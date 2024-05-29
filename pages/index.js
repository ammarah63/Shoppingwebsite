import React from "react";
import { ProductCard, Slider } from "../components";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useTranslation } from "react-i18next";

const Home = (props) => {
  const { t } = useTranslation("common");
  const { products } = props.data;
  const furnitureProducts = products.filter(
    (product) => product.category === "furniture"
  );

  console.log(furnitureProducts);
  return (
    <main>
      <div>
        <Slider />
      </div>
      <div className="m-2 mb-20 mt-10 ">
        <h2 className="text-4xl font-bold text-center">
          <span className="bg-neutral text-neutral-content">
            {t("featured")}
          </span>{" "}
          {t("products")}
        </h2>
      </div>
      <div className="px-20 grid lg:grid-cols-4 md:grid-cols-3 sm:grid-cols-2 gap-4 mb-4">
        {furnitureProducts.map((product, index) => (
          <div key={index}>
            <ProductCard
              productDescription={product.description}
              productImage={product.thumbnail}
              productTitle={product.title}
              productPrice={product.price}
              productID={product.id}
              productDiscount={product.discountPercentage}
              productRating={product.rating}
              productBrand={product.brand}
              productCategory={product.category}
              productStock={product.stock}
              productImages={product.images}
            />
          </div>
        ))}
      </div>
    </main>
  );
};

export default Home;

export async function getServerSideProps({ locale }) {
  const res = await fetch("https://dummyjson.com/products?limit=0");
  const data = await res.json();
  console.log(res);
  return {
    props: {
      ...(await serverSideTranslations(locale, ["common"])),
      data,
    },
  };
}
