import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = process.env.PORT || 3000;
const isProduction = process.env.NODE_ENV === 'production';
const geminiModel = process.env.GEMINI_MODEL || 'gemini-2.5-flash';

app.disable('x-powered-by');
app.use(express.json({ limit: '1mb' }));

const apiKey = process.env.GEMINI_API_KEY;
const aiClient = apiKey && apiKey !== 'MY_GEMINI_API_KEY'
  ? new GoogleGenAI({ apiKey })
  : null;

// A browser-hosted app cannot reliably inspect Windows hardware, installed apps,
// disk usage, battery health, or BIOS details. Never return invented device specs.
app.get('/api/system-info', (_req, res) => {
  res.json({
    available: false,
    source: 'web-app',
    app: {
      name: 'KRIX Desktop',
      version: process.env.KRIX_VERSION || 'development',
      environment: isProduction ? 'production' : 'development',
    },
    message: 'This web build cannot directly inspect host hardware. Native Windows diagnostics require a separately installed, permission-aware companion.',
  });
});

app.post('/api/gemini/chat', async (req, res) => {
  const prompt = typeof req.body?.prompt === 'string' ? req.body.prompt.trim() : '';
  if (!prompt) return res.status(400).json({ error: 'Enter a message to continue.' });
  if (prompt.length > 20000) {
    return res.status(413).json({ error: 'That message is too long. Please keep it under 20,000 characters.' });
  }

  if (!aiClient) {
    return res.status(503).json({
      error: 'Gemini is not connected yet. Configure GEMINI_API_KEY on the server to enable live AI.',
      model: 'not-configured',
    });
  }

  try {
    const response = await aiClient.models.generateContent({
      model: geminiModel,
      contents: prompt,
      config: {
        systemInstruction: typeof req.body?.systemInstruction === 'string'
          ? req.body.systemInstruction.slice(0, 4000)
          : 'You are KRIX Intelligence, a helpful assistant inside the KRIX desktop-style app. Be clear and honest about what the web app can and cannot control. Do not claim to have executed actions on the user’s device unless a connected tool confirms it.',
      },
    });

    const text = response.text?.trim();
    if (!text) {
      return res.status(502).json({ error: 'Gemini returned an empty response. Please try again.', model: geminiModel });
    }

    return res.json({ text, model: geminiModel });
  } catch (error) {
    // Keep provider details and request metadata out of the client response.
    console.error('Gemini chat request failed:', error instanceof Error ? error.message : 'Unknown error');
    return res.status(502).json({
      error: 'KRIX Intelligence could not reach Gemini. Check the server configuration and try again.',
      model: geminiModel,
    });
  }
});

app.post('/api/gemini/writing', async (req, res) => {
  const inputText = typeof req.body?.text === 'string' ? req.body.text.trim() : '';
  const task = typeof req.body?.task === 'string' ? req.body.task : 'polish';
  const allowedTasks = new Set(['polish', 'summarize', 'expand', 'formal', 'concise']);

  if (!inputText) return res.status(400).json({ error: 'Add some text before asking KRIX to revise it.' });
  if (inputText.length > 20000) {
    return res.status(413).json({ error: 'That text is too long. Please keep it under 20,000 characters.' });
  }
  if (!allowedTasks.has(task)) {
    return res.status(400).json({ error: 'Choose a supported writing task.' });
  }
  if (!aiClient) {
    return res.status(503).json({
      error: 'Gemini is not connected yet. Configure GEMINI_API_KEY on the server to enable live writing assistance.',
      model: 'not-configured',
    });
  }

  const instructions: Record<string, string> = {
    polish: 'Fix grammar, punctuation, and flow while preserving the original meaning and voice.',
    summarize: 'Summarize the supplied text into its essential points without inventing details.',
    expand: 'Expand the ideas thoughtfully without introducing unsupported facts.',
    formal: 'Rewrite in a clear, professional, formal tone while preserving the meaning.',
    concise: 'Make the text concise and impactful while preserving essential information.',
  };

  try {
    const response = await aiClient.models.generateContent({
      model: geminiModel,
      contents: inputText,
      config: {
        systemInstruction: `You are KRIX Writing Assistant. ${instructions[task]} Return only the revised text, without a conversational preamble.`,
      },
    });
    const result = response.text?.trim();
    if (!result) return res.status(502).json({ error: 'Gemini returned an empty result. Please try again.', model: geminiModel });
    return res.json({ result, model: geminiModel });
  } catch (error) {
    console.error('Gemini writing request failed:', error instanceof Error ? error.message : 'Unknown error');
    return res.status(502).json({ error: 'KRIX Writing Assistant could not reach Gemini. Check the server configuration and try again.', model: geminiModel });
  }
});

async function startServer() {
  if (!isProduction) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true, hmr: process.env.DISABLE_HMR !== 'true' },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(port, () => {
    console.log(`KRIX Desktop server listening on port ${port} (${isProduction ? 'production' : 'development'})`);
  });
}

startServer().catch((error) => {
  console.error('KRIX server failed to start:', error instanceof Error ? error.message : 'Unknown error');
  process.exitCode = 1;
});
