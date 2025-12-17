/*
  # Criar tabela de Dívidas e Financiamentos

  1. Nova Tabela
    - `dividas_financiamentos`
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key to auth.users)
      - `nome` (text) - Título/nome da dívida ou financiamento
      - `credor` (text) - Banco, cooperativa, empresa credora
      - `tipo` (text) - Tipo: Financiamento bancário, Máquina, CPR Física, Custeio, etc
      - `data_contratacao` (date) - Data da contratação
      - `valor_contratado` (numeric) - Valor total contratado
      - `taxa` (text) - Taxa de juros (ex: "12% a.a.")
      - `carencia` (text) - Período de carência (ex: "6 meses")
      - `garantia` (text) - Tipo de garantia oferecida
      - `responsavel` (text) - Responsável pela dívida
      - `observacoes` (text) - Observações gerais
      - `forma_pagamento` (text) - Descrição da forma de pagamento
      - `situacao` (text) - Status: 'Ativa', 'Liquidada', 'Renegociada'
      - `juros_aa` (text) - Período dos juros (a.a., a.m., etc)
      - `indexador` (text) - Indexador: Fixo, CDI, IPCA, etc
      - `indexador_outro` (text) - Outro indexador personalizado
      - `pagamento_parcela` (jsonb) - Dados de pagamento parcela única
      - `pagamento_parcelado` (jsonb) - Dados de pagamento parcelado
      - `pagamento_producao` (jsonb) - Dados de pagamento em produção
      - `cronograma_manual` (text) - Cronograma manual de pagamento
      - `anexos` (text[]) - Array de URLs/nomes de anexos
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

  2. Segurança
    - Habilitar RLS
    - Políticas para usuários autenticados visualizarem apenas suas dívidas
    - Políticas para inserir, atualizar e deletar apenas suas próprias dívidas

  3. Índices
    - Índice em user_id para consultas rápidas
    - Índice em situacao para filtros
    - Índice em data_contratacao para ordenação
*/

-- Criar tabela de dívidas e financiamentos
CREATE TABLE IF NOT EXISTS dividas_financiamentos (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  nome text NOT NULL,
  credor text NOT NULL,
  tipo text NOT NULL,
  data_contratacao date NOT NULL,
  valor_contratado numeric(15, 2) NOT NULL,
  taxa text,
  carencia text,
  garantia text,
  responsavel text NOT NULL,
  observacoes text,
  forma_pagamento text NOT NULL,
  situacao text NOT NULL DEFAULT 'Ativa' CHECK (situacao IN ('Ativa', 'Liquidada', 'Renegociada')),
  juros_aa text,
  indexador text,
  indexador_outro text,
  pagamento_parcela jsonb,
  pagamento_parcelado jsonb,
  pagamento_producao jsonb,
  cronograma_manual text,
  anexos text[] DEFAULT ARRAY[]::text[],
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Criar índices para melhor performance
CREATE INDEX IF NOT EXISTS idx_dividas_financiamentos_user_id ON dividas_financiamentos(user_id);
CREATE INDEX IF NOT EXISTS idx_dividas_financiamentos_situacao ON dividas_financiamentos(situacao);
CREATE INDEX IF NOT EXISTS idx_dividas_financiamentos_data_contratacao ON dividas_financiamentos(data_contratacao DESC);
CREATE INDEX IF NOT EXISTS idx_dividas_financiamentos_tipo ON dividas_financiamentos(tipo);

-- Criar trigger para atualizar updated_at
CREATE OR REPLACE FUNCTION update_dividas_financiamentos_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_update_dividas_financiamentos_updated_at ON dividas_financiamentos;
CREATE TRIGGER trigger_update_dividas_financiamentos_updated_at
  BEFORE UPDATE ON dividas_financiamentos
  FOR EACH ROW
  EXECUTE FUNCTION update_dividas_financiamentos_updated_at();

-- Habilitar RLS
ALTER TABLE dividas_financiamentos ENABLE ROW LEVEL SECURITY;

-- Políticas RLS
CREATE POLICY "Usuários podem visualizar suas próprias dívidas"
  ON dividas_financiamentos FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Usuários podem inserir suas próprias dívidas"
  ON dividas_financiamentos FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Usuários podem atualizar suas próprias dívidas"
  ON dividas_financiamentos FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Usuários podem deletar suas próprias dívidas"
  ON dividas_financiamentos FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);