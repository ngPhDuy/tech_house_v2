import sequelize from "../../config/db.js";
import {
  San_pham,
  Danh_gia,
  Laptop,
  Mobile,
  Tai_nghe_bluetooth,
  Tablet,
  Ban_phim,
  Sac_du_phong,
  Op_lung,
} from "../models/index.js";
import { Op, literal, where, col, fn } from "sequelize";

const categoryHash = {
  laptop: 0,
  mobile: 1,
  tablet: 2,
  tai_nghe_bluetooth: 3,
  ban_phim: 4,
  sac_du_phong: 5,
  op_lung: 6,
};

// Map key FE -> key DB
const productMap = {
  name: "ten_sp",
  brand: "thuong_hieu",
  image: "hinh_anh",
  quantity: "sl_ton_kho",
  price: "gia_thanh",
  saleOff: "sale_off",
  description: "mo_ta",
  color: "mau_sac",
};

// Map riêng cho từng loại
const categoryConfig = {
  0: {
    procedure: "them_laptop",
    map: {
      cpu: "bo_xu_ly",
      battery: "dung_luong_pin",
      screenSize: "kich_thuoc_man_hinh",
      screenTechnology: "cong_nghe_man_hinh",
      operatingSystem: "he_dieu_hanh",
      ram: "ram",
      storage: "bo_nho",
    },
  },
  1: {
    procedure: "them_mobile",
    map: {
      cpu: "bo_xu_ly",
      battery: "dung_luong_pin",
      screenSize: "kich_thuoc_man_hinh",
      screenTechnology: "cong_nghe_man_hinh",
      operatingSystem: "he_dieu_hanh",
      storage: "bo_nho",
    },
  },
  2: {
    procedure: "them_tablet",
    map: {
      cpu: "bo_xu_ly",
      battery: "dung_luong_pin",
      screenSize: "kich_thuoc_man_hinh",
      screenTechnology: "cong_nghe_man_hinh",
      operatingSystem: "he_dieu_hanh",
      storage: "bo_nho",
    },
  },
  3: {
    procedure: "them_tai_nghe_blue_tooth",
    map: {
      range: "pham_vi_ket_noi",
      battery: "dung_luong_pin",
      waterproof: "chong_nuoc",
      soundTechnology: "cong_nghe_am_thanh",
    },
  },
  4: {
    procedure: "them_ban_phim",
    map: {
      keyCap: "key_cap",
      numberOfKeys: "so_phim",
      connectionPort: "cong_ket_noi",
    },
  },
  5: {
    procedure: "them_sac_du_phong",
    map: {
      battery: "dung_luong_pin",
      power: "cong_suat",
      connectionPort: "cong_ket_noi",
      material: "chat_lieu",
    },
  },
  6: {
    procedure: "them_op_lung",
    map: {
      material: "chat_lieu",
      thickness: "do_day",
    },
  },
};
const getAll = async (page, limit, search, brand, category, sort) => {
  // Pagination
  const offset = (page - 1) * limit;

  // Search by name and brand
  let whereCondition = {
    bi_xoa: false,
  };

  if (search) {
    whereCondition = {
      ...whereCondition,
      [Op.or]: [
        where(fn("LOWER", col("ten_sp")), {
          [Op.like]: `%${search.toLowerCase()}%`,
        }),
        where(fn("LOWER", col("thuong_hieu")), {
          [Op.like]: `%${search.toLowerCase()}%`,
        }),
      ],
    };
  }

  // Filter by brand and category
  if (brand) {
    whereCondition = {
      ...whereCondition,
      [Op.and]: [
        where(fn("LOWER", col("thuong_hieu")), {
          [Op.eq]: `${brand.toLowerCase()}`,
        }),
      ],
    };
  }

  if (category && categoryHash[category]) {
    whereCondition.phan_loai = categoryHash[category];
  }

  // Sort
  let order = [];
  if (sort) {
    const [field, direction] = sort.split("_");
    const sortDirection = direction === "asc" ? "ASC" : "DESC";

    if (field == "name") {
      order.push(["ten_sp", sortDirection]);
    } else if (field == "price") {
      order.push([literal("gia_thanh * (1 - sale_off)"), sortDirection]);
    }
  }

  let products = await San_pham.findAll({
    where: whereCondition,
    attributes: {
      include: [
        [
          fn("COALESCE", fn("AVG", col("Danh_gia.diem_danh_gia")), 0),
          "diem_danh_gia",
        ],
      ],
    },
    include: {
      model: Danh_gia,
      attributes: [],
    },
    group: ["San_pham.ma_sp"],
    limit,
    offset,
    order: sort ? order : [["ma_sp", "DESC"]],
    subQuery: false,
  });

  let total = await San_pham.count({
    where: whereCondition,
    include: {
      model: Danh_gia,
      attributes: [],
    },
    distinct: true,
    col: "ma_sp",
  });

  return {
    data: products,
    pagination: {
      page,
      limit,
      total,
    },
  };
};

