import { Model, DataTypes, Op } from "sequelize";
import sequelize from "../../config/db.js";

class Duyet_don_hang extends Model {}

Duyet_don_hang.init(
  {
    ma_don_hang: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      references: {
        model: "don_hang",
        key: "ma_don_hang",
      },
    },
    nhan_vien: {
      type: DataTypes.STRING(25),
      allowNull: false,
      references: {
        model: "nhan_vien",
        key: "ten_dang_nhap",
      },
    },
    thoi_diem_duyet: {
      type: DataTypes.DATE,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: "duyet_don_hang",
    tableName: "duyet_don_hang",
  }
);

export default Duyet_don_hang;
