import React from "react";
import { ProductCard } from "@/components";

const usePagination = (itemsPerPage, items) => {
  const [currentPage, setCurrentPage] = React.useState(1);

  const totalPages = Math.ceil(items.length / itemsPerPage);

  const nextPage = () => {
    setCurrentPage((prevPage) => Math.min(prevPage + 1, totalPages));
  };

  const prevPage = () => {
    setCurrentPage((prevPage) => Math.max(prevPage - 1, 1));
  };

  const goToPage = (page) => {
    setCurrentPage(page);
  };

  const currentItems = items.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return {
    currentItems,
    nextPage,
    prevPage,
    goToPage,
    currentPage,
    totalPages,
  };
};

const Sale = (props) => {
  const { products } = props.data;
  const productsPerPage = 8;
  const {
    currentItems,
    nextPage,
    prevPage,
    goToPage,
    currentPage,
    totalPages,
  } = usePagination(productsPerPage, products);
  return (
    <div>
      <div>
        <div className="m-2 mb-20 mt-20">
          <h1 className="text-4xl font-bold text-center">
            <span className="bg-neutral text-neutral-content">Sale</span>
          </h1>
        </div>
        <div className="px-20 grid lg:grid-cols-4 md:grid-cols-3 sm:grid-cols-2 gap-4 mb-4">
          {currentItems.map((product, index) => (
            <div key={index}>
              {product.discountPercentage && (
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
              )}
            </div>
          ))}
        </div>
        <div className="flex justify-center mt-4 space-x-2">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <button
              key={page}
              className={`${
                currentPage === page
                  ? "btn btn-outline btn-secondary bg-secondary-content"
                  : "btn btn-outline btn-secondary "
              }`}
              onClick={() => goToPage(page)}
            >
              {page}
            </button>
          ))}
        </div>
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

export default Sale;
