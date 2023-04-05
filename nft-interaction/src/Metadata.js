import axiox from 'axios';

function Metadata(props) {
    return (
        <div>
            <input id="metadataInput" type="text" placeholder="Token ID" />
            <button onClick={() => getMetadata()}>Get Metadata</button>
        </div>
    );
}

function getMetadata() {
    axiox.get('http://localhost:2761/metadata?tokenId=' + document.getElementById('metadataInput').value)
        .then(({ data }) => alert(data))
        .catch(({ message }) => alert(message));
}

export default Metadata;