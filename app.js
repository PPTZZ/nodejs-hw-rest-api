import express, { json, urlencoded } from 'express';
import mongoose from 'mongoose';
import logger from 'morgan';
import cors from 'cors';
import'dotenv/config';
import contactsRouter from './routes/api/contacts.js';


const app = express();

const formatsLogger = app.get('env') === 'development' ? 'dev' : 'short';

const MONGO_CONNECTION = process.env.MONGO_CONNECTION;

app.use(logger(formatsLogger));
app.use(cors());
app.use(urlencoded({ extended: false }));
app.use(json());

app.use('/api/contacts', contactsRouter);

(async () => {
	try {
		await mongoose.connect(MONGO_CONNECTION);
		console.log('[server] Database connected successfully!');
	} catch (error) {
		console.error('[server] Database connection error:', error.message);
		process.exit(1);
	}
})();

app.use((req, res) => {
	res.status(404).json({ message: 'Not found' });
});

app.use((err, req, res, next) => {
	res.status(500).json({ message: err.message });
});

export default app;
