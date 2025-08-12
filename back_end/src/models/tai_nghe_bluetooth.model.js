import { Model, DataTypes } from "sequelize";
import sequelize from "../../config/db.js";

class Tai_nghe_bluetooth extends Model {}

Tai_nghe_bluetooth.init(
  {
    ma_sp: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      references: {
        model: "san_pham",
        key: "ma_sp",
      },
    },
    pham_vi_ket_noi: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    thoi_luong_pin: { type: DataTypes.STRING(100), allowNull: false },
    chong_nuoc: { type: DataTypes.STRING(100), allowNull: false },
    cong_nghe_am_thanh: { type: DataTypes.STRING(100), allowNull: false },
  },
  {
    sequelize,
    modelName: "Tai_nghe_bluetooth",
    tableName: "tai_nghe_bluetooth",
  }
);

export default Tai_nghe_bluetooth;
