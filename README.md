# T&A Ind Serv

Sistema de gestão de RH, estoque e ordens de serviço. O projeto é composto por um frontend React/Vite, uma API Express/TypeScript e um esquema PostgreSQL compatível com Supabase.

## Pré-requisitos

- Node.js 20 ou superior
- Um projeto Supabase/PostgreSQL

## Configuração

1. Crie as tabelas e tipos executando `database/schema.sql` no banco Supabase.
2. Copie `backend/.env.example` para `backend/.env` e preencha as credenciais do Supabase.
3. Instale as dependências:

   ```bash
   cd backend && npm ci
   cd ../frontend && npm ci
   ```

## Execução local

Em terminais separados:

```bash
cd backend && npm run dev
```

```bash
cd frontend && npm run dev
```

O frontend será servido em `http://localhost:5173` e encaminha as chamadas `/api` para o backend em `http://localhost:3333`.

## Validação

```bash
cd backend && npm run typecheck && npm run build
cd frontend && npm run build
```

## Segurança

Não versione `backend/.env`, chaves do Supabase ou arquivos de log. Use exclusivamente `backend/.env.example` como referência de configuração.

## Deploy na Vercel (2026)

Este repositório está configurado para **Vercel Services**, com o frontend Vite e o backend Express no mesmo projeto e no mesmo domínio.

### Configuração no painel da Vercel

1. Importe o repositório usando a raiz do projeto.
2. Em **Settings > Build and Deployment > Framework Preset**, selecione **Services**.
3. Não altere a Root Directory para `frontend` ou `backend`; mantenha a raiz do repositório.
4. Cadastre as variáveis de ambiente do backend:
   - `SUPABASE_URL`
   - `SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`
   - `NODE_ENV=production`
   - `CORS_ORIGIN=https://SEU-DOMINIO` (necessária para clientes hospedados em outro domínio; para o frontend no mesmo domínio, a API usa `/api`.)
5. No Supabase, execute `database/schema.sql` antes de testar login e cadastros.
6. Faça o deploy.

### Testes após o deploy

- `GET /api/health` deve retornar `{ "status": "ok", ... }`.
- Abra `/login` diretamente e atualize a página. A rota deve continuar funcionando por causa do fallback SPA.
- Faça login e teste pelo menos uma rota autenticada, como `/api/auth/profile`.

### Observações

- O arquivo legado `backend/vercel.json` foi removido para evitar conflito com a configuração moderna do projeto.
- `PORT` continua útil para desenvolvimento local, mas não precisa ser configurada manualmente na Vercel.
- O Node foi fixado em `24.x` nos pacotes frontend/backend.
