-- ============================================
-- Migration: Adicionar políticas RLS para Pragas e Doenças
-- ============================================
--
-- 1. Tabela pragas_e_doencas:
--    - SELECT: Usuários podem ver seus próprios registros
--    - INSERT: Usuários podem criar seus próprios registros
--    - UPDATE: Usuários podem atualizar seus próprios registros
--    - DELETE: Usuários podem deletar seus próprios registros
--
-- 2. Tabela pragas_e_doencas_talhoes:
--    - SELECT: Usuários podem ver vínculos de seus próprios registros
--    - INSERT: Usuários podem criar vínculos para seus próprios registros
--    - DELETE: Usuários podem deletar vínculos de seus próprios registros
--
-- 3. Suporte para service_role para operações administrativas

-- Políticas para pragas_e_doencas
CREATE POLICY "Users can view own pragas_e_doencas"
  ON pragas_e_doencas
  FOR SELECT
  TO authenticated, anon
  USING (user_id = auth.uid() OR current_setting('role', true) = 'service_role');

CREATE POLICY "Users can insert own pragas_e_doencas"
  ON pragas_e_doencas
  FOR INSERT
  TO authenticated, anon
  WITH CHECK (user_id = auth.uid() OR current_setting('role', true) = 'service_role');

CREATE POLICY "Users can update own pragas_e_doencas"
  ON pragas_e_doencas
  FOR UPDATE
  TO authenticated, anon
  USING (user_id = auth.uid() OR current_setting('role', true) = 'service_role')
  WITH CHECK (user_id = auth.uid() OR current_setting('role', true) = 'service_role');

CREATE POLICY "Users can delete own pragas_e_doencas"
  ON pragas_e_doencas
  FOR DELETE
  TO authenticated, anon
  USING (user_id = auth.uid() OR current_setting('role', true) = 'service_role');

-- Políticas para pragas_e_doencas_talhoes
CREATE POLICY "Users can view own pragas_e_doencas_talhoes"
  ON pragas_e_doencas_talhoes
  FOR SELECT
  TO authenticated, anon
  USING (user_id = auth.uid() OR current_setting('role', true) = 'service_role');

CREATE POLICY "Users can insert own pragas_e_doencas_talhoes"
  ON pragas_e_doencas_talhoes
  FOR INSERT
  TO authenticated, anon
  WITH CHECK (user_id = auth.uid() OR current_setting('role', true) = 'service_role');

CREATE POLICY "Users can delete own pragas_e_doencas_talhoes"
  ON pragas_e_doencas_talhoes
  FOR DELETE
  TO authenticated, anon
  USING (user_id = auth.uid() OR current_setting('role', true) = 'service_role');