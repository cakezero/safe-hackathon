import { ethers } from "ethers";
import toast from "react-hot-toast"

let signer: ethers.providers.JsonRpcSigner | undefined = undefined
let ethBalance: string | undefined = undefined

export const wallet = async () => {
    console.log("helo")
    if (signer && ethBalance) {
        console.log("heheh")
        return { signer, ethBalance };
    }
    // @ts-ignore
    if (typeof window.ethereum === "undefined") {
        toast.error("Please install a compatible ETH wallet")
        return;
    }
    console.log("wall")
    // @ts-ignore
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    await provider.send('eth_requestAccounts', []);
    const network = await provider.getNetwork()

    if (network.chainId === 11155111) {
        signer = provider.getSigner();
        const address = await signer.getAddress();
        const balance = await provider.getBalance(address);
        ethBalance = ethers.utils.formatEther(balance).slice(0, 5);
        console.log({ethBalance})
        return { signer, ethBalance };
    }
    await provider.send("wallet_switchEthereumChain", [{ chainId: "0xaa36a7" }]);
    signer = provider.getSigner();
    const address = await signer.getAddress();
    const balance = await provider.getBalance(address);
    ethBalance = ethers.utils.formatEther(balance).slice(0, 5);
    return { signer, ethBalance };
}