import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  selectedProduct: {},
};

const selectedProductSlice = createSlice({
  name: "selectedProductSlice",
  initialState,
  reducers: {
    addselectedProduct: (state, action) => {
      console.log(action);
      const {
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
      } = action.payload;

      state.selectedProduct = {
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
      };
    },
  },
});

export const { addselectedProduct } = selectedProductSlice.actions;
export default selectedProductSlice.reducer;
