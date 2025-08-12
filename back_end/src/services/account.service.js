import sequelize from "../../config/db.js";
import { Nhan_vien, Tai_khoan, Thanh_vien } from "../models/index.js";
import bcrypt from "bcrypt";

const BCRYPT_SALT = 10;
const createOne = async (username, password, phoneNumber) => {
  let hashedPassword = await bcrypt.hash(password, BCRYPT_SALT);

  const newAccount = await sequelize.query(
    `select tao_thanh_vien(:username, :password, :phoneNumber)`,
    {
      replacements: {
        username,
        password: hashedPassword,
        phoneNumber,
      },
    }
  );

  return newAccount;
};

const canMemberLogin = async (username, password) => {
  const user = await Tai_khoan.findOne({
    where: {
      ten_dang_nhap: username,
    },
    include: {
      model: Thanh_vien,
      where: {
        active_status: true,
      },
    },
  });

  if (!user) {
    return false;
  }

  const isValid = await bcrypt.compare(password, user.mat_khau);

  return isValid;
};

const canEmployeeLogin = async (username, password) => {
  const user = await Tai_khoan.findOne({
    where: {
      ten_dang_nhap: username,
    },
    include: {
      model: Nhan_vien,
    },
  });

  if (!user) {
    return false;
  }

  const isValid = await bcrypt.compare(password, user.mat_khau);

  return isValid;
};

export default {
  createOne,
  canMemberLogin,
  canEmployeeLogin,
};
