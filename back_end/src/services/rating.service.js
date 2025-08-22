import { col, fn, literal } from "sequelize";
import { Danh_gia, San_pham, Don_hang } from "../models/index.js";

const getAllByProductID = async (page, limit, productID) => {
  const offset = (page - 1) * limit;

  const getRatings = Danh_gia.findAll({
    where: {
      ma_sp: productID,
    },
    attributes: {
      exclude: ["ma_dh", "ma_sp"],
    },
    limit,
    offset,
  });

  const getTotal = Danh_gia.count({
    where: {
      ma_sp: productID,
    },
  });

  const getAvgRating = Danh_gia.findOne({
    where: { ma_sp: productID },
    attributes: [
      [
        fn("COALESCE", fn("AVG", col("diem_danh_gia")), 0),
        "diem_danh_gia_trung_binh",
      ],
    ],
    group: ["ma_sp"],
    raw: true,
  });

  const [ratings, total, avgRating] = await Promise.all([
    getRatings,
    getTotal,
    getAvgRating,
  ]);

  return {
    data: {
      ratings,
      avgRating: avgRating ? parseFloat(avgRating.diem_danh_gia_trung_binh) : 0,
    },
    pagination: { total, page: +page, limit: +limit },
  };
};

const getAllByOrderID = async (page, limit, orderID) => {
  const offset = (page - 1) * limit;

  const { rows: ratings, count: total } = await Danh_gia.findAndCountAll({
    where: {
      ma_dh: orderID,
    },
    attributes: {
      exclude: ["ma_dh"],
    },
    limit,
    offset,
  });

  return {
    data: ratings,
    pagination: { total, page, limit },
  };
};

const createOne = async (orderID, productID, userID, star, comment) => {
  const order = await Don_hang.findOne({
    where: { ma_don_hang: orderID, thanh_vien: userID },
  });

  if (!order || order.tinh_trang !== 3) {
    return false;
  }

  console.log(orderID, productID, userID, star, comment);

  const result = await Danh_gia.create({
    ma_dh: orderID,
    ma_sp: productID,
    thanh_vien: userID,
    diem_danh_gia: star,
    noi_dung: comment,
    thoi_diem_danh_gia: new Date(),
  });

  return result;
};

export default { getAllByProductID, getAllByOrderID, createOne };
