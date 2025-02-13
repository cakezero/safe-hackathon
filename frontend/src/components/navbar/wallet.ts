import { BigNumber, ethers } from "ethers";
import toast from "react-hot-toast"

let signer: ethers.providers.JsonRpcSigner | undefined = undefined
let ethBalance: BigNumber | undefined = undefined

export const wallet = async () => {
    console.log("helo")
    if (signer && ethBalance) {
        return { signer, ethBalance };
    }
    if (typeof window.ethereum === "undefined") {
        toast.error("Please install a compatible ETH wallet")
        return;
    }

    const provider = new ethers.providers.Web3Provider(window.ethereum);
    await provider.send('eth_requestAccounts', [])
    signer = provider.getSigner();
    const address = await signer.getAddress();
    ethBalance = await provider.getBalance(address);
    return { signer, ethBalance };
}