'use strict';

const router = require('express').Router();
const ctrl = require('../controllers/reportController');
const { authenticate } = require('../middlewares/auth');
const roleCheck = require('../middlewares/roleCheck');

/**
 * @openapi
 * tags:
 *   name: Reports
 *   description: Relatórios e consultas gerenciais
 */

/**
 * @openapi
 * /reports/orders-by-status:
 *   get:
 *     tags: [Reports]
 *     summary: Quantidade de ordens por status
 *     responses:
 *       200:
 *         description: Contagem agrupada por status
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ReportOrdersByStatus'
 *             example:
 *               - status: open
 *                 total: 5
 *               - status: in_progress
 *                 total: 3
 */
router.get('/orders-by-status', authenticate, ctrl.ordersByStatus);

/**
 * @openapi
 * /reports/overdue-orders:
 *   get:
 *     tags: [Reports]
 *     summary: Ordens em atraso (abertas ou em andamento há mais de 7 dias)
 *     responses:
 *       200:
 *         description: Lista de ordens em atraso com dados do cliente e técnico
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ReportOverdueOrders'
 */
router.get('/overdue-orders', authenticate, ctrl.overdueOrders);

/**
 * @openapi
 * /reports/top-technicians:
 *   get:
 *     tags: [Reports]
 *     summary: Técnicos com mais atendimentos (top 10)
 *     responses:
 *       200:
 *         description: Lista ranqueada de técnicos
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ReportTopTechnicians'
 */
router.get('/top-technicians', authenticate, ctrl.topTechnicians);

/**
 * @openapi
 * /reports/most-used-parts:
 *   get:
 *     tags: [Reports]
 *     summary: Peças mais utilizadas nos reparos (top 10)
 *     responses:
 *       200:
 *         description: Lista ranqueada de peças
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ReportMostUsedParts'
 */
router.get('/most-used-parts', authenticate, ctrl.mostUsedParts);

/**
 * @openapi
 * /reports/average-attendance-time:
 *   get:
 *     tags: [Reports]
 *     summary: Tempo médio de atendimento das ordens concluídas
 *     responses:
 *       200:
 *         description: Tempo médio em minutos e horas
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ReportAverageAttendanceTime'
 *             example:
 *               averageMinutes: 1440
 *               averageHours: "24.00"
 */
router.get('/average-attendance-time', authenticate, ctrl.averageAttendanceTime);

module.exports = router;
