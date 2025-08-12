import { Model, DataTypes } from "sequelize";
import sequelize from "../../config/db.js";

class Danh_gia extends Model {}

Danh_gia.init(
  {
    thoi_diem_danh_gia: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    thanh_vien: {
      type: DataTypes.STRING(25),
      primaryKey: true,
      references: {
        model: "thanh_vien",
        key: "ten_dang_nhap",
      },
    },
    ma_dh: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      references: {
        model: "don_hang",
        key: "ma_don_hang",
      },
    },
    ma_sp: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      references: {
        model: "san_pham",
        key: "ma_sp",
      },
    },
    diem_danh_gia: { type: DataTypes.INTEGER, allowNull: false },
    noi_dung: { type: DataTypes.STRING(1000), allowNull: false },
  },
  {
    sequelize,
    modelName: "Danh_gia",
    tableName: "danh_gia",
  }
);

export default Danh_gia;
