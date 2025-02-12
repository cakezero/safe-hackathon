import { ArrowDown } from "lucide-react"
import { useEffect, useState } from "react";


export default function LiquidityForm() {
    return (
      <div className="card w-full max-w-sm shrink-0 shadow-2xl">
        <div className="card-body text-base-content">
          <h2 className="card-title"> Add Liquidity </h2>
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

                <legend className="legend">Token 2</legend>
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
                <button className="btn btn-primary mt-4">Add Liquidity</button>
              </fieldset>
            </div>
          </form>
        </div>
      </div>
    );
}