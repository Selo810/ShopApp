import { ADD_TO_CART } from "../actions/cart";
import { REMOVE_FROM_CART } from "../actions/cart";
import CartItem from '../../models/cart-item'
import { add } from "react-native-reanimated";
import { ADD_ORDER } from "../actions/orders";
import { DELETE_PRODUCT } from "../actions/products";

const initialState = {
    items: {},
    totalAmount: 0
};

export default (state = initialState, action) => {
    switch (action.type) {
        case ADD_TO_CART:
            const addedProduct = action.product;
            const prodPrice = addedProduct.price;
            const prodTitle = addedProduct.title;

            let updatedOrNewCartItem;

            if (state.items[addedProduct.id]) {
                //already have the item in the cart
                updatedOrNewCartItem = new CartItem(
                    state.items[addedProduct.id].quantity + 1,
                    prodPrice,
                    prodTitle,
                    state.items[addedProduct.id].sum + prodPrice
                );
            } else {
                updatedOrNewCartItem = new CartItem(1, prodPrice, prodTitle, prodPrice);
            }

            return {
                //State copying may not needed
                ...state,
                items: { ...state.items, [addedProduct.id]: updatedOrNewCartItem },
                totalAmount: state.totalAmount + prodPrice
            }
        case REMOVE_FROM_CART:
            const selectedCartItem = state.items[action.pid];
            const currentQty = selectedCartItem.quantity;
            let updatedcartItems;

            //Reduce if quantity is more that 1, remove otherwise
            if (currentQty > 1) {
                const updatedcartItem = new CartItem(
                    selectedCartItem.quantity - 1,
                    selectedCartItem.productPrice,
                    selectedCartItem.productTitle,
                    selectedCartItem.sum - selectedCartItem.productPrice
                );

                updatedcartItems = {
                    ...state.items, [action.pid]: updatedcartItem
                }
            } else {
                updatedcartItems = { ...state.items };
                delete updatedcartItems[action.pid];
            }

            return {
                ...state,
                items: updatedcartItems,
                totalAmount: state.totalAmount - selectedCartItem.productPrice
            }
        //Clear the cart after order
        case ADD_ORDER: 
            return initialState

        case DELETE_PRODUCT:
            if (!state.items[action.pid]){
                return state;
            }
            const updatedItems = {...state.items};
            const itemTotal = state.items[action.pid].sum;
            delete updatedItems[action.pid]
            return {
                ...state,
                items: updatedItems,
                totalAmount: state.totalAmount - itemTotal
            }
    }
    return state;
}