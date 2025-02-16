import toast from "react-hot-toast";
import { deployToken } from "../../token/token";
import { wallet } from "../navbar/wallet";
import { useUser } from "../../context/useUser";
import { UserContextType } from "../../types/types";
import axios from "axios";
import { useState } from "react";
import { Spinner } from "../../utils/Spinner";
import { API } from "../../utils/constants";

interface TokenDetails {
  tokenName: string;
  tokenSymbol: string;
  tokenSupply: string;
}

interface CreateTokenFormProps {
  tokenDetails: TokenDetails;
  setTokenDetails: React.Dispatch<React.SetStateAction<TokenDetails>>;
}
export default function CreateTokenForm({
  tokenDetails,
  setTokenDetails,
}: CreateTokenFormProps) {
    const { setGlobalUser } = useUser() as UserContextType
  const [hash, setHash] = useState<string | undefined>(undefined);
  const [submit, setSubmit] = useState<boolean>(false)
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setTokenDetails((prevDetails) => ({
      ...prevDetails,
      [name]: value.trim(), // Trim the input value to remove whitespace
    }));
  };

    const createToken = async () => {
        try {
          console.log("hee");
          const { tokenName, tokenSymbol, tokenSupply } = tokenDetails;

          if (tokenName === "" || tokenSymbol === "" || tokenSupply === "") {
            toast.error("Please enter all details to create token");
            return;
          }
          setSubmit(true);

          const walletResult = await wallet();
          const signer = walletResult?.signer;
          const userAddress = await signer?.getAddress();

          const {
            tokenAddress,
            tokenBalance,
            tokenHash,
            deployedFactoryAddress
          } = await deployToken(
            signer!,
            tokenName,
            parseInt(tokenSupply),
            tokenSymbol,
            userAddress!
          );
          console.log({
            tokenAddress,
            tokenBalance,
            tokenHash,
          });
          const upBalance = parseInt(tokenBalance);

          const response = await axios.post(`${API}/create`, {
            content: `token_name: ${tokenName};\n token: ${tokenAddress};\n token_symbol: ${tokenSymbol};\n`,
          });

          const createResponse = await axios.post(`${API}/save-token`, {
            tokenAddress,
            tokenName,
            tokenSymbol,
            tokenBalance: upBalance,
            tokenFactory: deployedFactoryAddress,
            owner: userAddress,
            fileId: response.data.fileId,
          });
          createResponse.data.tokenProp.ethBalance = walletResult?.ethBalance.toString();
          const userProp = createResponse.data.tokenProp;
          console.log({userProp})
          setGlobalUser(userProp);
          toast.success(`${tokenName} has been created successfully!`);
          setSubmit(false);
          setHash(tokenHash);
        } catch (error) {
          console.error(error)
          setSubmit(false)
        }
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
                {submit ? (
                  <>
                    <Spinner />
                    <span className="ml-2">Creating Token...</span>
                  </>
                ) : (
                  "Create"
                )}
              </button>
            </fieldset>
          </div>
          {hash ? (
            <p>
              View the transaction status here - {" "}
              <a target="_blank" rel="noopener noreferrer" href={`https://sepolia.etherscan.io/tx/${hash}`}>click here.</a>
            </p>
          ) : (
            <></>
          )}
        </form>
      </div>
    </div>
  );
}
