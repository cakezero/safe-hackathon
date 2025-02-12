import { ArrowDown } from "lucide-react"
import { useEffect, useState } from "react";


export default function LiquidityForm() {
    const [selectedToken1, setSelectedToken1] = useState("");
    const [selectedToken2, setSelectedToken2] = useState("");
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleToken2Change = (e: React.ChangeEvent<HTMLSelectElement>) => {
      e.preventDefault();
      setSelectedToken2(e.target.value);
    };
  
    const handleAddLiquidityIfNotETHSelected = () => {
      if (selectedToken2 !== "ETH") {
        setIsModalOpen(true);
      } else {
        //do nothing for now
        console.log("ETH selected");
      }
    };

    return (
      <div className="card w-full max-w-sm shrink-0 shadow-2xl">
        <div className="card-body text-base-content">
          <h2 className="card-title"> Add Liquidity </h2>
          <label className="text-primary">you can only add ETH liquidity to your custom token</label>
          <form>
            <div className="card-body">
              <fieldset className="fieldset">
                <legend className="legend">Token 1</legend>
                <select
                  defaultValue="Select a token"
                  className="select select-primary"
                >
                  <option disabled={true}>Select a token</option>
                  <option>Token 1</option>
                  <option>Token 2</option>
                </select>
                <input
                  type="text"
                  className="input input-primary"
                  placeholder="0"
                />
                <legend className="legend">Balance: </legend>

                <div className="flex justify-center my-2">
                  <ArrowDown className="w-12 h-12" />
                </div>

                <legend className="legend">Token 2 (ETH)</legend>
                <select
                  defaultValue="Select a token"
                  className="select select-primary"
                  onChange={handleToken2Change}
                  value={selectedToken2}
                >
                  <option disabled={true}>Select a token</option>
                  <option>ETH</option>
                  <option>Token 2</option>
                </select>
                <input
                  type="text"
                  className="input input-primary"
                  placeholder="0"
                />
                <legend className="legend">Balance: </legend>
                <button 
                  type="button"
                  className="btn btn-primary mt-4"
                  onClick={handleAddLiquidityIfNotETHSelected}
                  >
                    Add Liquidity
                </button>
              </fieldset>
            </div>
          </form>
          {isModalOpen && (
            <dialog id="my_modal_1" className="modal modal-open">
              <div className="modal-box">
                <h3 className="font-bold text-lg">you can only add ETH</h3>
                <p className="py-4">you can only add ETH to the liquidity pool inyour token</p>
                <div className="modal-action">
                  <form method="dialog" onClick={() => setIsModalOpen(false)}>
                    <button className="btn">Close</button>
                  </form>
                </div>
              </div>
            </dialog>
          )}
        </div>
      </div>
    );
}