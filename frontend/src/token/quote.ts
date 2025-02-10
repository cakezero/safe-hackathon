import { OrderBookApi, OrderQuoteRequest, OrderQuoteSideKindSell } from "@cowprotocol/cow-sdk"

export const getTokenQuote = async (orderBook: OrderBookApi, tokenAddress: string, userAddress: string, tokenAmount: string, WETH: string) => { 
  const quoteRequest: OrderQuoteRequest = {
    sellToken: tokenAddress,
    buyToken: WETH,
    from: userAddress,
    receiver: userAddress,
    sellAmountBeforeFee: tokenAmount,
    kind: OrderQuoteSideKindSell.SELL,
  };

  const { quote } = await orderBook.getQuote(quoteRequest);

  return quote;
}

export const getETHQuote = async (orderBook: OrderBookApi, tokenAddress: string, userAddress: string, ethAmount: string, WETH: string) => {
  const quoteRequest: OrderQuoteRequest = {
    sellToken: WETH,
    buyToken: tokenAddress,
    from: userAddress,
    receiver: userAddress,
    sellAmountBeforeFee: ethAmount,
    kind: OrderQuoteSideKindSell.SELL,
  };

  const { quote } = await orderBook.getQuote(quoteRequest);

  return quote;
};