import { Model, DataTypes, Op } from "sequelize";
import sequelize from "../../config/db.js";

class Op_lung extends Model {}

Op_lung.init(
  {
    ma_sp: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      references: {
        model: "san_pham",
        key: "ma_sp",
      },
    },
    chat_lieu: { type: DataTypes.STRING(100), allowNull: false },
    do_day: { type: DataTypes.STRING(100), allowNull: false },
  },
  {
    sequelize,
    modelName: "Op_lung",
    tableName: "op_lung",
  }
);

export default Op_lung;
