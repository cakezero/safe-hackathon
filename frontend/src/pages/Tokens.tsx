import { useEffect, useState } from "react";
import { useUser } from "../context/useUser";
import { UserContextType } from "../types/types";
import axios from "axios";
import { API } from "../utils/constants";

function Tokens() {
  const [tokens, setTokens] = useState<string[][]>([]);
  const { globalUser } = useUser() as UserContextType;
  const { fileId } = globalUser ?? {};

  useEffect(() => {
    if (!fileId || fileId.length === 0) return;

    const fetchTokens = async () => {
      const fetchedTokens: string[][] = [];
      for (const id of fileId) {
        try {
          const response = await axios.get(`${API}/get?id=${id}`);
          const fetchedFile = response.data.file.split(";");
          fetchedTokens.push(fetchedFile);
        } catch (error) {
          console.error(`Failed to fetch file for ID: ${id}`, error);
        }
      }
      setTokens(fetchedTokens);
    };

    fetchTokens();
  }, [fileId]);

  return (
    <div className="hero bg-base-200 min-h-screen">
      <div className="hero-content text-center">
        <div className="max-w-md">
          <h1 className="text-5xl font-bold">My Tokens</h1>

          <div className="rounded-box border border-base-content/5 bg-base-100 mt-6">
            <table className="table">
              {/* Table Head */}
              <thead>
                <tr>
                  <th>#</th>
                  <th>Name</th>
                  <th>Symbol</th>
                  <th>Token Address</th>
                  <th>Token Balance</th>
                  <th>Token Factory</th>
                  <th>Liquidity(ETH {"->"} token)</th>
                </tr>
              </thead>
              {/* Table Body */}
              <tbody>
                {tokens.map((innerArray, index) => {
                  const name =
                    innerArray
                      .find((item) => item.startsWith("token_name:"))
                      ?.split(": ")[1] || "N/A";
                  const symbol =
                    innerArray
                      .find((item) => item.startsWith("token_symbol:"))
                          ?.split(": ")[1] || "N/A";
                    const tokenAddress =
                      innerArray
                        .find((item) => item.startsWith("token_symbol:"))
                        ?.split(": ")[1] || "N/A";
                    const tokenBalance =
                        innerArray
                        .find((item) => item.startsWith("token_symbol:"))
                        ?.split(": ")[1] || "N/A";
                    const tokenFactory =
                      innerArray
                        .find((item) => item.startsWith("token_symbol:"))
                        ?.split(": ")[1] || "N/A";
                  const liquidity =
                    innerArray
                      .find((item) => item.startsWith("liquidity(ETH -> token):"))
                      ?.split(": ")[1] || "0";

                  return (
                    <tr key={index}>
                      <th>{index + 1}</th>
                      <td>{name}</td>
                      <td>{symbol}</td>
                      <td>{tokenAddress}</td>
                      <td>{tokenBalance}</td>
                      <td>{tokenFactory}</td>
                      <td>{liquidity}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Tokens;
