import { Model, DataTypes } from "sequelize";
import sequelize from "../../config/db.js";

class Sac_du_phong extends Model {}

Sac_du_phong.init(
  {
    ma_sp: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      references: {
        model: "san_pham",
        key: "ma_sp",
      },
    },
    dung_luong_pin: { type: DataTypes.STRING(100), allowNull: false },
    cong_suat: { type: DataTypes.STRING(100), allowNull: false },
    cong_ket_noi: { type: DataTypes.STRING(100), allowNull: false },
    chat_lieu: { type: DataTypes.STRING(100), allowNull: false },
  },
  {
    sequelize,
    modelName: "Sac_du_phong",
    tableName: "sac_du_phong",
  }
);

export default Sac_du_phong;
