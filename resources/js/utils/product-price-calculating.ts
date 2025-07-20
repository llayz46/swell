export const calculateMargin = (costPrice: number, price: number) => {
    if (costPrice && price) {
        return (((price - costPrice) / price) * 100).toFixed(1)
    }

    return "0"
}

export const calculateProfit = (costPrice: number, price: number) => {
    if (costPrice && price) {
        return (price - costPrice).toFixed(2)
    }

    return "0.00"
}
