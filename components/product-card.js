"use client";
import React, { useState, useEffect } from "react";
import product1 from "../public/assets/product1.jpg";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { FaShoppingCart } from "react-icons/fa";
import { addselectedProduct } from "../redux/slices/productSlice";
import { addcartProducts } from "../redux/slices/cartSlice";
import { useDispatch, useSelector } from "react-redux";
import Toast from "./Toast";
import { useTranslation } from "react-i18next";

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
  const [quantity, setQuantity] = useState(1);
  const [showToast, setShowToast] = useState(false);
  const router = useRouter();
  const user = useSelector((state) => state.auth.user);
 const { t } = useTranslation("common");

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
    if (user) {
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
          quantity,
        })
      );
      setShowToast(true);
      setTimeout(() => {
        setShowToast(false);
      }, 3000);
    } else {
      router.push("/login");
    }
  }
  const truncateDescription = (description, wordLimit) => {
    const words = description.split(" ");
    if (words.length > wordLimit) {
      return words.slice(0, wordLimit).join(" ") + "...";
    }
    return description;
  };
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
            <p className="text-sm">
              {" "}
              {truncateDescription(productDescription, 15)}
              {/* {productDescription} */}
            </p>
          </div>
          <div className="card-actions ">
            <Link
              href={`/products/${productID+productTitle}`}
              className="btn btn-active btn-sm w-full"
            >
              <button
                className="btn btn-active btn-xs w-full"
                onClick={handleSeeDetailsClick}
              >
            {t("seeDetails")}
              </button>
            </Link>
            <a onClick={AddToCart} className="btn btn-active btn-sm w-full">
              <button className="btn btn-active btn-xs">
                <FaShoppingCart fontSize={20} onClick={AddToCart} />
                {t("addToCart")}
              </button>
            </a>
            {user ? (
              <></>
            ) : (
              <>
                <p className="text-xs text-center"> {t("loginToAdd")}</p>
              </>
            )}
          </div>
        </div>
      </div>
      {showToast && <Toast message={t("productAddedToCart")} />}
    </div>
  );
};

export default ProductCard;
