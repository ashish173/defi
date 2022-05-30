from lib2to3.pgen2 import token
from webbrowser import get
import pytest
from scripts.helpful_scripts import get_account, get_contract, LOCAL_BLOCKCHAIN_ENVIRONMENTS, INITIAL_VALUE
from scripts.deploy import KEPT_BALANCE, deploy_token_farm_and_dapp_token
from brownie import TokenFarm, LampToken, network, exceptions, DappToken
import pytest
from web3 import Web3

STAKE_AMOUNT = Web3.toWei(1, "ether")
UNSTAKE_AMOUNT = Web3.toWei(0.5, "ether")

def test_set_token_price_feed():
    # Prepare
    if network.show_active() not in LOCAL_BLOCKCHAIN_ENVIRONMENTS:
        pytest.skip()
    account = get_account()
    non_owner_account = get_account(Index=1)
    token_farm, lamp_token = deploy_token_farm_and_dapp_token()
    price_feed = get_contract("dai_usd_price_feed")
    # Act
    tx = token_farm.setTokenPriceFeed(
        lamp_token, price_feed, {"from": account})
    tx.wait(1)
    # Assert
    assert token_farm.tokenPriceFeedMapping(lamp_token.address) == price_feed
    with pytest.raises(exceptions.VirtualMachineError):
        token_farm.setTokenPriceFeed(
            lamp_token, price_feed, {"from": non_owner_account})

def test_stake_tokens():
    # prepare
    # get account
    account = get_account()
    token_farm, lamp_token = deploy_token_farm_and_dapp_token()
    # Act
    # stakers stake various amounts of tokens
    approval = lamp_token.approve(
        token_farm.address, STAKE_AMOUNT, {"from": account})

    token_farm.stakeTokens(STAKE_AMOUNT, lamp_token.address, {
        "from": account})
 

    user_balance = lamp_token.balanceOf(account.address)
    # stakers get equivalent lamp tokens for their value staked
    assert (
        token_farm.stakingBalance(account, lamp_token.address) == STAKE_AMOUNT
    )
    return token_farm, lamp_token

def test_unstake_tokens():
    # prepare
    account = get_account()
    # stake tokens
    token_farm, lamp_token = test_stake_tokens()
    
    # act
    # call unstake tokens
    token_farm.unStakeToken(lamp_token.address)

    # assert 
    # user balance will be kept balance 
    assert lamp_token.balanceOf(account.address) == KEPT_BALANCE
    # staking balance will become 0
    assert (
        token_farm.stakingBalance(account.address, lamp_token.address) == 0
    )
    # unique tokens staked will be lesser by 0
    assert (
        token_farm.uniqueTokensStaked(account.address) == 0
    )

def test_partial_unstake_tokens():
    account = get_account()
    token_farm, dapp_token = test_stake_tokens()

    token_farm.unStakeTokenPartial(dapp_token.address, UNSTAKE_AMOUNT)

    balance_dapp = dapp_token.balanceOf(account.address)

    assert (
        balance_dapp == KEPT_BALANCE - STAKE_AMOUNT + UNSTAKE_AMOUNT
    )
    assert (
        token_farm.uniqueTokensStaked(account.address) == 1
    )

def test_issue_tokens():
    # prepare
    # get account
    account = get_account()

    token_farm, lamp_token = test_stake_tokens()

    user_balance = lamp_token.balanceOf(account.address)
    print(f"user balance {user_balance}")
    # stakers get equivalent lamp tokens for their value staked
    assert (
        token_farm.stakingBalance(account, lamp_token.address) == STAKE_AMOUNT
    )

    token_farm.issueTokens({"from": account})

    assert (
        # assumption lamp token is similar to dai token hence using the dai_usd_price_feed
        # we staked 1 eth worth of lamp(~dai) with token farm
        # the amount of lamp tokens to be received is equal to the USD value of the deposit
        # intiail value of mock is $2000 to 1 eth
        lamp_token.balanceOf(account.address) == user_balance + INITIAL_VALUE
    )

def test_add_allowed_tokens():
    pass

def test_set_price_feed_contract():
    # Prepare
    
    # get price feed

    # get token
    
    # Act

    # Assert 

    pass