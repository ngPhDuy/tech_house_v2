import React, { useEffect, useState } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import axios from "axios";
import { useParams, useSearchParams } from "react-router-dom";
import { FaMoneyBill, FaCreditCard } from "react-icons/fa";

interface IProductInfo {
  ma_sp: number;
  ten_sp: string;
  thuong_hieu: string;
  phan_loai: number;
  hinh_anh: string;
  sl_ton_kho: number;
  gia_thanh: number;
  sale_off: number;
  mo_ta: string;
  mau_sac: string;
  diem_danh_gia: number;
  so_luong: number;
}

interface IProductInCart {
  so_luong: number;
  ma_sp: number;
  ten_sp: string;
  thuong_hieu: string;
  hinh_anh: string;
  gia_thanh: number;
  sale_off: number;
}

interface IInfoForm {
  firstname: string;
  lastname: string;
  phoneNumber: string;
  address: string;
  payment: string;
  note: string;
  email: string;
}

const defaultProductInfo: IProductInfo = {
  ma_sp: 0,
  ten_sp: "",
  thuong_hieu: "",
  phan_loai: 0,
  hinh_anh: "",
  sl_ton_kho: 0,
  gia_thanh: 0,
  sale_off: 0,
  mo_ta: "",
  mau_sac: "",
  diem_danh_gia: 0,
  so_luong: 1,
};

const defaultInfoForm: IInfoForm = {
  firstname: "",
  lastname: "",
  phoneNumber: "",
  address: "",
  payment: "cash",
  note: "",
  email: "",
};
const BE_HOST = import.meta.env.VITE_BE_HOST;

