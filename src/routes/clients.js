'use strict';

const router = require('express').Router();
const clientController = require('../controllers/clientController');
const { authenticate } = require('../middlewares/auth');
const { validateCreate, validateUpdate } = require('../validators/clientValidator');

/**
 * @openapi
 * tags:
 *   name: Clients
 *   description: Gestão de clientes
 */

/**
 * @openapi
 * /clients/search:
 *   get:
 *     tags: [Clients]
 *     summary: Buscar clientes por nome, CPF, e-mail ou telefone
 *     parameters:
 *       - in: query
 *         name: q
 *         schema: { type: string }
 *         required: true
 *         description: Termo de busca
 *     responses:
 *       200:
 *         description: Lista de clientes encontrados
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Client'
 */
router.get('/search', authenticate, clientController.search);

/**
 * @openapi
 * /clients:
 *   get:
 *     tags: [Clients]
 *     summary: Listar todos os clientes (paginado)
 *     parameters:
 *       - in: query
 *         name: page
 *         schema: { type: integer, default: 1 }
 *       - in: query
 *         name: limit
 *         schema: { type: integer, default: 20 }
 *     responses:
 *       200:
 *         description: Lista paginada de clientes
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ClientList'
 *   post:
 *     tags: [Clients]
 *     summary: Cadastrar novo cliente (CEP preenchido automaticamente via ViaCEP)
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name, cpf, phone]
 *             properties:
 *               name: { type: string, example: Maria Silva }
 *               cpf: { type: string, example: 123.456.789-00 }
 *               phone: { type: string, example: (11) 99999-9999 }
 *               email: { type: string, example: maria@email.com }
 *               zipCode: { type: string, example: 01310-100 }
 *               number: { type: string, example: 42 }
 *               complement: { type: string, example: Apto 3 }
 *     responses:
 *       201:
 *         description: Cliente criado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Client'
 *       409:
 *         description: CPF já cadastrado
 */
router.get('/', authenticate, clientController.list);
router.post('/', authenticate, validateCreate, clientController.create);

/**
 * @openapi
 * /clients/{id}:
 *   get:
 *     tags: [Clients]
 *     summary: Buscar cliente por ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Dados do cliente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Client'
 *       404:
 *         description: Cliente não encontrado
 *   put:
 *     tags: [Clients]
 *     summary: Atualizar cliente
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
 *               name: { type: string }
 *               phone: { type: string }
 *               email: { type: string }
 *               zipCode: { type: string }
 *               number: { type: string }
 *               complement: { type: string }
 *     responses:
 *       200:
 *         description: Cliente atualizado
 *       404:
 *         description: Cliente não encontrado
 *   delete:
 *     tags: [Clients]
 *     summary: Remover cliente
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       204:
 *         description: Removido com sucesso
 *       404:
 *         description: Cliente não encontrado
 */
router.get('/:id', authenticate, clientController.getById);
router.put('/:id', authenticate, validateUpdate, clientController.update);
router.delete('/:id', authenticate, clientController.destroy);

module.exports = router;
