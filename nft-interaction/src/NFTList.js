import axios from 'axios';

function NFTList({publicKey}) {
    return (
        <div>
            <button onClick={() => getOwnedNFTs(publicKey)}>
                Get NFTs Owned
            </button>
        </div>
    );
}

function getOwnedNFTs(publicKey) {
    if (publicKey === null) {
        alert('No public key found, please connect to the Signer');
        return;
    }

    axios.get(`http://localhost:2761/ownedNFTs?publicKey=${publicKey}`)
        .then(({ data }) => alert(data))
        .catch(({ message }) => alert(message));
}

export default NFTList;