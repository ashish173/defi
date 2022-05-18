import React from 'react';
import { DAppProvider, ChainId, Kovan, Rinkeby } from '@usedapp/core'
import { Header } from './components/Header'
import { Container } from "@material-ui/core"
import { Main } from "./components/Main"

function App() {
  return (
    <DAppProvider config={{
      networks: [Kovan, Rinkeby]
    }}>
      <Container maxWidth="md"> 
        <Header></Header>
        <div>Hi</div>
        <Main></Main>
      </Container>
    </DAppProvider>
  );
}

export default App;
