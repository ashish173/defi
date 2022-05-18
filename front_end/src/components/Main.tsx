import { useEthers } from "@usedapp/core"
import helperConfig from "../helper-config.json"
import { constants } from "ethers"
import networkMappings from "../chain-info/deployments/map.json"
import brownieConfig from "../brownie-config.json"

export const Main = () => {
    // show token values of wallet
    // Get the address of different tokens 
    // get the balance of the users wallet 

    // 
    const { chainId } = useEthers()
    
    // TODO: Solve for implicit any
    // https://stackoverflow.com/questions/57086672/element-implicitly-has-an-any-type-because-expression-of-type-string-cant-b
    const networkName = chainId ? helperConfig[chainId] : "dev"

    const dappTokenAddress = chainId ? 
                                networkMappings[String(chainId)]["DappToken"][0] : 
                                constants.AddressZero
    const wethTokenAddress = chainId ? brownieConfig["networks"][networkName]["weth_token"] : constants.AddressZero
    const fauTokenAddress = chainId ? brownieConfig["networks"][networkName]["fau_token"] : constants.AddressZero

    console.log("dapp token address", dappTokenAddress)
    console.log("weth token address", wethTokenAddress)
    console.log("fau token address", fauTokenAddress)
    return (<div>Main</div>)
}