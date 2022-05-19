import React from 'react';
import { DAppProvider, Config, Kovan, Rinkeby } from '@usedapp/core'
import { Header } from './components/Header'
import { Container } from "@material-ui/core"
import { Main } from "./components/Main"
import { getDefaultProvider } from 'ethers'

const config: Config = {
  readOnlyChainId: Kovan.chainId,
  readOnlyUrls: {
    [Kovan.chainId]: getDefaultProvider('kovan'),
  },
}

function App() {
  return (
    <DAppProvider config={
      config
      // TODO: refactor the code to also work with Ganache local development
    }>
      <Container maxWidth="md"> 
        <Header></Header>
        <Main></Main>
      </Container>
    </DAppProvider>
  );
}

export default App;
