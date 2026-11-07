import { configureStore } from "@reduxjs/toolkit";
import ProductReducer from "./redux/ProductReducer";
import orderProductAndAddressReducer from "./redux/orderProductAndAddressReducer";
import CategoryListingReducer from "./redux/CategoryListingReducer";
// import authReducer from "./redux/authReducer";

export default configureStore({
    reducer:{
        product: ProductReducer,
        order: orderProductAndAddressReducer,
        categoryListing: CategoryListingReducer,
        // auth: authReducer
    }
})