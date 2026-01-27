import express from 'express';
// import sql from 'mssql';
import 'dotenv/config';
import cors from 'cors'
import ticketsRoutes from './routes/tickets.js';
import usersRoutes from'./routes/users.js';




const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended: true}))

app.use('/api/tickets', ticketsRoutes);
app.use('/api/users', usersRoutes);

app.get('/', (_, res) => res.send('Ticketing API running'));

const PORT = parseInt(process.env.PORT) || 3000;
app.listen(PORT, () => console.log(`Server on ${PORT}`));

// Close the connection when the app stops 
process.on('SIGINT', () => {
    sql.close();
    console.log('SQL Server connection closed');
    process.exit();
});
