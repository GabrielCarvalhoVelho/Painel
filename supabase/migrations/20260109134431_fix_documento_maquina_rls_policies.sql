/*
  # Fix Documento_Maquina Storage Bucket RLS Policies
  
  1. Changes
    - Drop existing restrictive policies for Documento_Maquina bucket
    - Create new permissive policies that allow authenticated users full access
    - Policies check for authenticated role AND valid auth.uid()
  
  2. Security
    - All operations require authentication
    - Uses auth.uid() to verify user session
    - Bucket-specific policies to avoid conflicts
*/

-- Drop existing policies
DROP POLICY IF EXISTS "Documento_Maquina: authenticated insert" ON storage.objects;
DROP POLICY IF EXISTS "Documento_Maquina: authenticated select" ON storage.objects;
DROP POLICY IF EXISTS "Documento_Maquina: authenticated update" ON storage.objects;
DROP POLICY IF EXISTS "Documento_Maquina: authenticated delete" ON storage.objects;

-- Create new permissive policies for authenticated users

-- SELECT: Allow authenticated users to view files
CREATE POLICY "Documento_Maquina: Authenticated users can read"
  ON storage.objects FOR SELECT
  TO authenticated
  USING (
    bucket_id = 'Documento_Maquina' 
    AND auth.uid() IS NOT NULL
  );

-- INSERT: Allow authenticated users to upload files
CREATE POLICY "Documento_Maquina: Authenticated users can upload"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (
    bucket_id = 'Documento_Maquina' 
    AND auth.uid() IS NOT NULL
  );

-- UPDATE: Allow authenticated users to update files
CREATE POLICY "Documento_Maquina: Authenticated users can update"
  ON storage.objects FOR UPDATE
  TO authenticated
  USING (
    bucket_id = 'Documento_Maquina' 
    AND auth.uid() IS NOT NULL
  )
  WITH CHECK (
    bucket_id = 'Documento_Maquina' 
    AND auth.uid() IS NOT NULL
  );

-- DELETE: Allow authenticated users to delete files
CREATE POLICY "Documento_Maquina: Authenticated users can delete"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (
    bucket_id = 'Documento_Maquina' 
    AND auth.uid() IS NOT NULL
  );