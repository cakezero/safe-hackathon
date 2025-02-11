//import { ChangeEvent } from "react";

interface TokenDetails {
    tokenName: string;
    tokenSymbol: string;
    tokenSupply: string;
}

interface CreateTokenFormProps {
    tokenDetails: TokenDetails;
    setTokenDetails: React.Dispatch<React.SetStateAction<TokenDetails>>
}

export default function CreateTokenForm({ tokenDetails, setTokenDetails }: CreateTokenFormProps) {

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setTokenDetails((prevDetails) => ({
            ...prevDetails,
            [name]: value.trim(), // Trim the input value to remove whitespace
        }));
    };

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
                    <button className="btn btn-primary mt-4">create</button>
                </fieldset>
                </div>
            </form>
            </div>
        </div>
    )
}