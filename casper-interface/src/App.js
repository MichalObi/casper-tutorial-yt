import React from 'react';

import logo from './logo.svg';
import './App.css';

import Connect from './Connect';
import Update from './Update';
import Querry from './Querry';

function App() {
  const [publicKey, setPublicKey] = React.useState(null);

  return (
    <div>
      <Connect setPublicKey={setPublicKey} />
      <Update publicKey={publicKey} />
      <Querry />
    </div>
  );
}

export default App;
