import User from '../models/User.js';
import { Router } from 'express';

const router = Router();

router.get('/', async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (err) {
    res.status(500).json(err);
  }
});

export default router;
