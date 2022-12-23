
export function getWashData () {
    const configureStore = process.env.ENV === 'DEV'
        ? import('./product-data/product-wash.json')
        : import('./product-data/product-wash-prod.json');
    return configureStore;
}
