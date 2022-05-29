import { useEthers } from "@usedapp/core"
import helperConfig from "../helper-config.json"
import { constants } from "ethers"
import networkMappings from "../chain-info/deployments/map.json"
import brownieConfig from "../brownie-config.json"
import dai from "../dai.png"
import eth from "../eth.png"
import dapp from "../dapp.png"
import { YourWallet } from "./yourWallet"
import { TokenFarm } from "./tokenFarm/tokenFarm"

export type Token = {
    image: string 
    address: string
    name: string
}

export const Main = () => {
    // show token values of wallet
    // Get the address of different tokens 
    // get the balance of the users wallet 
    const { chainId } = useEthers()
    
    // TODO: Solve for implicit any
    // https://stackoverflow.com/questions/57086672/element-implicitly-has-an-any-type-because-expression-of-type-string-cant-b
    const networkName = chainId ? helperConfig[chainId] : "dev"

    const dappTokenAddress = chainId ? 
                                networkMappings[String(chainId)]["DappToken"][0] : 
                                constants.AddressZero
    const wethTokenAddress = chainId ? brownieConfig["networks"][networkName]["weth_token"] : constants.AddressZero
    const fauTokenAddress = chainId ? brownieConfig["networks"][networkName]["fau_token"] : constants.AddressZero

    const supportedTokens: Array<Token> = [
        {name: "Dapp", image: dapp, address: dappTokenAddress},
        {name: "Weth", image: eth, address: wethTokenAddress},
        {name: "Dai", image: dai, address: fauTokenAddress},
    ]

    return (
        <div>
            <YourWallet supportedTokens={supportedTokens}/>
            <TokenFarm supportedTokens={supportedTokens}></TokenFarm>
        </div>
    )
}