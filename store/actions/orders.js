export const ADD_ORDER = 'ADD_ORDER';


export const addOrder = (cartItem, totalAmount) => {
    return async dispatch => {
        const date = new Date();
        //execute any async code we want
        const response = await fetch('https://rn-complete-guide-3cfd6.firebaseio.com/orders/u1.json', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                cartItem, 
                totalAmount,
                date: date.toISOString()
            })
        })

        if(!response.ok){
            throw new Error('Something went wrong!');
        }

        const resData = await response.json();

        dispatch({
            type: ADD_ORDER,
            orderData: { 
                id: resData.name,
                items: cartItem, 
                amount: totalAmount,
                date: date
            }
        });
    }

    // return {
    //     type: ADD_ORDER,
    //     orderData: { items: cartItem, amount: totalAmount }
    // }
}