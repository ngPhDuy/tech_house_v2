import { Model, DataTypes, DATE } from "sequelize";
import sequelize from "../../config/db.js";

class San_pham extends Model {}

San_pham.init(
  {
    ma_sp: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    ten_sp: {
      type: DataTypes.STRING(500),
      unique: true,
      allowNull: false,
    },
    thuong_hieu: {
      type: DataTypes.STRING(20),
      allowNull: false,
    },
    phan_loai: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    hinh_anh: {
      type: DataTypes.STRING(500),
      allowNull: false,
    },
    sl_ton_kho: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    gia_thanh: { type: DataTypes.INTEGER, allowNull: false },
    sale_off: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    mo_ta: {
      type: DataTypes.STRING(5000),
      allowNull: false,
    },
    mau_sac: {
      type: DataTypes.STRING(20),
    },
    bi_xoa: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
  },
  {
    sequelize,
    modelName: "San_pham",
    tableName: "san_pham",
  }
);

export default San_pham;
