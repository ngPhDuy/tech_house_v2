import axios from "axios";
import React, { useEffect, useState } from "react";
import { IoIosArrowForward } from "react-icons/io";
import Header from "../components/Header";
import Footer from "../components/Footer";
import bannerImg from "../assets/images/banner.png";
import { Link } from "react-router-dom";
interface IResponse {
  data: {
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
  }[];
  pagination: {
    total: number;
    page: number;
    limit: number;
  };
}

const BE_HOST = import.meta.env.VITE_BE_HOST;
const categoryHash = {
  laptop: 0,
  mobile: 1,
  tablet: 2,
  tai_nghe_bluetooth: 3,
  ban_phim: 4,
  sac_du_phong: 5,
  op_lung: 6,
};
const titleHash: Record<string, string> = {
  laptop: "Laptop nổi bật",
  mobile: "Điện thoại nổi bật",
  tablet: "Máy tính bảng nổi bật",
  tai_nghe_bluetooth: "Tai nghe bluetooth nổi bật",
  ban_phim: "Bàn phím nổi bật",
  sac_du_phong: "Sạc dự phòng nổi bật",
  op_lung: "Ốp lưng nổi bật",
};

type CategoryKey = keyof typeof categoryHash;
type ProductsProps = {
  category: string;
};

const Products: React.FC<ProductsProps> = ({ category }) => {
  const limit = 5;
  const page = 1;
  const [products, setProducts] = useState<IResponse["data"]>([]);
  console.log("BE_HOST", BE_HOST);

  useEffect(() => {
    axios
      .get(
        `${BE_HOST}/api/products?category=${category}&limit=${limit}&page=${page}`
      )
      .then((response) => {
        console.log(response.data);
        setProducts(response.data.data);
      })
      .catch((error) => console.log(error));
  }, [category, limit, page]);

  return (
    <div className="products-bar flex flex-col w-full gap-4 mb-4">
      <div className="title flex justify-between items-center w-full cursor-pointer">
        <div className="text-xl font-semibold border-b-2 border-primary pb-1">
          {titleHash[category]}
        </div>
        <Link
          to={`/products?category=${category}`}
          className="flex justify-between items-center gap-2 cursor-pointer hover:text-primary hover:underline text-black"
        >
          <p className="text-sm">Xem tất cả</p> <IoIosArrowForward />
        </Link>
      </div>
      <div className="products flex justify-start items-end w-full text-sm gap-4">
        {products.map((product) => (
          <Link
            to={`/products/${product.ma_sp}`}
            key={product.ma_sp}
            className="product w-[19%] h-auto text-sm flex flex-col justify-evenly items-start gap-1 border-2 border-grayColor py-2 px-2 rounded-2xl shadow-lg hover:scale-110 transition duration-300 ease-in-out"
          >
            <img
              src={product.hinh_anh}
              alt={product.ten_sp}
              width={120}
              height={100}
              className="mx-auto mb-2"
            />
            <div className="truncate max-w-52 font-semibold">
              {product.ten_sp}
            </div>
            <div className="font-semibold">
              {new Intl.NumberFormat("vi-VN", {
                style: "currency",
                currency: "VND",
              }).format(product.gia_thanh * (1 - product.sale_off))}
            </div>

            {product.diem_danh_gia > 0 ? (
              <div>{product.diem_danh_gia} ⭐</div>
            ) : (
              <div className="text-gray-500 font-semibold italic">
                Chưa có đánh giá
              </div>
            )}
          </Link>
        ))}
      </div>
    </div>
  );
};
const HomePage: React.FC = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Header currentPage="home" />
      <div className="w-full my-4 flex-1">
        <div className="banner w-full flex justify-center items-center">
          <img src={bannerImg} alt="banner" width={650} height={100} />
        </div>
        <div className="products-bars flex flex-col items-center justify-center gap-4 px-4">
          {(Object.keys(categoryHash) as CategoryKey[]).map((key) => {
            return <Products key={key} category={key} />;
          })}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default HomePage;
