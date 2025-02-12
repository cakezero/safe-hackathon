// import ConnectButton from "./ConnectButton"
import { Wallet } from "lucide-react";

export default function NavBar() {
    const connectWallet = () => {
        
    }
    return (
      <div className="navbar bg-base-100 shadow-sm container mx-auto">
        <div className="flex-1">
          <a className="btn btn-ghost text-xl">Token Forge</a>
        </div>
        <div className="flex-none">
          <button className="btn btn-primary" onClick={connectWallet}>
            <Wallet />
            Connect Wallet
          </button>
        </div>
      </div>
    );
}