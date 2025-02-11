import { ArrowUpDown } from "lucide-react";

export default function SwapForm() {
    return (
        <div className="card w-full max-w-sm shrink-0 shadow-2xl">
            <div className="card-body text-base-content">
                <h2 className="card-title"> Swap Tokens </h2>
                <form>
                    <div className="card-body">
                        <fieldset className="fieldset">
                            <div className="flex items-center mb-4 b">
                                <input type="text" className="input input-primary w-1/2 mr-2" placeholder="0" />
                                <select defaultValue="Select a token" className="select select-primary w-1/2">
                                    <option disabled={true}>Select a token</option>
                                    <option>Token 1</option>
                                    <option>Token 2</option>
                                </select>
                            </div>

                            <div className="flex justify-center my-2">
                                <ArrowUpDown className="w-8 h-8" />
                            </div>

                            <div className="flex items-center mb-4">
                                <input type="text" className="input input-primary w-1/2 mr-2" placeholder="0" />
                                <select defaultValue="Select a token" className="select select-primary w-1/2">
                                    <option disabled={true}>Select a token</option>
                                    <option>Token 1</option>
                                    <option>Token 2</option>
                                </select>
                            </div>

                            <button className="btn btn-primary mt-4 w-full">Swap</button>
                        </fieldset>
                    </div>
                </form>
            </div>
        </div>    
    )
}