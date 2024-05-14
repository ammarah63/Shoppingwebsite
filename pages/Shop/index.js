import React from "react";
import { ProductCard } from "@/pages/components";

const Shop = (props) => {
  const { products } = props;
  return (
    <div>
      <div>
        <div className="m-2 mb-20 mt-20">
          <h1 class="text-4xl font-bold text-center">
            <span class="bg-neutral text-neutral-content">Shop</span>
          </h1>
        </div>
        <div className=" px-20 lg:flex">
          <ProductCard />
          <ProductCard />
          <ProductCard />
          {/* {products.map((product, index) => (
            <ProductCard key={index} product={product} />
          ))} */}
        </div>
      </div>
    </div>
  );
};

export async function getServerSideProps() {
  const res = await fetch("https://dummyjson.com/products");
  const data = await res.json();
  console.log(res);
  console.log(data);

  return {
    props: {
      products: data,
    },
  };
}
export default Shop;
