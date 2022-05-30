import { useContractFunction, useEthers } from "@usedapp/core"
import { utils, constants, Contract } from "ethers"
import TokenFarm from "../chain-info/contracts/TokenFarm.json"
import networkInterface from "../chain-info/deployments/map.json"

export const useUnstake = () => {
    // chainId from ethers
    const { chainId } = useEthers()
    const { abi } = TokenFarm

    // interface from the abi  
    const tokenFarmInterface = new utils.Interface(abi)

    // token farm contract address from the chain id 
    const tokenFarmAddress = chainId ? networkInterface[chainId.toString()]["TokenFarm"][0] : constants.AddressZero
    
    // token contract from token farm contract address and interface
    const tokenFarmContract = new Contract(tokenFarmAddress, tokenFarmInterface) 

    // useContractFunction to call the unstake function with token address
    return useContractFunction(
       tokenFarmContract, 
       "unStakeToken",
       { transactionName: "unstake tokens"}
    )

    // return {send, state}
}