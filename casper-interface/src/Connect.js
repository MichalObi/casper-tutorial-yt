import React from 'react';
import { Signer } from 'casper-js-sdk';

function Connect(props) {
    return (
        <button onClick={() => connectSigner(props)}>Connect Signer</button>
    );
}

function connectSigner(props) {
    Signer
        .isConnected()
        .then(isSigned => {
            if (isSigned) {
                Signer
                    .getActivePublicKey()
                    .then(props.setPublicKey)
                    .catch(({ message }) => alert(message));
            } else Signer.sendConnectionRequest();
        })
        .catch(({ message }) => alert(message));
}

export default Connect;