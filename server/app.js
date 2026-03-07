import express from 'express';
import 'dotenv/config';
import cors from 'cors'
import cookieParser from 'cookie-parser';

import authRoutes from "./routes/auth.routes.js";
import ticketsRoutes from './routes/tickets.js';
import usersRoutes from'./routes/users.js';
import priorityRoutes from './routes/priorities.js'
import categoryRoutes from './routes/categories.js'
import statusRoutes from './routes/statuses.js'
import roleRoutes from './routes/roles.js'
import departmentRoutes from './routes/departments.js'

const app = express();

app.use(cors({
  origin: "http://localhost:5173",
  credentials: true,
}));

// app.use(cors());

app.use(express.json());
app.use(express.urlencoded({extended: true}))
app.use(cookieParser());

app.use("/api/auth", authRoutes);

app.use('/api/tickets', ticketsRoutes);
app.use('/api/users', usersRoutes);
app.use('/api/priorities', priorityRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/statuses', statusRoutes);
app.use('/api/roles', roleRoutes);
app.use('/api/departments', departmentRoutes);

app.get('/', (_, res) => res.send('Ticketing API running'));

export default app;