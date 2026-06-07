'use strict';

const router = require('express').Router();
const ctrl = require('../controllers/serviceOrderController');
const { authenticate } = require('../middlewares/auth');
const roleCheck = require('../middlewares/roleCheck');
const v = require('../validators/serviceOrderValidator');

/**
 * @openapi
 * tags:
 *   name: ServiceOrders
 *   description: Gestão de ordens de serviço
 */

/**
 * @openapi
 * /service-orders:
 *   get:
 *     tags: [ServiceOrders]
 *     summary: Listar ordens de serviço
 *     parameters:
 *       - in: query
 *         name: page
 *         schema: { type: integer, default: 1 }
 *       - in: query
 *         name: limit
 *         schema: { type: integer, default: 20 }
 *       - in: query
 *         name: status
 *         schema: { type: string, enum: [open, in_progress, concluded, canceled] }
 *       - in: query
 *         name: priority
 *         schema: { type: string, enum: [low, medium, high, urgent] }
 *       - in: query
 *         name: technicianId
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Lista paginada de ordens
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ServiceOrderList'
 *   post:
 *     tags: [ServiceOrders]
 *     summary: Abrir nova ordem de serviço
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [clientId, equipment, problemDescription]
 *             properties:
 *               clientId: { type: string }
 *               equipment: { type: string, example: Notebook Dell Inspiron }
 *               problemDescription: { type: string, example: Não liga ao pressionar o botão de energia }
 *               priority: { type: string, enum: [low, medium, high, urgent], default: medium }
 *     responses:
 *       201:
 *         description: Ordem criada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ServiceOrder'
 */
router.get('/', authenticate, ctrl.list);
router.post('/', authenticate, v.validateCreate, ctrl.create);

/**
 * @openapi
 * /service-orders/{id}:
 *   get:
 *     tags: [ServiceOrders]
 *     summary: Buscar ordem por ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Dados da ordem com histórico e peças
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ServiceOrder'
 *       404:
 *         description: Não encontrada
 *   put:
 *     tags: [ServiceOrders]
 *     summary: Atualizar ordem (bloqueada se concluída ou cancelada)
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               equipment: { type: string }
 *               problemDescription: { type: string }
 *               priority: { type: string, enum: [low, medium, high, urgent] }
 *               notes: { type: string }
 *     responses:
 *       200:
 *         description: Ordem atualizada
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ServiceOrder'
 *       403:
 *         description: Ordem concluída não pode ser editada
 */
router.get('/:id', authenticate, ctrl.getById);
router.put('/:id', authenticate, v.validateUpdate, ctrl.update);

/**
 * @openapi
 * /service-orders/{id}/assign:
 *   patch:
 *     tags: [ServiceOrders]
 *     summary: Atribuir técnico à ordem
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [technicianId]
 *             properties:
 *               technicianId: { type: string }
 *     responses:
 *       200:
 *         description: Técnico atribuído com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ServiceOrder'
 *       422:
 *         description: Técnico já possui 5 ordens em andamento
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.patch('/:id/assign', authenticate, v.validateAssign, ctrl.assignTechnician);

/**
 * @openapi
 * /service-orders/{id}/conclude:
 *   patch:
 *     tags: [ServiceOrders]
 *     summary: Concluir ordem de serviço
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Ordem concluída. Tempo de atendimento calculado automaticamente.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ServiceOrder'
 *       422:
 *         description: Ordem sem técnico responsável não pode ser concluída
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.patch('/:id/conclude', authenticate, ctrl.conclude);

/**
 * @openapi
 * /service-orders/{id}/cancel:
 *   patch:
 *     tags: [ServiceOrders]
 *     summary: Cancelar ordem de serviço (motivo obrigatório)
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [cancelReason]
 *             properties:
 *               cancelReason: { type: string, example: Cliente desistiu do reparo }
 *     responses:
 *       200:
 *         description: Ordem cancelada
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ServiceOrder'
 *       422:
 *         description: Motivo obrigatório
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.patch('/:id/cancel', authenticate, v.validateCancel, ctrl.cancel);

/**
 * @openapi
 * /service-orders/{id}/history:
 *   get:
 *     tags: [ServiceOrders]
 *     summary: Histórico de alterações de status da ordem
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Histórico de movimentações
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/ServiceOrderHistory'
 */
router.get('/:id/history', authenticate, ctrl.getHistory);

/**
 * @openapi
 * /service-orders/{id}/parts:
 *   post:
 *     tags: [ServiceOrders]
 *     summary: Vincular peça à ordem (desconta estoque)
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [partId, quantity]
 *             properties:
 *               partId: { type: string }
 *               quantity: { type: integer, minimum: 1 }
 *     responses:
 *       201:
 *         description: Peça vinculada com sucesso
 *       422:
 *         description: Peça sem estoque ou estoque insuficiente
 */
router.post('/:id/parts', authenticate, v.validateAddPart, ctrl.addPart);

module.exports = router;
