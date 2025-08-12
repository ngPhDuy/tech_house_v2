import { Model, DataTypes } from "sequelize";
import sequelize from "../../config/db.js";

class Nhan_vien extends Model {}

Nhan_vien.init(
  {
    ten_dang_nhap: {
      type: DataTypes.STRING(25),
      primaryKey: true,
      references: {
        model: "tai_khoan",
        key: "ten_dang_nhap",
      },
    },
    cccd: {
      type: DataTypes.STRING(12),
      allowNull: false,
    },
    gioi_tinh: {
      type: DataTypes.STRING(3),
      allowNull: false,
    },
    ngay_sinh: {
      type: DataTypes.DATE,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: "Nhan_vien",
    tableName: "nhan_vien",
  }
);

export default Nhan_vien;
