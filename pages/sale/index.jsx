import React, { useState, useEffect } from "react";
import { ProductCard } from "@/components";
import { useRouter } from "next/router";

const usePagination = (itemsPerPage, items) => {
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(items.length / itemsPerPage);

  const goToPage = (page) => {
    setCurrentPage(page);
  };

  const currentItems = items.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return {
    currentItems,
    goToPage,
    currentPage,
    totalPages,
  };
};

const Sale = (props) => {
  const router = useRouter();
  const { page } = router.query;
  const initialPage = page ? parseInt(page, 10) : 1;

  const { products } = props.data;
  const productsPerPage = 8;
  const { currentItems, goToPage, currentPage, totalPages } = usePagination(
    productsPerPage,
    products
  );

  useEffect(() => {
    if (initialPage && initialPage >= 1 && initialPage <= totalPages) {
      goToPage(initialPage);
    }
  }, [initialPage, totalPages]);

  useEffect(() => {
    if (currentPage !== initialPage) {
      router.push(`/sale?page=${currentPage}`, undefined, { shallow: true });
    }
  }, [currentPage, initialPage, router]);
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
