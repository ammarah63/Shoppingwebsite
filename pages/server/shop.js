import React from "react";
import { ProductCard } from "@/pages/components";

const Shop = (props) => {
  const { products } = props.data;
  return (
    <div>
      <div >
        <div className="m-2 mb-20 mt-20">
          <h1 class="text-4xl font-bold text-center">
            <span class="bg-neutral text-neutral-content">Shop</span>
          </h1>
        </div>
        {/* <div className=" px-20 lg:flex sm:flex md:flex"> */}
        <div className=" px-20 grid lg:grid-cols-4 md:grid-cols-3 sm:grid-cols-2 gap-4 mb-4">
          {products.map((product, index) => (
            <ProductCard
              key={index}
              productDescription={product.description}
              productImage={product.thumbnail}
              productTitle={product.title}
               productPrice={product.price}
               productID={product.id}
            />
          ))}
        </div>
        {/* </div> */}
      </div>
    </div>
  );
};

export async function getServerSideProps() {
  const res = await fetch("https://dummyjson.com/products");
  const data = await res.json();

  return {
    props: {
       data,
    },
  };
}
export default Shop;
