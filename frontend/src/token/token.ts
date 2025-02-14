import { SupportedChainId, SigningScheme, OrderBookApi, OrderSigningUtils, UnsignedOrder } from "@cowprotocol/cow-sdk";
import { ethers } from "ethers"
import { abi } from "./erc/erc20"
import { factoryProp } from "./erc/factoryProp"
import { getETHQuote, getTokenQuote } from "./quote";

const relayerAddress = "0x"
const WETH = "0xfff9976782d46cc05630d1f6ebab18b2324d6b14";

const TokenSwap = async (signer: ethers.providers.JsonRpcSigner, tokenAddress: string, tokenAmount: string) => {
  
  try {
    const userAddress = await signer.getAddress();
    const feeAmount = "0";

    const token = new ethers.Contract(
      tokenAddress,
      abi,
      signer
    );

    const tx = await token.approve(relayerAddress, ethers.constants.MaxUint256);
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

const ETHSwap = async (signer: ethers.providers.JsonRpcSigner, tokenAddress: string, ethAmount: string) => {

  try {
    const userAddress = await signer.getAddress();
    const feeAmount = "0";
  
    const token = new ethers.Contract(WETH, abi, signer);
  
    const tx = await token.approve(relayerAddress, ethers.constants.MaxUint256);
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

const deployToken = async (signer: ethers.providers.JsonRpcSigner, tokenName: string, tokenQuantity: number, tokenSymbol: string, userAddress: string) => {

  const factory = new ethers.ContractFactory(factoryProp.abi, factoryProp.bytecode, signer);

  const deployedFactory = await factory.deploy(tokenName, tokenSymbol, tokenQuantity);

  const tokenHash = deployedFactory.deploymentTransaction()?.hash;

  await deployedFactory.waitForDeployment();
  
  const deployedFactoryAddress = await deployedFactory.getAddress();

  const factoryContract = new ethers.Contract(deployedFactoryAddress, factoryProp.abi, signer)

  const tokenAddress = await factoryContract.getTokenAddress();

  const tokenContract = new ethers.Contract(tokenAddress, abi, signer);

  const weiTokenBalance = await tokenContract.balanceOf(userAddress);

  const tokenBalance = ethers.utils.formatUnits(weiTokenBalance, 18);

  return { deployedFactoryAddress, tokenHash, tokenAddress, tokenBalance };
}

const addLiquidity = async (signer: ethers.providers.JsonRpcSigner, factoryContractAddress: string, ethAmount: string, tokenAmount: number) => { 

  const tokenContract = new ethers.Contract(factoryContractAddress, factoryProp.abi, signer);

  const liquidityAdd = await tokenContract.AddLiquidityETH(tokenAmount, { value: ethers.utils.parseUnits(ethAmount, "ether") });

  console.log({ liquidityAdd })

  await liquidityAdd.wait();

  const tx = liquidityAdd.transactionHash;
  
  return { tx };
}

export { TokenSwap, ETHSwap, deployToken, addLiquidity }