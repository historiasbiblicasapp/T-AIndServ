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
