import { Model, DataTypes, Op } from "sequelize";
import sequelize from "../../config/db.js";

class Danh_sach_yeu_thich extends Model {}

Danh_sach_yeu_thich.init(
  {
    ma_sp: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      references: {
        model: "san_pham",
        key: "ma_sp",
      },
    },
    thanh_vien: {
      type: DataTypes.STRING(25),
      primaryKey: true,
      references: {
        model: "thanh_vien",
        key: "ten_dang_nhap",
      },
    },
  },
  {
    sequelize,
    modelName: "Danh_sach_yeu_thich",
    tableName: "danh_sach_yeu_thich",
  }
);

export default Danh_sach_yeu_thich;
