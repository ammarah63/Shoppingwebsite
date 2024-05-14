import React from "react";
import { ProductCard, Slider } from "./components";


const Home = (props) => {
  return (
    <div>
      <div>
        <Slider />
      </div>
      <div className="m-2 mb-20 ">
        <h2 class="text-4xl font-bold text-center">
          <span class="bg-neutral text-neutral-content">Featured</span> Products
        </h2>
      </div>
      <div className=" px-20 lg:flex">
        <ProductCard />
        <ProductCard />
        <ProductCard />
      
      </div>
    </div>
  );
};

export default Home;
