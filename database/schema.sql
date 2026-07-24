-- ============================================================
-- SISTEMA DE GESTÃO DE RH - T&A IND SERV
-- PostgreSQL 15+ (Supabase)
-- ============================================================

-- Extensões úteis
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ============================================================
-- TYPES (ENUMs)
-- ============================================================

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'tipo_documento_enum') THEN
    CREATE TYPE tipo_documento_enum AS ENUM (
      'rg', 'cpf', 'ctps', 'titulo_eleitor', 'certificado_reservista',
      'comprovante_residencia', 'certidao_nascimento', 'certidao_casamento',
      'diploma', 'certificado_curso', 'aso', 'photo', 'outros'
    );
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'estado_civil_enum') THEN
    CREATE TYPE estado_civil_enum AS ENUM (
      'solteiro', 'casado', 'divorciado', 'viuvo', 'uniao_estavel'
    );
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'raca_cor_enum') THEN
    CREATE TYPE raca_cor_enum AS ENUM (
      'branca', 'preta', 'parda', 'amarela', 'indigena', 'nao_declarar'
    );
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'sexo_enum') THEN
    CREATE TYPE sexo_enum AS ENUM ('M', 'F', 'Outro');
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'tipo_colaborador_enum') THEN
    CREATE TYPE tipo_colaborador_enum AS ENUM (
      'efetivo', 'temporario', 'estagio', 'terceirizado', 'clt', 'pj'
    );
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'status_colaborador_enum') THEN
    CREATE TYPE status_colaborador_enum AS ENUM (
      'ativo', 'ferias', 'afastado', 'suspenso', 'desligado'
    );
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'parentesco_enum') THEN
    CREATE TYPE parentesco_enum AS ENUM (
      'conjuge', 'filho', 'filha', 'mae', 'pai', 'outro'
    );
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'grau_escolaridade_enum') THEN
    CREATE TYPE grau_escolaridade_enum AS ENUM (
      'fundamental_incompleto', 'fundamental_completo',
      'medio_incompleto', 'medio_completo',
      'superior_incompleto', 'superior_completo',
      'pos_graduacao', 'mestrado', 'doutorado'
    );
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'tipo_curso_enum') THEN
    CREATE TYPE tipo_curso_enum AS ENUM (
      'interno', 'externo', 'online', 'obrigatorio', 'nr'
    );
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'tipo_aso_enum') THEN
    CREATE TYPE tipo_aso_enum AS ENUM (
      'admissional', 'periodico', 'retorno', 'mudanca_funcao', 'demissional'
    );
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'resultado_aso_enum') THEN
    CREATE TYPE resultado_aso_enum AS ENUM (
      'apto', 'inapto', 'apto_com_restricao'
    );
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'tipo_acidente_enum') THEN
    CREATE TYPE tipo_acidente_enum AS ENUM (
      'trabalho', 'trajeto', 'doenca_ocupacional'
    );
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'tipo_ferias_enum') THEN
    CREATE TYPE tipo_ferias_enum AS ENUM (
      'integral', 'proporcional', 'abono'
    );
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'status_ferias_enum') THEN
    CREATE TYPE status_ferias_enum AS ENUM (
      'agendada', 'aprovada', 'gozada', 'cancelada'
    );
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'tipo_movimentacao_enum') THEN
    CREATE TYPE tipo_movimentacao_enum AS ENUM (
      'admissao', 'desligamento', 'transferencia', 'promocao',
      'reversao', 'suspensao', 'afastamento', 'retorno',
      'ferias', 'banco_horas', 'hora_extra', 'mudanca_turno'
    );
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'tipo_banco_horas_enum') THEN
    CREATE TYPE tipo_banco_horas_enum AS ENUM (
      'normal', 'extra', 'desconto', 'abono'
    );
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'operacao_auditoria_enum') THEN
    CREATE TYPE operacao_auditoria_enum AS ENUM (
      'INSERT', 'UPDATE', 'DELETE'
    );
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'tipo_privacidade_enum') THEN
    CREATE TYPE tipo_privacidade_enum AS ENUM (
      'acesso', 'exportacao', 'correcao', 'exclusao', 'anonimizacao', 'requisicao'
    );
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'nivel_notificacao_enum') THEN
    CREATE TYPE nivel_notificacao_enum AS ENUM (
      'info', 'atencao', 'urgente', 'critico'
    );
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'status_avaliacao_enum') THEN
    CREATE TYPE status_avaliacao_enum AS ENUM (
      'rascunho', 'finalizada', 'revisada'
    );
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'tipo_config_enum') THEN
    CREATE TYPE tipo_config_enum AS ENUM (
      'string', 'int', 'boolean', 'json'
    );
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'grau_insalubridade_enum') THEN
    CREATE TYPE grau_insalubridade_enum AS ENUM (
      'nenhum', 'minimo', 'medio', 'maximo'
    );
  END IF;
END $$;

-- ============================================================
-- 1. SEGURANÇA / AUTENTICAÇÃO
-- ============================================================

