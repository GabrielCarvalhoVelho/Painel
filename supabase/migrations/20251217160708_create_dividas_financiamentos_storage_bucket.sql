/*
  # Criar bucket de storage para anexos de Dívidas e Financiamentos

  1. Novo Bucket
    - Nome: `dividas_financiamentos_anexos`
    - Acesso público habilitado para leitura
    - Upload permitido apenas para usuários autenticados

  2. Políticas de Storage
    - Usuários autenticados podem fazer upload de documentos
    - Usuários podem visualizar seus próprios anexos
    - Usuários podem atualizar seus próprios anexos
    - Usuários podem deletar seus próprios anexos
*/

-- Criar bucket se não existir
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'dividas_financiamentos_anexos',
  'dividas_financiamentos_anexos',
  false, -- Privado, apenas o dono pode ver
  10485760, -- 10MB
  ARRAY[
    'application/pdf',
    'image/jpeg',
    'image/jpg',
    'image/png',
    'image/webp',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
  ]
)
ON CONFLICT (id) DO UPDATE SET
  public = false,
  file_size_limit = 10485760,
  allowed_mime_types = ARRAY[
    'application/pdf',
    'image/jpeg',
    'image/jpg',
    'image/png',
    'image/webp',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
  ];

-- Política de SELECT (visualizar próprios anexos)
DROP POLICY IF EXISTS "Usuários podem visualizar seus próprios anexos" ON storage.objects;
CREATE POLICY "Usuários podem visualizar seus próprios anexos"
ON storage.objects FOR SELECT
TO authenticated
USING (
  bucket_id = 'dividas_financiamentos_anexos' AND
  (storage.foldername(name))[1] = auth.uid()::text
);

-- Política de INSERT (upload para usuários autenticados)
DROP POLICY IF EXISTS "Usuários podem fazer upload de anexos" ON storage.objects;
CREATE POLICY "Usuários podem fazer upload de anexos"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'dividas_financiamentos_anexos' AND
  (storage.foldername(name))[1] = auth.uid()::text
);

-- Política de UPDATE (atualizar próprios anexos)
DROP POLICY IF EXISTS "Usuários podem atualizar seus anexos" ON storage.objects;
CREATE POLICY "Usuários podem atualizar seus anexos"
ON storage.objects FOR UPDATE
TO authenticated
USING (
  bucket_id = 'dividas_financiamentos_anexos' AND
  (storage.foldername(name))[1] = auth.uid()::text
);

-- Política de DELETE (deletar próprios anexos)
DROP POLICY IF EXISTS "Usuários podem deletar seus anexos" ON storage.objects;
CREATE POLICY "Usuários podem deletar seus anexos"
ON storage.objects FOR DELETE
TO authenticated
USING (
  bucket_id = 'dividas_financiamentos_anexos' AND
  (storage.foldername(name))[1] = auth.uid()::text
);