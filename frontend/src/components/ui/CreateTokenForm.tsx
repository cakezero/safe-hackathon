import toast from "react-hot-toast";
import { deployToken } from "../../token/token";
import { wallet } from "../navbar/wallet";
import { useUser } from "../../context/useUser";
import { UserContextType } from "../../types/types";
import axios from "axios";
import fileverseAgent from "../../fileverse/fileverseAgent";
import { useState } from "react";

interface TokenDetails {
  tokenName: string;
  tokenSymbol: string;
  tokenSupply: string;
}

interface CreateTokenFormProps {
  tokenDetails: TokenDetails;
  setTokenDetails: React.Dispatch<React.SetStateAction<TokenDetails>>;
}
const API = ""
export default function CreateTokenForm({
  tokenDetails,
  setTokenDetails,
}: CreateTokenFormProps) {
    const { setGlobalUser } = useUser as unknown as UserContextType
    const [hash, setHash] = useState<string | undefined>(undefined)
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setTokenDetails((prevDetails) => ({
      ...prevDetails,
      [name]: value.trim(), // Trim the input value to remove whitespace
    }));
  };

    const createToken = async () => {
        console.log("hee")
        const { tokenName, tokenSymbol, tokenSupply } = tokenDetails;

        if (tokenName === "" || tokenSymbol === "" || tokenSupply === "") {
            toast.error("Please enter all details to create token");
            return;
        }

        const walletResult = await wallet();
        const userAddress = await walletResult?.signer.getAddress();
        const signer = walletResult?.signer

        const { tokenAddress, tokenBalance, tokenHash, deployedFactoryAddress } = await deployToken(signer!, userAddress!, tokenName, parseInt(tokenSupply), tokenSymbol);
        const upBalance = parseInt(tokenBalance)

        const fileId = await fileverseAgent().createFile(
            `token_name: ${tokenName};\n token: ${tokenAddress};\n tokenFactory: ${deployedFactoryAddress};\n`
        );

        const response = await axios.post(`${API}/save-token`, { tokenAddress, tokenName, tokenBalance: upBalance, tokenFactory: deployedFactoryAddress, owner: userAddress, fileId });
        response.data.tokenProp.ethBalance = walletResult?.ethBalance;
        setGlobalUser(response.data.tokenProp);
        setHash(tokenHash);
    }

  return (
    <div className="card w-full max-w-sm shrink-0 shadow-2xl">
      <div className="card-body text-base-content">
        <h2 className="card-title"> Create Token </h2>
        <form>
          <div className="card-body">
            <fieldset className="fieldset">
              <label className="fieldset-label">Token name</label>
              <input
                type="text"
                className="input input-primary"
                name="tokenName"
                placeholder="Token name"
                value={tokenDetails.tokenName}
                onChange={handleChange}
              />
              <label className="fieldset-label">Token symbol</label>
              <input
                type="text"
                className="input input-primary"
                name="tokenSymbol"
                placeholder="TKN"
                value={tokenDetails.tokenSymbol}
                onChange={handleChange}
              />
              <label className="fieldset-label">Token initial supply</label>
              <input
                type="number"
                className="input input-primary"
                name="tokenSupply"
                placeholder="690000000"
                value={tokenDetails.tokenSupply}
                onChange={handleChange}
              />
              <button
                type="button"
                onClick={createToken}
                className="btn btn-primary mt-4"
              >
                create
              </button>
            </fieldset>
          </div>
          {hash ? <p>View the transaction status here: {hash}</p> : <></>}
        </form>
      </div>
    </div>
  );
}
