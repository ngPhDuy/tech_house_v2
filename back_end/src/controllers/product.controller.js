import productService from "../services/product.service.js";

const getAll = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      search,
      brand,
      category,
      sort,
      min_price: minPrice,
      max_price: maxPrice,
    } = req.query;

    const result = await productService.getAll(
      parseInt(page),
      parseInt(limit),
      search,
      brand,
      category,
      sort,
      minPrice,
      maxPrice
    );

    res.status(200).json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  }
};

const getOne = async (req, res) => {
  try {
    const { productID } = req.params;

    const result = await productService.getOne(productID);

    if (result) {
      res.status(200).json(result);
    } else {
      res.status(404).json({ message: "Product not found" });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Internal server error" });
  }
};

const createOne = async (req, res) => {
  try {
    if (!req.body.category) {
      return res.status(400).json({ message: "Category is required" });
    }

    const result = await productService.createOne(req.body);

    if (result) {
      res.status(201).json({ message: "Product created successfully", result });
    } else {
      res.status(400).json({ message: "Product creation failed" });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Internal server error" });
  }
};

const updateOne = async (req, res) => {
  try {
    const { productID } = req.params;
    const payload = {
      ...req.body,
      productID,
    };

    if (!payload.productID) {
      return res.status(400).json({ message: "Product ID is required" });
    }

    if (!payload.category) {
      return res.status(400).json({ message: "Category is required" });
    }

    const result = await productService.updateOne(payload);

    if (result) {
      res.status(200).json({ message: "Product updated successfully" });
    } else {
      res.status(404).json({ message: "Product not found" });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Internal server error" });
  }
};

const deleteOne = async (req, res) => {
  try {
    const { productID } = req.params;

    const result = await productService.deleteOne(productID);

    if (result) {
      res.status(200).json({ message: "Product deleted successfully" });
    } else {
      res.status(404).json({ message: "Product not found" });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Internal server error" });
  }
};

export default { getAll, getOne, createOne, updateOne, deleteOne };
