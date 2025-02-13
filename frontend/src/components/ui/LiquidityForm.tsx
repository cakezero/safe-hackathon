import { ArrowDown } from "lucide-react"
import { useEffect, useState } from "react";
import { UserContextType } from "../../types/types";
import { useUser } from "../../context/useUser";
import { addLiquidity } from "../../token/token";
import axios from "axios";
import { wallet } from "../navbar/wallet";
import { API } from "../../utils/constants";
import fileverseAgent from "../../fileverse/fileverseAgent";


export default function LiquidityForm() {
  // const [selectedToken1, setSelectedToken1] = useState("");
  // const [selectedToken2, setSelectedToken2] = useState("");
  // const [isModalOpen, setIsModalOpen] = useState(false);
  const { globalUser, setGlobalUser } = useUser() as UserContextType;
  
  const { ethBalance, tokenName, tokenAddress, tokenSymbol, tokenBalance, tokenFactory, owner, fileId } = globalUser ?? {};
  const [ethAmount, setEthAmount] = useState<string | undefined>(undefined);
  const [tokenAmount, setTokenAmount] = useState<string | undefined>(undefined);
  const [hash, setHash] = useState<string | undefined>(undefined);
  const [tokenIndex, setTokenIndex] = useState<number | undefined>(undefined)

  const handleToken2Change = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const index = e.target.selectedIndex - 1; // Adjust for the disabled first option
    if (index >= 0) {
      setTokenIndex(index);
    }
  };
  
  useEffect(() => {
    (async () => {
      const result = await wallet();
      const ethEffBalance = result?.ethBalance
      const response = await axios.get(`${API}/fetch-token?owner=${owner}`);
      response.data.tokenFound.ethBalance = ethEffBalance;
      setGlobalUser(response.data.tokenProp);
    })();
  }, [ethBalance, owner, setGlobalUser]);
  
  const AddLiquidity = async () => {
    try {
      const walletResult = await wallet();
      const signer = await walletResult?.signer;
  
      const factory = tokenFactory![tokenIndex!];
      const address = tokenAddress![tokenIndex!];
      const id = fileId![tokenIndex!];
      const balance = tokenBalance![tokenIndex!]
      const name = tokenName![tokenIndex!];
      const symbol = tokenSymbol![tokenIndex!]
      
      const { tx } = await addLiquidity(signer!, ethAmount!, factory, parseInt(tokenAmount!));
      setHash(tx);
      const updateDoc = await fileverseAgent().updateFile(id, `token_name: ${name};\n token_symbol: ${symbol};\n token_balance: ${balance};\n token_CA: ${address};\n tokenFactory: ${factory};\n liquidity(ETH -> token): ${ethAmount} -> ${tokenAmount}`);
      console.log(`Updated doc: ${updateDoc}`);
    } catch (error) {
      console.error("Error adding liquidity:", error);
    }
  };

    return (
      <div className="card w-full max-w-sm shrink-0 shadow-2xl">
        <div className="card-body text-base-content">
          <h2 className="card-title"> Add Liquidity </h2>
          <label className="text-primary">
            You can only add ETH liquidity to your custom token
          </label>
          <form>
            <div className="card-body">
              <fieldset className="fieldset">
                <legend className="legend">Token 1</legend>
                <select
                  defaultValue="Select a token"
                  className="select select-primary"
                >
                  <option disabled={true}>Select a token</option>
                  <option>ETH</option>
                </select>
                <input
                  type="text"
                  className="input input-primary"
                  onChange={(e) => setEthAmount(e.target.value)}
                  placeholder="0"
                />
                <legend className="legend">Balance: {ethBalance}</legend>

                <div className="flex justify-center my-2">
                  <ArrowDown className="w-12 h-12" />
                </div>

                <legend className="legend">Token 2</legend>
                <select
                  defaultValue="Select a token"
                  className="select select-primary"
                  onChange={handleToken2Change}
                  // value={selectedToken2}
                >
                  <option disabled={true}>Select a token</option>
                  {tokenSymbol?.map((symbol, index) => (
                    <option value={symbol} key={index}>{symbol}</option>
                  ))}
                </select>
                <input
                  type="text"
                  className="input input-primary"
                  placeholder="0"
                  onChange={(e) => setTokenAmount(e.target.value)}
                />
                <button
                  type="button"
                  className="btn btn-primary mt-4"
                  onClick={AddLiquidity}
                >
                  Add Liquidity
                </button>
              </fieldset>
              {hash ? <p>You can view the transaction status here: {hash}</p> : <></>}
            </div>
          </form>
          {/* {isModalOpen && (
            <dialog id="my_modal_1" className="modal modal-open">
              <div className="modal-box">
                <h3 className="font-bold text-lg">You can only add ETH</h3>
                <p className="py-4">you can only add ETH to the liquidity pool of your token</p>
                <div className="modal-action">
                  <form method="dialog" onClick={() => setIsModalOpen(false)}>
                    <button className="btn">Close</button>
                  </form>
                </div>
              </div>
            </dialog>
          )} */}
        </div>
      </div>
    );
}