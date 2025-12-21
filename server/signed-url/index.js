const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { createClient } = require('@supabase/supabase-js');

const PORT = process.env.PORT || 8787;
const SUPABASE_URL = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.VITE_SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  console.error('Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in environment');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, { auth: { persistSession: false } });

const app = express();
app.use(cors());
app.use(bodyParser.json());

app.post('/signed-url', async (req, res) => {
  try {
    const { bucket, path, expires } = req.body || {};
    if (!bucket || !path) return res.status(400).json({ error: 'bucket and path are required' });

    const ttl = typeof expires === 'number' ? expires : 60;
    const { data, error } = await supabase.storage.from(bucket).createSignedUrl(path, ttl);
    if (error) {
      console.error('Error creating signed URL:', error);
      return res.status(500).json({ error: error.message || 'failed to create signed url' });
    }

    return res.json({ signedUrl: data?.signedUrl || null });
  } catch (err) {
    console.error('Unhandled error in /signed-url:', err);
    return res.status(500).json({ error: 'internal server error' });
  }
});

app.get('/health', (_req, res) => res.json({ ok: true }));

app.listen(PORT, () => {
  console.log(`Signed URL server listening on port ${PORT}`);
});
