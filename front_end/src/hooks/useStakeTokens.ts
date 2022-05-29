import { useState, useEffect } from "react"
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

    const {send: approveErc20Send, state: approveAndStakeErc20State} = useContractFunction(
        erc20Contract, "approve", { transactionName: "Approve erc20 transaction"})

    // return the contract functions and state
    const approveAndStake = (amount: string) => {
        setAmountToStake(amount)
        approveErc20Send(tokenFarmAddress, amount)
    }

    const { send: stakeSend, state: stakeState } = useContractFunction(
        tokenFarmContract, "stakeTokens", {transactionName: "Stake tokens"}
    )

    const [amountToStake, setAmountToStake] = useState("0")

    useEffect(() => {
        if (approveAndStakeErc20State.status === "Success") {
            console.log("Approved successfully")
            stakeSend(amountToStake, tokenAddress)
        } else {
        }
    }, [approveAndStakeErc20State])

    const [state, setState] = useState(approveAndStakeErc20State)
    
    // when the success of approve comes, reset the state to 
    // stakeState leading to change in the value of <state>.status
    // that will reset the isMining value

    useEffect(() => {
        if (approveAndStakeErc20State.status === "Success") {
            console.log('setting state to stakeState,', stakeState)
            setState(stakeState)
        } else {
            setState(approveAndStakeErc20State)
        }
    }, [approveAndStakeErc20State, stakeState])

    return { approveAndStake, state }
}