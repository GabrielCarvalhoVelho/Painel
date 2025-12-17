/*
  # Criar bucket de storage para Pragas e Doenças

  1. Novo Bucket
    - Nome: `pragas_e_doencas`
    - Acesso público habilitado para leitura
    - Upload permitido apenas para usuários autenticados

  2. Políticas de Storage
    - Usuários autenticados podem fazer upload de imagens
    - Todos podem visualizar imagens (leitura pública)
    - Usuários podem atualizar suas próprias imagens
    - Usuários podem deletar suas próprias imagens
*/

-- Criar bucket se não existir
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'pragas_e_doencas',
  'pragas_e_doencas',
  true,
  5242880, -- 5MB
  ARRAY['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif']
)
ON CONFLICT (id) DO UPDATE SET
  public = true,
  file_size_limit = 5242880,
  allowed_mime_types = ARRAY['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'];

-- Política de SELECT (visualização pública)
DROP POLICY IF EXISTS "Permitir visualização pública de imagens" ON storage.objects;
CREATE POLICY "Permitir visualização pública de imagens"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'pragas_e_doencas');

-- Política de INSERT (upload para usuários autenticados)
DROP POLICY IF EXISTS "Usuários autenticados podem fazer upload" ON storage.objects;
CREATE POLICY "Usuários autenticados podem fazer upload"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'pragas_e_doencas');

-- Política de UPDATE (atualizar próprias imagens)
DROP POLICY IF EXISTS "Usuários podem atualizar suas imagens" ON storage.objects;
CREATE POLICY "Usuários podem atualizar suas imagens"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'pragas_e_doencas');

-- Política de DELETE (deletar próprias imagens)
DROP POLICY IF EXISTS "Usuários podem deletar suas imagens" ON storage.objects;
CREATE POLICY "Usuários podem deletar suas imagens"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'pragas_e_doencas');