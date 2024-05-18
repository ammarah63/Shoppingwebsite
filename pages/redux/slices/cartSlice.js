import { createSlice, current } from "@reduxjs/toolkit";

let datacart;
let cartData;
if (typeof window !== "undefined") {
  cartData = window.localStorage.getItem("cart");
  datacart = JSON.parse(cartData);
}
const initialState = {
  cartProducts: [],
  //cartProducts: datacart ? JSON.parse(cartData) : [],
};

const cartSlice = createSlice({
  name: "cartProductsSlice",
  initialState,
  reducers: {
    addcartProducts: (state, action) => {
      console.log("action", action);
      const productID = action.payload.productID;
      const existingProduct = state.cartProducts.find(
        (p) => p.productID === productID
      );
      console.log("existingProduct", existingProduct);
      if (existingProduct) {
        existingProduct.quantity += 1;
      } else {
        const data = {
          productID: action.payload.productID,
          productTitle: action.payload.productTitle,
          productImage: action.payload.productImage,
          productDescription: action.payload.productDescription,
          productPrice: action.payload.productPrice,
          productRating: action.payload.productRating,
          productBrand: action.payload.productBrand,
          productDiscount: action.payload.productDiscount,
          productStock: action.payload.productStock,
          productImages: action.payload.productImages,
          productCategory: action.payload.productCategory,
          quantity: 1,
        };
        action.payload.quantity = 1;
        state.cartProducts.push({
          data,
        });
      }
      let cartData = JSON.stringify(current(state.cartProducts));
      window.localStorage.setItem("cart", cartData);
    },
    removecartProducts: (state, action) => {
      console.log("Remove Product", action.payload.productID);
      console.log("Remove Cart Product", action);
      const productID = action.payload.productID;
      state.cartProducts = state.cartProducts.filter(
        (product) => product.data.productID !== productID
      );
      console.log(
        "Current state:",
        JSON.parse(JSON.stringify(state.cartProducts))
      );
    },
    updateProductQuantity: (state, action) => {
      const productID = action.payload.productID;
      console.log(
        "Current state:",
        JSON.parse(JSON.stringify(state.cartProducts))
      );
      const existingProduct = state.cartProducts.find(
        (p) => p.productID === productID
      );

      if (existingProduct) {
        existingProduct.quantity -= 1;
        if (existingProduct.quantity === 0) {
          // Remove the product if quantity becomes zero
          state.cartProducts = state.cartProducts.filter(
            (p) => p.productID !== productID
          );
        }
      } else {
        console.log(`Product with ID ${productID} not found in cart.`);
      }
      console.log(
        "Update state:",
        JSON.parse(JSON.stringify(state.cartProducts))
      );
    },
  },
});

export const { addcartProducts, removecartProducts, updateProductQuantity } =
  cartSlice.actions;
export default cartSlice.reducer;