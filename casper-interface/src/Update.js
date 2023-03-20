import React from 'react';
import { Signer, Contracts, RuntimeArgs, CLPublicKey, DeployUtil, CLValueBuilder } from 'casper-js-sdk';
import axios from 'axios';

function Update(props) {
    let disabled = props.publicKey === null;

    return (
        <div>
            <input type="text" />
            <button disabled={disabled} onClick={() => sendUpdate(props.publicKey)}>Update Message</button>
        </div>
    );
}

async function sendUpdate(publicKey) {
    const contract = new Contracts.Contract();

    contract.setContractHash('hash-fd9c48a5f50c96aa90c4ae42166b4034a4daabab8406af5a9777a5d43d09d194');

    const value = document.querySelector('input[type=text]').value;

    const deploy = contract.callEntrypoint(
        'update_msg',
        RuntimeArgs.fromMap({ 'message': CLValueBuilder.string(value) }),
        CLPublicKey.fromHex(publicKey),
        'casper-test',
        '1000000000'
    );

    const jsonDeploy = DeployUtil.deployToJson(deploy);

    try {
        const jsonDeploy = DeployUtil.deployToJson(deploy);

        const signedDeploy = await Signer.sign(jsonDeploy, publicKey);

        const response = await axios.post('http://localhost:3001/update_msg', signedDeploy, { 'Content-Type': 'application/json' });
    } catch (error) {
        alert(error.message);
    }
}

export default Update;