const express = require("express");
const router = express.Router();
const upload = require("../middleware/upload");

const {
  addProduct,
  updateProduct,
  deleteProduct,
  getAllProducts,
} = require("../controllers/productController");

// ➕ Add Product
router.post("/add", upload.single("image"), addProduct);

// ✏️ Update Product
router.put("/update/:id", upload.single("image"), updateProduct);

// ❌ Delete Product
router.delete("/delete/:id", deleteProduct);

// 📄 Get All
router.get("/", getAllProducts);

module.exports = router;

