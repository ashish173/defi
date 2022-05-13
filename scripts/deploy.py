from brownie import LampToken, TokenFarm, config, network
from scripts.helpful_scripts import get_account, get_contract

KEPT_BALANCE = 100


def deploy_token_farm_and_lamp_token():
    account = get_account()
    print(f"Account: {account}")
    # deploy Lamp Token contract
    lamp_token = LampToken.deploy({"from": account})

    # deploy Token Farm contract
    token_farm = TokenFarm.deploy(lamp_token.address, {
                                  "from": account}, publish_source=config["networks"][network.show_active()]["verify"])

    # Transfer the Lamp tokens to Token Farm contract
    tx = lamp_token.transfer(token_farm.address,
                             lamp_token.totalSupply() - KEPT_BALANCE, {"from": account})
    tx.wait(1)

    # Add allowed tokens; their token_address and price feeds for tokens
    # 1. LAMP (erc20), FAU/DAI (dai token), WETH (erc20)

    weth_token = get_contract("weth_token")
    fau_token = get_contract("fau_token")

    # maps token addresses with their price feeds
    dict_of_allowed_tokens = {
        lamp_token: get_contract("dai_usd_price_feed"),
        weth_token: get_contract("eth_usd_price_feed"),
        fau_token: get_contract("dai_usd_price_feed")
    }
    # create a dict of token addresses to their price feed addresses
    # mocking locally.
    add_allowed_tokens(token_farm, dict_of_allowed_tokens, account)
    return token_farm, lamp_token


def add_allowed_tokens(token_farm, dict_of_allowed_tokens, account):
    for token in dict_of_allowed_tokens:
        # add allowed tokens
        add_tx = token_farm.addAllowedTokens(token, {"from": account})
        add_tx.wait(1)
        # set pricefeed for tokens
        set_tx = token_farm.setTokenPriceFeed(
            token.address, dict_of_allowed_tokens[token], {"from": account})
        set_tx.wait(1)
    return token_farm


def main():
    deploy_token_farm_and_lamp_token()
