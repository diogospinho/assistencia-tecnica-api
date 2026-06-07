const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'API - Sistema de Gestão de Ordens de Serviço',
      version: '1.0.0',
      description: 'API REST para gerenciamento de ordens de serviço de assistência técnica.\n\n**Autores:** Diogo Pinho, Yan Marra, Gabriel Vargas',
    },
    servers: [{ url: '/api', description: 'Servidor principal' }],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
      schemas: {
        UserPublic: {
          type: 'object',
          properties: {
            id: { type: 'string', format: 'uuid' },
            name: { type: 'string' },
            email: { type: 'string' },
            role: { type: 'string', enum: ['admin', 'technician', 'attendant'] },
          },
        },
        AuthResponse: {
          type: 'object',
          properties: {
            token: { type: 'string', description: 'JWT de acesso' },
            user: { $ref: '#/components/schemas/UserPublic' },
          },
        },
        Client: {
          type: 'object',
          properties: {
            id: { type: 'string', format: 'uuid' },
            name: { type: 'string' },
            cpf: { type: 'string' },
            phone: { type: 'string' },
            email: { type: 'string', nullable: true },
            zipCode: { type: 'string', nullable: true },
            street: { type: 'string', nullable: true },
            number: { type: 'string', nullable: true },
            complement: { type: 'string', nullable: true },
            neighborhood: { type: 'string', nullable: true },
            city: { type: 'string', nullable: true },
            state: { type: 'string', nullable: true },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' },
          },
        },
        ClientList: {
          type: 'object',
          properties: {
            total: { type: 'integer', example: 42 },
            data: { type: 'array', items: { $ref: '#/components/schemas/Client' } },
          },
        },
        TechnicianRef: {
          type: 'object',
          nullable: true,
          properties: {
            id: { type: 'string', format: 'uuid' },
            name: { type: 'string' },
            email: { type: 'string' },
          },
        },
        ServiceOrderHistory: {
          type: 'object',
          properties: {
            id: { type: 'string', format: 'uuid' },
            previousStatus: { type: 'string', nullable: true },
            newStatus: { type: 'string' },
            notes: { type: 'string', nullable: true },
            createdAt: { type: 'string', format: 'date-time' },
            changedByUser: {
              type: 'object',
              properties: {
                id: { type: 'string', format: 'uuid' },
                name: { type: 'string' },
              },
            },
          },
        },
        ServiceOrderPart: {
          type: 'object',
          properties: {
            id: { type: 'string', format: 'uuid' },
            name: { type: 'string' },
            code: { type: 'string' },
            unit: { type: 'string' },
            ServiceOrderPart: {
              type: 'object',
              description: 'Dados da associação (tabela de junção)',
              properties: {
                quantity: { type: 'integer' },
                unitPrice: { type: 'number', format: 'float' },
              },
            },
          },
        },
        ServiceOrder: {
          type: 'object',
          properties: {
            id: { type: 'string', format: 'uuid' },
            orderNumber: { type: 'string', example: 'OS000001' },
            clientId: { type: 'string', format: 'uuid' },
            equipment: { type: 'string' },
            problemDescription: { type: 'string' },
            status: { type: 'string', enum: ['open', 'in_progress', 'concluded', 'canceled'] },
            priority: { type: 'string', enum: ['low', 'medium', 'high', 'urgent'] },
            technicianId: { type: 'string', format: 'uuid', nullable: true },
            openedAt: { type: 'string', format: 'date-time' },
            concludedAt: { type: 'string', format: 'date-time', nullable: true },
            cancelReason: { type: 'string', nullable: true },
            attendanceTimeMinutes: { type: 'integer', nullable: true },
            createdBy: { type: 'string', format: 'uuid' },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' },
            client: { $ref: '#/components/schemas/Client' },
            technician: { $ref: '#/components/schemas/TechnicianRef' },
            creator: {
              type: 'object',
              properties: {
                id: { type: 'string', format: 'uuid' },
                name: { type: 'string' },
              },
            },
            parts: { type: 'array', items: { $ref: '#/components/schemas/ServiceOrderPart' } },
            history: { type: 'array', items: { $ref: '#/components/schemas/ServiceOrderHistory' } },
          },
        },
        ServiceOrderList: {
          type: 'object',
          properties: {
            total: { type: 'integer', example: 12 },
            data: { type: 'array', items: { $ref: '#/components/schemas/ServiceOrder' } },
          },
        },
        ReportOrdersByStatus: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              status: { type: 'string', enum: ['open', 'in_progress', 'concluded', 'canceled'] },
              total: { type: 'integer', example: 5 },
            },
          },
        },
        ReportTopTechnicians: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              technician: {
                type: 'object',
                properties: {
                  name: { type: 'string' },
                  email: { type: 'string' },
                },
              },
              totalOrders: { type: 'integer', example: 8 },
            },
          },
        },
        ReportMostUsedParts: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              part: {
                type: 'object',
                properties: {
                  name: { type: 'string' },
                  code: { type: 'string' },
                  unit: { type: 'string' },
                },
              },
              totalUsed: { type: 'integer', example: 25 },
            },
          },
        },
        ReportAverageAttendanceTime: {
          type: 'object',
          properties: {
            averageMinutes: { type: 'integer', example: 1440 },
            averageHours: { type: 'string', example: '24.00' },
          },
        },
        ReportOverdueOrders: {
          type: 'array',
          items: { $ref: '#/components/schemas/ServiceOrder' },
        },
        Error: {
          type: 'object',
          properties: {
            message: { type: 'string' },
          },
        },
      },
    },
    security: [{ bearerAuth: [] }],
  },
  apis: ['./src/routes/*.js'],
};

module.exports = swaggerJsdoc(options);
