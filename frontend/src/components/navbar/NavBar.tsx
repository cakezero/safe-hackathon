// import ConnectButton from "./ConnectButton"
import { Wallet, Menu } from "lucide-react";
import {NavLink} from "react-router";
import { wallet } from "./wallet";

export default function NavBar() {
    return (
      <div className="navbar bg-base-100 shadow-sm container mx-auto">
        <div className="navbar-start">
          <div className="dropdown">
            <div tabIndex={0} role="button" className="btn btn-ghost lg:hidden">
              <Menu />
            </div>
            <ul
              tabIndex={0}
              className="menu menu-sm dropdown-content bg-base-100 rounded-box z-1 mt-3 w-52 p-2 shadow">
              <li>
                <NavLink to="/tokens">my tokens</NavLink>
              </li>
            </ul>
          </div>
          <NavLink to="/" className="btn btn-ghost text-xl">token forge</NavLink>
        </div>
        <div className="navbar-center hidden lg:flex">
          <ul className="menu menu-horizontal px-1">
            <li>  
              <NavLink to="/tokens">my tokens</NavLink>
            </li>
          </ul>
        </div>
        <div className="navbar-end">
          <button className="btn btn-primary" onClick={wallet}>
            <Wallet />
            Connect Wallet
          </button>
        </div>
          
      </div>
    );
}