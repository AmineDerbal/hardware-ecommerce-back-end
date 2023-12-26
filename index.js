import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import authRoute from './routes/authentification.js';
import userRoute from './routes/user.js';

const app = express();
dotenv.config();
app.use(cors());
app.use(express.json());
app.use('/api/auth', authRoute);
app.use('/api/users', userRoute);

mongoose
  .connect(process.env.MONGO_URL)
  .then(() => console.log('DB connection successful!'))
  .catch((err) => console.log(err));

app.listen(process.env.PORT || 5000, () => {
  console.log('Backend server is running!');
});
