import React, { useState } from "react"
import { Token } from "../Main"
import { useUnstake } from "../../hooks/"
import { useEffect } from "react"

interface UnstakeProps {
    token: Token
}

export const UnStake = ({token}: UnstakeProps) => {
    // token with address to unstake
    // create token farm contract from ABI and interface

    const { send, state: unstakeState } = useUnstake()

    const handleUnstake = () => {
        return send(token.address)  
    }

    const [miningState, setMiningState] = useState("")

    useEffect(() => {
        console.log(
            "unstake state",
            unstakeState
        )
        if (unstakeState.status === "Mining") {
            setMiningState("Mining")
        }
        if (unstakeState.status === "Success") {
            setMiningState("")
        }

        if (unstakeState.status === "Exception") {
            console.log(
                "an exception occurred"
            )
        }
    }, [unstakeState])

    return (<>
        {miningState !== "Mining" ? 
        <button  onClick={handleUnstake}>
             Unstake</button>
        : "Busy"}
    </>)
}