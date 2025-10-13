/*
  # Move Vector Extension to Extensions Schema
  
  1. Schema Organization
    - Create extensions schema if it doesn't exist
    - Move vector extension from public to extensions schema
    - This follows best practices for extension management
  
  2. Changes
    - Create extensions schema
    - Move vector extension
    - Update search paths if needed
  
  3. Security Note
    - Extensions should not be in public schema to avoid namespace conflicts
    - This is a Supabase recommended practice
*/

-- Create extensions schema if it doesn't exist
CREATE SCHEMA IF NOT EXISTS extensions;

-- Move vector extension to extensions schema
ALTER EXTENSION vector SET SCHEMA extensions;