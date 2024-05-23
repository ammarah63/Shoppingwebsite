import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  FaFacebookSquare,
  FaInstagramSquare,
  FaShoppingCart,
} from "react-icons/fa";
import { useRouter } from "next/router";
import { FaSquareXTwitter } from "react-icons/fa6";
import { FaUser } from "react-icons/fa";
import { signOut } from "firebase/auth";
import { useSelector, useDispatch } from "react-redux";
import { auth } from "@/firebaseConfig";
import { clearUser } from "@/redux/slices/authSlice";
import { clearCart } from "@/redux/slices/cartSlice";

const Header = () => {
  const [cartNo, setCartNo] = useState(0);
  const dispatch = useDispatch();
  const productData = useSelector((data) => data.cart.cartProducts);
  const user = useSelector((state) => state.auth.user);
  const router = useRouter();

  useEffect(() => {
    if(productData){
      const uniqueProductIDs = new Set();
      productData.forEach((product) => {
        uniqueProductIDs.add(product.data.productID);
      });

      setCartNo(uniqueProductIDs.size);
    }
  }, [productData]);

  const logout = async () => {
    try {
      await signOut(auth);
      dispatch(clearUser());
      dispatch(clearCart());
      console.log("User logged out successfully");
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  const handleLogout = async () => {
    await logout();
    router.push("/login");
  };

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
            Shipping Worldwide | Free shipping over 500$ purchase
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
                <Link href="/shop">Shop</Link>
              </li>
              <li>
                <Link href="/sale">Sale</Link>
              </li>
            </ul>
          </div>
        </div>
        <div className="navbar-center hidden lg:flex">
          <ul className="menu menu-horizontal px-1">
            <li>
              <Link href="/" className="link link-hover">
                Home
              </Link>
            </li>
            <li>
              <Link href="/shop" className="link link-hover">
                Shop
              </Link>
            </li>
            <li>
              <Link href="/sale" className="link link-hover">
                Sale
              </Link>
            </li>
          </ul>
        </div>
        <div className="navbar-end divide-x-2 divide-slate-400/25">
          <Link href="/cart">
            <button className="btn-sm m-1 me-5 relative">
              <div className="top-0 absolute left-10 right-0">
                <p className="flex h-1 w-1 items-center justify-center rounded-full bg-red-500 p-3 text-xs text-white">
                  {cartNo}
                </p>
              </div>
              <FaShoppingCart fontSize={30} className="mt-4" />
            </button>
          </Link>
          {user ? (
            <>
              <div className="dropdown">
                <div tabIndex={0} role="button" className="btn btn-ghost">
                  <p> {user.displayName}</p>
                </div>
                <ul
                  tabIndex={0}
                  className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 text-neutral rounded-box w-52"
                >
                  <li>
                    <Link href="/login">Profile</Link>
                  </li>
                  <li>
                    <button onClick={handleLogout}>Logout</button>
                  </li>
                </ul>
              </div>
              {/* <Link href="/login" className="link link-hover">
                <button className="flex btn-sm m-1 me-5 relative text-xl">
                  {user.displayName}
                </button>
              </Link>
            
              <Link href="/login" className="link link-hover">
                
                <button className="flex btn-sm m-1 me-5 relative text-xl">
                 {user.displayName}
                  
                </button>
              
              </Link> */}
            </>
          ) : (
            <Link href="/login" className="link link-hover">
              <button className="flex btn-sm m-1 me-5 relative text-xl">
                <FaUser className="mx-2 mt-1" /> Login
              </button>
            </Link>
          )}
        </div>
      </div>
    </>
  );
};

export default Header;
