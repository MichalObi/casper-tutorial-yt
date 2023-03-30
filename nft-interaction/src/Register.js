import axios from 'axios';
import { Contracts, RuntimeArgs, CLValueBuilder, CLPublicKey, DeployUtil, Signer } from 'casper-js-sdk';

function Register(props) {
    return (
        <div>
            <button onClick={() => register(props.publicKey)}>Register</button>
        </div>
    );
}

async function register(publicKey) {
    if (publicKey === null) {
        alert('No public key found, please connect to Signer');
        return;
    }

    const contract = new Contracts.Contract();

    contract.setContractHash('hash-e918a6ad4f49e2184731a51ff07825d0a7b8a2bcbf304f106a13a6c2f2214638');

    const args = RuntimeArgs.fromMap({ token_owner: CLValueBuilder.key(CLPublicKey.fromHex(publicKey)) });

    const deploy = contract.callEntrypoint(
        'register_owner',
        args,
        CLPublicKey.fromHex(publicKey),
        'casper-test',
        '5000000000' // 5 CPR
    );

    const jsonDeploy = DeployUtil.deployToJson(deploy);

    try {
        const signedDeploy = await Signer.sign(jsonDeploy, publicKey),
            response = await axios.post('http://localhost:3001/deploy', signedDeploy, { headers: { 'Content-Type': 'application/json' } });

        alert(response.data);
    } catch (error) {
        alert(error.message);
    }
}

export default Register;