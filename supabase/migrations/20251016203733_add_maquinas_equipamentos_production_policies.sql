/*
  # Adicionar Políticas RLS de Produção para Máquinas e Equipamentos
  
  ## Resumo
  Este migration adiciona políticas de Row Level Security (RLS) para permitir que 
  usuários autenticados em produção consigam gerenciar suas próprias máquinas e equipamentos.
  
  ## Problema Resolvido
  - A tabela maquinas_equipamentos tinha RLS habilitado
  - Apenas existiam políticas para o usuário de desenvolvimento (dev bypass)
  - Usuários em produção não conseguiam visualizar suas próprias máquinas
  
  ## Mudanças
  
  ### 1. Políticas para Visualização (SELECT)
  - Permite que usuários autenticados vejam suas próprias máquinas
  - Verifica ownership através da coluna user_id comparada com auth.uid()
  
  ### 2. Políticas para Inserção (INSERT)
  - Permite que usuários autenticados cadastrem novas máquinas
  - Garante que o user_id inserido corresponde ao auth.uid() do usuário
  
  ### 3. Políticas para Atualização (UPDATE)
  - Permite que usuários atualizem apenas suas próprias máquinas
  - Verifica ownership antes e depois da atualização
  
  ### 4. Políticas para Exclusão (DELETE)
  - Permite que usuários removam apenas suas próprias máquinas
  - Verifica ownership através do user_id
  
  ## Notas de Segurança
  - Todas as políticas usam auth.uid() para identificar o usuário autenticado
  - As políticas de desenvolvimento (dev bypass) permanecem intactas
  - Cada política é restrita ao role 'authenticated' para segurança adicional
  - Usuários só podem acessar dados onde user_id = auth.uid()
*/

-- ============================================================================
-- POLÍTICAS DE PRODUÇÃO PARA MÁQUINAS E EQUIPAMENTOS
-- ============================================================================

-- Remover políticas de produção existentes (se houver) para evitar duplicação
DROP POLICY IF EXISTS "Users can view own machinery" ON public.maquinas_equipamentos;
DROP POLICY IF EXISTS "Users can insert own machinery" ON public.maquinas_equipamentos;
DROP POLICY IF EXISTS "Users can update own machinery" ON public.maquinas_equipamentos;
DROP POLICY IF EXISTS "Users can delete own machinery" ON public.maquinas_equipamentos;

-- ----------------------------------------------------------------------------
-- POLÍTICA DE VISUALIZAÇÃO (SELECT)
-- ----------------------------------------------------------------------------
-- Permite que usuários autenticados visualizem suas próprias máquinas e equipamentos
-- Comparação: user_id da máquina deve ser igual ao auth.uid() do usuário logado
CREATE POLICY "Users can view own machinery"
  ON public.maquinas_equipamentos
  FOR SELECT
  TO authenticated
  USING (user_id = (SELECT auth.uid()));

-- ----------------------------------------------------------------------------
-- POLÍTICA DE INSERÇÃO (INSERT)
-- ----------------------------------------------------------------------------
-- Permite que usuários autenticados cadastrem novas máquinas e equipamentos
-- Validação: garante que o user_id inserido corresponde ao usuário logado
CREATE POLICY "Users can insert own machinery"
  ON public.maquinas_equipamentos
  FOR INSERT
  TO authenticated
  WITH CHECK (user_id = (SELECT auth.uid()));

-- ----------------------------------------------------------------------------
-- POLÍTICA DE ATUALIZAÇÃO (UPDATE)
-- ----------------------------------------------------------------------------
-- Permite que usuários autenticados atualizem suas próprias máquinas
-- USING: verifica ownership antes da atualização
-- WITH CHECK: garante que após a atualização o user_id ainda pertence ao usuário
CREATE POLICY "Users can update own machinery"
  ON public.maquinas_equipamentos
  FOR UPDATE
  TO authenticated
  USING (user_id = (SELECT auth.uid()))
  WITH CHECK (user_id = (SELECT auth.uid()));

-- ----------------------------------------------------------------------------
-- POLÍTICA DE EXCLUSÃO (DELETE)
-- ----------------------------------------------------------------------------
-- Permite que usuários autenticados removam suas próprias máquinas
-- Verifica ownership através do user_id antes de permitir a exclusão
CREATE POLICY "Users can delete own machinery"
  ON public.maquinas_equipamentos
  FOR DELETE
  TO authenticated
  USING (user_id = (SELECT auth.uid()));

-- ============================================================================
-- FIM DAS POLÍTICAS DE PRODUÇÃO
-- ============================================================================

-- Nota: As políticas de desenvolvimento (Dev user can...) definidas em migrations
-- anteriores permanecem ativas e não foram alteradas por este migration.