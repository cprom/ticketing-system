// import express from 'express';
import sql from 'mssql';
// import 'dotenv/config';
// import cors from 'cors'
// import ticketsRoutes from './routes/tickets.js';
// import usersRoutes from'./routes/users.js';
// import priorityRoutes from './routes/priorities.js'
// import categoryRoutes from './routes/categories.js'
// import statusRoutes from './routes/statuses.js'
// import roleRoutes from './routes/roles.js'
// import departmentRoutes from './routes/departments.js'

import dotenv from "dotenv";
dotenv.config();
import app from './app.js'


const PORT = parseInt(process.env.PORT) || 3000;
app.listen(PORT, () => console.log(`Server on ${PORT}`));

// Close the connection when the app stops 
process.on('SIGINT', () => {
    sql.close();
    console.log('SQL Server connection closed');
    process.exit();
});
