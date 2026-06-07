'use strict';

/**
 * Testes de regras de negócio das Ordens de Serviço.
 *
 * Os models e repositories são mockados para que a suíte rode sem depender
 * de um PostgreSQL ativo — o foco é validar o comportamento das regras de
 * negócio expostas pela API (camada HTTP via supertest).
 */

process.env.JWT_SECRET = process.env.JWT_SECRET || 'test_secret';

// Mock dos models: o middleware `authenticate` consulta RevokedToken;
// devolvemos null para que o token de teste seja sempre aceito.
jest.mock('../src/models', () => ({
  RevokedToken: { findOne: jest.fn().mockResolvedValue(null) },
  sequelize: {},
  ServiceOrderHistory: { create: jest.fn() },
  Part: {},
  ServiceOrderPart: {},
  PartMovement: {},
  User: {},
  Client: {},
}));

jest.mock('../src/repositories/serviceOrderRepository');
jest.mock('../src/repositories/userRepository');

const jwt = require('jsonwebtoken');
const request = require('supertest');
const app = require('../src/app');
const serviceOrderRepository = require('../src/repositories/serviceOrderRepository');
const userRepository = require('../src/repositories/userRepository');

const token = jwt.sign(
  { id: '11111111-1111-1111-1111-111111111111', name: 'Atendente', role: 'attendant' },
  process.env.JWT_SECRET
);
const auth = (req) => req.set('Authorization', `Bearer ${token}`);

const OS_ID = '22222222-2222-2222-2222-222222222222';
const TECH_ID = '33333333-3333-3333-3333-333333333333';

beforeEach(() => {
  jest.clearAllMocks();
});

describe('Regras de negócio — Ordens de Serviço', () => {
  test('concluir uma OS sem técnico responsável deve retornar 422', async () => {
    serviceOrderRepository.findById.mockResolvedValue({
      id: OS_ID,
      status: 'in_progress',
      technicianId: null,
      openedAt: new Date(),
    });

    const res = await auth(request(app).patch(`/api/service-orders/${OS_ID}/conclude`));

    expect(res.status).toBe(422);
    expect(res.body.message).toMatch(/sem técnico responsável/i);
    // Não deve ter tentado persistir a conclusão
    expect(serviceOrderRepository.update).not.toHaveBeenCalled();
  });

  test('atribuir técnico que já possui 5 OS em andamento deve retornar 422', async () => {
    serviceOrderRepository.findById.mockResolvedValue({
      id: OS_ID,
      status: 'open',
      technicianId: null,
      openedAt: new Date(),
    });
    userRepository.findById.mockResolvedValue({
      id: TECH_ID,
      name: 'Técnico Cheio',
      role: 'technician',
    });
    serviceOrderRepository.countTechnicianActive.mockResolvedValue(5);

    const res = await auth(
      request(app)
        .patch(`/api/service-orders/${OS_ID}/assign`)
        .send({ technicianId: TECH_ID })
    );

    expect(res.status).toBe(422);
    expect(res.body.message).toMatch(/5 ordens em andamento/i);
    expect(serviceOrderRepository.update).not.toHaveBeenCalled();
  });
});
