import React from "react";
import product1 from "../assets/product1.jpg";
import Image from "next/image";
import Link from "next/link";
import { FaShoppingCart } from "react-icons/fa";

const ProductCard = ({
  props,
  product,
  productTitle,
  productImage,
  productDescription,
  productPrice,
  productID,
}) => {
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
          <p>{productPrice}$</p>
          <div className="h-20">
            {" "}
            <p className="text-sm">{productDescription}</p>
          </div>
          <div className="card-actions ">
            <Link
              href={{
                pathname: "/ProductDetail",
                query: {
                  productID: productID,
                  productTitle: productTitle,
                },
              }}
              // href={`/ProductDetail/${productID}`}
              className="btn btn-active btn-sm w-full"
            >
              <button className="btn btn-active btn-sm w-full">
                See Details
              </button>
            </Link>
            <button className="btn btn-active btn-sm w-full">
              <FaShoppingCart fontSize={20} />
              Add to Cart
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
