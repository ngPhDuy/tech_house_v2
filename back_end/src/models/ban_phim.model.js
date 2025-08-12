import { Model, DataTypes } from "sequelize";
import sequelize from "../../config/db.js";

class Ban_phim extends Model {}

Ban_phim.init(
  {
    ma_sp: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      references: {
        model: "san_pham",
        key: "ma_sp",
      },
    },
    key_cap: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    so_phim: { type: DataTypes.INTEGER, allowNull: false },
    cong_ket_noi: { type: DataTypes.STRING(100), allowNull: false },
  },
  {
    sequelize,
    modelName: "Ban_phim",
    tableName: "ban_phim",
  }
);

export default Ban_phim;
