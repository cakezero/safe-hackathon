import { SupportedChainId, SigningScheme, OrderBookApi, OrderSigningUtils, UnsignedOrder } from "@cowprotocol/cow-sdk";
import { ethers, Signer } from "ethers"
import { Web3Provider } from "@ethersproject/providers";
import { abi } from "./erc/erc20"
import { factoryProp } from "./erc/factoryProp"
import { getETHQuote, getTokenQuote } from "./quote";

const relayerAddress = "0x"
const WETH = "0xfff9976782d46cc05630d1f6ebab18b2324d6b14";

const TokenSwap = async (provider: Web3Provider, tokenAddress: string, tokenAmount: string) => {
  
  try {
    const signer = provider.getSigner();
    const userAddress = await signer.getAddress();
    const feeAmount = "0";

    const token = new ethers.Contract(
      tokenAddress,
      abi,
      signer as unknown as Signer
    );

    const tx = await token.approve(relayerAddress, ethers.MaxUint256);
    console.log("tx:", tx, "\n");
    const receipt = await tx.wait();
    console.log("receipt:", receipt, "\n");

    const orderBook = new OrderBookApi({ chainId: SupportedChainId.SEPOLIA });

    const quote = await getTokenQuote(orderBook, tokenAddress, userAddress, tokenAmount, WETH)

    const order: UnsignedOrder = {
      ...quote,
      sellAmount: tokenAmount,
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
      sellAmount: tokenAmount,
      feeAmount,
      signingScheme: orderResult.signingScheme as unknown as SigningScheme,
    });

    const orderReceipt = await orderBook.getOrder(orderId);
    console.log("orderReceipt:", orderReceipt, "\n");

    const tradeReceipt = await orderBook.getTrades({ orderUid: orderId });

    return tradeReceipt;
  } catch (error) {
    console.error(error)
    throw new Error("Failed to swap Token for ETH")
  }
}

const ETHSwap = async (provider: Web3Provider, tokenAddress: `0x${string}`, ethAmount: string) => {

  try {
    const signer = provider.getSigner();
    const userAddress = await signer.getAddress();
    const feeAmount = "0";
  
    const token = new ethers.Contract(WETH, abi, signer as unknown as Signer);
  
    const tx = await token.approve(relayerAddress, ethers.MaxUint256);
    console.log("tx:", tx, "\n");
    const receipt = await tx.wait();
    console.log("receipt:", receipt, "\n");
  
    const orderBook = new OrderBookApi({ chainId: SupportedChainId.SEPOLIA });

    const quote = await getETHQuote(orderBook, tokenAddress, userAddress, ethAmount, WETH);

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
  } catch (error) {
    console.error(error)
    throw new Error("Couldn't swap ETH for Token")
  }
}

const deployToken = async (provider: Web3Provider, tokenName: string, tokenQuantity: number, tokenSymbol: string) => {
  const signer = provider.getSigner();

  const factory = new ethers.ContractFactory(factoryProp.abi, factoryProp.bytecode, signer as unknown as Signer);

  const deployedFactory = await factory.deploy(tokenName, tokenSymbol, tokenQuantity);

  const tokenHash = deployedFactory.deploymentTransaction()?.hash;

  await deployedFactory.waitForDeployment();
  
  const deployedFactoryAddress = await deployedFactory.getAddress();

  const factoryContract = new ethers.Contract(deployedFactoryAddress, factoryProp.abi, signer as unknown as Signer)

  const tokenAddress = await factoryContract.getTokenAddress();

  return { deployedFactoryAddress, tokenHash, tokenAddress };
}

const addLiquidity = async (provider: Web3Provider, factoryContractAddress: string, ethAmount: string, tokenAmount: number) => { 
  const signer = provider.getSigner();

  const tokenContract = new ethers.Contract(factoryContractAddress, factoryProp.abi, signer as unknown as Signer);

  const liquidityAdd = await tokenContract.AddLiquidityETH(tokenAmount, { value: ethers.parseUnits(ethAmount, "ether") });

  console.log({ liquidityAdd })

  await liquidityAdd.wait();

  const tx = liquidityAdd.transactionHash;
  
  return { tx };
}

export { TokenSwap, ETHSwap, deployToken, addLiquidity }