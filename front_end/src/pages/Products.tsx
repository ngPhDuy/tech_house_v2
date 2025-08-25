import React, { useEffect, useState } from "react";
import Header, { type IHeaderProps } from "../components/Header";
import Footer from "../components/Footer";
import axios from "axios";
import { AiOutlineFilter, AiOutlineDown } from "react-icons/ai";
import { Link, useSearchParams } from "react-router-dom";

interface IResponse {
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

interface IPagination {
  total: number;
  page: number;
  limit: number;
}

interface IFilter {
  brand: string[];
  minPrice: string;
  maxPrice: string;
}

type Category =
  | "mobile"
  | "laptop"
  | "tablet"
  | "tai_nghe_bluetooth"
  | "ban_phim"
  | "sac_du_phong"
  | "op_lung"
  | "";

const categoryToPage: Record<Category, IHeaderProps["currentPage"]> = {
  mobile: "mobile",
  laptop: "laptop",
  tablet: "tablet",
  tai_nghe_bluetooth: "accessory",
  ban_phim: "accessory",
  sac_du_phong: "accessory",
  op_lung: "accessory",
  "": "none",
};

const BE_HOST = import.meta.env.VITE_BE_HOST;

const Products: React.FC = () => {
  const [searchParams] = useSearchParams();
  const category = (searchParams.get("category") || "") as Category;
  const searchKey = searchParams.get("search");
  const [products, setProducts] = useState<IResponse[]>([]);
  const [pagination, setPagination] = useState<IPagination>({
    total: 0,
    page: 1,
    limit: 20,
  });
  const [curPage, setCurPage] = useState(1);
  const [order, setOrder] = useState<string>("");
  const [filterOpen, setFilterOpen] = useState<boolean>(false);
  const [filter, setFilter] = useState<IFilter>({
    brand: [],
    minPrice: "",
    maxPrice: "",
  });

  const buildUrl = (page: number, order: string) => {
    const params = new URLSearchParams();

    if (category) params.append("category", category);
    params.append("limit", String(pagination.limit));
    params.append("page", String(page));
    if (order) params.append("sort", order);
    if (searchKey) params.append("search", searchKey);

    // brand là mảng → lặp append
    filter.brand.forEach((b: string) => params.append("brand", b));

    if (filter.minPrice) params.append("min_price", String(filter.minPrice));
    if (filter.maxPrice) params.append("max_price", String(filter.maxPrice));

    return `${BE_HOST}/api/products?${params.toString()}`;
  };

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axios.get(buildUrl(1, order));
        setProducts(res.data.data);
        setPagination(res.data.pagination);
        setCurPage(1);
      } catch (error) {
        console.error(error);
      }
    };
    fetchProducts();
  }, [category, order, filter, searchKey]);

  console.log(order);

  const handleGetMore = async () => {
    if (products.length >= pagination.total) return;
    try {
      const res = await axios.get(buildUrl(curPage + 1, order));
      setProducts((prev) => [...prev, ...res.data.data]);
      setCurPage((prev) => prev + 1);
    } catch (error) {
      console.error(error);
    }
  };

  const handleApplyFilter = (newFilter: IFilter) => {
    setFilter(newFilter);
    setFilterOpen(false);
  };

  console.log(filter);

  return (
    <div className="flex flex-col min-h-screen">
      <Header currentPage={categoryToPage[category]} />
      <div className="w-full text-sm relative flex-1">
        <div className="flex flex-col gap-3 my-4 px-5">
          <div className="flex justify-between items-center">
            <button
              className="flex justify-evenly items-center gap-2 border border-gray-300 px-2 py-2 rounded-md hover:bg-gray-200"
              onClick={() => setFilterOpen(true)}
            >
              <AiOutlineFilter size={22} />
              <p className="font-semibold">Bộ lọc</p>
            </button>
            <div className="flex justify-evenly items-center gap-2">
              <label htmlFor="order">Sắp xếp theo:</label>
              <select
                name="order"
                id="order"
                onChange={(e) => setOrder(e.target.value)}
                className="border border-gray-200 py-2 px-1 rounded cursor-pointer focus:outline-none"
              >
                <option value="">Mặc định</option>
                <option value="price_desc">Giá giảm dần</option>
                <option value="price_asc">Giá tăng dần</option>
                <option value="name_desc">Tên giảm dần</option>
                <option value="name_asc">Tên tăng dần</option>
              </select>
            </div>
          </div>
          <div className="w-full text-right">
            Đã tìm thấy <span className="font-bold">{pagination.total} </span>{" "}
            kết quả
          </div>
          {products.length > 0 && (
            <div className="products grid grid-cols-[repeat(auto-fit,minmax(210px,230px))] gap-3 mb-2">
              {products.map((product) => (
                <Link
                  to={`/products/${product.ma_sp}`}
                  key={product.ma_sp}
                  className="product h-auto text-sm flex flex-col justify-evenly items-start gap-1 border-2 border-grayColor py-2 px-2 rounded-2xl shadow-lg hover:scale-110 transition duration-300 ease-in-out"
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
                  <div className="font-semibold text-primary">
                    {new Intl.NumberFormat("vi-VN", {
                      style: "currency",
                      currency: "VND",
                    }).format(product.gia_thanh * (1 - product.sale_off))}
                  </div>

                  {product.diem_danh_gia > 0 ? (
                    <div className="flex justify-start items-center gap-1">
                      <span>{product.diem_danh_gia}</span> <span>⭐</span>
                    </div>
                  ) : (
                    <div className="text-gray-500 font-semibold italic">
                      Chưa có đánh giá
                    </div>
                  )}
                </Link>
              ))}
            </div>
          )}
          {products.length === 0 && (
            <div className="text-base font-semibold text-gray-600 w-full text-center px-2 py-1 italic">
              Không tìm thấy kết quả nào
            </div>
          )}
          {products.length < pagination.total && (
            <button
              className="get-more cursor-pointer text-primary flex justify-evenly items-center gap-2 w-fit px-2 py-2 bg-white font-semibold border-2 border-primary rounded-md shadow-md mx-auto hover:bg-primary hover:text-white  ease-linear duration-150"
              onClick={() => handleGetMore()}
            >
              <span className="font-semibold">Xem thêm sản phẩm</span>
              <AiOutlineDown />
            </button>
          )}
        </div>
        <FilterModal
          isOpen={filterOpen}
          onClose={() => setFilterOpen(false)}
          filter={filter}
          onApply={handleApplyFilter}
        />
      </div>

      <Footer />
    </div>
  );
};

