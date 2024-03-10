import { Router } from 'express';
import User from '../models/User.js';
import CryptoJS from 'crypto-js';
import jwt from 'jsonwebtoken';
import multer from 'multer';

const router = Router();
const upload = multer();

//Register
router.post('/register',upload.single('image'), async (req, res) => {
  const user = await User.findOne({ email: req.body.email }) || await User.findOne({ username: req.body.username });
  if (user) return res.status(401).json('User already exists!');

  const newUser = new User({
    username: req.body.username,
    email: req.body.email,
    password: CryptoJS.AES.encrypt(
      req.body.password,
      process.env.PASS_SEC,
    ).toString(),
    img:req.file ? req.file.buffer : null,
  });

  try {
    const savedUser = await newUser.save();
    res.status(201).json(savedUser);
  } catch (err) {
    res.status(500).json(err);
  }
});

//Login
router.post('/login', async (req, res) => {
  try {
    const user = await User.findOne({ username: req.body.username });
    !user && res.status(401).json('Wrong credentials!');
    const hashedPassword = CryptoJS.AES.decrypt(
      user.password,
      process.env.PASS_SEC,
    );
    const OriginalPassword = hashedPassword.toString(CryptoJS.enc.Utf8);
    OriginalPassword !== req.body.password &&
      res.status(401).json('Wrong credentials!');
    const accessToken = jwt.sign(
      {
        id: user._id,
        isAdmin: user.isAdmin,
      },
      process.env.JWT_SEC,
      { expiresIn: '3d' },
    );
    if (user.accessToken !== accessToken) {
      user.accessToken = accessToken;
      await user.save();
    }
  
    const { username, email, isAdmin } = user._doc;
    const others = { username, email, isAdmin };
    res.status(200).json({ ...others, accessToken });
  } catch (err) {
    res.status(500).json(err);
  }
});

export default router;
