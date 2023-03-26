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
      <NFTList setPublicKey={setPublicKey}/>
      <Mint setPublicKey={setPublicKey}/>
      <Register setPublicKey={setPublicKey}/>
    </div>
  );
}

export default App;
