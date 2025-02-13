import { MoveDown } from "lucide-react";
import { useState } from "react";

interface SwapFormProps {
    isSwapped: boolean;
}

const InputSelectField = ({ isSwapped }: SwapFormProps) => {
    if (isSwapped) {
        return (
            <>
                <div className="flex flex-row">
                    <input type="number" className="input input-primary w-1/2 mr-2" placeholder="0.00" />
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
                    <input type="number" className="input input-primary w-1/2 mr-2" placeholder="0.00" />
                    <select defaultValue="Select a token" className="select select-primary">
                        <option disabled={true}>Select your token</option>
                        <option>your token</option>
                    </select>
                </div>
            </>
        );
    };
    
    export default function SwapForm() {
        const [isSwapped, setIsSwapped] = useState(false);
    
        const handleSwap = () => {
        setIsSwapped(!isSwapped);
        };
    
        return (
        <div className="card w-full max-w-sm shrink-0 shadow-2xl">
            <div className="card-body text-base-content">
            <h2 className="card-title"> Swap Tokens </h2>
            <form>
                <div className="card-body">
                    <label className="text-primary">you can only swap ETH for your token and vice versa</label>
                <fieldset className="fieldset">
                    <div className="flex items-center mb-4">
                    <InputSelectField isSwapped={isSwapped} />
                    </div>
    
                    <div className="flex justify-center my-2">
                        <button type="button" className="btn btn-ghost" onClick={handleSwap}>
                            <MoveDown className="w-8 h-8" />
                        </button>
                    </div>
    
                    <div className="flex items-center mb-4">
                    <InputSelectField isSwapped={!isSwapped} />
                    </div>
    
                    <button className="btn btn-primary mt-4 w-full">Swap</button>
                </fieldset>
                </div>
            </form>
            </div>
        </div>
        );
    }