const getOne = async (productID) => {
  const product = await San_pham.findByPk(productID, {
    attributes: {
      include: [
        [
          fn("COALESCE", fn("AVG", col("Danh_gia.diem_danh_gia")), 0),
          "diem_danh_gia",
        ],
      ],
    },
    include: {
      model: Danh_gia,
      attributes: [],
    },
    group: ["San_pham.ma_sp"],
  });

  if (!product || product.bi_xoa) return null;

  let specs;
  switch (product.phan_loai) {
    case 0:
      specs = await Laptop.findByPk(product.ma_sp);
      break;
    case 1:
      specs = await Mobile.findByPk(product.ma_sp);
      break;
    case 2:
      specs = await Tablet.findByPk(product.ma_sp);
      break;
    case 3:
      specs = await Tai_nghe_bluetooth.findByPk(product.ma_sp);
      break;
    case 4:
      specs = await Ban_phim.findByPk(product.ma_sp);
      break;
    case 5:
      specs = await Sac_du_phong.findByPk(product.ma_sp);
      break;
    case 6:
      specs = await Op_lung.findByPk(product.ma_sp);
      break;
    default:
      break;
  }

  return { product, specs };
};

const createOne = async (productInfo) => {
  let result;
  const category = productInfo.category;
  const config = categoryConfig[category];

  if (!config) return null;

  const fullMap = { ...productMap, ...config.map };

  const fields = Object.keys(fullMap);

  const placeholders = fields.map((field) => `:${field}`).join(",");

  const sqlQuerry = `select ${config.procedure}(${placeholders})`;

  result = await sequelize.query(sqlQuerry, {
    replacements: productInfo,
  });

  return result;
};

const updateOne = async (productInfo) => {
  let category = productInfo.category;

  switch (category) {
    case 0:
      return updateLaptop(productInfo);
    case 1:
      return updateMobile(productInfo);
    case 2:
      return updateTablet(productInfo);
    case 3:
      return updateEarphones(productInfo);
    case 4:
      return updateKeyboard(productInfo);
    case 5:
      return updatePowerBank(productInfo);
    case 6:
      return updatePhoneCase(productInfo);
    default:
      break;
  }
};

const deleteOne = async (productID) => {
  const product = await San_pham.findByPk(productID);

  if (!product || product.bi_xoa) return null;

  product.bi_xoa = true;

  await product.save();

  return true;
};

// Helper function
const updateLaptop = async (productInfo) => {
  const product = await San_pham.findByPk(productInfo.productID);

  if (!product || product.bi_xoa) return false;

  const laptop = await Laptop.findByPk(productInfo.productID);

  if (!laptop) return false;

  const laptopMap = categoryConfig[0].map;

  Object.entries(productMap).forEach(([src, dest]) => {
    if (productInfo[src] !== undefined) product[dest] = productInfo[src];
  });

  Object.entries(laptopMap).forEach(([src, dest]) => {
    if (productInfo[src] !== undefined) laptop[dest] = productInfo[src];
  });

  await Promise.all([product.save(), laptop.save()]);

  return true;
};

