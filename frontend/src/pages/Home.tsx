import { useState } from "react";
import CreateTokenForm from "../components/ui/CreateTokenForm";
import LiquidityForm from "../components/ui/LiquidityForm";
import SwapForm from "../components/ui/SwapForm";
import TokenPreviewCard from "../components/ui/TokenPreviewCard";

interface TokenDetails {
  tokenName: string;
  tokenSymbol: string;
  tokenSupply: string;
}

function App() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [tokenDetails, setTokenDetails] = useState<TokenDetails>({
    tokenName: "",
    tokenSymbol: "",
    tokenSupply: "",
  });

  const handleTabLiquidityTrigger = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.value === 'tab2') {
      setIsModalOpen(true);
    }
  };

  return (
    <>
      <div className="hero bg-base-200 min-h-screen ">
        <div className="container mx-auto">
          <div className="hero-content flex-col lg:flex-row">
            <div className="tabs tabs-lift">
              <input
                type="radio"
                name="my_tabs_3"
                value="tab1"
                className="tab"
                aria-label="Create Token"
                defaultChecked
              />
              <div className="tab-content bg-base-100 border-base-300 p-6">
                {/* <CreateTokenForm
                  tokenDetails={tokenDetails}
                  setTokenDetails={setTokenDetails}
                /> */}
              </div>

              <input
                type="radio"
                name="my_tabs_3"
                className="tab"
                value="tab2"
                aria-label="Add Liquidity"
                onChange={handleTabLiquidityTrigger}
              />
              <div className="tab-content bg-base-100 border-base-300 p-6">
                {/* <LiquidityForm /> */}
              </div>

              <input
                type="radio"
                name="my_tabs_3"
                className="tab"
                value="tab3"
                aria-label="Swap"
              />
              <div className="tab-content bg-base-100 border-base-300 p-6">
                <SwapForm />
              </div>
            </div>
            <div className="w-full flex justify-center mt-4">
              <TokenPreviewCard
                tokenName={tokenDetails.tokenName}
                tokenSymbol={tokenDetails.tokenSymbol}
                tokenSupply={tokenDetails.tokenSupply}
              />
            </div>
          </div>
        </div>
      </div>
      {isModalOpen && (
        <div className="modal modal-open">
          <div className="modal-box">
            <h3 className="font-bold text-lg">reminder: you can only add ETH liquidity to your custom token</h3>
            <p>you can only add ETH (etehreum) liquidity to your custom token</p>
            <button className="btn btn-primary" onClick={() => setIsModalOpen(false)}>Close</button>
          </div>
        </div>
      )}
    </>
  );
}

export default App;
