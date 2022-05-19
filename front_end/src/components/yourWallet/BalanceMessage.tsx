interface BalanceMsgProps {
    image: string 
    balance: number
    label: string
}

export const BalanceMessage = ({image, balance, label}: BalanceMsgProps) => {
    return (<div>
        {label}
        <img src={image} width="20px" alt=""></img>
        {balance}
    </div>)
}