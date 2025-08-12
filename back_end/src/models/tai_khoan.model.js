import { Model, DataTypes } from "sequelize";
import sequelize from "../../config/db.js";

class Tai_khoan extends Model {}

Tai_khoan.init(
  {
    ten_dang_nhap: {
      type: DataTypes.STRING(25),
      primaryKey: true,
    },
    mat_khau: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    ho_va_ten: {
      type: DataTypes.STRING(100),
    },
    email: {
      type: DataTypes.STRING(100),
    },
    sdt: {
      type: DataTypes.STRING(10),
    },
    dia_chi: {
      type: DataTypes.STRING(255),
    },
    phan_loai_tk: {
      type: DataTypes.STRING(3),
      allowNull: false,
    },
    thoi_diem_mo_tk: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    avatar: {
      type: DataTypes.STRING(500),
    },
  },
  {
    sequelize,
    modelName: "Tai_khoan",
    tableName: "tai_khoan",
  }
);

export default Tai_khoan;
