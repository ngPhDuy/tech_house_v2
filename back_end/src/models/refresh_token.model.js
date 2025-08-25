import { Model, DataTypes, Op } from "sequelize";
import sequelize from "../../config/db.js";

class RefreshToken extends Model {}

RefreshToken.init(
  {
    ten_dang_nhap: {
      type: DataTypes.STRING(25),
      primaryKey: true,
      references: {
        model: "tai_khoan",
        key: "ten_dang_nhap",
      },
    },
    refresh_token: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    thoi_diem_tao: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    thoi_diem_het_han: {
      type: DataTypes.DATE,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: "Refresh_token",
    tableName: "refresh_token",
  }
);

export default RefreshToken;
