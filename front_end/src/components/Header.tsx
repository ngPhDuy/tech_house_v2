import React, { useEffect, useState } from "react";
import { FaSearch, FaRegUser, FaRegHeart } from "react-icons/fa";
import {
  AiOutlineHome,
  AiOutlineMobile,
  AiOutlineTablet,
  AiOutlineLaptop,
  AiOutlineProduct,
  AiOutlineDown,
} from "react-icons/ai";
import { Link, useNavigate } from "react-router-dom";
import api from "../AxiosConfig";

export interface IHeaderProps {
  currentPage: "none" | "home" | "mobile" | "tablet" | "laptop" | "accessory";
}

const iconMap = {
  home: <AiOutlineHome />,
  mobile: <AiOutlineMobile />,
  tablet: <AiOutlineTablet />,
  laptop: <AiOutlineLaptop />,
  accessory: <AiOutlineProduct />,
};

const titleMap = {
  home: "Trang chủ",
  mobile: "Điện thoại",
  tablet: "Máy tính bảng",
  laptop: "Laptop",
  accessory: "Phụ kiện",
};

const urlMap = {
  home: "/",
  mobile: "/products?category=mobile",
  tablet: "/products?category=tablet",
  laptop: "/products?category=laptop",
  accessory: "/products?category=tai_nghe_bluetooth",
};
const Header: React.FC<IHeaderProps> = (props) => {
  const { currentPage = "none" } = props;
  const [searchKey, setSearchKey] = useState<string>("");
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const userID = token ? JSON.parse(atob(token.split(".")[1])).userID : null;

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && searchKey.trim() !== "") {
      navigate(`/products?search=${encodeURIComponent(searchKey)}`);
    }
  };

  const handleLogout = () => {
    api
      .post("/auth/logout", {})
      .then(() => {
        localStorage.removeItem("token");
        navigate("/login");
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <header className="w-ful">
      <div className="flex justify-between items-center px-4 py-3 bg-primary">
        <div className="text-white text-3xl font-bold">Tech House</div>
        <div className="flex justify-between items-center rounded-md bg-grayColor py-1 px-3 w-8/12">
          <input
            type="text"
            placeholder="Tìm kiếm sản phẩm"
            className="bg-grayColor w-full focus:outline-none"
            onChange={(e) => setSearchKey(e.target.value)}
            onKeyDown={handleKeyDown}
          />
          <FaSearch
            size={20}
            color="gray"
            className="cursor-pointer"
            onClick={() => {
              searchKey.trim() !== "" &&
                navigate(`/products?search=${encodeURIComponent(searchKey)}`);
            }}
          />
        </div>
        <div className="flex justify-between items-center gap-4 text-white font-semibold">
          {!token && (
            <Link
              to="/login"
              className="flex justify-between items-center gap-1 hover:text-primary hover:bg-white hover:scale-105 hover:shadow-md hover:rounded-md hover:py-1 hover:px-2 ease-in-out duration-150"
            >
              <FaRegUser />
              <p>Đăng nhập</p>
            </Link>
          )}
          {token && (
            <div className="group relative flex flex-col ease-in-out duration-150 cursor-pointer">
              <div className="w-full flex justify-between items-center gap-1">
                <FaRegUser />
                <p>{userID}</p>
              </div>

              <div className="absolute left-0 top-full hidden group-hover:block w-48 bg-white rounded-md shadow-lg z-50">
                <ul className="flex flex-col gap-2 text-black">
                  <li className="px-4 py-2 hover:bg-primary hover:text-white">
                    <button>Thông tin cá nhân</button>
                  </li>

                  <li className="px-4 py-2 hover:bg-primary hover:text-white">
                    <button>Giỏ hàng</button>
                  </li>

                  <li className="px-4 py-2 hover:bg-primary hover:text-white">
                    <button>Lịch sử mua hàng</button>
                  </li>

                  <li
                    className="px-4 py-2 hover:bg-primary hover:text-white"
                    onClick={handleLogout}
                  >
                    <button>Đăng xuất</button>
                  </li>
                </ul>
              </div>
            </div>
          )}
          <button className="flex justify-between items-center gap-1 hover:text-primary hover:bg-white hover:scale-105 hover:shadow-md hover:rounded-md hover:py-1 hover:px-2 ease-in-out duration-150">
            <FaRegHeart />
            <p>Yêu thích</p>
          </button>
        </div>
      </div>
      <div className="flex justify-start items-center bg-white w-full px-4 py-2 text-black gap-4">
        {(Object.keys(titleMap) as Array<keyof typeof titleMap>).map((key) =>
          key === "accessory" ? (
            <div
              key={key}
              className="group relative cursor-pointer flex justify-between items-center gap-1 font-medium bg-[#F3F9FB] py-2 px-4 rounded-xl hover:bg-primary hover:text-white"
            >
              <Link
                to={urlMap[key]}
                className="flex justify-start items-center w-full gap-1"
              >
                {iconMap[key]}
                <p>{titleMap[key]}</p>
                <AiOutlineDown size={15} className="ml-2" />
              </Link>

              {/* Menu con */}
              <div className="absolute left-0 top-full hidden w-48 bg-white rounded-md shadow-lg group-hover:block z-50">
                <ul className="flex flex-col gap-2 text-black">
                  <li className="px-4 py-2 hover:bg-primary hover:text-white">
                    <Link to="/products?category=tai_nghe_bluetooth">
                      Tai nghe Bluetooth
                    </Link>
                  </li>
                  <li className="px-4 py-2 hover:bg-primary hover:text-white">
                    <Link to="/products?category=ban_phim">Bàn phím</Link>
                  </li>
                  <li className="px-4 py-2 hover:bg-primary hover:text-white">
                    <Link to="/products?category=sac_du_phong">
                      Sạc dự phòng
                    </Link>
                  </li>
                  <li className="px-4 py-2 hover:bg-primary hover:text-white">
                    <Link to="/products?category=op_lung">Ốp lưng</Link>
                  </li>
                </ul>
              </div>
            </div>
          ) : (
            <Link
              to={urlMap[key]}
              key={key}
              className={`flex justify-between items-center gap-1 font-medium py-2 px-4 rounded-xl hover:bg-primary hover:text-white ${
                currentPage === key ? "bg-primary text-white" : "bg-[#F3F9FB]"
              }`}
            >
              {iconMap[key]}
              <p>{titleMap[key]}</p>
            </Link>
          )
        )}
      </div>
    </header>
  );
};

export default Header;
