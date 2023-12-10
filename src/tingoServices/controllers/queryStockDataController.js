const customError = require('../../utils/errors/customError')
const fetchTiingoData = require('../../utils/helpers/tiingoHelpers/getRequest')

getPriceOnDate = async function(requestParams, tickerName){
    try{
        // prepare endpoint
        const raw_endpoint = "/tiingo/daily/<ticker>/prices"
        const endpoint = raw_endpoint.replace("<ticker>",tickerName)

        const stock_data = await fetchTiingoData(endpoint, requestParams)
        if(stock_data.length === 0){
            throw new customError("Didnot receive data", 500, 'error')
        }
        return stock_data
    }catch(error){
        console.log(error)
        throw new customError("Failed to fetch price for the given date", 500, 'error')
    }
    
}

getDailyMetric = async function(requestParams, tickerName){
    try{
        const raw_endpoint = "/tiingo/fundamentals/<ticker>/daily" 
        const endpoint = raw_endpoint.replace("<ticker>",tickerName)

        const stockMetric = await fetchTiingoData(endpoint, requestParams)
        console.log(stockMetric)
        if(stockMetric.length === 0 || stockMetric.length > 1){
            throw new customError("Didnot receive data", 500, 'error')
        }
        return stockMetric[0]
    }catch(error){
        if(error.status === 400){
            throw error
        }else{
            console.log("Response",error)
            console.log("Response",stockMetric)
            throw new customError("Failed to fetch metric for the given ticker", 500, 'error')
        }
        
    }
}
module.exports = {
    getPriceOnDate,
    getDailyMetric
}