import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';

const app = express();
dotenv.config();
app.use(cors());

mongoose
  .connect(process.env.MONGO_URL)
  .then(() => console.log('DB connection successful!'))
  .catch((err) => console.log(err));

app.use(express.json());

app.listen(process.env.PORT || 5000, () => {
  console.log('Backend server is running!');
});
