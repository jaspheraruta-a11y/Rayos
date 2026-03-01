import cors from 'cors';
import 'dotenv/config';
import express from 'express';
import { connectDB } from './db.js';
import routes from './routes/index.js';

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors({ origin: true, credentials: true }));
app.use(express.json());

// Mount all API routes under /api
app.use('/api', routes);

connectDB()
  .then(() => {
    app.listen(PORT, () => console.log(`API server running at http://localhost:${PORT}`));
  })
  .catch((err) => {
    console.error('Failed to connect to PostgreSQL:', err.message);
    process.exit(1);
  });
