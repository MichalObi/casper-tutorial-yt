import axios from 'axios';
import { Contracts, RuntimeArgs, CLValueBuilder, CLPublicKey, DeployUtil, Signer } from 'casper-js-sdk';

function Mint(props) {
    return (
        <div>
            <input id="mintInput" type="text" placeholder="Metadata" />
            <button onClick={() => mint(props.publicKey)}>Mint</button>
        </div>
    );
}

async function mint(publicKey) {
    if (publicKey === null) {
        alert('No public key found, please connect to Signer');
        return;
    }

    const contract = new Contracts.Contract();

    contract.setContractHash('hash-e918a6ad4f49e2184731a51ff07825d0a7b8a2bcbf304f106a13a6c2f2214638');

    const args = RuntimeArgs.fromMap({
        token_owner: CLValueBuilder.key(CLPublicKey.fromHex(publicKey)),
        token_meta_data: CLValueBuilder.string(document.getElementById('mintInput').value),
    });

    const deploy = contract.callEntrypoint(
        'mint',
        args,
        CLPublicKey.fromHex(publicKey),
        'casper-test',
        '40000000000' // 40 CPR
    );

    const jsonDeploy = DeployUtil.deployToJson(deploy);

    try {
        const signedDeploy = await Signer.sign(jsonDeploy, publicKey);
        const response = await axios.post('http://localhost:3001/deploy', signedDeploy, { header: { 'Content-Type': 'application/json' } });
        
        alert(response.data);
    } catch (error) {
        alert(error.message);
    }
}

export default Mint;