import express from 'express';
import { createServer } from 'vite';

const app = express();
const PORT = 3000;

async function startServer() {
  const vite = await createServer({
    root: process.cwd(),
    server: { middlewareMode: true },
    appType: 'spa'
  });

  app.use(vite.middlewares);
  app.listen(PORT, 'localhost', () => {
    console.log(`\n  TuitionFinder running at: http://localhost:${PORT}\n`);
  });
}

startServer().catch(console.error);
