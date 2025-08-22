import React, { useEffect, useState } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import {
  FaStar,
  FaStarHalfAlt,
  FaThumbsUp,
  FaMinus,
  FaPlus,
} from "react-icons/fa";
import Swal from "sweetalert2";

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
}
interface IProductSpes {
  ma_sp: number;
  bo_xu_ly: string;
  dung_luong_pin: string;
  kich_thuoc_man_hinh: string;
  cong_nghe_man_hinh: string;
  he_dieu_hanh: string;
  bo_nho: string;
}

interface IProductRatings {
  data: {
    ratings: {
      thoi_diem_danh_gia: string;
      thanh_vien: string;
      diem_danh_gia: number;
      noi_dung: string;
    }[];
    avgRating: number;
  };
  pagination: {
    total: number;
    page: number;
    limit: number;
  };
}

type Tab = "description" | "specs" | "ratings";

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
};

const defaultProductSpecs: IProductSpes = {
  ma_sp: 0,
  bo_xu_ly: "",
  dung_luong_pin: "",
  kich_thuoc_man_hinh: "",
  cong_nghe_man_hinh: "",
  he_dieu_hanh: "",
  bo_nho: "",
};

const defaultProductRatings: IProductRatings = {
  data: {
    ratings: [],
    avgRating: 0,
  },
  pagination: {
    total: 0,
    page: 0,
    limit: 0,
  },
};

const BE_HOST = import.meta.env.VITE_BE_HOST;

const tabTitlesMap: Record<Tab, string> = {
  description: "Mô tả sản phẩm",
  specs: "Thông số kỹ thuật",
  ratings: "Đánh giá sản phẩm",
};

const fieldTitleMap: Record<string, string> = {
  // Dùng chung cho Laptop, Mobile, Tablet
  bo_xu_ly: "Bộ xử lý",
  dung_luong_pin: "Dung lượng pin",
  kich_thuoc_man_hinh: "Kích thước màn hình",
  cong_nghe_man_hinh: "Công nghệ màn hình",
  he_dieu_hanh: "Hệ điều hành",
  ram: "RAM",
  bo_nho: "Bộ nhớ",

  // Tai nghe bluetooth
  pham_vi_ket_noi: "Phạm vi kết nối",
  thoi_luong_pin: "Thời lượng pin",
  chong_nuoc: "Chống nước",
  cong_nghe_am_thanh: "Công nghệ âm thanh",

  // Bàn phím
  key_cap: "Keycap",
  so_phim: "Số phím",
  cong_ket_noi: "Cổng kết nối",

  // Sạc dự phòng
  cong_suat: "Công suất",
  chat_lieu: "Chất liệu",

  // Ốp lưng
  do_day: "Độ dày",
};

