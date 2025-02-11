import express, { json } from 'express';
import mongoose from 'mongoose';
import logger from 'morgan';
import cors from 'cors';
import 'dotenv/config';
import { corsOptions } from './cors.js';
import contactsRouter from './routes/api/contacts.js';
import usersRouter from './routes/api/users.js';
import passport from 'passport';



const app = express();

const formatsLogger = app.get('env') === 'development' ? 'dev' : 'short';

const MONGO_CONNECTION = process.env.MONGO_CONNECTION;

app.use(logger(formatsLogger));
app.use(cors(corsOptions));
app.use(json());
app.use(passport.initialize());

app.use('/api/contacts', contactsRouter);
app.use('/api/users', usersRouter);

// (async () => {
// 	try {
// 		await mongoose.connect(MONGO_CONNECTION);
// 		console.log('[server] Database connected successfully!');
// 	} catch (error) {
// 		console.error('[server] Database connection error:', error.message);
// 		process.exit(1);
// 	}
// })();

app.use((_, res, __) => {
	res.status(404).json({ message: 'Not found' });
});

app.use((err, req, res, next) => {
	res.status(500).json({ message: err.message });
});

export default app;
