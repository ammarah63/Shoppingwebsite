import Link from "next/link";
import React from "react";
import {
  FaFacebookSquare,
  FaInstagramSquare,
  FaShoppingCart,
} from "react-icons/fa";
import { FaSquareXTwitter } from "react-icons/fa6";

const Header = () => {
  return (
    <>
      <div className="navbar bg-neutral text-neutral-content">
        <div className="navbar-start">
          <Link href="/" className="btn btn-ghost text-xl">
            My Store
          </Link>
        </div>
        <div className="navbar-center hidden lg:flex">
          <p className="text-sm font-bold">
            Shipping Worldwide | Free shipping over 5000Rs purchase
          </p>
        </div>
        <div className="navbar-end">
          <button className="btn-sm m-1">
            <FaFacebookSquare fontSize={20} />
          </button>
          <button className="btn-sm m-1">
            <FaInstagramSquare fontSize={20} />
          </button>
          <button className="btn-sm m-1">
            <FaSquareXTwitter fontSize={20} />
          </button>
        </div>
      </div>
      <hr />
      <div className="navbar bg-neutral text-neutral-content border-t-3 border-white">
        <div className="navbar-start">
          <div className="dropdown">
            <div tabIndex={0} role="button" className="btn btn-ghost lg:hidden">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h8m-8 6h16"
                />
              </svg>
            </div>
            <ul
              tabIndex={0}
              className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52"
            >
              <li>
                <Link href="/">Home</Link>
              </li>
              <li>
                <Link href="/server/shop">Shop</Link>
              </li>
              <li>
                <Link href="/Sale">Sale</Link>
              </li>
            </ul>
          </div>
        </div>
        <div className="navbar-center hidden lg:flex">
          <ul className="menu menu-horizontal px-1">
            <li>
              <Link href="/">Home</Link>
            </li>
            <li>
              <Link href="/server/shop">Shop</Link>
            </li>
            <li>
              <Link href="/Sale">Sale</Link>
            </li>
          </ul>
        </div>
        <div className="navbar-end">
          {" "}
          <button className="btn-sm m-1 me-5 ">
            <FaShoppingCart fontSize={20} />
          </button>
        </div>
      </div>
    </>
  );
};

export default Header;
