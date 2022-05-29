import { useCall, useEthers } from "@usedapp/core"
import { BigNumber, Contract, utils, constants } from "ethers"
import networkMapping from "../chain-info/deployments/map.json"
import TokenFarm from "../chain-info/contracts/TokenFarm.json"

export const useTokenBalance = (tokenAddress: string): [BigNumber] | undefined => {
    const { account, chainId } = useEthers()

    const { abi } = TokenFarm
    const tokenFarmInterface = new utils.Interface(abi)
    const tokenFarmContractAddress = chainId ? networkMapping[String(chainId)]["TokenFarm"][0] : constants.AddressZero
    
    const contract = new Contract(tokenFarmContractAddress, tokenFarmInterface)

    const {value: tokenBalance, error} = useCall({
        contract,
        method: "stakingBalance",
        args: [account, tokenAddress] 
    }) ?? {}

    return tokenBalance
}
