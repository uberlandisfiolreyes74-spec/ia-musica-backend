uberlandisfiolreyes74-spec/ia-musica-backend

Servidor mínimo listo para desplegar en Render (u otro proveedor) con dos endpoints:
- POST /musica-instrumental  -> genera música instrumental
- POST /musica-vocal        -> genera música con voz

**IMPORTANTE**: Guarda tu clave en variables de entorno `OPENAI_API_KEY`.

## Archivos
- server.js : servidor express con endpoints
- package.json
- .env.example

## Uso local
1. Copia `.env.example` a `.env` y llena `OPENAI_API_KEY`.
2. `npm install`
3. `node server.js`
4. Prueba con curl:
```bash
curl -X POST http://localhost:10000/musica-instrumental -H "Content-Type: application/json" -d '{"prompt":"épica orquestal, 90s, tempo medio"}'
```

Respuesta típica (JSON):
- `{ "b64": "<base64-audio>", "content_type":"audio/mpeg" }` o `{"error": ...}`

## Despliegue en Render
1. Sube este repositorio a GitHub.
2. En Render crea un Web Service, conecta el repo y rama `main`.
3. Build command: `npm install`
4. Start command: `node server.js`
5. En Environment Variables agrega `OPENAI_API_KEY`.

## Integración con GitHub Pages
En tu HTML estático, realiza POST al endpoint del servicio Render (o URL que tengas):

```js
async function generarInstrumental(prompt){
  const res = await fetch('https://TU-URL/render/musica-instrumental', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ prompt })
  });
  const data = await res.json();
  if(data.b64){
    document.getElementById('player').src = 'data:audio/mpeg;base64,' + data.b64;
  } else {
    console.error('Error', data);
  }
}
```

## Nota sobre modelos
Dependiendo de tu cuenta de OpenAI, los modelos de audio disponibles pueden variar. Ajusta `model` en `server.js` si necesitas otro (ej: `gpt-4o-mini-tts`, `gpt-4o-audio-preview`, etc.).

