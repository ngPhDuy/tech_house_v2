import React, { useEffect, useRef, useState } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import axios from "axios";
import { AiOutlineDelete } from "react-icons/ai";
import api from "../AxiosConfig";

interface IProduct {
  thanh_vien: string;
  ma_sp: number;
  so_luong: number;
  ten_sp: string;
  hinh_anh: string;
  gia_thanh: number;
  sale_off: number;
}

interface IPagination {
  total: number;
  page: number;
  limit: number;
}

interface IPrice {
  tong_gia: number;
  tong_giam_gia: number;
  thanh_tien: number;
}

const Cart: React.FC = () => {
  const token = localStorage.getItem("token");
  const userID = JSON.parse(atob(token!.split(".")[1])).userID;
  const productsPerPage = 6;
  const [products, setProducts] = useState<IProduct[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState<IPagination>({
    total: 0,
    page: 1,
    limit: productsPerPage,
  });
  const [price, setPrice] = useState<IPrice>({
    tong_gia: 0,
    tong_giam_gia: 0,
    thanh_tien: 0,
  });
  const updateTimers = useRef<{ [key: number]: NodeJS.Timeout }>({});
  const [showBadge, setShowBadge] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  //pagination
  const totalPage = Math.ceil(pagination.total / productsPerPage);

  const handleQuantityChange = (productID: number, delta: number) => {
    setProducts((prev) => {
      const updatedProducts = prev.map((product) => {
        console.log(product.so_luong, delta);
        return product.ma_sp === productID
          ? { ...product, so_luong: Math.max(1, product.so_luong + delta) }
          : product;
      });

      if (updateTimers.current[productID]) {
        clearTimeout(updateTimers.current[productID]);
      }

      updateTimers.current[productID] = setTimeout(() => {
        const product = updatedProducts.find((p) => p.ma_sp === productID);

        api
          .patch(`/users/${userID}/carts/${productID}`, {
            quantity: product?.so_luong,
          })
          .then((response) => {
            setIsSuccess(true);
            setShowBadge(true);
            setTimeout(() => setShowBadge(false), 1000);
          })
          .catch((error) => {
            console.log(error);
            setIsSuccess(false);
            setShowBadge(true);
            setTimeout(() => setShowBadge(false), 1000);
          });
      }, 800);

      return updatedProducts;
    });
  };

  useEffect(() => {
    api
      .get(`/carts?limit=${productsPerPage}&page=${currentPage}`)
      .then((response) => {
        setProducts(response.data.data);
        setPagination(response.data.pagination);
      });
  }, [userID, productsPerPage, currentPage]);

  return (
    <div className="flex flex-col min-h-screen">
      <Header currentPage="none" />
      <div className="w-full my-4 px-5 text-sm flex-1">
        <div className="content flex justify-evenly items-start gap-4">
          <div className="cart-table w-[80%]">
            <h3 className="text-lg uppercase font-semibold mb-4">Giỏ hàng</h3>
            {products.length > 0 && (
              <div>
                <table className="w-full">
                  <thead className="border-b border-black">
                    <tr className="text-black text-center">
                      <th className="px-4 py-2"></th>
                      <th className="px-4 py-2">Hình ảnh</th>
                      <th className="px-4 py-2">Sản phẩm</th>
                      <th className="px-4 py-2">Đơn giá</th>
                      <th className="px-4 py-2">Số lượng</th>
                      <th className="px-4 py-2">Tổng cộng</th>
                    </tr>
                  </thead>
                  <tbody>
                    {products.map((product, index) => (
                      <tr key={index} className="odd:bg-gray-50 text-center">
                        <td className="py-2">
                          <button className="flex justify-center items-center cursor-pointer text-red-600 hover:text-red-800 w-full mx-auto">
                            <AiOutlineDelete size={20} />
                          </button>
                        </td>
                        <td className="py-2">
                          <img
                            src={product.hinh_anh}
                            alt={product.ten_sp}
                            width={50}
                            height={50}
                            className="block mx-auto"
                          />
                        </td>
                        <td className="text-left py-2 cursor-pointer hover:text-primary">
                          {product.ten_sp}
                        </td>
                        <td className="py-2">
                          {new Intl.NumberFormat("vi-VN", {
                            style: "currency",
                            currency: "VND",
                          }).format(product.gia_thanh)}
                        </td>
                        <td className="py-2">
                          <div className="flex justify-evenly items-center gap-6 border border-gray-300 w-fit px-2 py-2 mx-auto">
                            <button
                              onClick={() =>
                                handleQuantityChange(product.ma_sp, -1)
                              }
                              disabled={product.so_luong === 1}
                            >
                              -
                            </button>
                            <span>{product.so_luong}</span>
                            <button
                              onClick={() =>
                                handleQuantityChange(product.ma_sp, 1)
                              }
                            >
                              +
                            </button>
                          </div>
                        </td>
                        <td className="py-2">
                          {new Intl.NumberFormat("vi-VN", {
                            style: "currency",
                            currency: "VND",
                          }).format(product.gia_thanh * product.so_luong)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {totalPage > 1 && (
                  <div className="pagination flex justify-evenly items-center w-fit px-2 py-2 mx-auto gap-3 mt-4">
                    <button
                      disabled={currentPage === 1}
                      onClick={() => setCurrentPage(currentPage - 1)}
                      className="px-2 py-1 border border-gray-300 hover:bg-primary hover:text-white ease-linear duration-100 cursor-pointer rounded-md shadow-md"
                    >
                      Trước
                    </button>
                    {Array.from(
                      { length: totalPage },
                      (_, index) => index + 1
                    ).map((page) => (
                      <button
                        key={page}
                        className={`border border-gray-300 px-2 py-1 hover:bg-primary hover:text-white ease-linear duration-100 cursor-pointer rounded-md shadow-md ${
                          currentPage === page ? "bg-primary text-white" : ""
                        }`}
                        onClick={() => setCurrentPage(page)}
                      >
                        {page}
                      </button>
                    ))}
                    <button
                      disabled={currentPage === totalPage}
                      onClick={() => setCurrentPage(currentPage + 1)}
                      className="px-2 py-1 border border-gray-300 hover:bg-primary hover:text-white ease-linear duration-100 cursor-pointer rounded-md shadow-md"
                    >
                      Sau
                    </button>
                  </div>
                )}
              </div>
            )}
            {products.length === 0 && (
              <div className="flex flex-col justify-center items-center gap-4 w-full h-full">
                Hiện tại không có sản phẩm trong giỏ hàng
              </div>
            )}
          </div>
          <div className="total-n-coupon w-[20%] flex flex-col gap-6 h-full p-2 pt-1">
            <div className="total flex flex-col gap-2 border-[2px] border-gray-200 rounded-md shadow-md p-2 pt-1">
              <h4 className="text-base font-semibold mb-2">Chi tiết</h4>
              <div className="flex justify-between items-center w-full">
                <span>Tổng giá</span>{" "}
                <span className="font-semibold">
                  {new Intl.NumberFormat("vi-VN", {
                    style: "currency",
                    currency: "VND",
                  }).format(price.tong_gia)}
                </span>
              </div>
              <div className="flex justify-between items-center w-full">
                <span>Tổng giảm</span>{" "}
                <span className="font-semibold">
                  {new Intl.NumberFormat("vi-VN", {
                    style: "currency",
                    currency: "VND",
                  }).format(price.tong_giam_gia)}
                </span>
              </div>
              <div className="flex justify-between items-center w-full mt-2">
                <span>Thành tiền</span>{" "}
                <span className="font-semibold text-primary">
                  {new Intl.NumberFormat("vi-VN", {
                    style: "currency",
                    currency: "VND",
                  }).format(price.thanh_tien)}
                </span>
              </div>
            </div>
            <div className="coupon border-[2px] border-gray-200 rounded-md shadow-md p-2 pt-1">
              <h4 className="text-base font-semibold mb-4">Mã giảm giá</h4>
              <div className="coupon-code flex justify-items-center flex-col gap-3">
                <input
                  type="text"
                  placeholder="Mã giảm giá"
                  className="border-2 border-gray-200 px-2 py-1 rounded focus:outline-none"
                />
                <button className="mx-auto bg-orange-500 text-white rounded px-2 py-2 w-[70%] hover:bg-orange-600">
                  Áp dụng
                </button>
              </div>
            </div>
          </div>
        </div>
        {showBadge && isSuccess && (
          <div className="absolute bottom-1/4 right-[40%] z-50 w-fit py-1 px-2 bg-green-500 text-white rounded">
            Đã cập nhật số lượng trong giỏ
          </div>
        )}{" "}
        {showBadge && !isSuccess && (
          <div className="absolute bottom-1/4 right-[40%] z-50 w-fit py-1 px-2 bg-red-500 text-white rounded">
            Có lỗi trong quá trình cập nhật!!
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default Cart;
