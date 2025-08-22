import React from "react";
import { ImHeadphones } from "react-icons/im";

const Footer: React.FC = () => {
  return (
    <div className="w-full flex flex-col bg-primary py-2 gap-2">
      <div className="flex justify-between items-start px-4 text-white">
        <div className="w-1/3 flex flex-col gap-4 items-center">
          <p className="font-semibold text-lg">Tổng đài hỗ trợ</p>
          <ul className="text-sm flex flex-col gap-2">
            <li className="flex flex-col">
              <div className="flex gap-2 items-center">
                <ImHeadphones />
                <p>Gọi mua:</p>
              </div>
              <p>Hotline: 1900 1234 (08:00 - 22:00)</p>
            </li>
            <li className="flex flex-col">
              <div className="flex gap-2 items-center">
                <ImHeadphones />
                <p>Bảo hành:</p>
              </div>
              <p>Hotline: 1900 1234 (08:00 - 22:00)</p>
            </li>
            <li className="flex flex-col">
              <div className="flex gap-2 items-center">
                <ImHeadphones />
                <p>Khiếu nại:</p>
              </div>
              <p>Hotline: 1900 1234 (08:00 - 22:00)</p>
            </li>
          </ul>
        </div>
        <div className="w-1/3 flex flex-col gap-2 items-center">
          <p className="font-semibold text-lg border-b-2 border-white w-fit">
            Danh mục sản phẩm
          </p>
          <ul className="text-sm flex flex-col gap-1 list-disc text-white pl-4 ">
            <li>
              <a href="#">Điện thoại</a>
            </li>
            <li>
              <a href="#">Laptop</a>
            </li>
            <li>
              <a href="#">Máy tính bảng</a>
            </li>
            <li>
              <a href="#">Sạc dự phòng</a>
            </li>
            <li>
              <a href="#">Bàn phím</a>
            </li>
            <li>
              <a href="#">Tai nghe bluetooth</a>
            </li>
            <li>
              <a href="#">Bao da, ốp lưng</a>
            </li>
          </ul>
        </div>
        <div className="w-1/3 flex flex-col gap-2 items-center">
          <p className="font-semibold text-lg border-b-2 border-white w-fit">
            Các thông tin khác
          </p>
          <ul className="text-sm flex flex-col gap-1 list-disc text-white pl-4">
            <li>
              <a href="#">Giới thiệu công ty</a>
            </li>
            <li>
              <a href="#">Chính sách đổi trả</a>
            </li>
            <li>
              <a href="#">Góp ý, khiếu nại</a>
            </li>
          </ul>
        </div>
      </div>
      <div className="text-white w-full text-center text-sm">
        © 2025 All rights reserved. Reliance Retail Ltd.
      </div>
    </div>
  );
};

export default Footer;
