import { SupportedChainId, SigningScheme, OrderBookApi, OrderQuoteRequest, OrderQuoteSideKindSell, OrderSigningUtils, UnsignedOrder } from "@cowprotocol/cow-sdk";
import { ethers, Signer } from "ethers"
import { Web3Provider } from "@ethersproject/providers";
import { abi, bytecode } from "./erc/erc20"

const relayerAddress = "0x"
const WETH = "0x"

const TokenSwap = async (provider: Web3Provider, tokenAddress: string, tokenAmount: string) => {
  const signer = provider.getSigner();
  const userAddress = await signer.getAddress();
  const feeAmount = "0"

  const token = new ethers.Contract(tokenAddress, abi, signer as unknown as Signer);

  const tx = await token.approve(relayerAddress, ethers.MaxUint256);
  console.log("tx:", tx, "\n");
  const receipt = await tx.wait();
  console.log("receipt:", receipt, "\n");

  const orderBook = new OrderBookApi({ chainId: SupportedChainId.SEPOLIA });

  const quoteRequest: OrderQuoteRequest = {
    sellToken: tokenAddress,
    buyToken: WETH,
    from: userAddress,
    receiver: userAddress,
    sellAmountBeforeFee: tokenAmount,
    kind: OrderQuoteSideKindSell.SELL
  }

  const { quote } = await orderBook.getQuote(quoteRequest);

  const order: UnsignedOrder = {
    ...quote,
    sellAmount: tokenAmount,
    feeAmount,
    receiver: userAddress
  }

  const orderResult = await OrderSigningUtils.signOrder(order, SupportedChainId.SEPOLIA, signer);

  const orderId = await orderBook.sendOrder({
    ...quote,
    ...orderResult,
    sellAmount: tokenAmount,
    feeAmount,
    signingScheme: orderResult.signingScheme as unknown as SigningScheme
  })

  const orderReceipt = await orderBook.getOrder(orderId);
  console.log("orderReceipt:", orderReceipt, "\n");

  const tradeReceipt = await orderBook.getTrades({ orderUid: orderId });

  return tradeReceipt;
}

const ETHSwap = async (provider: Web3Provider, tokenAddress: `0x${string}`, ethAmount: string) => {
  const signer = provider.getSigner();
  const userAddress = await signer.getAddress();
  const feeAmount = "0";

  const token = new ethers.Contract(
    WETH,
    abi,
    signer as unknown as Signer
  );

  const tx = await token.approve(relayerAddress, ethers.MaxUint256);
  console.log("tx:", tx, "\n");
  const receipt = await tx.wait();
  console.log("receipt:", receipt, "\n");

  const orderBook = new OrderBookApi({ chainId: SupportedChainId.SEPOLIA });

  const quoteRequest: OrderQuoteRequest = {
    sellToken: WETH,
    buyToken: tokenAddress,
    from: userAddress,
    receiver: userAddress,
    sellAmountBeforeFee: ethAmount,
    kind: OrderQuoteSideKindSell.SELL,
  };

  const { quote } = await orderBook.getQuote(quoteRequest);

  const order: UnsignedOrder = {
    ...quote,
    sellAmount: ethAmount,
    feeAmount,
    receiver: userAddress,
  };

  const orderResult = await OrderSigningUtils.signOrder(
    order,
    SupportedChainId.SEPOLIA,
    signer
  );

  const orderId = await orderBook.sendOrder({
    ...quote,
    ...orderResult,
    sellAmount: ethAmount,
    feeAmount,
    signingScheme: orderResult.signingScheme as unknown as SigningScheme,
  });

  const orderReceipt = await orderBook.getOrder(orderId);
  console.log("orderReceipt:", orderReceipt, "\n");

  const tradeReceipt = await orderBook.getTrades({ orderUid: orderId });

  return tradeReceipt;
}

const deployToken = async (provider: Web3Provider, tokenName: string, tokenQuantity: number, tokenSymbol: string) => {
  const signer = provider.getSigner();

  const token = new ethers.ContractFactory(abi, bytecode, signer as unknown as Signer);

  const deployedToken = await token.deploy(tokenName, tokenSymbol, tokenQuantity);

  const tokenHash = deployedToken.deploymentTransaction()?.hash;

  await deployedToken.waitForDeployment();

  const deployedTokenAddress = deployedToken.getAddress();

  return { deployedTokenAddress, tokenHash };
}

export { TokenSwap, ETHSwap, deployToken }