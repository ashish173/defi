import React, { useState, useEffect } from "react"
import { Token } from "../Main"
import { useEthers, useTokenBalance, useNotifications } from "@usedapp/core"
import { formatUnits } from "@ethersproject/units"
import { Button, Input, CircularProgress, Snackbar } from "@material-ui/core"
// import Alert from "@mui/lab/Alert"
// import { useStakeTokens } from "../../hooks"
import { utils } from "ethers"
import { useStakeTokens } from "../../hooks"

export interface StakeFormProps {
    token: Token
}

export const StakeForm = ({token}: StakeFormProps) => {
    // get the amout in this form
    // display the amount
    const { address: tokenAddress } = token
    const [amount, setAmount] = useState<number | string | Array<number | string>>(0)

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const newAmount = event.target.value === "" ? "" : Number(event.target.value)
        setAmount(newAmount)
        console.log(newAmount)
    }

    const { approve, approveErc20State } = useStakeTokens(tokenAddress)
    

    const handleStakeSubmit = () => {
        const amountAsWei = utils.parseEther(amount.toString())
        return approve(amountAsWei.toString())
    }

    return (
        <div>
        <Input onChange={handleInputChange} ></Input>
        <Button onClick={handleStakeSubmit}>Stake</Button>
         </div>
    )
}