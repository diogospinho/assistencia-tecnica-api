# Sistema de Gestão de Ordens de Serviço — Assistência Técnica

API REST para gerenciamento completo do fluxo operacional de uma assistência técnica: clientes, ordens de serviço, técnicos, peças e relatórios gerenciais.

**Autores:** Diogo Pinho · Yan Marra · Gabriel Vargas

---

## Tecnologias

- **Runtime:** Node.js
- **Framework:** Express.js
- **Banco de dados:** PostgreSQL
- **ORM:** Sequelize
- **Autenticação:** JWT (jsonwebtoken + bcryptjs)
- **Validação:** Joi
- **Documentação:** Swagger (OpenAPI 3.0)
- **Integração externa:** ViaCEP (preenchimento automático de endereço)
- **Rate limiting:** express-rate-limit
- **Testes:** Jest + Supertest

---

## Arquitetura

```
src/
├── config/          # Configurações (banco, swagger)
├── controllers/     # Recebem a requisição e delegam à service
├── services/        # Regras de negócio
├── repositories/    # Acesso ao banco de dados (Sequelize)
├── middlewares/     # auth, roleCheck, errorHandler, rateLimiter
├── validators/      # Validação de entrada com Joi
├── models/          # Definições dos models Sequelize
├── routes/          # Declaração das rotas com anotações Swagger
└── database/
    ├── migrations/  # Estrutura do banco
    └── seeders/     # Dados iniciais
```

---

## Instalação e Execução

### Pré-requisitos
- Node.js 18+
- PostgreSQL 14+

### Passo a passo

```bash
# 1. Clone o repositório
git clone <url-do-repositorio>
cd assistencia-tecnica-api

# 2. Instale as dependências
npm install

# 3. Configure as variáveis de ambiente
cp .env.example .env
# Edite o .env com suas credenciais do PostgreSQL

# 4. Crie o banco de dados no PostgreSQL
psql -U postgres -c "CREATE DATABASE assistencia_tecnica;"

# 5. Execute as migrations
npm run db:migrate

# 6. Execute os seeds
npm run db:seed

# 7. Inicie o servidor
npm run dev
```

O servidor estará disponível em `http://localhost:3000`.  
A documentação Swagger estará em `http://localhost:3000/api/docs`.

---

## Variáveis de Ambiente

| Variável | Descrição | Padrão |
|---|---|---|
| `PORT` | Porta do servidor | `3000` |
| `DB_HOST` | Host do PostgreSQL | `localhost` |
| `DB_PORT` | Porta do PostgreSQL | `5432` |
| `DB_NAME` | Nome do banco | `assistencia_tecnica` |
| `DB_USER` | Usuário do banco | `postgres` |
| `DB_PASSWORD` | Senha do banco | — |
| `JWT_SECRET` | Chave secreta para JWT | — |
| `JWT_EXPIRES_IN` | Expiração do token | `8h` |

---

## Usuários Padrão (Seeds)

| Nome | E-mail | Senha | Perfil |
|---|---|---|---|
| Administrador | admin@assistencia.com | Admin@123 | admin |
| Diogo Pinho | diogo@assistencia.com | Tecnico@123 | technician |
| Yan Marra | yan@assistencia.com | Tecnico@123 | technician |
| Gabriel Vargas | gabriel@assistencia.com | Atendente@123 | attendant |

---

## Endpoints da API

### Autenticação
| Método | Rota | Descrição | Auth |
|---|---|---|---|
| POST | `/api/auth/login` | Login — retorna JWT | Não |
| POST | `/api/auth/logout` | Logout (revoga token de forma persistente) | Sim |
| POST | `/api/auth/register` | Criar usuário (somente admin) | Sim |

### Clientes
| Método | Rota | Descrição |
|---|---|---|
| GET | `/api/clients` | Listar clientes (paginado) |
| POST | `/api/clients` | Criar cliente (CEP auto-preenchido via ViaCEP) |
| GET | `/api/clients/search?q=` | Busca por nome, CPF, e-mail ou telefone |
| GET | `/api/clients/:id` | Buscar por ID |
| PUT | `/api/clients/:id` | Atualizar |
| DELETE | `/api/clients/:id` | Remover |

