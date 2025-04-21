import express, { Request, Response } from "express";
import Product from "../models/Product";
const router = express.Router();

router.post("/", async (req: Request, res: Response) => {
  try {
    const product = await new Product(req.body).save();
    res.status(201).json(product);
  } catch (error) {
    console.log(error);
    res.status(500).send("Failed to create new product");
  }
});

router.get("/", async (req: Request, res: Response) => {
  try {
    const products = await Product.find();
    res.status(200).json(products);
  } catch (error) {
    console.log(error);
    res.status(500).send("Failed to retrieve products");
  }
});

router.put("/:id", async (req: Request, res: Response) => {
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    res.status(200).json(product);
  } catch (error) {
    console.log(error);
    res.status(500).send("Failed to update product");
  }
});

router.delete("/:id", async (req: Request, res: Response) => {
  try {
    const deletedProduct = await Product.findByIdAndDelete(req.params.id);
    res.status(200).json(deletedProduct);
  } catch (error) {
    console.log(error);
    res.status(500).send("Failed to delete product");
  }
});

export default router;
