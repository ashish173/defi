import json
from brownie import LampToken, TokenFarm, config, network, DappToken
from scripts.helpful_scripts import get_account, get_contract
from web3 import Web3
import json
import yaml 
import shutil 
import os 

KEPT_BALANCE = Web3.toWei(100, "ether")


def deploy_token_farm_and_dapp_token(front_end_update=False):
    account = get_account()
    dapp_token = DappToken.deploy({"from": account})
    token_farm = TokenFarm.deploy(
        dapp_token.address,
        {"from": account},
        publish_source=config["networks"][network.show_active()]["verify"],
    )

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
    if front_end_update:
        update_front_end()
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

def update_front_end():
    # Send the build folder
    copy_folders_to_front_end("./build", "./front_end/src/chain-info")

    # Sending the front end our config in JSON format
    with open("brownie-config.yaml", "r") as brownie_config:
        config_dict = yaml.load(brownie_config, Loader=yaml.FullLoader)
        with open("./front_end/src/brownie-config.json", "w") as brownie_config_json:
            json.dump(config_dict, brownie_config_json)
    print("Front end updated!")


def copy_folders_to_front_end(src, dest):
    if os.path.exists(dest):
        shutil.rmtree(dest)
    shutil.copytree(src, dest)


def main():
    deploy_token_farm_and_dapp_token(front_end_update=True)