const StarRating: React.FC<{ stars: number; total: number }> = (props) => {
  const fullStar = Math.floor(props.stars);
  const halfStar = Math.round(props.stars - fullStar);

  if (props.stars == 0) {
    return (
      <div className="text-gray-600 italic font-semibold text-sm">
        Chưa có đánh giá
      </div>
    );
  }

  return (
    <div className="flex flex-start items-center gap-2">
      <div className="flex justify-evenly items-center w-fit text-yellow-400">
        {Array.from({ length: fullStar }).map((_, index) => (
          <FaStar key={index} />
        ))}
        {halfStar > 0 && <FaStarHalfAlt />}
      </div>
      <div className="font-semibold text-sm pe-1">{props.stars}</div>
      <div className="text-gray-500 font-light text-sm italic">
        ({props.total} đánh giá)
      </div>
    </div>
  );
};
const ProductDetail: React.FC = () => {
  const userID = localStorage.getItem("username") || "khachhang1";
  const numSameBrandProduct = 4;
  const { productID } = useParams();
  const [productInfo, setProductInfo] =
    useState<IProductInfo>(defaultProductInfo);
  const [productSpecs, setProductSpecs] =
    useState<IProductSpes>(defaultProductSpecs);
  const [productRatings, setProductRatings] = useState<IProductRatings>(
    defaultProductRatings
  );
  const [sameBrandProducts, setSameBrandProducts] = useState<IProductInfo[]>(
    []
  );
  const [quantity, setQuantity] = useState(1);
  const [selectedTab, setSelectedTab] = useState<Tab>("description");
  const ratingsPerPage = 5;
  const [currentPage, setCurrentPage] = useState(1);
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get(`${BE_HOST}/api/products/${productID}`)
      .then((response) => {
        setProductInfo(response.data.product);
        setProductSpecs(response.data.specs);
      })
      .catch((error) => console.log(error));
  }, [productID]);

  useEffect(() => {
    axios
      .get(
        `${BE_HOST}/api/products/${productID}/ratings?limit=${ratingsPerPage}&page=${currentPage}`
      )
      .then((response) => {
        setProductRatings(response.data);
      });
  }, [productID, currentPage, ratingsPerPage]);

  useEffect(() => {
    axios
      .get(
        `${BE_HOST}/api/products?brand=${productInfo.thuong_hieu}&limit=${numSameBrandProduct}`
      )
      .then((response) => {
        {
          setSameBrandProducts(response.data.data);
        }
      });
  }, [productInfo, numSameBrandProduct]);

  console.log(sameBrandProducts);

  const handleAddProductToCart = async () => {
    console.log(`Add ${productID} with ${quantity}`);
    axios
      .put(`${BE_HOST}/api/users/${userID}/carts/${productID}`, {
        quantity,
      })
      .then(() => {
        Swal.fire({
          title: "Okie!!",
          text: "Đã thêm vào giỏ hàng",
          icon: "success",
          showConfirmButton: false,
          timer: 1000,
        });
      })
      .catch((err) => {
        console.log(err);
        Swal.fire({
          title: "Oh No!!",
          text: "Có lỗi xảy ra",
          icon: "error",
          showConfirmButton: false,
          timer: 1000,
        });
      });
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header currentPage="none" />
      <div className="w-full my-4 px-5 text-sm flex-1">
        <div className="product-info w-full flex justify-between items-start">
          <div className="w-1/2 px-2">
            <img
              className="block mx-auto"
              src={productInfo.hinh_anh}
              alt={productInfo.ten_sp}
            />
          </div>
          <div className="w-1/2 text-sm flex flex-col justify-start items-start gap-4">
            <div className="flex justify-start items-center w-full">
              <StarRating
                stars={productInfo.diem_danh_gia}
                total={productRatings.pagination.total}
              />
            </div>
            <div className="text-lg font-bold text-black">
              {productInfo.ten_sp}
            </div>
            <div className="flex justify-between items-center w-full">
              <div>
                Thương hiệu:{" "}
                <span className="font-semibold">{productInfo.thuong_hieu}</span>
              </div>
              <div>
                Tình trạng:{" "}
                {productInfo.sl_ton_kho > 0 ? (
                  <span className="text-green-500 font-semibold">Còn hàng</span>
                ) : (
                  <span className="text-red-500 font-semibold">Hết hàng</span>
                )}
              </div>
            </div>
            <div className="price flex justify-start items-center w-full gap-4">
              <div className="text-lg font-bold text-primary">
                {new Intl.NumberFormat("vi-VN", {
                  style: "currency",
                  currency: "VND",
                }).format(productInfo.gia_thanh * (1 - productInfo.sale_off))}
              </div>
              {productInfo.sale_off > 0 && (
                <div className="text-sm line-through text-gray-500">
                  {new Intl.NumberFormat("vi-VN", {
                    style: "currency",
                    currency: "VND",
                  }).format(productInfo.gia_thanh)}
                </div>
              )}
              {productInfo.sale_off > 0 && (
                <div className="text-black bg-yellow-400 py-1 px-1 font-semibold">
                  {productInfo.sale_off * 100}% OFF
                </div>
              )}
            </div>
            <div className="flex justify-start items-center w-full gap-4">
              <div className="quantity-input flex flex-between gap-2 items-center w-fit border-2 border-gray-400 px-2 py-2 rounded-md">
                <button onClick={() => setQuantity(Math.max(1, quantity - 1))}>
                  <FaMinus size={10} color="black" />
                </button>
                <div className="text-center w-12 px-2 text-base">
                  {quantity}
                </div>
                <button
                  onClick={() => setQuantity(Math.min(100, quantity + 1))}
                >
                  <FaPlus size={10} color="black" />
                </button>
              </div>
              <button
                className="add-cart-btn text-white border-2 border-darkSecondary bg-darkSecondary hover:bg-white hover:text-darkSecondary w-fit py-2 px-2 uppercase font-semibold rounded-md ease-linear duration-100"
                onClick={() => handleAddProductToCart()}
              >
                Thêm vào giỏ hàng
              </button>
              <button
                className="buy-now-btn text-white border-2 border-lightSecondary bg-lightSecondary hover:bg-white hover:text-lightSecondary w-fit py-2 px-2 uppercase font-semibold rounded-md ease-linear duration-100"
                onClick={() =>
                  navigate(`/check_out/${productID}?quantity=${quantity}`)
                }
              >
                Mua ngay
              </button>
            </div>
            <div className="product-policy w-full">
              <p className="text-base text-black font-bold mb-3">
                Chính sách cho sản phẩm
              </p>
              <ul className="grid grid-cols-2 text-primary gap-y-2">
                {[
                  "Bảo hành 1 năm",
                  "Miễn phí vận chuyển",
                  "Đảm bảo hoàn tiền 100%",
                  "Dịch vụ hỗ trợ 24/7",
                  "Bảo mật thanh toán",
                ].map((title, index) => (
                  <li
                    key={index}
                    className="flex justify-start items-center gap-2"
                  >
                    <FaThumbsUp />
                    <p className="text-sm text-black">{title}</p>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
        <div className="product-sub-info w-[70%] mx-auto border-2 border-gray-200 rounded-sm py-2 px-8">
          <div className="tabs flex justify-between items-center w-fit gap-3 mx-auto mb-4">
            {(["description", "specs", "ratings"] as Tab[]).map(
              (tab, index) => (
                <button
                  key={index}
                  className={`text-uppercase font-medium text-base py-1 px-1 border-primary cursor-pointer ease-linear duration-150 ${
                    selectedTab === tab ? "border-b-4" : "hover:border-b-2"
                  }`}
                  onClick={() => {
                    setSelectedTab(tab);
                  }}
                >
                  {tabTitlesMap[tab]}
                </button>
              )
            )}
          </div>
          <div className="content mb-2">
            {selectedTab === "description" && (
              <p className="leading-8 align-middle">{productInfo.mo_ta}</p>
            )}

            {selectedTab === "specs" && (
              <table className="w-[60%] mx-auto border-2 border-gray-300 border-collapse rounded-lg shadow-sm">
                <thead className="bg-gray-100 text-left">
                  <tr>
                    <td className="px-4 py-2 border border-gray-300">
                      Chi tiết
                    </td>
                    <td className="px-4 py-2 border border-gray-300">
                      Thông số
                    </td>
                  </tr>
                </thead>
                <tbody>
                  {Object.entries(productSpecs).map(([field, value]) => {
                    if (field === "ma_sp") return <></>;

                    return (
                      <tr key={field} className="even:bg-gray-50">
                        <td className="px-4 py-2 border border-gray-300 font-medium">
                          {fieldTitleMap[field]}
                        </td>
                        <td className="px-4 py-2 border border-gray-300">
                          {value}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}

            {selectedTab === "ratings" && (
              <div className="w-full max-w-2xl mx-auto">
                {productRatings.data.ratings.length > 0 ? (
                  <div className="space-y-4">
                    {productRatings.data.ratings.map((rating, index) => (
                      <div
                        key={index}
                        className="border rounded-xl p-3 shadow-sm bg-white"
                      >
                        {/* Thông tin người đánh giá */}
                        <div className="flex justify-between items-center mb-2">
                          <span className="font-medium text-gray-700">
                            {rating.thanh_vien}
                          </span>
                          <span className="text-xs text-gray-400">
                            {new Date(
                              rating.thoi_diem_danh_gia
                            ).toLocaleDateString("vi-VN")}
                          </span>
                        </div>

                        {/* Điểm đánh giá */}
                        <div className="flex items-center gap-1 mb-2">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <FaStar
                              key={i}
                              size={16}
                              className={
                                i < rating.diem_danh_gia
                                  ? "text-yellow-400"
                                  : "text-gray-300"
                              }
                            />
                          ))}
                          <span className="ml-2 text-sm text-gray-600">
                            {rating.diem_danh_gia}/5
                          </span>
                        </div>

                        {/* Nội dung */}
                        <p className="text-gray-700 text-sm">
                          {rating.noi_dung}
                        </p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center text-gray-500 font-semibold text-lg italic">
                    Chưa có đánh giá
                  </div>
                )}

                {/* Pagination đơn giản */}
                <div className="flex justify-center mt-4 gap-2">
                  {Array.from({
                    length: Math.ceil(
                      productRatings.pagination.total /
                        productRatings.pagination.limit
                    ),
                  }).map((_, i) => (
                    <button
                      key={i}
                      className={`px-3 py-1 rounded-md text-sm ${
                        productRatings.pagination.page === i + 1
                          ? "bg-blue-500 text-white"
                          : "bg-gray-100 hover:bg-gray-200"
                      }`}
                      onClick={() => {
                        setCurrentPage(i + 1);
                      }}
                    >
                      {i + 1}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
        <div className="products flex flex-col mt-8 mb-8 gap-2 text-sm">
          <p className="text-base uppercase font-bold text-black">
            Sản phẩm cùng thương hiệu
          </p>
          <div className="flex justify-start items-center w-full h-full gap-3">
            {sameBrandProducts.map((product) => (
              <button
                key={product.ma_sp}
                className="flex justify-between items-stretch gap-2 w-[24%] border-2 border-gray-400 rounded-md shadow-md py-1 px-2 h-full hover:scale-105 ease-linear duration-150"
                onClick={() => navigate(`/products/${product.ma_sp}`)}
              >
                <img
                  src={product.hinh_anh}
                  alt={product.ten_sp}
                  width={80}
                  height={60}
                />
                <div className="flex flex-col justify-evenly items-start w-full ">
                  <div className="text-sm truncate max-w-[70%]">
                    {product.ten_sp}
                  </div>
                  <div className="text-primary font-semibold">
                    {new Intl.NumberFormat("vi-VN", {
                      style: "currency",
                      currency: "VND",
                    }).format(productInfo.gia_thanh)}
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default ProductDetail;
