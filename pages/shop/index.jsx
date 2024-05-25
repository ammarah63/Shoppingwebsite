import React, { useState, useEffect } from "react";
import { ProductCard } from "@/components";
import { useRouter } from "next/router";

const usePagination = (itemsPerPage, items, initialPage = 1) => {
  const [currentPage, setCurrentPage] = useState(initialPage);

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

const Shop = (props) => {
  const router = useRouter();
  const { page } = router.query;
  const initialPage = page ? parseInt(page, 10) : 1;
  // const { products, totalProducts } = props;
  const { products } = props.data;
  const totalProducts = 100;
  const productsPerPage = 12;
  const totalPages = Math.ceil(totalProducts / productsPerPage);

  const { currentItems, goToPage, currentPage } = usePagination(
    productsPerPage,
    products,
    initialPage
  );
  useEffect(() => {
    console.log("products", products);
    if (initialPage && initialPage >= 1 && initialPage <= totalPages) {
      goToPage(initialPage);
    }
  }, [initialPage, totalPages]);

  useEffect(() => {
    console.log(products);
    if (currentPage !== initialPage) {
      router.push(`/shop?page=${currentPage}`, undefined, { shallow: true });
    }
  }, [currentPage, initialPage, router]);

  return (
    <div>
      <div>
        <div className="m-2 mb-20 mt-20">
          <h1 className="text-4xl font-bold text-center">
            <span className="bg-neutral text-neutral-content">Shop</span>
          </h1>
        </div>
        <div className="px-20 grid lg:grid-cols-4 md:grid-cols-3 sm:grid-cols-2 gap-4 mb-4">
          {products.map((product, index) => (
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
        <div className="flex justify-center mt-4 space-x-2">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <button
              key={page}
              className={`${
                currentPage === page
                  ? "btn btn-outline btn-secondary bg-secondary-content"
                  : "btn btn-outline btn-secondary "
              }`}
              onClick={() => {
                goToPage(page);
                router.push(`/shop?page=${page}`);
              }}
            >
              {page}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export async function getServerSideProps({ query }) {
  if (query.page) {
    console.log("context", query.page);
    const skip = (parseInt(query.page) - 1) * 12;
    console.log("skip", skip);

    const res = await fetch(
      `https://dummyjson.com/products?limit=12&skip=${skip}`
    );
    const data = await res.json();
    console.log("data", data);
    const totalProducts = data.total;
    console.log("totalProducts", totalProducts);
    return {
      props: {
        data,
        totalProducts,
      },
    };
  }
  const res = await fetch("https://dummyjson.com/products?limit=12");
  const data = await res.json();
  console.log("data", data);
  const totalProducts = data.total;
  return {
    props: {
      data,
      totalProducts,
    },
  };
}

export default Shop;
