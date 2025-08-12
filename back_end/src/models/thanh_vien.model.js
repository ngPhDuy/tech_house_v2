import { Model, DataTypes } from "sequelize";
import sequelize from "../../config/db.js";

class Thanh_vien extends Model {}

Thanh_vien.init(
  {
    ten_dang_nhap: {
      type: DataTypes.STRING(25),
      primaryKey: true,
      references: {
        model: "tai_khoan",
        key: "ten_dang_nhap",
      },
    },
    active_status: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
    },
    thoi_diem_huy_tk: {
      type: DataTypes.DATE,
    },
  },
  {
    sequelize,
    modelName: "Thanh_vien",
    tableName: "thanh_vien",
  }
);

export default Thanh_vien;
