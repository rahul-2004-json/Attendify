import React from "react";
import { Link } from "react-router-dom";

const Home = () => {
  return (
    <div className="rounded-2xl bg-indigo-50 py-10 overflow-hidden m-5 lg:m-0 2xl:py-16 xl:py-8  lg:rounded-tl-2xl lg:rounded-bl-2xl ">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-14 items-center lg:grid-cols-12 lg:gap32">
          <div className="w-full xl:col-span-5 lg:col-span-6 2xl:-mx-5 xl:-mx-0">
            <h1 className="py-8 text-center text-gray-900 font-bold font-manrope text-5xl lg:text-left leading-[70px]">
              Taking attendance got easier with{"  "}
              <span className="text-indigo-600">attendify </span>
            </h1>
            <p className=" text-gray-500 text-lg text-center lg:text-left">
              Quickly take attendance of a class with the power of attendify in
              your mobile device!
            </p>
            <Link to={"/takeattendance"}>
              <button className="bg-indigo-600 mt-8 rounded-full py-3 px-7 text-base font-semibold text-white hover:bg-indigo-700 cursor-pointer transition-all duration-500 md:w-fit w-full">
                Get Started
              </button>
            </Link>
          </div>
          <div className="w-full xl:col-span-7  lg:col-span-6 block pt-18">
            <div className="w-full  sm:w-auto lg:w-[60.8125rem] xl:ml-16">
              <img
                src="/images/hero.png"
                alt="dashboardImage"
                className="rounded-lg object-cover mt-5 md:mt-20"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
