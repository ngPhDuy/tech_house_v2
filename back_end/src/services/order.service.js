import { col, fn, where, Op } from "sequelize";
import {
  Don_hang,
  Thanh_vien,
  Tai_khoan,
  Chi_tiet_don_hang,
  San_pham,
} from "../models/index.js";
import sequelize from "../../config/db.js";

const getAll = async (limit, page, search) => {
  const offset = (page - 1) * limit;
  let accountWhere = {};

  if (search) {
    accountWhere = {
      ...accountWhere,
      [Op.or]: [
        where(fn("LOWER", col("ho_va_ten")), {
          [Op.like]: `%${search.toLowerCase()}%`,
        }),
        where(fn("LOWER", col("dia_chi")), {
          [Op.like]: `%${search.toLowerCase()}%`,
        }),
      ],
    };
  }

  const { rows: orders, count: total } = await Don_hang.findAndCountAll({
    limit,
    offset,
    include: {
      model: Thanh_vien,
      attributes: [],
      include: {
        model: Tai_khoan,
        attributes: [],
        where: accountWhere,
        required: true,
      },
      required: true,
    },
    attributes: {
      include: [
        [col("Thanh_vien.Tai_khoan.ho_va_ten"), "ho_va_ten"],
        [col("Thanh_vien.Tai_khoan.dia_chi"), "dia_chi"],
      ],
    },
    order: [["ma_don_hang", "DESC"]],
  });

  return {
    data: orders,
    pagination: {
      total,
      page,
      limit,
    },
  };
};

const getOne = async (orderID) => {
  const getOrderInfo = Don_hang.findByPk(orderID, {
    include: {
      model: Thanh_vien,
      attributes: [],
      include: {
        model: Tai_khoan,
        attributes: [],
      },
    },
    attributes: {
      include: [
        [col("Thanh_vien.Tai_khoan.ho_va_ten"), "ho_va_ten"],
        [col("Thanh_vien.Tai_khoan.dia_chi"), "dia_chi"],
      ],
    },
  });

  const getProducts = Chi_tiet_don_hang.findAll({
    where: {
      ma_don_hang: orderID,
    },
    include: {
      model: San_pham,
      attributes: [],
    },
    attributes: {
      include: [
        [col("San_pham.ten_sp"), "ten_sp"],
        [col("San_pham.hinh_anh"), "hinh_anh"],
        [col("San_pham.phan_loai"), "phan_loai"],
      ],
    },
  });

  const [orderInfo, products] = await Promise.all([getOrderInfo, getProducts]);

  if (!orderInfo || !products) return null;

  return {
    orderInfo,
    products,
  };
};

const createOne = async (userID, totalPrice) => {
  const newOrder = await sequelize.query(
    "call tao_don_hang_tu_gio_hang(:userID, :totalPrice)",
    {
      replacements: {
        userID,
        totalPrice,
      },
    }
  );

  return newOrder;
};

const createOneWithAProduct = async (
  userID,
  productID,
  quantity,
  totalPrice
) => {
  const newOrder = await sequelize.query(
    "call tao_don_hang_mot_sp(:userID, :productID, :quantity, :totalPrice)",
    {
      replacements: {
        userID,
        productID,
        quantity,
        totalPrice,
      },
    }
  );

  return newOrder;
};

const updateStatus = async (orderID, status) => {
  const result = await Don_hang.update(
    { trang_thai: status },
    {
      where: {
        ma_don_hang: orderID,
        trang_thai: {
          [Op.notIn]: [3, 4],
        },
      },
    }
  );

  if (result[0] === 0) return null;

  return result;
};

const updateDeliveryTime = async (orderID, deliveryTime) => {
  const result = await Don_hang.update(
    { thoi_gian_nhan_hang: deliveryTime },
    { where: { ma_don_hang: orderID } }
  );

  return result;
};

export default {
  getAll,
  getOne,
  createOne,
  createOneWithAProduct,
  updateStatus,
  updateDeliveryTime,
};
