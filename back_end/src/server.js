import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import sequelize from "../config/db.js";
//Router
import authRouter from "./routes/auth.route.js";
import userRouter from "./routes/user.route.js";
import productRouter from "./routes/product.route.js";
import orderRouter from "./routes/order.route.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Add middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Apply router
app.use("/api/auth", authRouter);
app.use("/api/users", userRouter);
app.use("/api/products", productRouter);
app.use("/api/orders", orderRouter);

// DB Sync
// sequelize
//   .sync({
//     alter: true,
//   })
//   .then(() => {
//     console.log("Database synced");
//   })
//   .catch((error) => {
//     console.error("Error syncing database:", error);
//   });

// Listenig
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