const CheckOut: React.FC = () => {
  const [searchParams] = useSearchParams();
  const { productID } = useParams();
  const quantity = Number(searchParams.get("quantity")) || 1;
  const [productInfo, setProductInfo] =
    useState<IProductInfo>(defaultProductInfo);
  const [cartProducts, setCartProducts] = useState<IProductInCart[]>([]);
  const [infoForm, setInfoForm] = useState<IInfoForm>(defaultInfoForm);
  const userID = localStorage.getItem("username") || "khachhang1";
  console.log(productID);
  console.log(cartProducts);
  const renderedItems = productID ? [productInfo] : cartProducts;
  let total = 0,
    totalDiscount = 0,
    finalPrice = 0;

  useEffect(() => {
    if (productID === undefined) return;

    axios
      .get(`${BE_HOST}/api/products/${productID}`)
      .then((res) => {
        const newData = {
          ...res.data.product,
          so_luong: quantity,
        };
        setProductInfo(newData);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [userID, productID]);

  useEffect(() => {
    if (productID !== undefined) return;

    axios
      .get(`${BE_HOST}/api/users/${userID}/check_out`)
      .then((res) => {
        setCartProducts(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [userID, productID]);

  //Price calculator
  renderedItems.forEach((item) => {
    total += item.gia_thanh * item.so_luong;
    totalDiscount += item.gia_thanh * item.so_luong * item.sale_off;
    finalPrice += item.gia_thanh * item.so_luong * (1 - item.sale_off);
  });

  return (
    <div className="flex flex-col min-h-screen">
      <Header currentPage="none" />
      <div className="w-full my-4 px-5 text-sm flex-1">
        <div className="flex justify-between items-start gap-4 mx-auto w-[95%]">
          <div className="info w-[70%]">
            <h4 className="text-lg font-semibold uppercase mb-4">
              Thông tin thanh toán
            </h4>
            <div className="w-full flex flex-col justify-evenly gap-4">
              <div className="row1 flex justify-start items-center gap-2">
                <div className="flex flex-col justify-start items-start gap-1 w-full">
                  <label htmlFor="firstname">Họ</label>
                  <input
                    type="text"
                    placeholder="First name"
                    id="firstname"
                    value={infoForm.firstname}
                    onChange={(e) =>
                      setInfoForm((prev) => ({
                        ...prev,
                        firstname: e.target.value,
                      }))
                    }
                    className="border border-gray-400 px-2 py-2 rounded w-full focus:outline-none"
                  />
                </div>
                <div className="flex flex-col justify-start items-start gap-1 w-full">
                  <label htmlFor="lastname">Tên</label>
                  <input
                    type="text"
                    placeholder="Last name"
                    id="lastname"
                    className="border border-gray-400 px-2 py-2 rounded w-full focus:outline-none"
                    value={infoForm.lastname}
                    onChange={(e) =>
                      setInfoForm((prev) => ({
                        ...prev,
                        lastname: e.target.value,
                      }))
                    }
                  />
                </div>
              </div>
              <div className="row2 flex justify-start items-center gap-2">
                <div className="flex flex-col justify-start items-start gap-1 w-full">
                  <label htmlFor="address">Địa chỉ nhận hàng</label>
                  <input
                    type="text"
                    placeholder="Shipping address"
                    id="address"
                    className="border border-gray-400 px-2 py-2 rounded w-full focus:outline-none"
                    value={infoForm.address}
                    onChange={(e) =>
                      setInfoForm((prev) => ({
                        ...prev,
                        address: e.target.value,
                      }))
                    }
                  ></input>
                </div>
              </div>
              <div className="row3 flex justify-start items-center gap-2">
                <div className="flex flex-col justify-start items-start gap-1 w-full">
                  <label htmlFor="email">Email</label>
                  <input
                    type="email"
                    placeholder="Email"
                    id="email"
                    className="border border-gray-400 px-2 py-2 rounded w-full focus:outline-none"
                    value={infoForm.email}
                    onChange={(e) =>
                      setInfoForm((prev) => ({
                        ...prev,
                        email: e.target.value,
                      }))
                    }
                  />
                </div>
                <div className="flex flex-col justify-start items-start gap-1 w-full">
                  <label htmlFor="phoneNumber">Điện thoại</label>
                  <input
                    type="phone"
                    placeholder="Phone number"
                    id="phoneNumber"
                    className="border border-gray-400 px-2 py-2 rounded w-full focus:outline-none"
                    value={infoForm.phoneNumber}
                    onChange={(e) =>
                      setInfoForm((prev) => ({
                        ...prev,
                        phoneNumber: e.target.value,
                      }))
                    }
                  />
                </div>
              </div>
              <div className="row4 flex flex-col justify-start items-start gap-1 w-full">
                <h4>Hình thức thanh toán</h4>
                <div className="flex justify-start items-center gap-2">
                  <label className="flex flex-col justify-evenly items-center gap-2 border border-gray-400 px-2 py-3 rounded-md shadow-md cursor-pointer hover:scale-105 ease-linear duration-150">
                    <FaMoneyBill color="orange" />
                    Trả tiền mặt
                    <input
                      type="radio"
                      name="payment"
                      value="cash"
                      checked={infoForm.payment === "cash"}
                      onChange={(e) =>
                        setInfoForm((prev) => ({
                          ...prev,
                          payment: e.target.value,
                        }))
                      }
                    />
                  </label>
                  <label className="flex flex-col justify-evenly items-center gap-2 border border-gray-400 px-2 py-3 rounded-md shadow-md cursor-pointer hover:scale-105 ease-linear duration-150">
                    <FaCreditCard color="blue" />
                    Thẻ tín dụng
                    <input
                      type="radio"
                      name="payment"
                      value="credit"
                      checked={infoForm.payment === "credit"}
                      onChange={(e) =>
                        setInfoForm((prev) => ({
                          ...prev,
                          payment: e.target.value,
                        }))
                      }
                    />
                  </label>
                </div>
                {infoForm.payment === "credit" && (
                  <div className="flex justify-start items-center gap-2 w-full">
                    <div className="flex flex-col justify-start items-start gap-1 w-full">
                      <div>Chủ thẻ</div>
                      <input
                        type="text"
                        placeholder="Owner"
                        className="border border-gray-400 px-2 py-2 rounded w-full focus:outline-none"
                      />
                    </div>
                    <div className="flex flex-col justify-start items-start gap-1 w-full">
                      <div>Địa chỉ thanh toán</div>
                      <input
                        type="text"
                        placeholder="Payment address"
                        className="border border-gray-400 px-2 py-2 rounded w-full focus:outline-none"
                      />
                    </div>
                  </div>
                )}
              </div>
              <div className="row5 flex flex-col justify-start items-start gap-1 w-full">
                <label htmlFor="note">Ghi chú thêm</label>
                <textarea
                  placeholder="Order notes"
                  id="note"
                  className="border border-gray-400 px-2 py-2 rounded w-full focus:outline-none"
                  rows={3}
                  value={infoForm.note}
                  onChange={(e) =>
                    setInfoForm((prev) => ({
                      ...prev,
                      note: e.target.value,
                    }))
                  }
                ></textarea>
              </div>
            </div>
          </div>
          <div className="sumary w-[25%] flex flex-col gap-2 border border-gray-300 rounded-md shadow-md px-2 py-1">
            <h4 className="text-base font-bold text-left w-full">
              Tóm tắt đơn hàng
            </h4>
            <div className="flex flex-col justify-evenly items-center gap-2 mb-3 max-h-52 overflow-y-auto">
              {renderedItems.map((item) => (
                <div className="flex justify-between items-center gap-1 w-full">
                  {" "}
                  <div className="flex justify-center items-center w-1/5">
                    <img
                      src={item.hinh_anh}
                      alt={item.ten_sp}
                      className="object-fill"
                      width={60}
                      height={120}
                    />
                  </div>
                  <div className="flex flex-col justify-evenly items-start text-left gap-2 w-4/5">
                    <div>{item.ten_sp}</div>
                    <div>
                      {quantity} x{" "}
                      {new Intl.NumberFormat("vi-VN", {
                        style: "currency",
                        currency: "VND",
                      }).format(item.gia_thanh)}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="h-[1px] bg-gray-200 w-full"></div>
            <div className="flex flex-col gap-2 mb-3">
              <div className="flex justify-between items-center w-full">
                <span>Tổng giá</span>
                <span>
                  {new Intl.NumberFormat("vi-VN", {
                    style: "currency",
                    currency: "VND",
                  }).format(total)}
                </span>
              </div>
              <div className="flex justify-between items-center w-full">
                <span>Tổng giảm giá</span>
                <span>
                  {new Intl.NumberFormat("vi-VN", {
                    style: "currency",
                    currency: "VND",
                  }).format(totalDiscount)}
                </span>
              </div>
            </div>
            <div className="h-[2px] bg-gray-300 w-full"></div>
            <div className="flex justify-between items-center w-full text-base font-bold">
              <span>Thành tiền</span>
              <span>
                {" "}
                {new Intl.NumberFormat("vi-VN", {
                  style: "currency",
                  currency: "VND",
                }).format(finalPrice)}
              </span>
            </div>
            <button className="bg-orange-400 text-white hover:bg-orange-600 ease-linear duration-150 px-3 py-2 rounded shadow w-full uppercase mx-auto my-2 font-medium">
              Đặt hàng
            </button>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default CheckOut;
