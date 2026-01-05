/*
  # Optimize RLS Policies for Performance - Simple Tables Only

  1. Changes
    - Replace auth.uid() with (select auth.uid()) for simple single-table policies
    - Skip tables with complex joins or missing user_id columns

  2. Security
    - No security changes, only performance optimization
*/

-- usuarios policies
DROP POLICY IF EXISTS "insert-own-user" ON public.usuarios;
DROP POLICY IF EXISTS "select-own-user" ON public.usuarios;
DROP POLICY IF EXISTS "update-own-user" ON public.usuarios;

CREATE POLICY "insert-own-user" ON public.usuarios
  FOR INSERT TO authenticated
  WITH CHECK (user_id = (select auth.uid()));

CREATE POLICY "select-own-user" ON public.usuarios
  FOR SELECT TO authenticated
  USING (user_id = (select auth.uid()));

CREATE POLICY "update-own-user" ON public.usuarios
  FOR UPDATE TO authenticated
  USING (user_id = (select auth.uid()))
  WITH CHECK (user_id = (select auth.uid()));

-- propriedades select policy
DROP POLICY IF EXISTS "select" ON public.propriedades;

CREATE POLICY "select" ON public.propriedades
  FOR SELECT TO authenticated
  USING (
    user_id = (select auth.uid()) OR
    EXISTS (
      SELECT 1 FROM vinculo_usuario_propriedade vup
      WHERE vup.id_propriedade = propriedades.id_propriedade
      AND vup.user_id = (select auth.uid())
      AND vup.ativo = true
    )
  );

-- lancamentos_agricolas policies
DROP POLICY IF EXISTS "del_own_lancagric" ON public.lancamentos_agricolas;
DROP POLICY IF EXISTS "sel_own_lancagric" ON public.lancamentos_agricolas;
DROP POLICY IF EXISTS "ins_own_lancagric" ON public.lancamentos_agricolas;
DROP POLICY IF EXISTS "upd_own_lancagric" ON public.lancamentos_agricolas;

CREATE POLICY "del_own_lancagric" ON public.lancamentos_agricolas
  FOR DELETE TO authenticated
  USING (user_id = (select auth.uid()));

CREATE POLICY "sel_own_lancagric" ON public.lancamentos_agricolas
  FOR SELECT TO authenticated
  USING (user_id = (select auth.uid()));

CREATE POLICY "ins_own_lancagric" ON public.lancamentos_agricolas
  FOR INSERT TO authenticated
  WITH CHECK (user_id = (select auth.uid()));

CREATE POLICY "upd_own_lancagric" ON public.lancamentos_agricolas
  FOR UPDATE TO authenticated
  USING (user_id = (select auth.uid()))
  WITH CHECK (user_id = (select auth.uid()));

-- lancamento child tables with proper aliases
DROP POLICY IF EXISTS "sel_child_ltalhoes" ON public.lancamento_talhoes;
DROP POLICY IF EXISTS "mut_child_ltalhoes" ON public.lancamento_talhoes;

CREATE POLICY "sel_child_ltalhoes" ON public.lancamento_talhoes
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM lancamentos_agricolas la
      WHERE la.atividade_id = lancamento_talhoes.atividade_id
      AND la.user_id = (select auth.uid())
    )
  );

CREATE POLICY "mut_child_ltalhoes" ON public.lancamento_talhoes
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM lancamentos_agricolas la
      WHERE la.atividade_id = lancamento_talhoes.atividade_id
      AND la.user_id = (select auth.uid())
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM lancamentos_agricolas la
      WHERE la.atividade_id = lancamento_talhoes.atividade_id
      AND la.user_id = (select auth.uid())
    )
  );

DROP POLICY IF EXISTS "sel_child_lprod" ON public.lancamento_produtos;
DROP POLICY IF EXISTS "mut_child_lprod" ON public.lancamento_produtos;

CREATE POLICY "sel_child_lprod" ON public.lancamento_produtos
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM lancamentos_agricolas la
      WHERE la.atividade_id = lancamento_produtos.atividade_id
      AND la.user_id = (select auth.uid())
    )
  );

CREATE POLICY "mut_child_lprod" ON public.lancamento_produtos
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM lancamentos_agricolas la
      WHERE la.atividade_id = lancamento_produtos.atividade_id
      AND la.user_id = (select auth.uid())
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM lancamentos_agricolas la
      WHERE la.atividade_id = lancamento_produtos.atividade_id
      AND la.user_id = (select auth.uid())
    )
  );

DROP POLICY IF EXISTS "sel_child_lmaq" ON public.lancamento_maquinas;
DROP POLICY IF EXISTS "mut_child_lmaq" ON public.lancamento_maquinas;

CREATE POLICY "sel_child_lmaq" ON public.lancamento_maquinas
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM lancamentos_agricolas la
      WHERE la.atividade_id = lancamento_maquinas.atividade_id
      AND la.user_id = (select auth.uid())
    )
  );

CREATE POLICY "mut_child_lmaq" ON public.lancamento_maquinas
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM lancamentos_agricolas la
      WHERE la.atividade_id = lancamento_maquinas.atividade_id
      AND la.user_id = (select auth.uid())
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM lancamentos_agricolas la
      WHERE la.atividade_id = lancamento_maquinas.atividade_id
      AND la.user_id = (select auth.uid())
    )
  );

DROP POLICY IF EXISTS "sel_child_lresp" ON public.lancamento_responsaveis;
DROP POLICY IF EXISTS "mut_child_lresp" ON public.lancamento_responsaveis;