const updateMobile = async (productInfo) => {
  const product = await San_pham.findByPk(productInfo.productID);

  if (!product || product.bi_xoa) return false;

  const mobile = await Mobile.findByPk(productInfo.productID);

  if (!mobile) return false;

  const mobileMap = categoryConfig[1].map;

  Object.entries(productMap).forEach(([src, dest]) => {
    if (productInfo[src] !== undefined) product[dest] = productInfo[src];
  });

  Object.entries(mobileMap).forEach(([src, dest]) => {
    if (productInfo[src] !== undefined) mobile[dest] = productInfo[src];
  });

  await Promise.all([product.save(), mobile.save()]);

  return true;
};

const updateTablet = async (productInfo) => {
  const product = await San_pham.findByPk(productInfo.productID);

  if (!product || product.bi_xoa) return false;

  const tablet = await Tablet.findByPk(productInfo.productID);

  if (!tablet) return false;

  const tabletMap = categoryConfig[2].map;

  Object.entries(productMap).forEach(([src, dest]) => {
    if (productInfo[src] !== undefined) product[dest] = productInfo[src];
  });

  Object.entries(tabletMap).forEach(([src, dest]) => {
    if (productInfo[src] !== undefined) tablet[dest] = productInfo[src];
  });

  await Promise.all([product.save(), tablet.save()]);

  return true;
};

const updateEarphones = async (productInfo) => {
  const product = await San_pham.findByPk(productInfo.productID);

  if (!product || product.bi_xoa) return false;

  const earphones = await Tai_nghe_bluetooth.findByPk(productInfo.productID);

  if (!earphones) return false;

  const earphonesMap = categoryConfig[3].map;

  Object.entries(productMap).forEach(([src, dest]) => {
    if (productInfo[src] !== undefined) product[dest] = productInfo[src];
  });

  Object.entries(earphonesMap).forEach(([src, dest]) => {
    if (productInfo[src] !== undefined) earphones[dest] = productInfo[src];
  });

  await Promise.all([product.save(), earphones.save()]);

  return true;
};

const updateKeyboard = async (productInfo) => {
  const product = await San_pham.findByPk(productInfo.productID);

  if (!product || product.bi_xoa) return false;

  const keyboard = await Ban_phim.findByPk(productInfo.productID);

  if (!keyboard) return false;

  const keyboardMap = categoryConfig[4].map;

  Object.entries(productMap).forEach(([src, dest]) => {
    if (productInfo[src] !== undefined) product[dest] = productInfo[src];
  });

  Object.entries(keyboardMap).forEach(([src, dest]) => {
    if (productInfo[src] !== undefined) keyboard[dest] = productInfo[src];
  });

  await Promise.all([product.save(), keyboard.save()]);

  return true;
};

const updatePowerBank = async (productInfo) => {
  const product = await San_pham.findByPk(productInfo.productID);

  if (!product || product.bi_xoa) return false;

  const powerBank = await Sac_du_phong.findByPk(productInfo.productID);

  if (!powerBank) return false;

  const powerBankMap = categoryConfig[5].map;

  Object.entries(productMap).forEach(([src, dest]) => {
    if (productInfo[src] !== undefined) product[dest] = productInfo[src];
  });

  Object.entries(powerBankMap).forEach(([src, dest]) => {
    if (productInfo[src] !== undefined) powerBank[dest] = productInfo[src];
  });

  await Promise.all([product.save(), powerBank.save()]);

  return true;
};

const updatePhoneCase = async (productInfo) => {
  const product = await San_pham.findByPk(productInfo.productID);

  if (!product || product.bi_xoa) return false;

  const phoneCase = await Op_lung.findByPk(productInfo.productID);

  if (!phoneCase) return false;

  const phoneCaseMap = categoryConfig[6].map;

  Object.entries(productMap).forEach(([src, dest]) => {
    if (productInfo[src] !== undefined) product[dest] = productInfo[src];
  });

  Object.entries(phoneCaseMap).forEach(([src, dest]) => {
    if (productInfo[src] !== undefined) phoneCase[dest] = productInfo[src];
  });

  await Promise.all([product.save(), phoneCase.save()]);

  return true;
};

export default { getAll, getOne, createOne, updateOne, deleteOne };
