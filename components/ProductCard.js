"use client";
import React, { useState, useEffect } from "react";
import product1 from "../public/assets/product1.jpg";
import Image from "next/image";
import Link from "next/link";
import { FaShoppingCart } from "react-icons/fa";
import { addselectedProduct } from "../redux/slices/productSlice";
import { addcartProducts } from "../redux/slices/cartSlice";
import { useDispatch } from "react-redux";
import Toast from "./Toast";

const ProductCard = ({
  productTitle,
  productImage,
  productDescription,
  productPrice,
  productID,
  productDiscount,
  productRating,
  productBrand,
  productCategory,
  productStock,
  productImages,
}) => {
  const dispatch = useDispatch();
  const [cartProducts, setCartProducts] = useState();
  const [showToast, setShowToast] = useState(false);
  const handleSeeDetailsClick = () => {
    dispatch(
      addselectedProduct({
        productTitle,
        productImage,
        productDescription,
        productPrice,
        productID,
        productDiscount,
        productRating,
        productBrand,
        productCategory,
        productStock,
        productImages,
      })
    );
  };

  function AddToCart() {
    console.log("working");
    dispatch(
      addcartProducts({
        productID,
        productTitle,
        productImage,
        productDescription,
        productPrice,
        productRating,
        productBrand,
        productDiscount,
        productStock,
        productImages,
        productCategory,
      })
    );
    setShowToast(true);
    setTimeout(() => {
      setShowToast(false);
    }, 3000);
  }

  return (
    <div>
      <div className="card lg:w-70 md:w-50 sm:w-30  bg-neutral text-neutral-content shadow-xl p-2 m-2">
        <figure>
          {productImage ? (
            <img
              src={productImage}
              alt="Watch"
              className="object-cover h-[250px]"
            />
          ) : (
            <Image
              src={product1}
              alt="Watch"
              className="object-cover h-[250px]"
            />
          )}
        </figure>
        <div className="card-body p-2">
          <h2 className="card-title text-base h-10">{productTitle}</h2>
          {productDiscount ? (
            <p>
              <span className="line-through decoration-red-500">
                {productPrice}$
              </span>{" "}
              {`$${(
                productPrice -
                (productPrice * productDiscount) / 100
              ).toFixed(2)}`}{" "}
            </p>
          ) : (
            <p>{productPrice}$</p>
          )}
          <div className="h-20">
            {" "}
            <p className="text-sm">{productDescription}</p>
          </div>
          <div className="card-actions ">
            <Link
              href={`/ProductDetail/${productID + productTitle}`}
              className="btn btn-active btn-sm w-full"
            >
              <button
                className="btn btn-active btn-xs w-full"
                onClick={handleSeeDetailsClick}
              >
                See Details
              </button>
            </Link>
            <a
              
              onClick={AddToCart}
               className="btn btn-active btn-sm w-full"
            >
              <button className="btn btn-active btn-xs">
                <FaShoppingCart fontSize={20} onClick={AddToCart} />
                Add to Cart
              </button>
            </a>
          </div>
        </div>
      </div>
      {showToast && <Toast />}
    </div>
  );
};

export default ProductCard;
