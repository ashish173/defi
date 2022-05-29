import { Token } from "../Main"

interface UnstakeProps {
    token: Token
}

export const UnStake = ({token}: UnstakeProps) => {
    // token with address to unstake
    // create token farm contract from ABI and interface

    return (<div>Hi {token.name}</div>)
}