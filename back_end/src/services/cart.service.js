import { col, Op, fn } from "sequelize";
import sequelize from "../../config/db.js";
import { Gio_hang, San_pham } from "../models/index.js";

const getAllByUserID = async (limit, page, userID) => {
  const offset = (page - 1) * limit;

  const getProducts = Gio_hang.findAll({
    where: {
      thanh_vien: userID,
    },
    include: {
      model: San_pham,
      attributes: [],
    },
    attributes: {
      include: [
        [col("San_pham.ten_sp"), "ten_sp"],
        [col("San_pham.hinh_anh"), "hinh_anh"],
        [col("San_pham.gia_thanh"), "gia_thanh"],
        [col("San_pham.sale_off"), "sale_off"],
      ],
    },
    order: [["ma_sp", "ASC"]],
    limit,
    offset,
  });

  const getTotal = Gio_hang.count({
    where: {
      thanh_vien: userID,
    },
  });

  const [products, total] = await Promise.all([getProducts, getTotal]);

  return {
    data: products,
    pagination: { total, page, limit },
  };
};

const addProductToCart = async (userID, productID, quantity) => {
  const result = sequelize.query(
    `call them_vao_gio_hang(:userID, :productID, :quantity)`,
    {
      replacements: {
        userID,
        productID,
        quantity,
      },
    }
  );

  return result;
};

const updateProductQuantityInCart = async (userID, productID, quantity) => {
  const result = await Gio_hang.update(
    {
      so_luong: quantity,
    },
    {
      where: {
        ma_sp: productID,
        thanh_vien: userID,
      },
    }
  );

  if (result[0] === 0) return null;

  return result;
};

const deleteProductFromCart = async (userID, productID) => {
  const deletedRows = await Gio_hang.destroy({
    where: {
      ma_sp: productID,
      thanh_vien: userID,
    },
  });

  return deletedRows > 0;
};

const getCheckOutInfo = async (userID) => {
  const sanPhamAttributes = Object.keys(San_pham.getAttributes());
  const sanPhamExcludeAttributes = [
    "phan_loai",
    "sl_ton_kho",
    "mo_ta",
    "mau_sac",
    "bi_xoa",
  ];
  const filteredAttributes = sanPhamAttributes.filter(
    (field) => !sanPhamExcludeAttributes.includes(field)
  );

  console.log(sanPhamAttributes);

  const info = Gio_hang.findAll({
    where: {
      thanh_vien: userID,
    },
    include: {
      model: San_pham,
      attributes: [],
    },
    attributes: {
      exclude: ["thanh_vien", "ma_sp"],
      include: filteredAttributes.map((att) => [col(`San_pham.${att}`), att]),
    },
  });

  return info;
};

export default {
  getAllByUserID,
  addProductToCart,
  updateProductQuantityInCart,
  deleteProductFromCart,
  getCheckOutInfo,
};
