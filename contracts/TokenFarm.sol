// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@chainlink/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol";

contract TokenFarm is Ownable {
    // stakeTokens
    mapping(address => mapping(address => uint256)) public stakingBalance;
    mapping(address => uint256) public uniqueTokensStaked;
    address[] public allowedTokens;
    address[] public stakers;
    IERC20 public lampToken;
    mapping(address => address) tokenPriceFeedMapping;

    constructor(address _lampTokenAddress) {
        lampToken = IERC20(_lampTokenAddress);
    }

    function stakeToken(uint256 _amount, address _token) public {
        require(_amount > 0, "amount should be more than 0.");
        require(tokenIsAllowed(_token), "token isn't allowed to stake");
        IERC20(_token).transferFrom(msg.sender, address(this), _amount);

        updateUniqueTokensStaked(msg.sender, _token);

        // update the local mapping for account and token balance
        stakingBalance[msg.sender][_token] =
            stakingBalance[msg.sender][_token] +
            _amount;

        // if unique tokens staked by staker is equal to 1 then update the
        // stakers list with staker address
        if (uniqueTokensStaked[msg.sender] == 1) {
            stakers.push(msg.sender);
        }
    }

    function unStakeToken(address _token) public {
        // confirm the balance is there for the staker
        // transfer to caller

        uint256 userBalance = stakingBalance[msg.sender][_token];
        require(userBalance <= 0, "not enough balance to unstake");
        IERC20(_token).transfer(msg.sender, userBalance);

        // update staking balance
        // update unique tokens staked mapping
        stakingBalance[msg.sender][_token] = 0;
        uniqueTokensStaked[msg.sender] = uniqueTokensStaked[msg.sender] - 1;
    }

    function updateUniqueTokensStaked(address _user, address _token) internal {
        if (stakingBalance[_user][_token] <= 0) {
            uniqueTokensStaked[_user] = uniqueTokensStaked[_user] + 1;
        }
    }

    function addAllowedTokens(address _token) public onlyOwner {
        allowedTokens.push(_token);
    }

    function tokenIsAllowed(address _token) internal returns (bool) {
        for (
            uint32 allowedTokenIndex;
            allowedTokenIndex < allowedTokens.length;
            allowedTokenIndex++
        ) {
            if (_token == allowedTokens[allowedTokenIndex]) {
                return true;
            }
        }
        return false;
    }

    // Unstake tokens
    // IssueTokens
    function issueTokens() public onlyOwner {
        // calculate total amount held by staker
        // transfer LampToken to user from contract.
        // LAMP tokens are transfered to TokenFarm at the time of deployment in constructor
        for (
            uint256 stakerIndex = 0;
            stakerIndex < stakers.length;
            stakerIndex++
        ) {
            address recipient = stakers[stakerIndex];
            uint256 userTotalValue = getUserTotalValue(recipient);
            lampToken.transfer(recipient, userTotalValue);
        }
    }

    function getUserTotalValue(address _user) public view returns (uint256) {
        uint256 totalValue = 0;
        require(uniqueTokensStaked[_user] <= 0, "No tokens staked");
        for (
            uint32 allowedTokensIndex;
            allowedTokensIndex < allowedTokens.length;
            allowedTokensIndex++
        ) {
            totalValue =
                totalValue +
                getUserSingleTokenValue(
                    _user,
                    allowedTokens[allowedTokensIndex]
                );
        }
        return totalValue;
    }

    function getUserSingleTokenValue(address _user, address _token)
        public
        view
        returns (uint256)
    {
        (uint256 price, uint256 decimals) = getTokenValue(_token);
        return (stakingBalance[msg.sender][_token] * price) / 10**decimals;
    }

    // only owner can set the token and it's price feed addresses
    function setTokenPriceFeed(address _token, address _priceFeed)
        public
        onlyOwner
    {
        tokenPriceFeedMapping[_token] = _priceFeed;
    }

    function getTokenValue(address _token)
        public
        view
        returns (uint256, uint256)
    {
        // get the token address for the network
        // fetch the data from chainlink price feeds AggregatorV3
        // return in uint256 at 8 decimals, make it 18 decimal places before returning
        // decimals is uint8 cast it to uint256 before returning
        address priceFeedAddress = tokenPriceFeedMapping[_token];
        AggregatorV3Interface priceFeed = AggregatorV3Interface(
            priceFeedAddress
        );
        (, int256 price, , , ) = priceFeed.latestRoundData();
        uint80 decimals = priceFeed.decimals();
        return (uint256(price), uint256(decimals));
    }
}
