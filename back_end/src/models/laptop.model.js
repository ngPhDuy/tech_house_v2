import { Model, DataTypes } from "sequelize";
import sequelize from "../../config/db.js";

class Laptop extends Model {}

Laptop.init(
  {
    ma_sp: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      references: {
        model: "san_pham",
        key: "ma_sp",
      },
    },
    bo_xu_ly: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    dung_luong_pin: { type: DataTypes.STRING(100), allowNull: false },
    kich_thuoc_man_hinh: { type: DataTypes.STRING(100), allowNull: false },
    cong_nghe_man_hinh: { type: DataTypes.STRING(100), allowNull: false },
    he_dieu_hanh: { type: DataTypes.STRING(50), allowNull: false },
    ram: { type: DataTypes.STRING(50), allowNull: false },
    bo_nho: { type: DataTypes.STRING(50), allowNull: false },
  },
  {
    sequelize,
    modelName: "Laptop",
    tableName: "laptop",
  }
);

export default Laptop;
