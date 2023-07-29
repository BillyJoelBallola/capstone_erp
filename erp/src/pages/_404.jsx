import React from "react";
import { Link } from "react-router-dom";

const _404 = () => {
  return (
    <div className="w-screen h-screen grid place-items-center">
      <div className="flex flex-col gap-2 items-center text-center text-darker">
        <div className="relative">
          <span className="text-9xl font-bold text-blue-400">404</span>
          <span className="text-9xl font-bold absolute left-[50%] top-[50%] translate-y-[-50%] translate-x-[-52%]">404</span>
        </div>
        <span className="text-lg font-bold">PAGE NOT FOUND</span>
        <Link to="/" className="mt-4 border-2 border-[#212121] max-w-min px-2 font-semibold hover:bg-darker hover:text-white duration-100 ease-in-out">
          HOME
        </Link>
      </div>
    </div>
  );
};

export default _404;