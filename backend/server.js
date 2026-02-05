import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import userRoutes from './routes/userRoutes.js';

import {
    notFound,
    errorHandler
} from './Middleware/errorMiddleware.js';

const app = express();
dotenv.config();

const PORT = process.env.PORT || 3000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/myapp';

// Middleware
app.use(cors());
app.use(bodyParser.json());

//Routes 
app.use('/api/users', userRoutes);

//Error Middleware
app.use(notFound);
app.use(errorHandler);


//Connect to MongoDB and start the server
mongoose
.connect(MONGO_URI)
.then(() => {
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    })
})





