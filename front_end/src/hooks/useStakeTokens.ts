
import { useState } from "react"
import { useContractFunction, useEthers } from "@usedapp/core"
import TokenFarm from "../chain-info/contracts/TokenFarm.json"
import networkMappings from "../chain-info/deployments/map.json"
import { constants, utils } from "ethers"
import { Contract } from "@ethersproject/contracts"
import ERC20 from "../chain-info/contracts/DappToken.json"

export const useStakeTokens = (tokenAddress: string) => {
    const { chainId } = useEthers()

    const { abi } = TokenFarm
    const tokenFarmAddress = chainId ? networkMappings[String(chainId)]["TokenFarm"][0] : constants.AddressZero
    const tokenFarmInterface = new utils.Interface(abi)

    // abi from latest deployment
    // get token farm contract from chain-info
    const tokenFarmContract = new Contract(tokenFarmAddress, tokenFarmInterface)

    // get token contract from the token address
    // ABI from mockcrc20 
    const erc20ABI = ERC20.abi
    const erc20Interface = new utils.Interface(erc20ABI)
    const erc20Contract = new Contract(tokenAddress, erc20Interface)

    const {send: approveErc20Spend, state: approveErc20State} = useContractFunction(
        erc20Contract, "approve", { transactionName: "Approve erc20 transaction"})

    // return the contract functions and state
    const approve = (amount: string) => {
        approveErc20Spend(tokenFarmAddress, amount)
    }

    const [state, setState] = useState(approveErc20State)

    return { approve, approveErc20State }
}