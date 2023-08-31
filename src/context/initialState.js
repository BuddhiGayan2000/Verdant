import { fetchCart, fetchUser } from "../utils/fetchLocalStorageData";

const userInfo = fetchUser();
const cartInfo = fetchCart();


export const initialState = {
    user: userInfo, 
    Plants : null,
    cartShow: false,
    cartItems: cartInfo,
};