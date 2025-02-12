import { useState } from "react";
import CreateTokenForm from "./components/ui/CreateTokenForm";
import LiquidityForm from "./components/ui/LiquidityForm";
import SwapForm from "./components/ui/SwapForm";
import TokenPreviewCard from "./components/ui/TokenPreviewCard";
import { NavBar } from "./components/navbar/NavBar";

interface TokenDetails {
  tokenName: string;
  tokenSymbol: string;
  tokenSupply: string;
}

function App() {
  const [tokenDetails, setTokenDetails] = useState<TokenDetails>({
    tokenName: "",
    tokenSymbol: "",
    tokenSupply: "",
  });

  console.log("Token Details:", tokenDetails);

  return (
    <>
      <NavBar />
      <div className="container mx-auto">
        <div className="hero bg-base-200 min-h-screen">
          <div className="hero-content flex-col lg:flex-row">
            <div className="tabs tabs-lift">
              <input
                type="radio"
                name="my_tabs_3"
                className="tab"
                aria-label="Create Token"
                defaultChecked
              />
              <div className="tab-content bg-base-100 border-base-300 p-6">
                <CreateTokenForm
                  tokenDetails={tokenDetails}
                  setTokenDetails={setTokenDetails}
                />
              </div>

              <input
                type="radio"
                name="my_tabs_3"
                className="tab"
                aria-label="Add Liquidity"
              />
              <div className="tab-content bg-base-100 border-base-300 p-6">
                <LiquidityForm />
              </div>

              <input
                type="radio"
                name="my_tabs_3"
                className="tab"
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
    </>
  );
}

export default App;
