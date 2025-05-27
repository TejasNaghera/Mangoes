const Product = require("../models/Product");

//  Add Product
exports.addProduct = async (req, res) => {
  try {
    const { name, description, price, offerPrice, onSale,  availableStock } = req.body;
    const image = req.file ? `/uploads/${req.file.filename}` : "";
      //  console.log(req.file.filename);
       
    const product = new Product({ name, description, image, price, offerPrice, onSale ,  availableStock});
    await product.save();
    res.status(201).json(product);
  } catch (err) {
    res.status(500).json({ error: "Failed to add product" });
  }
};

//  Update Product
exports.updateProduct = async (req, res) => {
  try {
    const updatedData = { ...req.body };
    if (req.file) {
      updatedData.image = `/uploads/${req.file.filename}`;
    }

    const updated = await Product.findByIdAndUpdate(req.params.id, updatedData, { new: true });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: "Update failed" });
  }
};

//  Delete Product
exports.deleteProduct = async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    res.json({ message: "Product deleted" });
  } catch (err) {
    res.status(500).json({ error: "Delete failed" });
  }
};

//  Get All Products
exports.getAllProducts = async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch products" });
  }
};
