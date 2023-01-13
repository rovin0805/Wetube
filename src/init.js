import 'regenerator-runtime';
import 'dotenv/config';
import './db';
import { User, Video, Comment } from './models';
import app from './server';

const PORT = 4000;

app.listen(PORT, () =>
  console.log(`🍀 Server listening on port http://localhost:${PORT}`)
);
