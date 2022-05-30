import React, { useState } from "react"
import { Token } from "../Main"
import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import { makeStyles } from "@material-ui/core"
import {UnStake} from "./UnStake"
import { TokenBalance } from "./tokenBalance";

interface TokenFarmProps {
    supportedTokens: Array<Token>
}

const useStyles = makeStyles((theme) => ({
    tabContent: {
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: theme.spacing(4)
    },
    box: {
        backgroundColor: "white",
        borderRadius: "25px"
    },
    header: {
        color: "white"
    }
}))


export const TokenFarm = ({supportedTokens}: TokenFarmProps) => {
    const classes = useStyles()

    const handleChange = (event: React.ChangeEvent<{}>, newValue: string) => {
        setSelectedTokenIndex(parseInt(newValue))
    }

    const [selectedTokenIndex, setSelectedTokenIndex] = useState<number>(0) 

    return (
        <div>
            <h1 color="white"> Token Farm</h1>
            <Box sx={{ width: '100%', typography: 'body1' }}>
                <TabContext value={selectedTokenIndex.toString()}>
                    <Box className={classes.box}>
                        <TabList onChange={handleChange} aria-label="lab API tabs example">
                            {supportedTokens.map((token, index) => {
                                return (
                                <Tab 
                                label={token.name} 
                                value={index.toString()}
                                key={index} />)
                            })}
                        </TabList>
                    </Box>
                    {supportedTokens.map((token, index) => {
                        return (
                            <TabPanel 
                                value={index.toString()}
                                key={index}
                            >
                                Token Name: {token.name}
                                <TokenBalance token={token}/>
                                <UnStake token={token}/>
                            </TabPanel>
                        )
                    })}
                </TabContext>
            </Box>
        </div>
    )
}