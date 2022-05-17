from brownie import LampToken, TokenFarm, config, network, DappToken
from scripts.helpful_scripts import get_account, get_contract
from web3 import Web3

KEPT_BALANCE = Web3.toWei(100, "ether")


def deploy_token_farm_and_dapp_token(update_front_end_flag=False):
    account = get_account()
    dapp_token = DappToken.deploy({"from": account})
    token_farm = TokenFarm.deploy(
        dapp_token.address,
        {"from": account},
        publish_source=config["networks"][network.show_active()]["verify"],
    )
    print(f"tokens transfering to token farm: {dapp_token.totalSupply() - 100}")
    print(f"tokens transfering to token farm: {dapp_token.totalSupply() - KEPT_BALANCE}")

    tx = dapp_token.transfer(
        token_farm.address,
        dapp_token.totalSupply() - KEPT_BALANCE,
        {"from": account},
    )

    # print(f"total balance with token farm {}")
    tx.wait(1)
    info = tx.traceback()
    print(f"transfer info: {info}")

    fau_token = get_contract("fau_token")
    weth_token = get_contract("weth_token")

    add_allowed_tokens(
        token_farm,
        {
            dapp_token: get_contract("dai_usd_price_feed"),
            fau_token: get_contract("dai_usd_price_feed"),
            weth_token: get_contract("eth_usd_price_feed"),
        },
        account,
    )
    # if update_front_end_flag:
        # update_front_end()
    return token_farm, dapp_token

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
    # deploy_token_farm_and_lamp_token()
    deploy_token_farm_and_dapp_token()
