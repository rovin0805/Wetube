import mongoose from 'mongoose';

mongoose.set('strictQuery', false);
mongoose.connect(process.env.DB_URL);

const db = mongoose.connection;

db.on('error', (error) => console.log('🚫 DB Error :', error));
db.once('open', () => console.log('🍀 Connected to DB'));
