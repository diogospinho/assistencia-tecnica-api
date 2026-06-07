'use strict';

const router = require('express').Router();
const ctrl = require('../controllers/partController');
const { authenticate } = require('../middlewares/auth');
const roleCheck = require('../middlewares/roleCheck');
const { validateCreate, validateUpdate, validateRestock } = require('../validators/partValidator');

/**
 * @openapi
 * tags:
 *   name: Parts
 *   description: Controle de peças e estoque
 */

/**
 * @openapi
 * /parts:
 *   get:
 *     tags: [Parts]
 *     summary: Listar todas as peças
 *     responses:
 *       200:
 *         description: Lista de peças com estoque
 *   post:
 *     tags: [Parts]
 *     summary: Cadastrar nova peça (somente admin)
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name, code, price]
 *             properties:
 *               name: { type: string, example: Tela LCD 6.5" }
 *               code: { type: string, example: TELA-LCD-65 }
 *               description: { type: string }
 *               stock: { type: integer, default: 0 }
 *               unit: { type: string, default: un }
 *               price: { type: number, example: 180.00 }
 *     responses:
 *       201:
 *         description: Peça criada
 *       409:
 *         description: Código já cadastrado
 */
router.get('/', authenticate, ctrl.list);
router.post('/', authenticate, roleCheck('admin'), validateCreate, ctrl.create);

/**
 * @openapi
 * /parts/{id}:
 *   get:
 *     tags: [Parts]
 *     summary: Buscar peça por ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Dados da peça
 *       404:
 *         description: Não encontrada
 *   put:
 *     tags: [Parts]
 *     summary: Atualizar peça (somente admin)
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Peça atualizada
 *   delete:
 *     tags: [Parts]
 *     summary: Remover peça (somente admin)
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       204:
 *         description: Removida com sucesso
 */
router.get('/:id', authenticate, ctrl.getById);
router.put('/:id', authenticate, roleCheck('admin'), validateUpdate, ctrl.update);
router.delete('/:id', authenticate, roleCheck('admin'), ctrl.destroy);

/**
 * @openapi
 * /parts/{id}/restock:
 *   post:
 *     tags: [Parts]
 *     summary: Repor estoque de uma peça (gera histórico de movimentação)
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
 *             required: [quantity]
 *             properties:
 *               quantity: { type: integer, minimum: 1 }
 *               reason: { type: string }
 *     responses:
 *       200:
 *         description: Estoque atualizado
 */
router.post('/:id/restock', authenticate, roleCheck('admin'), validateRestock, ctrl.restock);

/**
 * @openapi
 * /parts/{id}/movements:
 *   get:
 *     tags: [Parts]
 *     summary: Histórico de movimentações de estoque de uma peça
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Histórico de entrada e saída
 */
router.get('/:id/movements', authenticate, ctrl.getMovements);

module.exports = router;
