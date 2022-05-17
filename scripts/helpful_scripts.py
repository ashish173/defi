from brownie import accounts, config, network, MockV3Aggregator, Contract, MockDai, MockWeth
FORKED_LOCAL_ENVIRONMENTS = ["mainnet-fork", "mainnet-fork-dev"]
LOCAL_BLOCKCHAIN_ENVIRONMENTS = ["development", "ganache-local"]


def get_account(Index=None, Id=None):
    if Index:
        return accounts[Index]
    if Id:
        return accounts.load(id)
    if (network.show_active() in FORKED_LOCAL_ENVIRONMENTS or
            network.show_active() in LOCAL_BLOCKCHAIN_ENVIRONMENTS):
        print("<<< returning local first account >>>")
        return accounts[0]
    return accounts.add(config["wallets"]["from_key"])


contract_to_mock = {
    "eth_usd_price_feed": MockV3Aggregator,
    "dai_usd_price_feed": MockV3Aggregator,
    "weth_token": MockWeth,
    "fau_token": MockDai
}


def get_contract(contract_name):
    """This function will grab the contract addresses from the brownie config
    if defined, otherwise, it will deploy a mock version of that contract, and
    return that mock contract.

        Args:
            contract_name (string)

        Returns:
            brownie.network.contract.ProjectContract: The most recently deployed
            version of this contract.
    """
    contract_type = contract_to_mock[contract_name]
    if network.show_active() in LOCAL_BLOCKCHAIN_ENVIRONMENTS:
        if len(contract_type) <= 0:
            # MockV3Aggregator.length
            deploy_mocks()
        contract = contract_type[-1]
        # MockV3Aggregator[-1]
    else:
        contract_address = config["networks"][network.show_active(
        )][contract_name]
        # address
        # ABI
        contract = Contract.from_abi(
            contract_type._name, contract_address, contract_type.abi
        )
    return contract


DECIMALS = 18
INITIAL_VALUE = 2000000000000000000000


def deploy_mocks(decimals=DECIMALS, initial_value=INITIAL_VALUE):
    account = get_account()
    mock_aggregator = MockV3Aggregator.deploy(
        decimals, initial_value, {"from": account})
    print(f"Deployed MockV3Aggregator! {mock_aggregator.address}")

    print("deploying mock dai")
    mock_dai = MockDai.deploy({"from": account})
    print(f"Deployed MockV3Aggregator! {mock_dai.address}")

    print("deploying mock weth")
    mock_weth = MockWeth.deploy({"from": account})
    print(f"Deployed MockV3Aggregator! {mock_weth.address}")
