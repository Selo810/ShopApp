import React, { useState, useEffect, useCallback } from 'react';
import { FlatList, Text, Platform, Button, ActivityIndicator, View, StyleSheet} from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { State } from 'react-native-gesture-handler';
import { HeaderButtons, Item } from 'react-navigation-header-buttons';

import HeaderButton from '../../components/UI/HeaderButton';
import ProductItem from '../../components/shop/ProductItem';
import * as cartActions from '../../store/actions/cart';
import * as productsActions from '../../store/actions/products';
import Colors from '../../constants/Colors';

const ProductOverviewScreen = props => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState();
    //Used to get data from state
    const products = useSelector(State => State.products.availableProducts)
    const dispatch = useDispatch();

    //Fuction to load products
    const loadProducts = useCallback (async () => {
        setError(null);
        setIsLoading(true);
        try{
            await dispatch(productsActions.fetchProducts());
        }catch (err){
            setError(err.message)
        }

        setIsLoading(false);
    }, [dispatch, setIsLoading, setError])

    //fetch products after dispatch is initialized 
    useEffect(() => {

        loadProducts()

    }, [dispatch, loadProducts])

    const selectItemHandler = (id, title) => {
        //passing Params to uri
        props.navigation.navigate('ProductDetail', {
            productId: id,
            productTitle: title
        });
    }

    //Display message if no data
    if (error) {
        return (
            <View style={styles.centered}>
                <Text>Error occurred.</Text>
                ]<Button title="Try again" onPress={loadProducts} color={Colors.primary}/>
            </View>
        )
    }

    //Display loading icon if data is loading
    if (isLoading) {
        return (
            <View style={styles.centered}>
                <ActivityIndicator size='large' color={Colors.primary} />
            </View>
        )
    }

    //Display message if no data
    if (!isLoading && products.length === 0) {
        return (
            <View style={styles.centered}>
                <Text>No products found.</Text>
            </View>
        )
    }

    return (
        <FlatList
            data={products}
            keyExtractor={item => item.id}
            renderItem={itemData => (
                <ProductItem
                    image={itemData.item.imageUrl}
                    title={itemData.item.title}
                    price={itemData.item.price}
                    onSelect={() => {
                        selectItemHandler(itemData.item.id, itemData.item.title)
                    }}
                >
                    <Button
                        color={Colors.primary}
                        title='View Details'
                        onPress={() => {
                            selectItemHandler(itemData.item.id, itemData.item.title)
                        }}
                    />
                    <Button
                        color={Colors.primary}
                        title='Add To Cart'
                        onPress={() => {
                            dispatch(cartActions.addToCart(itemData.item));
                        }}
                    />
                </ProductItem>
            )}
        />
    );
};

ProductOverviewScreen.navigationOptions = navData => {

    return {
        headerTitle: 'All Products',
        headerLeft: () => <HeaderButtons HeaderButtonComponent={HeaderButton}>
            <Item
                title="Menu"
                iconName={Platform.OS === 'android' ? 'md-menu' : 'ios-menu'}
                onPress={() => {
                    navData.navigation.toggleDrawer();
                }}
            >
            </Item>
        </HeaderButtons>,
        headerRight: () => <HeaderButtons HeaderButtonComponent={HeaderButton}>
            <Item
                title='Cart'
                iconName={Platform.OS === 'android' ? 'md-cart' : 'ios-cart'}
                onPress={() => {
                    navData.navigation.navigate('Cart')
                }} />
        </HeaderButtons>
    }

}

const styles = StyleSheet.create({
    centered: {
        flex: 1, 
        justifyContent: 'center', 
        alignItems: 'center'
    }
})


export default ProductOverviewScreen;