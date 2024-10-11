import React from "react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <div>
      <footer class="bg-white rounded-lg shadow m-4 border-2 ">
        <div class="w-full max-w-screen-xl mx-auto p-4 md:py-8">
          <div class="sm:flex sm:items-center sm:justify-between">
              <Link
                to="/"
                class="flex items-center mb-4 sm:mb-0 ml-14 space-x-3 rtl:space-x-reverse "
              >
                <img
                  src="/images/attendifylogo2.png"
                  alt="attendify"
                  className="h-14 w-30"
                />
              </Link>
            <ul class="flex flex-wrap ml-2 items-center mb-6 text-sm font-medium text-black sm:mb-0 ">
              <li>
                <Link to="#" class="hover:underline me-4 md:me-6">
                  About
                </Link>
              </li>
              <li>
                <Link to="#" class="hover:underline me-4 md:me-6">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="#" class="hover:underline me-4 md:me-6">
                  Licensing
                </Link>
              </li>
              <li>
                <Link to="#" class="hover:underline">
                  Contact
                </Link>
              </li>
            </ul>
          </div>
          <hr class="my-6 border-gray-200 sm:mx-auto dark:border-gray-700 lg:my-8" />

          <span class="block text-sm ml-2 text-gray-500 sm:text-center dark:text-gray-400 ">
            © 2024{" "}
            <Link to="#" class="hover:underline">
              attendify™
            </Link>
            . All Rights Reserved.
          </span>
        </div>
      </footer>
    </div>
  );
};

export default Footer;