### Ordens de Serviço
| Método | Rota | Descrição |
|---|---|---|
| GET | `/api/service-orders` | Listar (filtros: status, priority, technicianId) |
| POST | `/api/service-orders` | Abrir nova OS |
| GET | `/api/service-orders/:id` | Buscar por ID (com histórico e peças) |
| PUT | `/api/service-orders/:id` | Atualizar (bloqueado se concluída/cancelada) |
| PATCH | `/api/service-orders/:id/assign` | Atribuir técnico (max 5 OS/técnico) |
| PATCH | `/api/service-orders/:id/conclude` | Concluir (exige técnico, calcula tempo) |
| PATCH | `/api/service-orders/:id/cancel` | Cancelar (motivo obrigatório) |
| GET | `/api/service-orders/:id/history` | Histórico de alterações de status |
| POST | `/api/service-orders/:id/parts` | Vincular peça (desconta estoque) |

### Peças
| Método | Rota | Descrição |
|---|---|---|
| GET | `/api/parts` | Listar peças |
| POST | `/api/parts` | Criar peça (admin) |
| GET | `/api/parts/:id` | Buscar por ID |
| PUT | `/api/parts/:id` | Atualizar (admin) |
| DELETE | `/api/parts/:id` | Remover (admin) |
| POST | `/api/parts/:id/restock` | Repor estoque (gera histórico) |
| GET | `/api/parts/:id/movements` | Histórico de movimentações |

### Relatórios
| Método | Rota | Descrição |
|---|---|---|
| GET | `/api/reports/orders-by-status` | Quantidade de OS por status |
| GET | `/api/reports/overdue-orders` | OS em atraso (>7 dias abertas) |
| GET | `/api/reports/top-technicians` | Top 10 técnicos com mais atendimentos |
| GET | `/api/reports/most-used-parts` | Top 10 peças mais utilizadas |
| GET | `/api/reports/average-attendance-time` | Tempo médio de atendimento |

---

## Regras de Negócio Implementadas

1. OS não pode ser concluída sem técnico responsável
2. Ordens concluídas não podem ser editadas
3. Toda mudança de status gera registro no histórico
4. Cada técnico pode ter no máximo **5 ordens em andamento** simultaneamente
5. Prioridades: `low` / `medium` / `high` / `urgent`
6. Tempo de atendimento calculado automaticamente ao concluir (em minutos)
7. Cancelamento exige `cancelReason` preenchido
8. Estoque não pode ficar negativo
9. Toda movimentação de peça gera registro em `part_movements`
10. Peça com estoque zero bloqueia vínculo com OS
11. Logout revoga o token de forma **persistente** (tabela `revoked_tokens`): tokens invalidados continuam inválidos mesmo após reinício do servidor

---

## Segurança e Performance

- **Revogação persistente de tokens:** o logout grava o JWT na tabela `revoked_tokens`. O middleware `authenticate` consulta essa tabela antes de aceitar qualquer token, garantindo que um token deslogado não volte a ser válido após reiniciar a aplicação. Para remover tokens já expirados da tabela, execute `npm run db:cleanup-tokens`.
- **Índices de banco:** além das foreign keys, há índices nos campos mais usados em filtros, ordenações e relatórios (`clients.cpf`, `clients.email`, `service_orders.status/priority/technician_id/opened_at`, `part_movements.part_id/created_at`).

---

## Testes

Testes automatizados com **Jest + Supertest** cobrindo as regras de negócio mais críticas das ordens de serviço. Os models e repositories são mockados, então a suíte roda **sem necessidade de banco de dados ativo**.

```bash
npm test              # executa os testes
npm run test:coverage # executa com relatório de cobertura
```

Casos cobertos:
1. Concluir uma OS sem técnico responsável → retorna `422`
2. Atribuir um técnico que já possui 5 OS em andamento → retorna `422`

---

## Documentação Interativa

Acesse `http://localhost:3000/api/docs` para explorar todos os endpoints com exemplos de request/response via Swagger UI.

---

## Integração Externa

Ao cadastrar ou atualizar um cliente com `zipCode`, o sistema consulta automaticamente a API **ViaCEP** (`https://viacep.com.br`) e preenche os campos de endereço (`street`, `neighborhood`, `city`, `state`).
