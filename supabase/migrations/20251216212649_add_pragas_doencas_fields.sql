-- ============================================
-- Migration: Adicionar campos para Pragas e Doenças
-- ============================================
--
-- 1. Novos Campos na tabela pragas_e_doencas:
--    - origem: Origem do registro (WhatsApp ou Painel)
--    - nome_praga: Nome identificado da praga ou doença
--    - diagnostico: Nível de confirmação do diagnóstico
--    - descricao_detalhada: Descrição detalhada dos sintomas
--    - clima_recente: Condições climáticas recentes
--    - produtos_aplicados: Array de produtos aplicados (JSONB)
--    - data_aplicacao: Data de aplicação dos produtos
--    - recomendacoes: Recomendações futuras
--    - status: Status da ocorrência (Nova, Em acompanhamento, Resolvida)
--    - anexos: Array de URLs de anexos (JSONB)
--    - foto_principal: URL ou emoji da foto principal
--    - updated_at: Data de última atualização
--
-- 2. Índices para performance:
--    - idx_pragas_user_status: Índice em user_id e status
--    - idx_pragas_data: Índice em data_da_ocorrencia
--
-- 3. Valores padrão:
--    - origem: 'Painel'
--    - status: 'Nova'
--    - produtos_aplicados e anexos: arrays vazios

-- Adicionar coluna 'origem'
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'pragas_e_doencas' AND column_name = 'origem'
  ) THEN
    ALTER TABLE pragas_e_doencas ADD COLUMN origem TEXT DEFAULT 'Painel';
  END IF;
END $$;

-- Adicionar coluna 'nome_praga'
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'pragas_e_doencas' AND column_name = 'nome_praga'
  ) THEN
    ALTER TABLE pragas_e_doencas ADD COLUMN nome_praga TEXT;
  END IF;
END $$;

-- Adicionar coluna 'diagnostico'
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'pragas_e_doencas' AND column_name = 'diagnostico'
  ) THEN
    ALTER TABLE pragas_e_doencas ADD COLUMN diagnostico TEXT;
  END IF;
END $$;

-- Adicionar coluna 'descricao_detalhada'
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'pragas_e_doencas' AND column_name = 'descricao_detalhada'
  ) THEN
    ALTER TABLE pragas_e_doencas ADD COLUMN descricao_detalhada TEXT;
  END IF;
END $$;

-- Adicionar coluna 'clima_recente'
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'pragas_e_doencas' AND column_name = 'clima_recente'
  ) THEN
    ALTER TABLE pragas_e_doencas ADD COLUMN clima_recente TEXT;
  END IF;
END $$;

-- Adicionar coluna 'produtos_aplicados' (JSONB array)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'pragas_e_doencas' AND column_name = 'produtos_aplicados'
  ) THEN
    ALTER TABLE pragas_e_doencas ADD COLUMN produtos_aplicados JSONB DEFAULT '[]'::jsonb;
  END IF;
END $$;

-- Adicionar coluna 'data_aplicacao'
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'pragas_e_doencas' AND column_name = 'data_aplicacao'
  ) THEN
    ALTER TABLE pragas_e_doencas ADD COLUMN data_aplicacao DATE;
  END IF;
END $$;

-- Adicionar coluna 'recomendacoes'
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'pragas_e_doencas' AND column_name = 'recomendacoes'
  ) THEN
    ALTER TABLE pragas_e_doencas ADD COLUMN recomendacoes TEXT;
  END IF;
END $$;

-- Adicionar coluna 'status'
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'pragas_e_doencas' AND column_name = 'status'
  ) THEN
    ALTER TABLE pragas_e_doencas ADD COLUMN status TEXT DEFAULT 'Nova';
  END IF;
END $$;

-- Adicionar coluna 'anexos' (JSONB array)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'pragas_e_doencas' AND column_name = 'anexos'
  ) THEN
    ALTER TABLE pragas_e_doencas ADD COLUMN anexos JSONB DEFAULT '[]'::jsonb;
  END IF;
END $$;

-- Adicionar coluna 'foto_principal'
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'pragas_e_doencas' AND column_name = 'foto_principal'
  ) THEN
    ALTER TABLE pragas_e_doencas ADD COLUMN foto_principal TEXT;
  END IF;
END $$;

-- Adicionar coluna 'updated_at'
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'pragas_e_doencas' AND column_name = 'updated_at'
  ) THEN
    ALTER TABLE pragas_e_doencas ADD COLUMN updated_at TIMESTAMPTZ DEFAULT NOW();
  END IF;
END $$;

-- Criar índice em user_id e status para filtros rápidos
CREATE INDEX IF NOT EXISTS idx_pragas_user_status ON pragas_e_doencas(user_id, status);

-- Criar índice em data_da_ocorrencia para ordenação
CREATE INDEX IF NOT EXISTS idx_pragas_data ON pragas_e_doencas(data_da_ocorrencia DESC);

-- Adicionar comentários às novas colunas
COMMENT ON COLUMN pragas_e_doencas.origem IS 'Origem do registro: WhatsApp ou Painel';
COMMENT ON COLUMN pragas_e_doencas.nome_praga IS 'Nome identificado da praga ou doença';
COMMENT ON COLUMN pragas_e_doencas.diagnostico IS 'Nível de confirmação do diagnóstico';
COMMENT ON COLUMN pragas_e_doencas.descricao_detalhada IS 'Descrição detalhada dos sintomas observados';
COMMENT ON COLUMN pragas_e_doencas.clima_recente IS 'Condições climáticas recentes que podem ter influenciado';
COMMENT ON COLUMN pragas_e_doencas.produtos_aplicados IS 'Array JSON de produtos aplicados no tratamento';
COMMENT ON COLUMN pragas_e_doencas.data_aplicacao IS 'Data em que os produtos foram aplicados';
COMMENT ON COLUMN pragas_e_doencas.recomendacoes IS 'Recomendações para acompanhamento futuro';
COMMENT ON COLUMN pragas_e_doencas.status IS 'Status da ocorrência: Nova, Em acompanhamento, ou Resolvida';
COMMENT ON COLUMN pragas_e_doencas.anexos IS 'Array JSON de URLs de anexos (fotos, PDFs)';
COMMENT ON COLUMN pragas_e_doencas.foto_principal IS 'URL ou emoji da foto principal da ocorrência';
COMMENT ON COLUMN pragas_e_doencas.updated_at IS 'Data e hora da última atualização do registro';