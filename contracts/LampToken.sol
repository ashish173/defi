// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

// LampToken
contract LampToken is ERC20 {
    constructor() public ERC20("Guest Token", "GUST") {
        _mint(msg.sender, 1000000000000000000000000);
    }
}
