import { Coins } from "lucide-react";

interface TokenPreviewCardProps {
    tokenName: string;
    tokenSymbol: string;
    tokenSupply: string;
}

export default function TokenPreviewCard({ tokenName, tokenSymbol, tokenSupply }: TokenPreviewCardProps) {
    return (
        <div className="card card-border bg-secondary text-base-100 w-96 relative">
            <div className="absolute top-2 left-2">
                <span className="badge badge-primary">Preview</span>
            </div>
            <div className="absolute top-2 right-2">
                <Coins className="w-6 h-6" />
            </div>
            <div className="card-body">
                <h2 className="card-title">{tokenName || "Token Name"}</h2>
                <p>Symbol: {tokenSymbol || "TKN"}</p>
                <p>Supply: {tokenSupply || "690000000"}</p>
            </div>
        </div>
    );
}