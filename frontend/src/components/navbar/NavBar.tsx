import ConnectButton from "./ConnectButton"

export default function NavBar() {
    return(
        <div className="navbar bg-base-100 shadow-sm container mx-auto">
            <div className="flex-1">
                <a className="btn btn-ghost text-xl">token creation</a>
            </div>
            <div className="flex-none">
                <ConnectButton />
            </div>
        </div>
    )
}