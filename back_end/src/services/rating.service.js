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

  console.log(avgRating);

  console.log(avgRating.diem_danh_gia_trung_binh);

  return {
    data: {
      ratings,
      avgRating: avgRating ? avgRating.diem_danh_gia_trung_binh : 0,
    },
    pagination: { total, page, limit },
  };
};

export default { getAllByProductID };
