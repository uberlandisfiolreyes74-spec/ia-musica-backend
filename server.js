import express from 'express';
import cors from 'cors';
import OpenAI from 'openai';
import dotenv from 'dotenv';
dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

if(!process.env.OPENAI_API_KEY){
  console.warn('WARNING: OPENAI_API_KEY not set. Set it in .env or environment variables.');
}

const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// Helper: respond with base64 audio (mp3) when available
async function generateAudio(prompt, mode){
  try{
    const model = "gpt-4o-audio-preview";
    const request = {
      model,
      input: prompt
    };

    if(mode === 'instrumental'){
      request.input = `Genera una pieza musical instrumental (sin voz). Estilo: ${prompt}`;
    } else {
      request.input = `Genera una pieza musical con voz/human-like singing. Estilo: ${prompt}`;
    }

    const res = await client.audio.generate(request);

    if(res?.data && res.data[0]){
      const item = res.data[0];
      if(item.b64_json) return { b64: item.b64_json, content_type: 'audio/mpeg' };
      if(item.data) {
        return { b64: item.data, content_type: 'audio/mpeg' };
      }
    }
    return { error: 'Respuesta inesperada de la API', raw: res };
  }catch(e){
    console.error('OpenAI audio error', e?.response?.data || e.message || e);
    return { error: e?.response?.data || e.message || String(e) };
  }
}

app.post('/musica-instrumental', async (req, res) => {
  const { prompt } = req.body;
  if(!prompt) return res.status(400).json({ error: 'Falta prompt en body' });
  const out = await generateAudio(prompt, 'instrumental');
  res.json(out);
});

app.post('/musica-vocal', async (req, res) => {
  const { prompt } = req.body;
  if(!prompt) return res.status(400).json({ error: 'Falta prompt en body' });
  const out = await generateAudio(prompt, 'vocal');
  res.json(out);
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, ()=> console.log(`Server listening on port ${PORT}`));