CREATE POLICY "sel_child_lresp" ON public.lancamento_responsaveis
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM lancamentos_agricolas la
      WHERE la.atividade_id = lancamento_responsaveis.atividade_id
      AND la.user_id = (select auth.uid())
    )
  );

CREATE POLICY "mut_child_lresp" ON public.lancamento_responsaveis
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM lancamentos_agricolas la
      WHERE la.atividade_id = lancamento_responsaveis.atividade_id
      AND la.user_id = (select auth.uid())
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM lancamentos_agricolas la
      WHERE la.atividade_id = lancamento_responsaveis.atividade_id
      AND la.user_id = (select auth.uid())
    )
  );

-- pragas_e_doencas policies
DROP POLICY IF EXISTS "Users can view only own pragas_e_doencas" ON public.pragas_e_doencas;
DROP POLICY IF EXISTS "Users can insert only own pragas_e_doencas" ON public.pragas_e_doencas;
DROP POLICY IF EXISTS "Users can update only own pragas_e_doencas" ON public.pragas_e_doencas;
DROP POLICY IF EXISTS "Users can delete only own pragas_e_doencas" ON public.pragas_e_doencas;

CREATE POLICY "Users can view only own pragas_e_doencas" ON public.pragas_e_doencas
  FOR SELECT TO authenticated
  USING (user_id = (select auth.uid()));

CREATE POLICY "Users can insert only own pragas_e_doencas" ON public.pragas_e_doencas
  FOR INSERT TO authenticated
  WITH CHECK (user_id = (select auth.uid()));

CREATE POLICY "Users can update only own pragas_e_doencas" ON public.pragas_e_doencas
  FOR UPDATE TO authenticated
  USING (user_id = (select auth.uid()))
  WITH CHECK (user_id = (select auth.uid()));

CREATE POLICY "Users can delete only own pragas_e_doencas" ON public.pragas_e_doencas
  FOR DELETE TO authenticated
  USING (user_id = (select auth.uid()));

-- pragas_e_doencas_talhoes policies
DROP POLICY IF EXISTS "Users can view only own pragas_e_doencas_talhoes" ON public.pragas_e_doencas_talhoes;
DROP POLICY IF EXISTS "Users can insert only own pragas_e_doencas_talhoes" ON public.pragas_e_doencas_talhoes;
DROP POLICY IF EXISTS "Users can delete only own pragas_e_doencas_talhoes" ON public.pragas_e_doencas_talhoes;

CREATE POLICY "Users can view only own pragas_e_doencas_talhoes" ON public.pragas_e_doencas_talhoes
  FOR SELECT TO authenticated
  USING (user_id = (select auth.uid()));

CREATE POLICY "Users can insert only own pragas_e_doencas_talhoes" ON public.pragas_e_doencas_talhoes
  FOR INSERT TO authenticated
  WITH CHECK (user_id = (select auth.uid()));

CREATE POLICY "Users can delete only own pragas_e_doencas_talhoes" ON public.pragas_e_doencas_talhoes
  FOR DELETE TO authenticated
  USING (user_id = (select auth.uid()));

-- notificacoes_produtor policies
DROP POLICY IF EXISTS "allow_user_select_notifications" ON public.notificacoes_produtor;
DROP POLICY IF EXISTS "allow_user_update_own_notification" ON public.notificacoes_produtor;

CREATE POLICY "allow_user_select_notifications" ON public.notificacoes_produtor
  FOR SELECT TO authenticated
  USING (user_id = (select auth.uid()));

CREATE POLICY "allow_user_update_own_notification" ON public.notificacoes_produtor
  FOR UPDATE TO authenticated
  USING (user_id = (select auth.uid()))
  WITH CHECK (user_id = (select auth.uid()));

-- transacoes_talhoes_alocacao policies (uses join with transacoes_financeiras)
DROP POLICY IF EXISTS "Users can view own transaction allocations" ON public.transacoes_talhoes_alocacao;

CREATE POLICY "Users can view own transaction allocations" ON public.transacoes_talhoes_alocacao
  FOR SELECT TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM transacoes_financeiras tf
      WHERE tf.id_transacao = transacoes_talhoes_alocacao.id_transacao
      AND tf.user_id = (select auth.uid())
    )
  );

-- dividas_financiamentos policies
DROP POLICY IF EXISTS "Usuários podem visualizar suas próprias dívidas" ON public.dividas_financiamentos;
DROP POLICY IF EXISTS "Usuários podem inserir suas próprias dívidas" ON public.dividas_financiamentos;
DROP POLICY IF EXISTS "Usuários podem atualizar suas próprias dívidas" ON public.dividas_financiamentos;
DROP POLICY IF EXISTS "Usuários podem deletar suas próprias dívidas" ON public.dividas_financiamentos;

CREATE POLICY "Usuários podem visualizar suas próprias dívidas" ON public.dividas_financiamentos
  FOR SELECT TO authenticated
  USING (user_id = (select auth.uid()));

CREATE POLICY "Usuários podem inserir suas próprias dívidas" ON public.dividas_financiamentos
  FOR INSERT TO authenticated
  WITH CHECK (user_id = (select auth.uid()));

CREATE POLICY "Usuários podem atualizar suas próprias dívidas" ON public.dividas_financiamentos
  FOR UPDATE TO authenticated
  USING (user_id = (select auth.uid()))
  WITH CHECK (user_id = (select auth.uid()));

CREATE POLICY "Usuários podem deletar suas próprias dívidas" ON public.dividas_financiamentos
  FOR DELETE TO authenticated
  USING (user_id = (select auth.uid()));