-- Tabela de perfis vinculada ao auth.users do Supabase
CREATE TABLE IF NOT EXISTS usuarios (
  id              UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email           VARCHAR(255) NOT NULL UNIQUE,
  nome_completo   VARCHAR(255) NOT NULL,
  avatar_url      VARCHAR(500) DEFAULT NULL,
  ativo           BOOLEAN NOT NULL DEFAULT TRUE,
  mfa_habilitado  BOOLEAN NOT NULL DEFAULT FALSE,
  ultimo_login    TIMESTAMPTZ DEFAULT NULL,
  criado_em       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  atualizado_em   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_usuarios_email ON usuarios(email);
CREATE INDEX IF NOT EXISTS idx_usuarios_ativo ON usuarios(ativo);

CREATE TABLE IF NOT EXISTS roles (
  id          SERIAL PRIMARY KEY,
  nome        VARCHAR(100) NOT NULL UNIQUE,
  descricao   VARCHAR(255) DEFAULT NULL,
  nivel       INT NOT NULL DEFAULT 0,
  criado_em   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS permissoes (
  id          SERIAL PRIMARY KEY,
  chave       VARCHAR(100) NOT NULL UNIQUE,
  descricao   VARCHAR(255) DEFAULT NULL,
  modulo      VARCHAR(50) NOT NULL,
  criado_em   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_permissoes_modulo ON permissoes(modulo);

CREATE TABLE IF NOT EXISTS role_permissions (
  role_id       INT NOT NULL REFERENCES roles(id) ON DELETE CASCADE,
  permissao_id  INT NOT NULL REFERENCES permissoes(id) ON DELETE CASCADE,
  PRIMARY KEY (role_id, permissao_id)
);

CREATE TABLE IF NOT EXISTS usuario_roles (
  usuario_id  UUID NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
  role_id     INT NOT NULL REFERENCES roles(id) ON DELETE CASCADE,
  PRIMARY KEY (usuario_id, role_id)
);

-- ============================================================
-- 2. ESTRUTURA ORGANIZACIONAL
-- ============================================================

CREATE TABLE IF NOT EXISTS empresas (
  id                    SERIAL PRIMARY KEY,
  razao_social          VARCHAR(255) NOT NULL,
  nome_fantasia         VARCHAR(255) NOT NULL,
  cnpj                  VARCHAR(18) NOT NULL UNIQUE,
  inscricao_estadual    VARCHAR(20) DEFAULT NULL,
  inscricao_municipal   VARCHAR(20) DEFAULT NULL,
  endereco              VARCHAR(255) DEFAULT NULL,
  cidade                VARCHAR(100) DEFAULT NULL,
  estado                CHAR(2) DEFAULT NULL,
  cep                   VARCHAR(10) DEFAULT NULL,
  telefone              VARCHAR(20) DEFAULT NULL,
  email                 VARCHAR(255) DEFAULT NULL,
  ativa                 BOOLEAN NOT NULL DEFAULT TRUE,
  criado_em             TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  atualizado_em         TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS unidades (
  id            SERIAL PRIMARY KEY,
  empresa_id    INT NOT NULL REFERENCES empresas(id) ON DELETE RESTRICT,
  nome          VARCHAR(255) NOT NULL,
  codigo        VARCHAR(20) DEFAULT NULL,
  endereco      VARCHAR(255) DEFAULT NULL,
  cidade        VARCHAR(100) DEFAULT NULL,
  estado        CHAR(2) DEFAULT NULL,
  cep           VARCHAR(10) DEFAULT NULL,
  ativa         BOOLEAN NOT NULL DEFAULT TRUE,
  criado_em     TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_unidades_empresa ON unidades(empresa_id);

CREATE TABLE IF NOT EXISTS setores (
  id              SERIAL PRIMARY KEY,
  unidade_id      INT NOT NULL REFERENCES unidades(id) ON DELETE RESTRICT,
  nome            VARCHAR(255) NOT NULL,
  codigo          VARCHAR(20) DEFAULT NULL,
  responsavel_id  UUID DEFAULT NULL,
  ativo           BOOLEAN NOT NULL DEFAULT TRUE,
  criado_em       TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_setores_unidade ON setores(unidade_id);

CREATE TABLE IF NOT EXISTS funcoes (
  id                  SERIAL PRIMARY KEY,
  setor_id            INT NOT NULL REFERENCES setores(id) ON DELETE RESTRICT,
  nome                VARCHAR(255) NOT NULL,
  descricao           TEXT DEFAULT NULL,
  salario_base        DECIMAL(10,2) DEFAULT NULL,
  periculosidade      BOOLEAN NOT NULL DEFAULT FALSE,
  insalubridade       BOOLEAN NOT NULL DEFAULT FALSE,
  grau_insalubridade  grau_insalubridade_enum DEFAULT 'nenhum',
  ativa               BOOLEAN NOT NULL DEFAULT TRUE,
  criado_em           TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_funcoes_setor ON funcoes(setor_id);

-- ============================================================
-- 3. RH - COLABORADORES
-- ============================================================

CREATE TABLE IF NOT EXISTS colaboradores (
  id                      SERIAL PRIMARY KEY,
  usuario_id              UUID DEFAULT NULL REFERENCES usuarios(id) ON DELETE SET NULL,
  empresa_id              INT NOT NULL REFERENCES empresas(id) ON DELETE RESTRICT,
  unidade_id              INT DEFAULT NULL REFERENCES unidades(id) ON DELETE SET NULL,
  setor_id                INT DEFAULT NULL REFERENCES setores(id) ON DELETE SET NULL,
  funcao_id               INT DEFAULT NULL REFERENCES funcoes(id) ON DELETE SET NULL,
  matricula               VARCHAR(20) NOT NULL UNIQUE,
  nome_completo           VARCHAR(255) NOT NULL,
  nome_social             VARCHAR(255) DEFAULT NULL,
  cpf                     VARCHAR(14) NOT NULL UNIQUE,
  rg                      VARCHAR(20) DEFAULT NULL,
  orgao_emissor           VARCHAR(20) DEFAULT NULL,
  data_nascimento         DATE NOT NULL,
  sexo                    sexo_enum NOT NULL,
  estado_civil            estado_civil_enum DEFAULT NULL,
  raca_cor                raca_cor_enum DEFAULT NULL,
  nacionalidade           VARCHAR(50) DEFAULT 'Brasileira',
  naturalidade            VARCHAR(100) DEFAULT NULL,
  email_pessoal           VARCHAR(255) DEFAULT NULL,
  email_corporativo       VARCHAR(255) DEFAULT NULL,
  telefone                VARCHAR(20) DEFAULT NULL,
  celular                 VARCHAR(20) DEFAULT NULL,
  endereco                VARCHAR(255) DEFAULT NULL,
  cidade                  VARCHAR(100) DEFAULT NULL,
  estado                  CHAR(2) DEFAULT NULL,
  cep                     VARCHAR(10) DEFAULT NULL,
  foto_url                VARCHAR(500) DEFAULT NULL,
  tipo_sanguineo          VARCHAR(5) DEFAULT NULL,
  fator_rh                VARCHAR(5) DEFAULT NULL,
  pcd                     BOOLEAN NOT NULL DEFAULT FALSE,
  deficiencia             VARCHAR(100) DEFAULT NULL,
  pis_pasep               VARCHAR(14) DEFAULT NULL,
  ctps                    VARCHAR(20) DEFAULT NULL,
  ctps_serie              VARCHAR(10) DEFAULT NULL,
  titulo_eleitor          VARCHAR(20) DEFAULT NULL,
  certificado_reservista  VARCHAR(20) DEFAULT NULL,
  cnh                     VARCHAR(20) DEFAULT NULL,
  cnh_categoria           VARCHAR(5) DEFAULT NULL,
  cnh_validade            DATE DEFAULT NULL,
  banco_codigo            VARCHAR(10) DEFAULT NULL,
  banco_nome              VARCHAR(100) DEFAULT NULL,
  agencia                 VARCHAR(20) DEFAULT NULL,
  conta                   VARCHAR(20) DEFAULT NULL,
  pix_chave               VARCHAR(255) DEFAULT NULL,
  admissao                DATE NOT NULL,
  desligamento            DATE DEFAULT NULL,
  motivo_desligamento     VARCHAR(255) DEFAULT NULL,
  tipo_colaborador        tipo_colaborador_enum NOT NULL DEFAULT 'efetivo',
  status                  status_colaborador_enum NOT NULL DEFAULT 'ativo',
  criado_em               TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  atualizado_em           TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_colaboradores_empresa ON colaboradores(empresa_id);
CREATE INDEX IF NOT EXISTS idx_colaboradores_setor ON colaboradores(setor_id);
CREATE INDEX IF NOT EXISTS idx_colaboradores_funcao ON colaboradores(funcao_id);
CREATE INDEX IF NOT EXISTS idx_colaboradores_cpf ON colaboradores(cpf);
CREATE INDEX IF NOT EXISTS idx_colaboradores_matricula ON colaboradores(matricula);
CREATE INDEX IF NOT EXISTS idx_colaboradores_status ON colaboradores(status);
CREATE INDEX IF NOT EXISTS idx_colaboradores_admissao ON colaboradores(admissao);

-- ============================================================
-- 4. DEPENDENTES
-- ============================================================

CREATE TABLE IF NOT EXISTS dependentes (
  id                  SERIAL PRIMARY KEY,
  colaborador_id      INT NOT NULL REFERENCES colaboradores(id) ON DELETE CASCADE,
  nome_completo       VARCHAR(255) NOT NULL,
  cpf                 VARCHAR(14) DEFAULT NULL,
  data_nascimento     DATE DEFAULT NULL,
  parentesco          parentesco_enum NOT NULL,
  irrf                BOOLEAN NOT NULL DEFAULT FALSE,
  salario_familia     BOOLEAN NOT NULL DEFAULT FALSE,
  pensao_alimenticia  BOOLEAN NOT NULL DEFAULT FALSE,
  criado_em           TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_dependentes_colaborador ON dependentes(colaborador_id);

-- ============================================================
-- 5. DOCUMENTOS
-- ============================================================

CREATE TABLE IF NOT EXISTS documentos (
  id                      SERIAL PRIMARY KEY,
  colaborador_id          INT NOT NULL REFERENCES colaboradores(id) ON DELETE CASCADE,
  tipo_documento          tipo_documento_enum NOT NULL,
  descricao               VARCHAR(255) DEFAULT NULL,
  arquivo_url             VARCHAR(500) NOT NULL,
  arquivo_nome_original   VARCHAR(255) DEFAULT NULL,
  mime_type               VARCHAR(50) DEFAULT NULL,
  tamanho_bytes           INT DEFAULT NULL,
  validade                DATE DEFAULT NULL,
  criado_em               TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_documentos_colaborador ON documentos(colaborador_id);
CREATE INDEX IF NOT EXISTS idx_documentos_tipo ON documentos(tipo_documento);

-- ============================================================
-- 6. ESCOLARIDADE E CURSOS
-- ============================================================

CREATE TABLE IF NOT EXISTS escolaridade (
  id                SERIAL PRIMARY KEY,
  colaborador_id    INT NOT NULL REFERENCES colaboradores(id) ON DELETE CASCADE,
  grau             grau_escolaridade_enum NOT NULL,
  instituicao       VARCHAR(255) DEFAULT NULL,
  curso             VARCHAR(255) DEFAULT NULL,
  ano_conclusao     SMALLINT DEFAULT NULL,
  registro          VARCHAR(100) DEFAULT NULL,
  criado_em         TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_escolaridade_colaborador ON escolaridade(colaborador_id);

CREATE TABLE IF NOT EXISTS cursos_treinamentos (
  id              SERIAL PRIMARY KEY,
  nome            VARCHAR(255) NOT NULL,
  descricao       TEXT DEFAULT NULL,
  carga_horaria   INT DEFAULT NULL,
  tipo            tipo_curso_enum NOT NULL DEFAULT 'interno',
  norma_nr        VARCHAR(20) DEFAULT NULL,
  validade_meses  INT DEFAULT NULL,
  obrigatorio     BOOLEAN NOT NULL DEFAULT FALSE,
  criado_em       TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_cursos_tipo ON cursos_treinamentos(tipo);
CREATE INDEX IF NOT EXISTS idx_cursos_nr ON cursos_treinamentos(norma_nr);

CREATE TABLE IF NOT EXISTS colaborador_treinamentos (
  id                      SERIAL PRIMARY KEY,
  colaborador_id          INT NOT NULL REFERENCES colaboradores(id) ON DELETE CASCADE,
  curso_treinamento_id    INT NOT NULL REFERENCES cursos_treinamentos(id) ON DELETE RESTRICT,
  data_realizacao         DATE NOT NULL,
  data_validade           DATE DEFAULT NULL,
  carga_horaria           INT DEFAULT NULL,
  nota                    DECIMAL(4,2) DEFAULT NULL,
  aprovado                BOOLEAN DEFAULT NULL,
  certificado_url         VARCHAR(500) DEFAULT NULL,
  observacoes             TEXT DEFAULT NULL,
  criado_em               TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_colab_trein_colaborador ON colaborador_treinamentos(colaborador_id);
CREATE INDEX IF NOT EXISTS idx_colab_trein_curso ON colaborador_treinamentos(curso_treinamento_id);
CREATE INDEX IF NOT EXISTS idx_colab_trein_validade ON colaborador_treinamentos(data_validade);

-- ============================================================
-- 7. SAÚDE E SEGURANÇA DO TRABALHO
-- ============================================================

CREATE TABLE IF NOT EXISTS exames_aso (
  id              SERIAL PRIMARY KEY,
  colaborador_id  INT NOT NULL REFERENCES colaboradores(id) ON DELETE CASCADE,
  tipo_aso        tipo_aso_enum NOT NULL,
  data_exame      DATE NOT NULL,
  data_validade   DATE NOT NULL,
  medico_resp     VARCHAR(255) DEFAULT NULL,
  crm             VARCHAR(20) DEFAULT NULL,
  resultado       resultado_aso_enum NOT NULL,
  restricoes      TEXT DEFAULT NULL,
  arquivo_url     VARCHAR(500) DEFAULT NULL,
  observacoes     TEXT DEFAULT NULL,
  criado_em       TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_aso_colaborador ON exames_aso(colaborador_id);
CREATE INDEX IF NOT EXISTS idx_aso_validade ON exames_aso(data_validade);
CREATE INDEX IF NOT EXISTS idx_aso_tipo ON exames_aso(tipo_aso);

CREATE TABLE IF NOT EXISTS exames_periodicos (
  id                SERIAL PRIMARY KEY,
  colaborador_id    INT NOT NULL REFERENCES colaboradores(id) ON DELETE CASCADE,
  tipo_exame        VARCHAR(100) NOT NULL,
  data_realizacao   DATE NOT NULL,
  data_validade     DATE NOT NULL,
  resultado         VARCHAR(255) DEFAULT NULL,
  medico_resp       VARCHAR(255) DEFAULT NULL,
  crm               VARCHAR(20) DEFAULT NULL,
  arquivo_url       VARCHAR(500) DEFAULT NULL,
  criado_em         TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_experiod_colaborador ON exames_periodicos(colaborador_id);
CREATE INDEX IF NOT EXISTS idx_experiod_validade ON exames_periodicos(data_validade);
CREATE INDEX IF NOT EXISTS idx_experiod_tipo ON exames_periodicos(tipo_exame);

CREATE TABLE IF NOT EXISTS cat (
  id                  SERIAL PRIMARY KEY,
  colaborador_id      INT NOT NULL REFERENCES colaboradores(id) ON DELETE CASCADE,
  data_acidente       DATE NOT NULL,
  hora_acidente       TIME DEFAULT NULL,
  tipo_acidente       tipo_acidente_enum NOT NULL,
  natureza_lesao      VARCHAR(255) DEFAULT NULL,
  parte_corpo         VARCHAR(255) DEFAULT NULL,
  agente_causador     VARCHAR(255) DEFAULT NULL,
  descricao           TEXT NOT NULL,
  cid                 VARCHAR(10) DEFAULT NULL,
  data_afastamento    DATE DEFAULT NULL,
  retorno             DATE DEFAULT NULL,
  mortal              BOOLEAN NOT NULL DEFAULT FALSE,
  cat_numero          VARCHAR(50) DEFAULT NULL,
  arquivo_url         VARCHAR(500) DEFAULT NULL,
  criado_em           TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_cat_colaborador ON cat(colaborador_id);
CREATE INDEX IF NOT EXISTS idx_cat_data ON cat(data_acidente);

CREATE TABLE IF NOT EXISTS ppp (
  id                    SERIAL PRIMARY KEY,
  colaborador_id        INT NOT NULL REFERENCES colaboradores(id) ON DELETE CASCADE,
  data_emissao          DATE NOT NULL,
  empresa_anterior_1    VARCHAR(255) DEFAULT NULL,
  cnpj_anterior_1       VARCHAR(18) DEFAULT NULL,
  atividades_1          TEXT DEFAULT NULL,
  empresa_anterior_2    VARCHAR(255) DEFAULT NULL,
  cnpj_anterior_2       VARCHAR(18) DEFAULT NULL,
  atividades_2          TEXT DEFAULT NULL,
  empresa_anterior_3    VARCHAR(255) DEFAULT NULL,
  cnpj_anterior_3       VARCHAR(18) DEFAULT NULL,
  atividades_3          TEXT DEFAULT NULL,
  exposicao_agentes     TEXT DEFAULT NULL,
  epc                   TEXT DEFAULT NULL,
  epi                   TEXT DEFAULT NULL,
  conclusao             TEXT DEFAULT NULL,
  medico_resp           VARCHAR(255) DEFAULT NULL,
  crm                   VARCHAR(20) DEFAULT NULL,
  arquivo_url           VARCHAR(500) DEFAULT NULL,
  criado_em             TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_ppp_colaborador ON ppp(colaborador_id);

-- ============================================================
-- 8. FÉRIAS
-- ============================================================

CREATE TABLE IF NOT EXISTS ferias (
  id                    SERIAL PRIMARY KEY,
  colaborador_id        INT NOT NULL REFERENCES colaboradores(id) ON DELETE CASCADE,
  periodo_aquisitivo    VARCHAR(9) NOT NULL,
  data_inicio           DATE NOT NULL,
  data_fim              DATE NOT NULL,
  dias_gozados          INT NOT NULL DEFAULT 30,
  tipo                  tipo_ferias_enum NOT NULL DEFAULT 'integral',
  fracionamento         INT DEFAULT 1,
  status                status_ferias_enum NOT NULL DEFAULT 'agendada',
  aprovado_por          UUID DEFAULT NULL REFERENCES usuarios(id) ON DELETE SET NULL,
  data_aprovacao        DATE DEFAULT NULL,
  observacoes           TEXT DEFAULT NULL,
  criado_em             TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  atualizado_em         TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_ferias_colaborador ON ferias(colaborador_id);
CREATE INDEX IF NOT EXISTS idx_ferias_periodo ON ferias(periodo_aquisitivo);
CREATE INDEX IF NOT EXISTS idx_ferias_status ON ferias(status);
CREATE INDEX IF NOT EXISTS idx_ferias_inicio ON ferias(data_inicio);

-- ============================================================
-- 9. AVALIAÇÕES DE DESEMPENHO
-- ============================================================

CREATE TABLE IF NOT EXISTS avaliacoes_desempenho (
  id                SERIAL PRIMARY KEY,
  colaborador_id    INT NOT NULL REFERENCES colaboradores(id) ON DELETE CASCADE,
  avaliador_id      INT NOT NULL REFERENCES colaboradores(id) ON DELETE RESTRICT,
  periodo           VARCHAR(20) NOT NULL,
  data_avaliacao    DATE NOT NULL,
  nota_geral        DECIMAL(4,2) DEFAULT NULL,
  pontos_fortes     TEXT DEFAULT NULL,
  pontos_melhoria   TEXT DEFAULT NULL,
  observacoes       TEXT DEFAULT NULL,
  status            status_avaliacao_enum NOT NULL DEFAULT 'rascunho',
  criado_em         TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_avaliacoes_colaborador ON avaliacoes_desempenho(colaborador_id);
CREATE INDEX IF NOT EXISTS idx_avaliacoes_periodo ON avaliacoes_desempenho(periodo);

CREATE TABLE IF NOT EXISTS avaliacoes_criterios (
  id              SERIAL PRIMARY KEY,
  avaliacao_id    INT NOT NULL REFERENCES avaliacoes_desempenho(id) ON DELETE CASCADE,
  criterio        VARCHAR(255) NOT NULL,
  nota            DECIMAL(4,2) NOT NULL,
  peso            DECIMAL(4,2) DEFAULT 1.00,
  observacao      TEXT DEFAULT NULL
);

CREATE INDEX IF NOT EXISTS idx_avcriterios_avaliacao ON avaliacoes_criterios(avaliacao_id);

-- ============================================================
-- 10. MOVIMENTAÇÕES DE PESSOAL
-- ============================================================

CREATE TABLE IF NOT EXISTS movimentacoes (
  id                SERIAL PRIMARY KEY,
  colaborador_id    INT NOT NULL REFERENCES colaboradores(id) ON DELETE CASCADE,
  tipo_movimentacao tipo_movimentacao_enum NOT NULL,
  data_movimentacao DATE NOT NULL,
  data_efetiva      DATE DEFAULT NULL,
  funcao_anterior   INT DEFAULT NULL REFERENCES funcoes(id) ON DELETE SET NULL,
  funcao_nova       INT DEFAULT NULL REFERENCES funcoes(id) ON DELETE SET NULL,
  setor_anterior    INT DEFAULT NULL REFERENCES setores(id) ON DELETE SET NULL,
  setor_novo        INT DEFAULT NULL REFERENCES setores(id) ON DELETE SET NULL,
  salario_anterior  DECIMAL(10,2) DEFAULT NULL,
  salario_novo      DECIMAL(10,2) DEFAULT NULL,
  turno_anterior    VARCHAR(50) DEFAULT NULL,
  turno_novo        VARCHAR(50) DEFAULT NULL,
  horas             DECIMAL(5,2) DEFAULT NULL,
  descricao         TEXT NOT NULL,
  motivo            TEXT DEFAULT NULL,
  aprovado_por      UUID DEFAULT NULL REFERENCES usuarios(id) ON DELETE SET NULL,
  data_aprovacao    DATE DEFAULT NULL,
  criado_por        UUID DEFAULT NULL REFERENCES usuarios(id) ON DELETE SET NULL,
  criado_em         TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_mov_colaborador ON movimentacoes(colaborador_id);
CREATE INDEX IF NOT EXISTS idx_mov_tipo ON movimentacoes(tipo_movimentacao);
CREATE INDEX IF NOT EXISTS idx_mov_data ON movimentacoes(data_movimentacao);

-- ============================================================
-- 11. BANCO DE HORAS
-- ============================================================

CREATE TABLE IF NOT EXISTS banco_horas (
  id                  SERIAL PRIMARY KEY,
  colaborador_id      INT NOT NULL REFERENCES colaboradores(id) ON DELETE CASCADE,
  data_registro       DATE NOT NULL,
  entrada             TIME DEFAULT NULL,
  saida               TIME DEFAULT NULL,
  horas_trabalhadas   DECIMAL(5,2) DEFAULT NULL,
  horas_extras        DECIMAL(5,2) DEFAULT 0.00,
  horas_desconto      DECIMAL(5,2) DEFAULT 0.00,
  saldo               DECIMAL(5,2) DEFAULT 0.00,
  tipo                tipo_banco_horas_enum NOT NULL DEFAULT 'normal',
  descricao           VARCHAR(255) DEFAULT NULL,
  aprovado            BOOLEAN NOT NULL DEFAULT FALSE,
  aprovado_por        UUID DEFAULT NULL REFERENCES usuarios(id) ON DELETE SET NULL,
  criado_em           TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_banco_colaborador ON banco_horas(colaborador_id);
CREATE INDEX IF NOT EXISTS idx_banco_data ON banco_horas(data_registro);

-- ============================================================
-- 12. AUDITORIA
-- ============================================================

CREATE TABLE IF NOT EXISTS auditoria (
  id              SERIAL PRIMARY KEY,
  usuario_id      UUID DEFAULT NULL REFERENCES usuarios(id) ON DELETE SET NULL,
  tabela          VARCHAR(100) NOT NULL,
  campo           VARCHAR(100) DEFAULT NULL,
  registro_id     INT DEFAULT NULL,
  valor_antigo    TEXT DEFAULT NULL,
  valor_novo      TEXT DEFAULT NULL,
  tipo_operacao   operacao_auditoria_enum NOT NULL,
  ip_address      VARCHAR(45) DEFAULT NULL,
  user_agent      VARCHAR(500) DEFAULT NULL,
  empresa_id      INT DEFAULT NULL,
  criado_em       TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_auditoria_tabela ON auditoria(tabela);
CREATE INDEX IF NOT EXISTS idx_auditoria_registro ON auditoria(registro_id);
CREATE INDEX IF NOT EXISTS idx_auditoria_usuario ON auditoria(usuario_id);
CREATE INDEX IF NOT EXISTS idx_auditoria_data ON auditoria(criado_em);
CREATE INDEX IF NOT EXISTS idx_auditoria_empresa ON auditoria(empresa_id);

-- ============================================================
-- 13. LGPD
-- ============================================================

CREATE TABLE IF NOT EXISTS consentimentos (
  id                  SERIAL PRIMARY KEY,
  colaborador_id      INT NOT NULL REFERENCES colaboradores(id) ON DELETE CASCADE,
  finalidade          VARCHAR(255) NOT NULL,
  consentido          BOOLEAN NOT NULL DEFAULT FALSE,
  data_consentimento  TIMESTAMPTZ DEFAULT NULL,
  data_revogacao      TIMESTAMPTZ DEFAULT NULL,
  ip_address          VARCHAR(45) DEFAULT NULL,
  criado_em           TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_consent_colaborador ON consentimentos(colaborador_id);

CREATE TABLE IF NOT EXISTS logs_privacidade (
  id                SERIAL PRIMARY KEY,
  colaborador_id    INT NOT NULL REFERENCES colaboradores(id) ON DELETE CASCADE,
  tipo_acao         tipo_privacidade_enum NOT NULL,
  descricao         TEXT NOT NULL,
  solicitado_por    UUID DEFAULT NULL REFERENCES usuarios(id) ON DELETE SET NULL,
  ip_address        VARCHAR(45) DEFAULT NULL,
  criado_em         TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_priv_colaborador ON logs_privacidade(colaborador_id);
CREATE INDEX IF NOT EXISTS idx_priv_tipo ON logs_privacidade(tipo_acao);

-- ============================================================
-- 14. NOTIFICAÇÕES / ALERTAS
-- ============================================================

CREATE TABLE IF NOT EXISTS notificacoes (
  id                SERIAL PRIMARY KEY,
  usuario_id        UUID DEFAULT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
  colaborador_id    INT DEFAULT NULL REFERENCES colaboradores(id) ON DELETE CASCADE,
  tipo              VARCHAR(50) NOT NULL,
  titulo            VARCHAR(255) NOT NULL,
  mensagem          TEXT NOT NULL,
  nivel             nivel_notificacao_enum NOT NULL DEFAULT 'info',
  lida              BOOLEAN NOT NULL DEFAULT FALSE,
  data_envio        TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  data_leitura      TIMESTAMPTZ DEFAULT NULL,
  criado_em         TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_notif_usuario ON notificacoes(usuario_id);
CREATE INDEX IF NOT EXISTS idx_notif_lida ON notificacoes(lida);
CREATE INDEX IF NOT EXISTS idx_notif_tipo ON notificacoes(tipo);
CREATE INDEX IF NOT EXISTS idx_notif_nivel ON notificacoes(nivel);

-- ============================================================
-- 15. UPLOADS
-- ============================================================

CREATE TABLE IF NOT EXISTS uploads (
  id                SERIAL PRIMARY KEY,
  entidade_tipo     VARCHAR(50) NOT NULL,
  entidade_id       INT NOT NULL,
  arquivo_nome      VARCHAR(255) NOT NULL,
  arquivo_original  VARCHAR(255) NOT NULL,
  mime_type         VARCHAR(50) NOT NULL,
  tamanho_bytes     INT NOT NULL,
  caminho           VARCHAR(500) NOT NULL,
  criado_por        UUID DEFAULT NULL REFERENCES usuarios(id) ON DELETE SET NULL,
  criado_em         TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_uploads_entidade ON uploads(entidade_tipo, entidade_id);

-- ============================================================
-- 16. CONFIGURAÇÕES DO SISTEMA
-- ============================================================

CREATE TABLE IF NOT EXISTS configuracoes_sistema (
  id            SERIAL PRIMARY KEY,
  chave         VARCHAR(100) NOT NULL UNIQUE,
  valor         TEXT NOT NULL,
  descricao     VARCHAR(255) DEFAULT NULL,
  tipo          tipo_config_enum NOT NULL DEFAULT 'string',
  criado_em     TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  atualizado_em TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================
-- 17. ESTOQUE
-- ============================================================

CREATE TABLE IF NOT EXISTS estoque (
  id                SERIAL PRIMARY KEY,
  empresa_id        INT NOT NULL REFERENCES empresas(id) ON DELETE CASCADE,
  nome              VARCHAR(200) NOT NULL,
  descricao         TEXT DEFAULT NULL,
  localizacao       VARCHAR(255) DEFAULT NULL,
  responsavel_id    UUID DEFAULT NULL REFERENCES usuarios(id) ON DELETE SET NULL,
  ativo             BOOLEAN NOT NULL DEFAULT TRUE,
  criado_em         TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  atualizado_em     TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_estoque_empresa ON estoque(empresa_id);
CREATE INDEX IF NOT EXISTS idx_estoque_ativo ON estoque(ativo);

CREATE TABLE IF NOT EXISTS itens_estoque (
  id                    SERIAL PRIMARY KEY,
  estoque_id            INT NOT NULL REFERENCES estoque(id) ON DELETE CASCADE,
  codigo                VARCHAR(50) NOT NULL,
  nome                  VARCHAR(200) NOT NULL,
  descricao             TEXT DEFAULT NULL,
  categoria             VARCHAR(100) DEFAULT NULL,
  unidade              VARCHAR(20) NOT NULL DEFAULT 'un',
  quantidade_atual     NUMERIC(12,2) NOT NULL DEFAULT 0,
  quantidade_minima    NUMERIC(12,2) NOT NULL DEFAULT 0,
  quantidade_maxima    NUMERIC(12,2) NOT NULL DEFAULT 0,
  preco_unitario       NUMERIC(12,2) NOT NULL DEFAULT 0,
  fornecedor           VARCHAR(200) DEFAULT NULL,
  validade             DATE DEFAULT NULL,
  numero_lote          VARCHAR(100) DEFAULT NULL,
  ativo                BOOLEAN NOT NULL DEFAULT TRUE,
  criado_em            TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  atualizado_em        TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (estoque_id, codigo)
);

CREATE INDEX IF NOT EXISTS idx_itens_estoque_estoque ON itens_estoque(estoque_id);
CREATE INDEX IF NOT EXISTS idx_itens_estoque_codigo ON itens_estoque(codigo);
CREATE INDEX IF NOT EXISTS idx_itens_estoque_categoria ON itens_estoque(categoria);

CREATE TABLE IF NOT EXISTS movimentacoes_estoque (
  id                SERIAL PRIMARY KEY,
  item_id           INT NOT NULL REFERENCES itens_estoque(id) ON DELETE CASCADE,
  tipo              VARCHAR(20) NOT NULL CHECK (tipo IN ('entrada', 'saida', 'transferencia', 'ajuste')),
  quantidade        NUMERIC(12,2) NOT NULL,
  motivo            TEXT DEFAULT NULL,
  colaborador_id    UUID DEFAULT NULL REFERENCES usuarios(id) ON DELETE SET NULL,
  os_id             INT DEFAULT NULL,
  usuario_id        UUID DEFAULT NULL REFERENCES usuarios(id) ON DELETE SET NULL,
  criado_em         TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_mov_estoque_item ON movimentacoes_estoque(item_id);
CREATE INDEX IF NOT EXISTS idx_mov_estoque_tipo ON movimentacoes_estoque(tipo);
CREATE INDEX IF NOT EXISTS idx_mov_estoque_data ON movimentacoes_estoque(criado_em);

-- ============================================================
-- 18. MATERIAIS
-- ============================================================

CREATE TABLE IF NOT EXISTS materiais (
  id                SERIAL PRIMARY KEY,
  codigo            VARCHAR(50) NOT NULL UNIQUE,
  nome              VARCHAR(200) NOT NULL,
  descricao         TEXT DEFAULT NULL,
  categoria         VARCHAR(100) NOT NULL DEFAULT 'geral',
  unidade           VARCHAR(20) NOT NULL DEFAULT 'un',
  preco_unitario    NUMERIC(12,2) NOT NULL DEFAULT 0,
  estoque_minimo    INT NOT NULL DEFAULT 0,
  fornecedor        VARCHAR(200) DEFAULT NULL,
  imagem_url        TEXT DEFAULT NULL,
  ativo             BOOLEAN NOT NULL DEFAULT TRUE,
  criado_em         TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  atualizado_em     TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_materiais_codigo ON materiais(codigo);
CREATE INDEX IF NOT EXISTS idx_materiais_categoria ON materiais(categoria);
CREATE INDEX IF NOT EXISTS idx_materiais_ativo ON materiais(ativo);

CREATE TABLE IF NOT EXISTS materiais_os (
  id                SERIAL PRIMARY KEY,
  material_id       INT NOT NULL REFERENCES materiais(id) ON DELETE CASCADE,
  os_id             INT DEFAULT NULL,
  quantidade        NUMERIC(12,2) NOT NULL DEFAULT 1,
  valor_unitario    NUMERIC(12,2) NOT NULL DEFAULT 0,
  observacao        TEXT DEFAULT NULL,
  criado_em         TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  usuario_id        UUID DEFAULT NULL REFERENCES usuarios(id) ON DELETE SET NULL
);

CREATE INDEX IF NOT EXISTS idx_materiais_os_os ON materiais_os(os_id);
CREATE INDEX IF NOT EXISTS idx_materiais_os_material ON materiais_os(material_id);

-- ============================================================
-- 19. ORDENS DE SERVIÇO
-- ============================================================

CREATE TABLE IF NOT EXISTS ordens_servico (
  id                    SERIAL PRIMARY KEY,
  numero                VARCHAR(20) NOT NULL UNIQUE,
  titulo                VARCHAR(200) NOT NULL,
  descricao             TEXT DEFAULT NULL,
  tipo                  VARCHAR(20) NOT NULL DEFAULT 'manutencao' CHECK (tipo IN ('manutencao', 'corretiva', 'preventiva', 'emergencial')),
  prioridade            VARCHAR(10) NOT NULL DEFAULT 'media' CHECK (prioridade IN ('baixa', 'media', 'alta', 'urgente')),
  status                VARCHAR(20) NOT NULL DEFAULT 'aberta' CHECK (status IN ('aberta', 'em_andamento', 'parada', 'concluida', 'cancelada')),
  empresa_id            INT NOT NULL REFERENCES empresas(id) ON DELETE CASCADE,
  colaborador_id        UUID DEFAULT NULL REFERENCES usuarios(id) ON DELETE SET NULL,
  solicitante           VARCHAR(200) DEFAULT NULL,
  setor_solicitante     VARCHAR(200) DEFAULT NULL,
  data_abertura         TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  data_prevista         DATE DEFAULT NULL,
  data_conclusao        TIMESTAMPTZ DEFAULT NULL,
  observacoes           TEXT DEFAULT NULL,
  criado_em             TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  atualizado_em         TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  usuario_criacao       UUID DEFAULT NULL REFERENCES usuarios(id) ON DELETE SET NULL
);

CREATE INDEX IF NOT EXISTS idx_os_numero ON ordens_servico(numero);
CREATE INDEX IF NOT EXISTS idx_os_status ON ordens_servico(status);
CREATE INDEX IF NOT EXISTS idx_os_tipo ON ordens_servico(tipo);
CREATE INDEX IF NOT EXISTS idx_os_prioridade ON ordens_servico(prioridade);
CREATE INDEX IF NOT EXISTS idx_os_empresa ON ordens_servico(empresa_id);
CREATE INDEX IF NOT EXISTS idx_os_data_abertura ON ordens_servico(data_abertura);

CREATE TABLE IF NOT EXISTS historico_os (
  id                SERIAL PRIMARY KEY,
  os_id             INT NOT NULL REFERENCES ordens_servico(id) ON DELETE CASCADE,
  descricao         TEXT NOT NULL,
  usuario_id        UUID DEFAULT NULL REFERENCES usuarios(id) ON DELETE SET NULL,
  criado_em         TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_historico_os_os ON historico_os(os_id);

-- ============================================================
-- TRIGGERS - updated_at automático
-- ============================================================

CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.atualizado_em = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_usuarios_updated_at ON usuarios;
CREATE TRIGGER trg_usuarios_updated_at
  BEFORE UPDATE ON usuarios
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

DROP TRIGGER IF EXISTS trg_empresas_updated_at ON empresas;
CREATE TRIGGER trg_empresas_updated_at
  BEFORE UPDATE ON empresas
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

DROP TRIGGER IF EXISTS trg_colaboradores_updated_at ON colaboradores;
CREATE TRIGGER trg_colaboradores_updated_at
  BEFORE UPDATE ON colaboradores
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

DROP TRIGGER IF EXISTS trg_ferias_updated_at ON ferias;
CREATE TRIGGER trg_ferias_updated_at
  BEFORE UPDATE ON ferias
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

DROP TRIGGER IF EXISTS trg_configuracoes_updated_at ON configuracoes_sistema;
CREATE TRIGGER trg_configuracoes_updated_at
  BEFORE UPDATE ON configuracoes_sistema
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

DROP TRIGGER IF EXISTS trg_estoque_updated_at ON estoque;
CREATE TRIGGER trg_estoque_updated_at
  BEFORE UPDATE ON estoque
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

DROP TRIGGER IF EXISTS trg_itens_estoque_updated_at ON itens_estoque;
CREATE TRIGGER trg_itens_estoque_updated_at
  BEFORE UPDATE ON itens_estoque
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

DROP TRIGGER IF EXISTS trg_materiais_updated_at ON materiais;
CREATE TRIGGER trg_materiais_updated_at
  BEFORE UPDATE ON materiais
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

DROP TRIGGER IF EXISTS trg_os_updated_at ON ordens_servico;
CREATE TRIGGER trg_os_updated_at
  BEFORE UPDATE ON ordens_servico
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ============================================================
-- TRIGGER - Sincronizar auth.users → usuarios
-- ============================================================

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.usuarios (id, email, nome_completo, ativo)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'nome_completo', NEW.email),
    TRUE
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- ============================================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================================

ALTER TABLE usuarios ENABLE ROW LEVEL SECURITY;
ALTER TABLE roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE permissoes ENABLE ROW LEVEL SECURITY;
ALTER TABLE role_permissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE usuario_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE empresas ENABLE ROW LEVEL SECURITY;
ALTER TABLE unidades ENABLE ROW LEVEL SECURITY;
ALTER TABLE setores ENABLE ROW LEVEL SECURITY;
ALTER TABLE funcoes ENABLE ROW LEVEL SECURITY;
ALTER TABLE colaboradores ENABLE ROW LEVEL SECURITY;
ALTER TABLE dependentes ENABLE ROW LEVEL SECURITY;
ALTER TABLE documentos ENABLE ROW LEVEL SECURITY;
ALTER TABLE escolaridade ENABLE ROW LEVEL SECURITY;
ALTER TABLE cursos_treinamentos ENABLE ROW LEVEL SECURITY;
ALTER TABLE colaborador_treinamentos ENABLE ROW LEVEL SECURITY;
ALTER TABLE exames_aso ENABLE ROW LEVEL SECURITY;
ALTER TABLE exames_periodicos ENABLE ROW LEVEL SECURITY;
ALTER TABLE cat ENABLE ROW LEVEL SECURITY;
ALTER TABLE ppp ENABLE ROW LEVEL SECURITY;
ALTER TABLE ferias ENABLE ROW LEVEL SECURITY;
ALTER TABLE avaliacoes_desempenho ENABLE ROW LEVEL SECURITY;
ALTER TABLE avaliacoes_criterios ENABLE ROW LEVEL SECURITY;
ALTER TABLE movimentacoes ENABLE ROW LEVEL SECURITY;
ALTER TABLE banco_horas ENABLE ROW LEVEL SECURITY;
ALTER TABLE auditoria ENABLE ROW LEVEL SECURITY;
ALTER TABLE consentimentos ENABLE ROW LEVEL SECURITY;
ALTER TABLE logs_privacidade ENABLE ROW LEVEL SECURITY;
ALTER TABLE notificacoes ENABLE ROW LEVEL SECURITY;
ALTER TABLE uploads ENABLE ROW LEVEL SECURITY;
ALTER TABLE configuracoes_sistema ENABLE ROW LEVEL SECURITY;
ALTER TABLE estoque ENABLE ROW LEVEL SECURITY;
ALTER TABLE itens_estoque ENABLE ROW LEVEL SECURITY;
ALTER TABLE movimentacoes_estoque ENABLE ROW LEVEL SECURITY;
ALTER TABLE materiais ENABLE ROW LEVEL SECURITY;
ALTER TABLE materiais_os ENABLE ROW LEVEL SECURITY;
ALTER TABLE ordens_servico ENABLE ROW LEVEL SECURITY;
ALTER TABLE historico_os ENABLE ROW LEVEL SECURITY;

-- ============================================================
-- POLÍTICAS RLS
-- ============================================================

-- Função auxiliar para verificar se usuário é admin
CREATE OR REPLACE FUNCTION is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM usuario_roles ur
    JOIN roles r ON r.id = ur.role_id
    WHERE ur.usuario_id = auth.uid()
    AND r.nome = 'admin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Função auxiliar para verificar se usuário é RH
CREATE OR REPLACE FUNCTION is_rh()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM usuario_roles ur
    JOIN roles r ON r.id = ur.role_id
    WHERE ur.usuario_id = auth.uid()
    AND r.nome IN ('admin', 'rh')
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Função auxiliar para verificar se usuário é gestor
CREATE OR REPLACE FUNCTION is_gestor()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM usuario_roles ur
    JOIN roles r ON r.id = ur.role_id
    WHERE ur.usuario_id = auth.uid()
    AND r.nome IN ('admin', 'rh', 'gestor')
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- USUARIOS
DROP POLICY IF EXISTS "Usuarios visualizam própria conta" ON usuarios;
CREATE POLICY "Usuarios visualizam própria conta"
  ON usuarios FOR SELECT
  USING (auth.uid() = id);

DROP POLICY IF EXISTS "Admin gerencia todos usuarios" ON usuarios;
CREATE POLICY "Admin gerencia todos usuarios"
  ON usuarios FOR ALL
  USING (is_admin());

-- EMPRESAS
DROP POLICY IF EXISTS "RH e admin gerenciam empresas" ON empresas;
CREATE POLICY "RH e admin gerenciam empresas"
  ON empresas FOR ALL
  USING (is_rh());

DROP POLICY IF EXISTS "Gestores visualizam empresas" ON empresas;
CREATE POLICY "Gestores visualizam empresas"
  ON empresas FOR SELECT
  USING (is_gestor());

-- COLABORADORES
DROP POLICY IF EXISTS "RH e admin gerenciam colaboradores" ON colaboradores;
CREATE POLICY "RH e admin gerenciam colaboradores"
  ON colaboradores FOR ALL
  USING (is_rh());

DROP POLICY IF EXISTS "Gestores visualizam colaboradores do seu setor" ON colaboradores;
CREATE POLICY "Gestores visualizam colaboradores do seu setor"
  ON colaboradores FOR SELECT
  USING (
    is_gestor()
    OR usuario_id = auth.uid()
  );

-- DEPENDENTES
DROP POLICY IF EXISTS "RH gerencia dependentes" ON dependentes;
CREATE POLICY "RH gerencia dependentes"
  ON dependentes FOR ALL
  USING (is_rh());

-- DOCUMENTOS
DROP POLICY IF EXISTS "RH gerencia documentos" ON documentos;
CREATE POLICY "RH gerencia documentos"
  ON documentos FOR ALL
  USING (is_rh());

-- FÉRIAS
DROP POLICY IF EXISTS "RH gerencia férias" ON ferias;
CREATE POLICY "RH gerencia férias"
  ON ferias FOR ALL
  USING (is_rh());

DROP POLICY IF EXISTS "Colaborador solicita próprias férias" ON ferias;
CREATE POLICY "Colaborador solicita próprias férias"
  ON ferias FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM colaboradores c
      WHERE c.id = colaborador_id
      AND c.usuario_id = auth.uid()
    )
  );

DROP POLICY IF EXISTS "Colaborador visualiza próprias férias" ON ferias;
CREATE POLICY "Colaborador visualiza próprias férias"
  ON ferias FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM colaboradores c
      WHERE c.id = colaborador_id
      AND c.usuario_id = auth.uid()
    )
  );

-- TREINAMENTOS
DROP POLICY IF EXISTS "RH gerencia treinamentos" ON cursos_treinamentos;
CREATE POLICY "RH gerencia treinamentos"
  ON cursos_treinamentos FOR ALL
  USING (is_rh());

DROP POLICY IF EXISTS "Todos visualizam treinamentos" ON cursos_treinamentos;
CREATE POLICY "Todos visualizam treinamentos"
  ON cursos_treinamentos FOR SELECT
  USING (TRUE);

-- AUDITORIA (apenas admin e auditor)
DROP POLICY IF EXISTS "Admin visualiza auditoria" ON auditoria;
CREATE POLICY "Admin visualiza auditoria"
  ON auditoria FOR SELECT
  USING (
    is_admin()
    OR EXISTS (
      SELECT 1 FROM usuario_roles ur
      JOIN roles r ON r.id = ur.role_id
      WHERE ur.usuario_id = auth.uid()
      AND r.nome = 'auditor'
    )
  );

-- NOTIFICAÇÕES
DROP POLICY IF EXISTS "Usuário visualiza próprias notificações" ON notificacoes;
CREATE POLICY "Usuário visualiza próprias notificações"
  ON notificacoes FOR SELECT
  USING (usuario_id = auth.uid());

-- CONFIGURAÇÕES
DROP POLICY IF EXISTS "Admin gerencia configurações" ON configuracoes_sistema;
CREATE POLICY "Admin gerencia configurações"
  ON configuracoes_sistema FOR ALL
  USING (is_admin());

DROP POLICY IF EXISTS "Todos visualizam configurações" ON configuracoes_sistema;
CREATE POLICY "Todos visualizam configurações"
  ON configuracoes_sistema FOR SELECT
  USING (TRUE);

-- PERMISSÕES e ROLES (leitura para todos autenticados)
DROP POLICY IF EXISTS "Todos autenticados visualizam roles" ON roles;
CREATE POLICY "Todos autenticados visualizam roles"
  ON roles FOR SELECT
  USING (auth.uid() IS NOT NULL);

DROP POLICY IF EXISTS "Todos autenticados visualizam permissoes" ON permissoes;
CREATE POLICY "Todos autenticados visualizam permissoes"
  ON permissoes FOR SELECT
  USING (auth.uid() IS NOT NULL);

DROP POLICY IF EXISTS "Todos autenticados visualizam role_permissions" ON role_permissions;
CREATE POLICY "Todos autenticados visualizam role_permissions"
  ON role_permissions FOR SELECT
  USING (auth.uid() IS NOT NULL);

DROP POLICY IF EXISTS "Admin gerencia roles" ON roles;
CREATE POLICY "Admin gerencia roles"
  ON roles FOR ALL
  USING (is_admin());

DROP POLICY IF EXISTS "Admin gerencia permissoes" ON permissoes;
CREATE POLICY "Admin gerencia permissoes"
  ON permissoes FOR ALL
  USING (is_admin());

DROP POLICY IF EXISTS "Admin gerencia role_permissions" ON role_permissions;
CREATE POLICY "Admin gerencia role_permissions"
  ON role_permissions FOR ALL
  USING (is_admin());

-- ESTOQUE
DROP POLICY IF EXISTS "RH e admin gerenciam estoque" ON estoque;
CREATE POLICY "RH e admin gerenciam estoque"
  ON estoque FOR ALL
  USING (is_rh());

DROP POLICY IF EXISTS "Gestores visualizam estoque" ON estoque;
CREATE POLICY "Gestores visualizam estoque"
  ON estoque FOR SELECT
  USING (is_gestor());

DROP POLICY IF EXISTS "RH e admin gerenciam itens estoque" ON itens_estoque;
CREATE POLICY "RH e admin gerenciam itens estoque"
  ON itens_estoque FOR ALL
  USING (is_rh());

DROP POLICY IF EXISTS "Gestores visualizam itens estoque" ON itens_estoque;
CREATE POLICY "Gestores visualizam itens estoque"
  ON itens_estoque FOR SELECT
  USING (is_gestor());

DROP POLICY IF EXISTS "RH e admin gerenciam movimentacoes estoque" ON movimentacoes_estoque;
CREATE POLICY "RH e admin gerenciam movimentacoes estoque"
  ON movimentacoes_estoque FOR ALL
  USING (is_rh());

DROP POLICY IF EXISTS "Gestores visualizam movimentacoes estoque" ON movimentacoes_estoque;
CREATE POLICY "Gestores visualizam movimentacoes estoque"
  ON movimentacoes_estoque FOR SELECT
  USING (is_gestor());

-- MATERIAIS
DROP POLICY IF EXISTS "RH e admin gerenciam materiais" ON materiais;
CREATE POLICY "RH e admin gerenciam materiais"
  ON materiais FOR ALL
  USING (is_rh());

DROP POLICY IF EXISTS "Todos visualizam materiais" ON materiais;
CREATE POLICY "Todos visualizam materiais"
  ON materiais FOR SELECT
  USING (TRUE);

DROP POLICY IF EXISTS "RH e admin gerenciam materiais_os" ON materiais_os;
CREATE POLICY "RH e admin gerenciam materiais_os"
  ON materiais_os FOR ALL
  USING (is_rh());

DROP POLICY IF EXISTS "Todos visualizam materiais_os" ON materiais_os;
CREATE POLICY "Todos visualizam materiais_os"
  ON materiais_os FOR SELECT
  USING (TRUE);

-- ORDENS DE SERVIÇO
DROP POLICY IF EXISTS "RH e admin gerenciam OS" ON ordens_servico;
CREATE POLICY "RH e admin gerenciam OS"
  ON ordens_servico FOR ALL
  USING (is_rh());

DROP POLICY IF EXISTS "Gestores visualizam OS" ON ordens_servico;
CREATE POLICY "Gestores visualizam OS"
  ON ordens_servico FOR SELECT
  USING (is_gestor());

DROP POLICY IF EXISTS "RH e admin gerenciam historico OS" ON historico_os;
CREATE POLICY "RH e admin gerenciam historico OS"
  ON historico_os FOR ALL
  USING (is_rh());

DROP POLICY IF EXISTS "Gestores visualizam historico OS" ON historico_os;
CREATE POLICY "Gestores visualizam historico OS"
  ON historico_os FOR SELECT
  USING (is_gestor());

-- ============================================================
-- DADOS INICIAIS
-- ============================================================

-- Roles padrão
INSERT INTO roles (nome, descricao, nivel) VALUES
  ('admin', 'Administrador do sistema', 100),
  ('rh', 'Recursos Humanos', 80),
  ('gestor', 'Gestor / Supervisor', 60),
  ('colaborador', 'Colaborador comum', 20),
  ('auditor', 'Auditor / Visualizador', 40)
ON CONFLICT (nome) DO NOTHING;

-- Permissões padrão
INSERT INTO permissoes (chave, descricao, modulo) VALUES
  ('usuarios.listar', 'Listar usuários', 'seguranca'),
  ('usuarios.criar', 'Criar usuários', 'seguranca'),
  ('usuarios.editar', 'Editar usuários', 'seguranca'),
  ('usuarios.excluir', 'Excluir usuários', 'seguranca'),
  ('usuarios.resetar_senha', 'Resetar senha de usuários', 'seguranca'),
  ('roles.gerenciar', 'Gerenciar perfis e permissões', 'seguranca'),
  ('colaboradores.listar', 'Listar colaboradores', 'rh'),
  ('colaboradores.criar', 'Cadastrar colaboradores', 'rh'),
  ('colaboradores.editar', 'Editar dados de colaboradores', 'rh'),
  ('colaboradores.excluir', 'Excluir colaboradores', 'rh'),
  ('colaboradores.visualizar_documento', 'Visualizar documentos', 'rh'),
  ('ferias.solicitar', 'Solicitar férias', 'rh'),
  ('ferias.aprovar', 'Aprovar férias', 'rh'),
  ('ferias.visualizar', 'Visualizar férias', 'rh'),
  ('movimentacoes.criar', 'Criar movimentações', 'rh'),
  ('movimentacoes.aprovar', 'Aprovar movimentações', 'rh'),
  ('treinamentos.listar', 'Listar treinamentos', 'treinamentos'),
  ('treinamentos.criar', 'Criar treinamentos', 'treinamentos'),
  ('treinamentos.matricular', 'Matricular colaboradores', 'treinamentos'),
  ('aso.listar', 'Listar ASOs', 'saude'),
  ('aso.criar', 'Cadastrar ASOs', 'saude'),
  ('exames.listar', 'Listar exames', 'saude'),
  ('exames.criar', 'Cadastrar exames', 'saude'),
  ('cat.listar', 'Listar CATs', 'saude'),
  ('cat.criar', 'Cadastrar CATs', 'saude'),
  ('auditoria.visualizar', 'Visualizar auditoria', 'auditoria'),
  ('relatorios.gerar', 'Gerar relatórios', 'relatorios'),
  ('relatorios.pdf', 'Gerar PDFs', 'relatorios'),
  ('dashboard.visualizar', 'Visualizar dashboard', 'dashboard'),
  ('configuracoes.gerenciar', 'Gerenciar configurações', 'configuracoes'),
  ('estoque.listar', 'Listar estoques', 'estoque'),
  ('estoque.gerenciar', 'Gerenciar estoques e itens', 'estoque'),
  ('materiais.listar', 'Listar materiais', 'materiais'),
  ('materiais.gerenciar', 'Gerenciar catálogo de materiais', 'materiais'),
  ('os.listar', 'Listar ordens de serviço', 'os'),
  ('os.gerenciar', 'Gerenciar ordens de serviço', 'os')
ON CONFLICT (chave) DO NOTHING;

-- Admin role recebe todas as permissões
INSERT INTO role_permissions (role_id, permissao_id)
SELECT
  (SELECT id FROM roles WHERE nome = 'admin'),
  id
FROM permissoes
ON CONFLICT (role_id, permissao_id) DO NOTHING;

-- RH recebe permissões relevantes
INSERT INTO role_permissions (role_id, permissao_id)
SELECT
  (SELECT id FROM roles WHERE nome = 'rh'),
  id
FROM permissoes
WHERE chave IN (
  'colaboradores.listar', 'colaboradores.criar', 'colaboradores.editar', 'colaboradores.visualizar_documento',
  'ferias.solicitar', 'ferias.aprovar', 'ferias.visualizar',
  'movimentacoes.criar', 'movimentacoes.aprovar',
  'treinamentos.listar', 'treinamentos.criar', 'treinamentos.matricular',
  'aso.listar', 'aso.criar', 'exames.listar', 'exames.criar',
  'cat.listar', 'cat.criar',
  'relatorios.gerar', 'relatorios.pdf',
  'dashboard.visualizar',
  'estoque.listar', 'estoque.gerenciar',
  'materiais.listar', 'materiais.gerenciar',
  'os.listar', 'os.gerenciar'
)
ON CONFLICT (role_id, permissao_id) DO NOTHING;

-- Gestor recebe permissões de visualização + aprovação
INSERT INTO role_permissions (role_id, permissao_id)
SELECT
  (SELECT id FROM roles WHERE nome = 'gestor'),
  id
FROM permissoes
WHERE chave IN (
  'colaboradores.listar', 'colaboradores.visualizar_documento',
  'ferias.solicitar', 'ferias.visualizar',
  'treinamentos.listar',
  'aso.listar',
  'relatorios.gerar',
  'dashboard.visualizar',
  'estoque.listar',
  'materiais.listar',
  'os.listar'
)
ON CONFLICT (role_id, permissao_id) DO NOTHING;

-- Colaborador recebe permissões básicas
INSERT INTO role_permissions (role_id, permissao_id)
SELECT
  (SELECT id FROM roles WHERE nome = 'colaborador'),
  id
FROM permissoes
WHERE chave IN (
  'ferias.solicitar',
  'treinamentos.listar',
  'dashboard.visualizar'
)
ON CONFLICT (role_id, permissao_id) DO NOTHING;

-- Configurações padrão
INSERT INTO configuracoes_sistema (chave, valor, descricao, tipo) VALUES
  ('sistema.nome', 'T&A Ind Serv', 'Nome do sistema', 'string'),
  ('sistema.versao', '1.0.0', 'Versão do sistema', 'string'),
  ('alerta.aso_dias', '30', 'Dias de antecedência para alertar ASO', 'int'),
  ('alerta.ferias_dias', '15', 'Dias de antecedência para alertar férias', 'int'),
  ('alerta.nr_dias', '30', 'Dias de antecedência para alertar NRs', 'int'),
  ('alerta.exame_dias', '15', 'Dias de antecedência para alertar exames', 'int'),
  ('ferias.minimo_dias', '10', 'Mínimo de dias para fracionar férias', 'int'),
  ('ferias.maximo_fracionamento', '3', 'Máximo de parcelas de férias', 'int'),
  ('senha.minimo_caracteres', '8', 'Mínimo de caracteres da senha', 'int'),
  ('senha.requer_numero', '1', 'Senha requer número', 'boolean'),
  ('senha.requer_especial', '1', 'Senha requer caractere especial', 'boolean'),
  ('senha.expiracao_dias', '90', 'Dias para expiração da senha', 'int'),
  ('login.max_tentativas', '5', 'Máximo de tentativas de login', 'int'),
  ('login.bloqueio_minutos', '30', 'Minutos de bloqueio após falhas', 'int'),
  ('lgpd.retencao_dias', '2555', 'Dias de retenção de dados (7 anos)', 'int'),
  ('upload.tamanho_maximo_mb', '10', 'Tamanho máximo de upload em MB', 'int'),
  ('upload.tipos_permitidos', 'pdf,jpg,png,jpeg,doc,docx', 'Tipos de arquivo permitidos', 'string')
ON CONFLICT (chave) DO NOTHING;


