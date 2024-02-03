import express from 'express';
import Product from '../models/Product.js';
import {
  verifyTokenAndAuthorization,
  verifyTokenAndAdmin,
  verifyToken,
} from '../verifyToken.js';

const router = express.Router();

// CREATE

router.post('/', verifyTokenAndAdmin, async (req, res) => {
  const newProduct = new Product(req.body);

  try {
    const savedProduct = await newProduct.save();
    res.status(200).json(savedProduct);
  } catch (err) {
    res.status(500).json(err);
  }
});
