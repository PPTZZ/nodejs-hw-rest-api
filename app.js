import express, { json, urlencoded } from 'express';
import logger from 'morgan';
import cors from 'cors';

import contactsRouter from './routes/api/contacts.js';

const app = express();

const formatsLogger = app.get('env') === 'development' ? 'dev' : 'short';

app.use(logger(formatsLogger));
app.use(cors());
app.use(urlencoded({ extended: false }));
app.use(json());

app.use('/api/contacts', contactsRouter);
app.use('/', contactsRouter);

app.use((req, res) => {
	res.status(404).json({ message: 'Not found' });
});

app.use((err, req, res, next) => {
	res.status(500).json({ message: err.message });
});

export default app;
