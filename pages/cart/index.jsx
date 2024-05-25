import React, { useEffect, useState } from "react";
import { FaShoppingCart } from "react-icons/fa";
import Image from "next/image";
import Link from "next/link";
import {
  removecartProducts,
  updateProductQuantity,
  addcartProducts,
} from "@/redux/slices/cartSlice";
import { useSelector, useDispatch } from "react-redux";

const Cart = (props) => {
  const productData = useSelector((data) => data.cart.cartProducts);
  const productData1 = useSelector((data) => data);
  const user = useSelector((state) => state.auth.user);
  const [products, setProducts] = useState({});
  const [subtotal, setSubtotal] = useState(0);
  const [shipping, setShipping] = useState(0);
  const dispatch = useDispatch();

  const handleRemoveProduct = (productID) => {
    dispatch(removecartProducts({ productID }));
    console.log("Product", productID);
  };

  useEffect(() => {
    if (productData) {
      console.log(productData1);
      const productsObj = {};
      let totalPrice = 0;

      productData.forEach((product) => {
        const { productID, productPrice, quantity } = product.data;
        const price = productPrice * quantity;

        productsObj[productID] = { ...product.data, quantity };
        totalPrice += price;
      });

      setProducts(productsObj);
      setSubtotal(totalPrice);
      setShipping(totalPrice >= 500 ? 0 : 50);
    }
  }, [productData]);

  const handleIncrement = (productIDs) => {
    const updatedProducts = { ...products };
    updatedProducts[productIDs].quantity += 1;
    setProducts(updatedProducts);
    updateSubtotal(updatedProducts);

    const productID = updatedProducts[productIDs].productID;
    const productTitle = updatedProducts[productIDs].productTitle;
    const productImage = updatedProducts[productIDs].productImage;
    const productDescription = updatedProducts[productIDs].productDescription;
    const productPrice = updatedProducts[productIDs].productPrice;
    const productRating = updatedProducts[productIDs].productRating;
    const productBrand = updatedProducts[productIDs].productBrand;
    const productDiscount = updatedProducts[productIDs].productDiscount;
    const productStock = updatedProducts[productIDs].productStock;
    const productImages = updatedProducts[productIDs].productImages;
    const productCategory = updatedProducts[productIDs].productCategory;
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
  };

  const handleDecrement = (productIDs) => {
    const updatedProducts = { ...products };
    if (updatedProducts[productIDs].quantity > 1) {
      updatedProducts[productIDs].quantity -= 1;
      setProducts(updatedProducts);
      updateSubtotal(updatedProducts);

      const quantity = updatedProducts[productIDs].quantity;
      const productID = updatedProducts[productIDs].productID;
      const productTitle = updatedProducts[productIDs].productTitle;
      const productImage = updatedProducts[productIDs].productImage;
      const productDescription = updatedProducts[productIDs].productDescription;
      const productPrice = updatedProducts[productIDs].productPrice;
      const productRating = updatedProducts[productIDs].productRating;
      const productBrand = updatedProducts[productIDs].productBrand;
      const productDiscount = updatedProducts[productIDs].productDiscount;
      const productStock = updatedProducts[productIDs].productStock;
      const productImages = updatedProducts[productIDs].productImages;
      const productCategory = updatedProducts[productIDs].productCategory;
      dispatch(
        updateProductQuantity(
          productID
          // productTitle,
          // productImage,
          // productDescription,
          // productPrice,
          // productRating,
          // productBrand,
          // productDiscount,
          // productStock,
          // productImages,
          // productCategory,
        )
      );
    }
  };

  const updateSubtotal = (updatedProducts) => {
    let totalPrice = 0;
    Object.values(updatedProducts).forEach((product) => {
      totalPrice += product.productPrice * product.quantity;
    });
    setSubtotal(totalPrice);
    setShipping(totalPrice >= 500 ? 0 : 50);
  };

  return (
    <div>
      <div className="flex items-center justify-center m-2 mb-10 mt-10">
        <h1 className="text-4xl font-bold">
          <span className="bg-neutral text-neutral-content flex items-center p-2">
            <FaShoppingCart fontSize={40} className="mr-2" />
            My Cart
          </span>
        </h1>
      </div>
      <div>
        <div className="py-10 grid grid-cols-1 lg:grid-cols-3 gap-1 mx-10">
          <div className=" p-4 col-span-2">
            <div className="overflow-x-auto">
              <table className="table">
                {/* head */}
                <thead className="text-lg ">
                  <tr>
                    <th></th>
                    <th>Product</th>
                    <th>Price</th>
                    <th>Quantity</th>
                    <th>Remove</th>
                  </tr>
                </thead>
                <tbody>
                  {productData && (
                    <>
                      {Object.keys(products).map((productID) => {
                        const product = products[productID];
                        return (
                          <tr className="bg-base-200" key={productID}>
                            <th>
                              <Image
                                src={product.productImage}
                                alt="Product"
                                width={50}
                                height={50}
                                className="object-cover h-[70px] w-[70px]"
                              />
                            </th>
                            <td>{product.productTitle}</td>
                            <td>{product.productPrice} $</td>
                            <td>
                              <form className="max-w-xs mx-auto">
                                <div className="relative flex items-center max-w-[8rem]">
                                  <button
                                    type="button"
                                    id="decrement-button"
                                    onClick={() => handleDecrement(productID)}
                                    className="bg-neutral rounded-s-lg p-3 h-11 "
                                  >
                                    -
                                  </button>
                                  <input
                                    type="text"
                                    id="quantity-input"
                                    aria-describedby="helper-text-explanation"
                                    className="bg-white text-neutral border-x-0 border-gray-300 h-11 text-center text-sm block w-full py-2.5 "
                                    placeholder="1"
                                    value={product.quantity}
                                    readOnly
                                    required
                                  />
                                  <button
                                    type="button"
                                    id="increment-button"
                                    onClick={() => handleIncrement(productID)}
                                    className="bg-neutral rounded-e-lg p-3 h-11 "
                                  >
                                    +
                                  </button>
                                </div>
                              </form>
                            </td>
                            <td>
                              <a
                                onClick={() =>
                                  handleRemoveProduct(product.productID)
                                }
                              >
                                <button className="btn btn-circle">
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-6 w-6"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth="2"
                                      d="M6 18L18 6M6 6l12 12"
                                    />
                                  </svg>
                                </button>
                              </a>
                            </td>
                          </tr>
                        );
                      })}
                    </>
                  )}
                </tbody>
              </table>
            </div>
          </div>
          <div className="bg-gray-200 p-4 col-span-1 rounded-lg">
            <h2 className="text-2xl font-bold">Cart Total</h2>
            <div className="my-5 flex">
              <p className="text-lg font-semibold flex-1">Subtotal:</p>
              <p className="text-lg font-medium justify-end">{subtotal}$</p>
            </div>
            <div className="my-5 flex">
              <p className="text-lg font-semibold flex-1">Shipping</p>
              <div className="text-lg font-medium justify-end">
                <div className="form-control">
                  <label className="label cursor-pointer">
                    <input
                      type="radio"
                      name="radio-10"
                      className="radio checked:bg-accent me-2"
                      checked
                    />
                    <span className="label-text">
                      Flat Rate: <b>{shipping}$</b>
                    </span>
                  </label>
                </div>
                <div className="flex">
                  <p className="label-text text-base flex-1 me-2">
                    Shipping To:
                  </p>
                  <span className="label-text justify-end mt-0.5">
                    <b>{user?.address || "No Address Provided"}</b>
                  </span>
                </div>
                <div className="flex justify-end my-5">
                  <Link href={`/profile/${user.displayName}`}>
                    <button className="btn btn-outline btn-secondary">
                      Change Address
                    </button>
                  </Link>
                </div>
              </div>
            </div>
            <div className="my-5 flex">
              <p className="text-lg font-semibold flex-1">Total:</p>
              <p className="text-lg font-medium justify-end">
                {subtotal + shipping}$
              </p>
            </div>
            <div className="my-5">
              <button className="btn btn-neutral text-lg my-3 w-full">
                Proceed to Checkout
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
