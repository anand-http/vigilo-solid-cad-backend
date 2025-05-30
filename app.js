import express from 'express';
import dotenv from 'dotenv';
import "express-async-errors"
import cors from 'cors';

//Middleware import
import pageNotFound from './src/middleware/pageNotFound.js';


const app = express();

dotenv.config({ path: './src/config/.env' });

app.use(express.json());



app.use(
    cors({
        origin: "http://localhost:5173",
        methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
        credentials: true,
    })
);



app.get('/', (req, res) => {
    res.sendFile(`${process.cwd()}/public/index.html`)
})


//Import routes path
import userRouter from './src/@user_entity/user_routes.js';
import shiftRouter from './src/@shift_entity/shift_routes.js';
import orderRouter from './src/@order_entity/order_routes.js';
import errorMiddleware from './src/middleware/error.js';

//Routes path
app.use('/api/v1/user', userRouter);
app.use('/api/v1/shift', shiftRouter);
app.use('/api/v1/order', orderRouter);


app.use(pageNotFound);

app.use(errorMiddleware);


export default app;