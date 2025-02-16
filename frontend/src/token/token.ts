import { SupportedChainId, SigningScheme, OrderBookApi, OrderSigningUtils, UnsignedOrder } from "@cowprotocol/cow-sdk";
import { ethers } from "ethers"
import { abi, bytecode } from "./erc/erc20"
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

  const tokenFactory = new ethers.ContractFactory(abi, bytecode, signer);
  const deployedToken = await tokenFactory.deploy(tokenName, tokenSymbol, tokenQuantity);

  const tokenHash = deployedToken.deployTransaction?.hash;
  console.log({ tokenHash });

  await deployedToken.deployTransaction.wait()
  
  const tokenAddress = deployedToken.address;

  console.log({tokenAddress})
  const factory = new ethers.ContractFactory(factoryProp.abi, factoryProp.bytecode, signer);
  console.log({factory})

  const deployedFactory = await factory.deploy(tokenAddress);
  console.dir({deployedFactory})

  await deployedFactory.deployTransaction.wait();
  
  const deployedFactoryAddress = deployedFactory.address;
  console.log({deployedFactoryAddress})

  const tokenContract = new ethers.Contract(tokenAddress, abi, signer);
  console.log({ tokenContract })
  
  const weiTokenBalance = await tokenContract.balanceOf(userAddress);

  const tokenBalance = ethers.utils.formatUnits(weiTokenBalance, 18);

  return { deployedFactoryAddress, tokenHash, tokenAddress, tokenBalance };
}

const addLiquidity = async (signer: ethers.providers.JsonRpcSigner, factoryContractAddress: string, ethAmount: string, tokenAmount: number) => { 

  const tokenContract = new ethers.Contract(factoryContractAddress, factoryProp.abi, signer);
  console.log({tokenContract})

  const weiAmount = ethers.utils.parseUnits(tokenAmount.toString(), 18);

  const liquidityAdd = await tokenContract.AddLiquidityETH(weiAmount, { value: ethers.utils.parseEther(ethAmount), gasLimit: 500000 });

  console.log({ liquidityAdd })

  await liquidityAdd.wait();

  const tx = liquidityAdd.transactionHash;
  
  return { tx };
}

export { TokenSwap, ETHSwap, deployToken, addLiquidity }