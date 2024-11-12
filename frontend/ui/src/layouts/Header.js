import React, { useState } from "react";
import { Link } from "react-router-dom";
import { RxHamburgerMenu } from "react-icons/rx";
import { IoCloseOutline } from "react-icons/io5";

const Header = () => {
  const [isMenuOpen, setMenuOpen] = useState(false);

  const handleMenuClick = () => {
    setMenuOpen(false); // Close the menu when a link is clicked
  };

  return (
    <>
      <div className="fixed top-0 left-0 w-full z-10">
        <nav className="py-5 mb-5 bg-white transition-all duration-500 shadow-md shadow-indigo-300">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="w-full flex flex-col lg:flex-row">
              <div className="flex justify-between lg:flex-row">
                <Link to="/" className="flex items-center">
                  <img
                    src="/images/attendifylogo2.png"
                    alt="attendify"
                    className="h-14 w-30"
                  />
                </Link>

                {/* Burger Menu */}
                {isMenuOpen ? (
                  <button
                    data-collapse-toggle="navbar"
                    type="button"
                    className="inline-flex items-center p-2 ml-3 text-sm text-gray-500 rounded-lg lg:hidden focus:outline-none focus:ring-2 focus:ring-gray-200"
                    aria-controls="navbar-default"
                    aria-expanded="false"
                    onClick={() => {
                      setMenuOpen(false);
                    }}
                  >
                    <IoCloseOutline size={25} />
                  </button>
                ) : (
                  <button
                    data-collapse-toggle="navbar"
                    type="button"
                    className="inline-flex items-center p-2 ml-3 text-sm text-gray-500 rounded-lg lg:hidden focus:outline-none focus:ring-2 focus:ring-gray-200"
                    aria-controls="navbar-default"
                    aria-expanded="false"
                    onClick={() => {
                      setMenuOpen(true);
                    }}
                  >
                    <RxHamburgerMenu size={25} />
                  </button>
                )}
              </div>

              <div
                className={`w-full lg:flex text-center lg:pl-11 max-lg:py-4 ${
                  isMenuOpen ? "block" : "hidden"
                }`}
                id="navbar"
              >
                <ul className="flex lg:items-center flex-col max-lg:gap-4 mt-4 lg:mt-0 lg:flex-row max-lg:mb-4">
                  <li>
                    <Link
                      to="/"
                      className="text-gray-500 text-base lg:text-base font-medium hover:text-indigo-700 transition-all duration-500 mb-2 block lg:mr-6 md:mb-0 lg:text-left"
                      onClick={handleMenuClick}
                    >
                      Home
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/takeattendance"
                      className="text-gray-500 text-base lg:text-base font-medium hover:text-indigo-700 transition-all duration-500 mb-2 block lg:mr-6 md:mb-0 lg:text-left"
                      onClick={handleMenuClick}
                    >
                      Take Attendance
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/addStudent"
                      className="text-gray-500 text-base lg:text-base font-medium hover:text-indigo-700 transition-all duration-500 mb-2 block lg:mr-6 md:mb-0 lg:text-left"
                      onClick={handleMenuClick}
                    >
                      Add Student
                    </Link>
                  </li>
                </ul>
                <div className="flex lg:items-center justify-start flex-col lg:flex-row max-lg:gap-4 lg:flex-1 lg:justify-end">
                  <button className="bg-indigo-50 text-indigo-600 rounded-full cursor-pointer font-semibold text-center shadow-xs transition-all duration-500 py-3 px-6 text-sm hover:bg-indigo-100">
                    Login
                  </button>
                  <button className="bg-indigo-600 text-white rounded-full cursor-pointer font-semibold text-center shadow-xs transition-all duration-500 py-3 px-6 text-sm lg:ml-5 hover:bg-indigo-700">
                    Sign up
                  </button>
                </div>
              </div>
            </div>
          </div>
        </nav>
      </div>

      <div className="pt-28"> </div>
    </>
  );
};

export default Header;