// app.js
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import sequelize from './config/database.js';

// Import routes
import programRoutes from './routes/program.js';
import courseRoutes from './routes/course.js';
import courseProgramRoutes from './routes/course_program.js';


dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Use the routes
app.use('/api/program', programRoutes);
app.use('/api/course', courseRoutes);
app.use('/api/course_program', courseProgramRoutes);

// Test DB connection
(async () => {
    try {
        await sequelize.authenticate();
        console.log('Database connected successfully!');
    } catch (error) {
        console.error('Unable to connect to database:', error);
    }
})();

// const PORT = process.env.PORT || 8080;

// const app = express(); // use the expressJS
const PORT = process.env.PORT || 5000; // define PORT
app.listen(PORT, () => console.log("Server Open At port: ", PORT));

