import { Model, DataTypes } from "sequelize";
import sequelize from "../../config/db.js";

class Gio_hang extends Model {}

Gio_hang.init(
  {
    thanh_vien: {
      type: DataTypes.STRING(25),
      primaryKey: true,
      references: {
        model: "thanh_vien",
        key: "ten_dang_nhap",
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
  },
  {
    sequelize,
    modelName: "Gio_hang",
    tableName: "gio_hang",
  }
);

export default Gio_hang;
