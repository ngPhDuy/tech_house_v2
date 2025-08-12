import Ban_phim from "./ban_phim.model.js";
import Chi_tiet_don_hang from "./chi_tiet_don_hang.model.js";
import Don_hang from "./don_hang.model.js";
import Danh_gia from "./danh_gia.model.js";
import Danh_sach_yeu_thich from "./danh_sach_yeu_thich.model.js";
import Duyet_don_hang from "./duyet_don_hang.model.js";
import Gio_hang from "./gio_hang.model.js";
import Laptop from "./laptop.model.js";
import Mobile from "./mobile.model.js";
import Nhan_vien from "./nhan_vien.model.js";
import Op_lung from "./op_lung.model.js";
import Sac_du_phong from "./sac_du_phong.model.js";
import San_pham from "./san_pham.model.js";
import Tablet from "./tablet.model.js";
import Tai_khoan from "./tai_khoan.model.js";
import Tai_nghe_bluetooth from "./tai_nghe_bluetooth.model.js";
import Thanh_vien from "./thanh_vien.model.js";

// Tai khoan, Nhan vien, Thanh vien
Tai_khoan.hasOne(Thanh_vien, { foreignKey: "ten_dang_nhap" });
Thanh_vien.belongsTo(Tai_khoan, { foreignKey: "ten_dang_nhap" });

Tai_khoan.hasOne(Nhan_vien, { foreignKey: "ten_dang_nhap" });
Nhan_vien.belongsTo(Tai_khoan, { foreignKey: "ten_dang_nhap" });

//Danh gia
Thanh_vien.hasMany(Danh_gia, {
  foreignKey: "thanh_vien",
  sourceKey: "ten_dang_nhap",
});
Danh_gia.belongsTo(Thanh_vien, {
  foreignKey: "thanh_vien",
  targetKey: "ten_dang_nhap",
});

San_pham.hasMany(Danh_gia, {
  foreignKey: "ma_sp",
  sourceKey: "ma_sp",
});
Danh_gia.belongsTo(San_pham, {
  foreignKey: "ma_sp",
  targetKey: "ma_sp",
});

Don_hang.hasOne(Danh_gia, {
  foreignKey: "ma_dh",
  sourceKey: "ma_don_hang",
});
Danh_gia.belongsTo(Don_hang, {
  foreignKey: "ma_dh",
  targetKey: "ma_don_hang",
});

export {
  Ban_phim,
  Chi_tiet_don_hang,
  Danh_gia,
  Danh_sach_yeu_thich,
  Duyet_don_hang,
  Gio_hang,
  Laptop,
  Mobile,
  Nhan_vien,
  Op_lung,
  Sac_du_phong,
  San_pham,
  Tablet,
  Tai_khoan,
  Tai_nghe_bluetooth,
  Thanh_vien,
};
