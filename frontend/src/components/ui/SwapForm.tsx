import { ArrowUpDown } from "lucide-react";
import { useState, useEffect } from "react";
import { Spinner } from "../../utils/Spinner";
import { UserContextType } from "../../types/types";
import { useUser } from "../../context/useUser";
import { TokenSwap, ETHSwap } from "../../token/token";
import { wallet } from "../navbar/wallet";
import { ethers } from "ethers";
import { abi } from "../../token/erc/erc20";
import toast from "react-hot-toast";

interface SwapFormProps {
    isSwapped: boolean;
}

let ethInput: string;
let tokenInput: string;
let indexInput: number;
let address: string;

const InputSelectField = ({ isSwapped }: SwapFormProps) => {
    const [tokenIndex, setTokenIndex] = useState<number | undefined>(undefined);
    const [tokenAmount, setTokenAmount] = useState<string>("0");
    const [tokenBalance, setBalance] = useState<string>("0");
    const [ethBalance, setEthBalance] = useState<string>("0");
    const [ethAmount, setEthAmount] = useState<string>("0");
    const { globalUser } = useUser() as UserContextType;
    const { tokenSymbol } = globalUser ?? {}

    ethInput = ethAmount;
    tokenInput = tokenAmount;
    indexInput = tokenIndex!;

    const handleToken = (e: React.ChangeEvent<HTMLSelectElement>) => {
      const index = e.target.selectedIndex - 1; // Adjust for the disabled first option
      if (index >= 0) {
        setTokenIndex(index);
      }
    };

    useEffect(() => {
      (async () => {
        const result = await wallet();
          const signer = result?.signer;
          setEthBalance(result?.ethBalance.toString())

        const contract = new ethers.Contract(address!, abi, signer);
        const balance = await contract.balanceOf(await signer?.getAddress());
        setBalance(balance);
      })();
    });

    if (isSwapped) {
        return (
          <>
            <div className="flex flex-row">
              <p>Balance: {ethBalance}</p>
              <input
                type="number"
                onChange={(e) => setEthAmount(e.target.value)}
                className="input input-primary w-1/2 mr-2"
                placeholder="0.00"
              />
              <select className="select select-primary">
                <option defaultChecked>ETH</option>
              </select>
            </div>
          </>
        );
    }
    
        return (
          <>
                <div className="flex flex-row">
                    <p>Balance: {tokenBalance}</p>
              <input
                type="number"
                className="input input-primary w-1/2 mr-2"
                placeholder="0.00"
                onChange={(e) => setTokenAmount(e.target.value)}
              />
              <select
                defaultValue="Select a token"
                className="select select-primary"
                onChange={handleToken}
              >
                <option disabled={true}>Select your token</option>
                {tokenSymbol?.map((symbol, index) => (
                  <option key={index} value={symbol}>
                    {symbol}
                  </option>
                ))}
              </select>
            </div>
          </>
        );
    };
    
    export default function SwapForm() {
        const [isSwapped, setIsSwapped] = useState<boolean>(false);
        const [submit, setSubmit] = useState<boolean>(false);
        const { globalUser } = useUser() as UserContextType;
        const { tokenAddress } = globalUser ?? {};

        address = tokenAddress![indexInput!];

        const swapToken = async () => {
          setSubmit(true);
           const result = await wallet();

            const signer = result?.signer;
            await TokenSwap(signer!, address!, tokenInput!);
            toast.success("Token for ETH swap completed");

          setSubmit(false);
        };

        const ethSwap = async () => {
            setSubmit(true);
            const result = await wallet();

            const signer = result?.signer;
            await ETHSwap(signer!, address!, ethInput!);
            toast.success("ETH for token swap completed")
            setSubmit(false);
        };
    
        const handleSwap = () => {
            setIsSwapped(!isSwapped);
        };
    
        return (
          <div className="card w-full max-w-sm shrink-0 shadow-2xl">
            <div className="card-body text-base-content">
              <h2 className="card-title"> Swap Tokens </h2>
              <form>
                <div className="card-body">
                  <label className="text-primary">
                    You can only swap ETH for your token and vice versa
                  </label>
                  <fieldset className="fieldset">
                    <div className="flex items-center mb-4">
                      <InputSelectField isSwapped={isSwapped} />
                    </div>

                    <div className="flex justify-center my-2">
                      <button
                        type="button"
                        className="btn btn-ghost"
                        onClick={handleSwap}
                      >
                        <ArrowUpDown className="w-8 h-8" />
                      </button>
                    </div>

                    <div className="flex items-center mb-4">
                      <InputSelectField isSwapped={!isSwapped} />
                    </div>

                    <button 
                    type="button"
                      onClick={isSwapped ? ethSwap : swapToken}
                      className="btn btn-primary mt-4 w-full"
                    >
                      {submit ? (
                        <>
                          <Spinner />
                          <span className="ml-2">Swapping Tokens... </span>
                        </>
                      ) : (
                        "Swap"
                      )}
                    </button>
                  </fieldset>
                </div>
              </form>
            </div>
          </div>
        );
    }