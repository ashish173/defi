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
    const { notifications } = useNotifications()

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const newAmount = event.target.value === "" ? "" : Number(event.target.value)
        setAmount(newAmount)
    }

    const { approveAndStake, state: approveAndStakeErc20State } = useStakeTokens(tokenAddress)
    
    const handleStakeSubmit = () => {
        const amountAsWei = utils.parseEther(amount.toString())
        return approveAndStake(amountAsWei.toString())
    }

    useEffect(() => {
        // console.log(notifications)
        if (
            notifications.filter(
                (notification) => 
                    notification.type === "transactionSucceed" && 
                    notification.transactionName === "Approve erc20 transaction"
                
            ).length > 0
        ) {
            // console.log('transactions approve is successful')
        }
        if (notifications.filter(
            (notification) => 
                notification.type === "transactionSucceed" &&
                notification.transactionName === "Stake tokens"
        ).length > 0) {
            // console.log('transaction transfer is successful')
        }
    }, [notifications])

    useEffect(() => {
        console.log(approveAndStakeErc20State)
        console.log("state: =>", approveAndStakeErc20State.status)
    }, [approveAndStakeErc20State])

    const isMining = approveAndStakeErc20State.status === "Mining"

    return (
        <div>
            <Input onChange={handleInputChange} autoFocus={true}></Input>
            <Button 
                onClick={handleStakeSubmit} 
                disabled={isMining}>
                {isMining ? <CircularProgress size={26} /> : "Stake" }

            </Button>        
        </div>
    )
}