import express from 'express';
import dotenv from 'dotenv';

import connectDatabase from './config/db-config.js';
import apiRoutes from './routes/index.js';


dotenv.config();
const PORT = process.env.PORT || 4000;

const app =  express();

app.use(express.json());
app.use(express.urlencoded({extended: true}));


app.use('/api/v1', apiRoutes);
app.get('/test', (req, res) => {
    res.send("BACKEND is working fine!");
})


app.listen(PORT, async () => {
    console.log(`Server is listening on PORT: ${PORT}`);
    await connectDatabase();
})