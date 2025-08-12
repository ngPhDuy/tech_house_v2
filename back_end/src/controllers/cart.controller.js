import cartService from "../services/cart.service.js";

const getAllByUserID = async (req, res) => {
  try {
    const { userID } = req.params;
    const { page = 1, limit = 5 } = req.query;

    const result = await cartService.getAllByUserID(limit, page, userID);

    if (result) {
      res.status(200).json(result);
    } else {
      res.status(404).json({ message: "Cart not found" });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Internal server error" });
  }
};

const addProductToCart = async (req, res) => {
  try {
    const { userID, productID } = req.params;
    const { quantity } = req.body;

    if (!quantity) {
      return res.status(400).json({ message: "Quantity is required" });
    }

    const result = await cartService.addProductToCart(
      userID,
      productID,
      quantity
    );

    if (result) {
      res.status(200).json({ message: "Product added to cart successfully" });
    } else {
      res.status(404).json({ message: "Cart not found" });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Internal server error" });
  }
};

const updateProductQuantityInCart = async (req, res) => {
  try {
    const { userID, productID } = req.params;
    const { quantity } = req.body;

    if (!quantity) {
      return res.status(400).json({ message: "Quantity is required" });
    }

    const result = await cartService.updateProductQuantityInCart(
      userID,
      productID,
      quantity
    );

    if (result) {
      res
        .status(200)
        .json({ message: "Product quantity updated successfully" });
    } else {
      res.status(404).json({ message: "Cart not found" });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Internal server error" });
  }
};

const deleteProductFromCart = async (req, res) => {
  try {
    const { userID, productID } = req.params;

    const result = await cartService.deleteProductFromCart(userID, productID);

    if (result) {
      res
        .status(200)
        .json({ message: "Product deleted from cart successfully" });
    } else {
      res.status(404).json({ message: "Cart not found" });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Internal server error" });
  }
};

export default {
  getAllByUserID,
  addProductToCart,
  updateProductQuantityInCart,
  deleteProductFromCart,
};
