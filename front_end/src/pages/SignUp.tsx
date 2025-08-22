import React, { useState } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { Link } from "react-router-dom";

const SignUp: React.FC = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [rePassword, setRePassword] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");

  return (
    <div className="flex flex-col min-h-screen">
      <Header currentPage="none" />
      <div className="flex-1 bg-grayColor border-t-2 border-gray-300 py-4">
        <div className="flex flex-col mx-auto w-[30%] border-2 border-gray-200 rounded-md shadow-lg bg-white py-2">
          <div className="flex justify-between items-center font-semibold px-1">
            <Link
              to={"/login"}
              className="w-1/2 text-center hover:border-b-4 border-primary py-2 ease-linear duration-150"
            >
              Đăng nhập
            </Link>
            <Link
              to={"/sign_up"}
              className="w-1/2 text-center py-2 border-primary border-b-4 ease-linear duration-150"
            >
              Đăng ký
            </Link>
          </div>
          <form className="px-5 flex flex-col gap-4 py-2 my-2 text-sm">
            <div className="flex flex-col gap-1">
              <label
                htmlFor="username"
                className="block text-black font-semibold"
              >
                Tên đăng nhập:
              </label>
              <input
                type="text"
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Tên đăng nhập"
                className="border-2 border-gray-300 rounded-md w-full py-1 px-2 focus:outline-none"
              />
            </div>
            <div className="flex flex-col gap-1">
              <label
                htmlFor="phoneNumber"
                className="block text-black font-semibold"
              >
                Số điện thoại:
              </label>
              <input
                type="phone"
                id="phoneNumber"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                placeholder="Số điện thoại"
                className="border-2 border-gray-300 rounded-md w-full py-1 px-2 focus:outline-none"
              />
            </div>
            <div className="flex flex-col gap-1">
              <label
                htmlFor="password"
                className="block text-black font-semibold"
              >
                Mật khẩu:
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Mật khẩu"
                className="border-2 border-gray-300 rounded-md w-full py-1 px-2 focus:outline-none"
              />
            </div>
            <div className="flex flex-col gap-1">
              <label
                htmlFor="rePassword"
                className="block text-black font-semibold"
              >
                Xác nhận mật khẩu:
              </label>
              <input
                type="password"
                id="rePassword"
                value={rePassword}
                onChange={(e) => setRePassword(e.target.value)}
                placeholder="Xác nhận mật khẩu"
                className="border-2 border-gray-300 rounded-md w-full py-1 px-2 focus:outline-none"
              />
            </div>
          </form>
          <button className="bg-primary text-white font-semibold py-2 rounded-md my-2 w-1/2 mx-auto hover:bg-darkSecondary uppercase">
            Tạo tài khoản
          </button>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default SignUp;
