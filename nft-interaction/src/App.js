import React from 'react';
import Connect from './Connect';
import Metadata from './Metadata';
import NFTList from './NFTList';
import Mint from './Mint';
import Register from './Register';
import './App.css';

function App() {
  const [publicKey, setPublicKey] = React.useState(null);

  return (
    <div>
      <Connect setPublicKey={setPublicKey} />
      <Metadata />
      <NFTList publicKey={publicKey} />
      <Mint publicKey={publicKey} />
      <Register publicKey={publicKey} />
    </div>
  );
}

export default App;
