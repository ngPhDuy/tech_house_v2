import { Model, DataTypes, Op } from "sequelize";
import sequelize from "../../config/db.js";

class Chi_tiet_don_hang extends Model {}

Chi_tiet_don_hang.init(
  {
    ma_don_hang: {
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
    so_luong: { type: DataTypes.INTEGER, allowNull: false },
    don_gia: { type: DataTypes.INTEGER, allowNull: false },
  },
  {
    sequelize,
    modelName: "Chi_tiet_don_hang",
    tableName: "chi_tiet_don_hang",
  }
);

export default Chi_tiet_don_hang;
