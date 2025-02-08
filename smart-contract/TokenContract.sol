// SPDX-License-Identifier: MIT

pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import '../interface/IUniswapV2Router.sol';
import '../interface/IUniswapV2Factory.sol';

contract Token is ERC20 {
    constructor(
        string memory name,
        string memory symbol,
        uint256 initialSupply
    ) ERC20(name, symbol) {
        _mint(msg.sender, initialSupply * 10 ** 18);
    }
}

contract TokenContract {
    address public constant UNISWAP_V2_ROUTER = 0xeE567Fe1712Faf6149d80dA1E6934E354124CfE3;
    address public constant UNISWAP_V2_FACTORY = 0xF62c03E08ada871A0bEb309762E260a7a6a880E6;

    error MustSendETH();
    error MustSpecifyTokenAmount();

    address public token;
    address public pair;
    address public weth;
    IUniswapV2Router public uniswapV2Router;

  constructor(string memory name, string memory symbol, uint256 initialSupply) {

    Token NewToken = new Token(name, symbol, initialSupply);

    token = address(NewToken);

    uniswapV2Router = IUniswapV2Router(UNISWAP_V2_ROUTER);

    weth = uniswapV2Router.WETH();

    IERC20(token).approve(UNISWAP_V2_ROUTER, type(uint256).max);

    pair = IUniswapV2Factory(UNISWAP_V2_FACTORY).createPair(token, weth);
  }

  function getTokenAddress() external view returns (address) {
    return token;
  }

  function AddLiquidityETH(uint tokenAmountToBeAdded) external payable {
    if (msg.value <= 0) revert MustSendETH();

    if (tokenAmountToBeAdded <= 0) revert MustSpecifyTokenAmount();

    IERC20(token).transferFrom(msg.sender, address(this), tokenAmountToBeAdded);

    uniswapV2Router.addLiquidityETH{value: msg.value}(
      token,
      tokenAmountToBeAdded,
      0,
      0,
      msg.sender,
      block.timestamp + 360
    );
  }

  receive() external payable {};
}