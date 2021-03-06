import Product from "../../models/product";

export const DELETE_PRODUCT = 'DELETE_PRODUCT';
export const CREATE_PRODUCT = 'CREATE_PRODUCT';
export const UPDATE_PRODUCT = 'UPDATE_PRODUCT';
export const SET_PRODUCTS = 'SET_PRODUCTS';

export const fetchProducts = () => {

    return async (dispatch, getState) => {

        const userId = getState().auth.userId;

        try {
            //Get products 
            const response = await fetch('https://rn-complete-guide-3cfd6.firebaseio.com/products.json');

            if (!response.ok) {
                throw new Error('Something went wrong!')
            }

            const resdata = await response.json();
            const loadedProducts = [];

            //loop throught object to push to array for use
            for (const key in resdata) {
                loadedProducts.push(new Product(
                    key,
                    resdata[key].ownerId,
                    resdata[key].title,
                    resdata[key].imageUrl,
                    resdata[key].description,
                    resdata[key].price
                )
                );
            }
            dispatch({ 
                type: SET_PRODUCTS, 
                products: loadedProducts, 
                userProducts: loadedProducts.filter(prod => prod.ownerId === userId)
            });
        } catch (err) {
            throw err;
        }



    }
}

export const deleteProduct = productId => {

    return async (dispatch, getState) => {
        const token = getState().auth.token;
        const response = await fetch(`https://rn-complete-guide-3cfd6.firebaseio.com/products/${productId}.json?auth=${token}`, {
            method: 'DELETE'
        });

        if (!response.ok) {
            throw new Error('Something went wrong!')
        }

        dispatch({
            type: DELETE_PRODUCT,
            pid: productId
        });
    }

    //return { type: DELETE_PRODUCT, pid: productId };
}

export const createProduct = (title, description, imageUrl, price) => {

    return async (dispatch, getState) => {
        //const token = getState().auth.token;
        const token = getState().auth.token;
        const userId = getState().auth.userId;
        //execute any async code we want
        const response = await fetch(`https://rn-complete-guide-3cfd6.firebaseio.com/products.json?auth=${token}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                title,
                description,
                imageUrl,
                price, 
                ownerId: userId
            })
        })

        const resdata = await response.json();

        dispatch({
            type: CREATE_PRODUCT,
            productData: {
                id: resdata.name,
                title,
                description,
                imageUrl,
                price,
                ownerId: userId
            }
        });
    }
    // return {
    //     type: CREATE_PRODUCT, 
    //     productData: {
    //     title,
    //     description,
    //     imageUrl,
    //     price
    // }}
}

export const updateProduct = (id, title, description, imageUrl) => {

    return async (dispatch, getState) => {

        console.log(getState());
        const token = getState().auth.token;
        const response = await fetch(`https://rn-complete-guide-3cfd6.firebaseio.com/products/${id}.json?auth=${token}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                title,
                description,
                imageUrl
            })
        });

        if (!response.ok) {
            throw new Error('Something went wrong!')
        }

        dispatch({
            type: UPDATE_PRODUCT,
            pid: id,
            productData: {
                title,
                description,
                imageUrl
            }
        });
    }
    // return {
    //     type: UPDATE_PRODUCT,
    //     pid: id,
    //     productData: {
    //         title,
    //         description,
    //         imageUrl
    //     }
    // }
}