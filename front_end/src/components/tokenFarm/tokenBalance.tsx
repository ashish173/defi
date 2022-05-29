import { useTokenBalance } from "../../hooks/useTokenBalance"
import {Token} from "../Main"
import { formatUnits } from "@ethersproject/units"

interface TokenBalanceProps {
    token: Token
}

export const TokenBalance = ({token}: TokenBalanceProps) => {
    const tokenBalance = useTokenBalance(token.address)
    const balance = tokenBalance ? tokenBalance[0] : "0"

    const bigNumberBalance = balance.toString()
    const formattedBalance: number = bigNumberBalance
    ? parseInt(formatUnits(bigNumberBalance, 18))
    : 0

    return (<div> token balance: {formattedBalance} </div>)
}