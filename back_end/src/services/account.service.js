import { col } from "sequelize";
import sequelize from "../../config/db.js";
import {
  Nhan_vien,
  Tai_khoan,
  Thanh_vien,
  RefreshToken,
} from "../models/index.js";
import bcrypt from "bcrypt";
import jwtUtils from "../utils/jwt.js";
import jwt from "jsonwebtoken";

const BCRYPT_SALT = 10;
const updateAccountFields = {
  fullName: "ho_va_ten",
  email: "email",
  phoneNumber: "so_dien_thoai",
  address: "dia_chi",
  avatar: "avatar",
};
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

  if (isValid) {
    const payload = {
      userID: username,
      role: "member",
    };

    let refreshToken = jwtUtils.signRefreshToken(payload),
      accessToken = jwtUtils.signAccessToken(payload);

    const decodedRefreshToken = jwt.decode(refreshToken);

    const newRefreshToken = await RefreshToken.create({
      ten_dang_nhap: username,
      refresh_token: refreshToken,
      thoi_diem_tao: new Date(decodedRefreshToken.iat * 1000),
      thoi_diem_het_han: new Date(decodedRefreshToken.exp * 1000),
    });

    return {
      accessToken,
      refreshToken: newRefreshToken,
    };
  }

  return null;
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

const getOne = async (userID) => {
  const user = await Tai_khoan.findOne({
    where: {
      ten_dang_nhap: userID,
      phan_loai_tk: "tv",
    },
    attributes: {
      exclude: ["mat_khau"],
    },
  });

  return user;
};

const updateOne = async (userID, payload) => {
  const account = await Tai_khoan.findOne({
    where: {
      ten_dang_nhap: userID,
      phan_loai_tk: "tv",
    },
  });

  if (!account) {
    return false;
  }

  Object.entries(updateAccountFields).forEach(([src, dest]) => {
    if (payload[src] !== undefined) account[dest] = payload[src];
  });

  await account.save();

  return true;
};

const updatePasswordByUser = async (userID, oldPassword, newPassword) => {
  const account = await Tai_khoan.findOne({
    where: {
      ten_dang_nhap: userID,
      phan_loai_tk: "tv",
    },
  });

  if (!account) {
    return false;
  }

  const isValid = await bcrypt.compare(oldPassword, account.mat_khau);

  if (!isValid) {
    return false;
  }

  const hashedPassword = await bcrypt.hash(newPassword, BCRYPT_SALT);

  account.mat_khau = hashedPassword;

  await account.save();

  return true;
};

const getAll = async () => {
  const accounts = await Tai_khoan.findAll({
    where: {
      phan_loai_tk: "tv",
    },
    include: {
      model: Thanh_vien,
      attributes: [],
    },
    attributes: {
      exclude: ["mat_khau", "phan_loai_tk"],
      include: [
        [col("Thanh_vien.active_status"), "active_status"],
        [col("Thanh_vien.thoi_diem_huy_tk"), "thoi_diem_huy_tk"],
      ],
    },
  });

  return accounts;
};

const updatePasswordByAdmin = async (userID, newPassword) => {
  const account = await Tai_khoan.findOne({
    where: {
      ten_dang_nhap: userID,
      phan_loai_tk: "tv",
    },
  });

  if (!account) {
    return false;
  }

  const hashedPassword = await bcrypt.hash(newPassword, BCRYPT_SALT);

  account.mat_khau = hashedPassword;

  await account.save();

  return true;
};

const updateActiveStatus = async (userID, active_status) => {
  let unableTime = null;

  if (!active_status) {
    unableTime = new Date();
  }

  const user = await Thanh_vien.update(
    {
      active_status,
      thoi_diem_huy_tk: unableTime,
    },
    {
      where: {
        ten_dang_nhap: userID,
      },
    }
  );

  return user[0] > 0;
};

const logout = async (accessToken, refreshToken) => {
  const payload = jwtUtils.verifyAccessToken(accessToken);

  if (refreshToken) {
    const deleteRefreshToken = await RefreshToken.destroy({
      where: {
        ten_dang_nhap: payload.userID,
        refresh_token: refreshToken,
      },
    });

    if (!deleteRefreshToken) {
      return false;
    }
  }

  return true;
};

const refreshToken = async (refreshToken) => {
  let payload;
  try {
    payload = jwtUtils.verifyRefreshToken(refreshToken);
  } catch {
    return false;
  }

  const refreshTokenExists = await RefreshToken.findOne({
    where: {
      ten_dang_nhap: payload.userID,
      refresh_token: refreshToken,
    },
  });

  if (
    !refreshTokenExists ||
    refreshTokenExists.thoi_diem_het_han < new Date()
  ) {
    return false;
  }

  let newAccessToken = jwtUtils.signAccessToken({
    userID: payload.userID,
    role: payload.role,
  });

  return { accessToken: newAccessToken };
};

export default {
  createOne,
  canMemberLogin,
  canEmployeeLogin,
  getOne,
  updateOne,
  updatePasswordByUser,
  getAll,
  updatePasswordByAdmin,
  updateActiveStatus,
  logout,
  refreshToken,
};
