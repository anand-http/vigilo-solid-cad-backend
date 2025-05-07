import express from 'express';
import dotenv from 'dotenv';
import "express-async-errors"

//Middleware import
import pageNotFound from './src/middleware/pageNotFound.js';


const app = express();

dotenv.config({ path: './src/config/.env' });

app.use(express.json());



const corsOptions = {
    origin: "*",
    methods: ['GET', 'POST', 'PUT', 'DELETE']
};

app.use(cors(corsOptions));


app.get('/', (req, res) => {
    res.sendFile(`${process.cwd()}/public/index.html`)
})


//Import routes path
import userRouter from './src/@user_entity/user_routes.js';
import shiftRouter from './src/@shift_entity/shift_routes.js';
import errorMiddleware from './src/middleware/error.js';

//Routes path
app.use('/api/v1/user', userRouter);
app.use('/api/v1/shift', shiftRouter);


app.use(pageNotFound);

app.use(errorMiddleware);


export default app;