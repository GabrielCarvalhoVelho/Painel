/*
  # Correção das RLS do bucket notas_fiscais

  1. Problema Identificado
    - SELECT policy permite leitura pública de TODOS os arquivos
    - Não verifica ownership real dos anexos
    - Diferente do padrão de atividades_agricolas que funciona corretamente

  2. Solução Aplicada
    - Remove políticas antigas permissivas
    - Cria novas políticas baseadas no padrão de atividades_agricolas
    - Verifica ownership via prefixo user_id no path do arquivo
    - Padrão de nomenclatura: <user_id>/<fileId>.jpg

  3. Políticas Criadas
    - INSERT: Permite se service_role OU se primeiro segmento do path = auth.uid()
    - UPDATE: Mesmo critério de INSERT
    - DELETE: Mesmo critério de INSERT
    - SELECT: CRUCIAL - Permite apenas se service_role OU se arquivo pertence ao usuário

  4. Segurança
    - Cada usuário só pode acessar seus próprios anexos
    - Service role mantém acesso total para operações do backend
    - Alinhado com padrão já funcional de atividades_agricolas
*/

-- ==================================================================
-- 1) LIMPEZA: Remover todas as políticas antigas do bucket notas_fiscais
-- ==================================================================

DROP POLICY IF EXISTS "Notas_fiscais: user owns object (insert)" ON storage.objects;
DROP POLICY IF EXISTS "Notas_fiscais: user owns object (update)" ON storage.objects;
DROP POLICY IF EXISTS "Notas_fiscais: user owns object (delete)" ON storage.objects;
DROP POLICY IF EXISTS "Notas_fiscais: select public" ON storage.objects;
DROP POLICY IF EXISTS "Allow authenticated insert into notas_fiscais" ON storage.objects;
DROP POLICY IF EXISTS "Allow authenticated update notas_fiscais" ON storage.objects;
DROP POLICY IF EXISTS "Allow authenticated delete notas_fiscais" ON storage.objects;
DROP POLICY IF EXISTS "Allow select notas_fiscais" ON storage.objects;
DROP POLICY IF EXISTS "Notas fiscais: select owner-only" ON storage.objects;

-- ==================================================================
-- 2) CRIAÇÃO: Novas políticas baseadas em ownership (padrão atividades_agricolas)
-- ==================================================================

-- Policy INSERT: Permite upload se service_role OU se o primeiro segmento do path é o user_id autenticado
CREATE POLICY "Notas fiscais: user owns transaction (insert)" ON storage.objects
FOR INSERT
WITH CHECK (
  bucket_id = 'notas_fiscais' AND (
    auth.role() = 'service_role' OR
    split_part(name, '/', 1) = auth.uid()::text
  )
);

-- Policy UPDATE: Permite atualização se service_role OU se o arquivo pertence ao usuário
CREATE POLICY "Notas fiscais: user owns transaction (update)" ON storage.objects
FOR UPDATE
USING (
  bucket_id = 'notas_fiscais' AND (
    auth.role() = 'service_role' OR
    split_part(name, '/', 1) = auth.uid()::text
  )
)
WITH CHECK (
  bucket_id = 'notas_fiscais' AND (
    auth.role() = 'service_role' OR
    split_part(name, '/', 1) = auth.uid()::text
  )
);

-- Policy DELETE: Permite exclusão se service_role OU se o arquivo pertence ao usuário
CREATE POLICY "Notas fiscais: user owns transaction (delete)" ON storage.objects
FOR DELETE
USING (
  bucket_id = 'notas_fiscais' AND (
    auth.role() = 'service_role' OR
    split_part(name, '/', 1) = auth.uid()::text
  )
);

-- Policy SELECT: CRUCIAL - Permite leitura apenas se service_role OU se o arquivo pertence ao usuário
-- Esta é a mudança mais importante: antes permitia leitura pública, agora verifica ownership
CREATE POLICY "Notas fiscais: select owner-only" ON storage.objects
FOR SELECT
USING (
  bucket_id = 'notas_fiscais' AND (
    auth.role() = 'service_role' OR
    split_part(name, '/', 1) = auth.uid()::text
  )
);

-- ==================================================================
-- 3) VERIFICAÇÃO: Confirmar que as políticas foram criadas
-- ==================================================================

-- Exibir todas as políticas do bucket notas_fiscais para confirmar
DO $$
DECLARE
  policy_count INTEGER;
BEGIN
  SELECT COUNT(*)
  INTO policy_count
  FROM pg_policy pol
  JOIN pg_class c ON pol.polrelid = c.oid
  JOIN pg_namespace n ON c.relnamespace = n.oid
  WHERE n.nspname = 'storage'
    AND c.relname = 'objects'
    AND pol.polname LIKE '%otas fiscais%';

  RAISE NOTICE 'Total de políticas criadas para notas_fiscais: %', policy_count;

  IF policy_count = 4 THEN
    RAISE NOTICE '✅ Migração concluída com sucesso! 4 políticas criadas.';
  ELSE
    RAISE WARNING '⚠️ Atenção: Esperado 4 políticas, encontradas %', policy_count;
  END IF;
END $$;