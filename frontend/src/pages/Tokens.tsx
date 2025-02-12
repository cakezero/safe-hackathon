function Tokens() {
    return (
        <div className="hero bg-base-200 min-h-screen">
            <div className="hero-content text-center">
                <div className="max-w-md">
                    <h1 className="text-5xl font-bold">my tokens</h1>

                    <div className="overflow-x-auto rounded-box border border-base-content/5 bg-base-100">
                        <table className="table">
                            {/* head */}
                            <thead>
                            <tr>
                                <th></th>
                                <th>name</th>
                                <th>symbol</th>
                                <th>liquidity</th>
                            </tr>
                            </thead>
                            <tbody>
                            {/* row 1 */}
                            <tr>
                                <th>1</th>
                                <td>Token 1</td>
                                <td>sum</td>
                                <td>1000000000</td>
                            </tr>
                            {/* row 2 */}
                            <tr>
                                <th>2</th>
                                <td>Token 2</td>
                                <td>doge</td>
                                <td>2000000000</td>
                            </tr>
                            {/* row 3 */}
                            <tr>
                                <th>3</th>
                                <td>Token 3</td>
                                <td>cate</td>
                                <td>3000000000</td>
                            </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Tokens