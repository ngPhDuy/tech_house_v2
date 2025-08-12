import { Model, DataTypes, Op } from "sequelize";
import sequelize from "../../config/db.js";

class Don_hang extends Model {}

Don_hang.init(
  {
    ma_don_hang: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    thanh_vien: {
      type: DataTypes.STRING(25),
      allowNull: false,
      references: {
        model: "thanh_vien",
        key: "ten_dang_nhap",
      },
    },
    thoi_diem_dat_hang: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    thoi_diem_nhan_hang: {
      type: DataTypes.DATE,
    },
    tinh_trang: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    tong_gia: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: "Don_hang",
    tableName: "don_hang",
  }
);

export default Don_hang;
