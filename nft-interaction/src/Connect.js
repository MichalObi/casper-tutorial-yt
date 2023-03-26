import { Signer } from 'casper-js-sdk';

function Connect(props) {
    return (
        <div>
            <button onClick={() => connectSigner(props)}>Connect Signer</button>
        </div>
    );
}

function connectSigner(props) {
    Signer.isConnected()
        .then(s => {
            if (s === false) {
                Signer.sendConnectionRequest();
            } else {
                Signer
                    .getActivePublicKey()
                    .then(pubKey => {
                        props.setPublicKey(pubKey);
                        alert('Public key is' + pubKey);
                    })
                    .catch(({ message }) => alert(message));
            }
        })
        .catch(({ message }) => alert(message));
}

export default Connect;