interface FilterModalProps {
  isOpen: boolean;
  onClose: () => void;
  filter: IFilter;
  onApply: (filter: IFilter) => void;
}

const FilterModal = ({
  isOpen,
  onClose,
  filter,
  onApply,
}: FilterModalProps) => {
  const [localFilter, setLocalFilter] = useState<IFilter>(filter);

  useEffect(() => {
    setLocalFilter(filter);
  }, [filter]);

  if (!isOpen) return null;
  const priceRanges = [
    { label: "Tất cả", min: "", max: "" },
    { label: "0 - 10tr", min: "0", max: "10000000" },
    { label: "10 - 20tr", min: "10000000", max: "20000000" },
    { label: "20 - 30tr", min: "20000000", max: "30000000" },
    { label: "30 - 40tr", min: "30000000", max: "40000000" },
    { label: "40 - 50tr", min: "40000000", max: "50000000" },
    { label: "> 50tr", min: "50000000", max: "" },
  ];

  const handleBrandChange = (newBrand: string) => {
    setLocalFilter((prev) => ({
      ...prev,
      brand: localFilter.brand.includes(newBrand)
        ? prev.brand.filter((b) => b !== newBrand)
        : [...prev.brand, newBrand],
    }));
  };

  const handlePriceChange = (newMinPrice: string, newMaxPrice: string) => {
    setLocalFilter((prev) => ({
      ...prev,
      minPrice: newMinPrice,
      maxPrice: newMaxPrice,
    }));
  };

  console.log(localFilter);

  return (
    <div
      className="fixed inset-0 z-50 w-screen h-screen bg-black bg-opacity-50 flex justify-center items-center"
      onClick={() => onClose()}
    >
      <div
        className="filter w-[50%] bg-white rounded-md shadow-md flex flex-col p-2"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-center items-center gap-4 p-2">
          <div className="brand w-1/2">
            <h3 className="font-semibold uppercase mb-4">Hãng sản xuất</h3>
            <div className="brands grid grid-cols-[repeat(auto-fit,minmax(100px,1fr))] gap-3">
              {[
                "Apple",
                "Samsung",
                "Google",
                "Oppo",
                "Huawei",
                "Dell",
                "Sony",
                "HP",
                "LG",
              ].map((brand, index) => (
                <label
                  key={index}
                  className="flex items-center gap-1 cursor-pointer"
                >
                  <input
                    type="checkbox"
                    checked={localFilter.brand.includes(brand)}
                    onChange={() => handleBrandChange(brand)}
                  />
                  <span>{brand}</span>
                </label>
              ))}
            </div>
          </div>
          <div className="price w-1/2">
            <h3 className="font-semibold uppercase mb-4">Mức giá</h3>
            <div className="prices grid grid-cols-[repeat(auto-fit,minmax(100px,1fr))] gap-3">
              {priceRanges.map((item, index) => (
                <label
                  key={index}
                  className="flex items-center gap-1 cursor-pointer"
                >
                  <input
                    type="radio"
                    onChange={() => handlePriceChange(item.min, item.max)}
                    name="price"
                    checked={
                      localFilter.minPrice === item.min &&
                      localFilter.maxPrice === item.max
                    }
                  />
                  <span>{item.label}</span>
                </label>
              ))}
            </div>
          </div>
        </div>
        <button
          className="font-semibold uppercase px-2 py-2 border-2 border-darkSecondary text-white bg-darkSecondary rounded shadow w-40 mx-auto my-2 hover:text-darkSecondary hover:bg-white ease-linear duration-150"
          onClick={() => onApply(localFilter)}
        >
          Áp dụng
        </button>
      </div>
    </div>
  );
};

export default Products;
