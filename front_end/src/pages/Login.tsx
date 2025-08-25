import React, { useState } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { Link, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import api from "../AxiosConfig";

const Login: React.FC = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [adminLogin, setAdminLogin] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      Swal.fire({
        title: "Đang đăng nhập...",
        allowOutsideClick: false,
        didOpen: () => {
          Swal.showLoading();
        },
      });

      const res = await api.post("/auth/login", {
        username,
        password,
        adminLogin,
      });

      if (res.status === 200) {
        localStorage.setItem("token", res.data.accessToken);
        Swal.fire({
          icon: "success",
          title: "Đăng nhập thành công",
          text: "Nhanh chóng đến trang chủ",
          showConfirmButton: false,
        });

        setTimeout(() => {
          Swal.close();
          navigate("/");
        }, 1000);
      }
    } catch (err) {
      console.log(err);
      Swal.fire({
        title: "Đăng nhập thất bại",
        text: "Tài khoản và mật khẩu không đúng",
        timer: 1000,
        showConfirmButton: false,
        icon: "error",
      });
    }
  };
  return (
    <div className="flex flex-col min-h-screen">
      <Header currentPage="none" />
      <div className="flex-1 bg-grayColor border-t-2 border-gray-300 py-4">
        <div className="flex flex-col mx-auto w-[30%] border-2 border-gray-200 rounded-md shadow-lg bg-white py-2">
          <div className="flex justify-between items-center font-semibold px-1">
            <Link
              to={"/login"}
              className="w-1/2 text-center border-primary border-b-4 py-2 ease-linear duration-150"
            >
              Đăng nhập
            </Link>
            <Link
              to={"/sign_up"}
              className="w-1/2 text-center py-2 border-primary hover:border-b-4 ease-linear duration-150"
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
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="rememberMe"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                />
                <label htmlFor="rememberMe">Ghi nhớ tài khoản</label>
              </div>
              <div className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  id="adminLogin"
                  checked={adminLogin}
                  onChange={(e) => setAdminLogin(e.target.checked)}
                />
                <label htmlFor="adminLogin">Đăng nhập cho Admin?</label>
              </div>
            </div>
          </form>
          <button
            className="bg-primary text-white font-semibold py-2 rounded-md my-2 w-1/2 mx-auto hover:bg-darkSecondary uppercase"
            onClick={handleLogin}
          >
            Đăng nhập
          </button>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Login;
