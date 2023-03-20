const fs = require('fs');
const { RuntimeArgs, CLValueBuilder, Contracts, CasperClient, Keys } = require('casper-js-sdk');
const client = new CasperClient('http://89.58.52.98:7777/rpc');
const contract = new Contracts.Contract(client);
const keys = Keys.Ed25519.loadKeyPairFromPrivateFile('./keys/secret_key.pem');
const wasm = new Uint8Array(fs.readFileSync('./contract/target/wasm32-unknown-unknown/release/contract.wasm'));

async function install() {
    const args = RuntimeArgs.fromMap({
        'message': CLValueBuilder.string('Hello word')
    });

    const deploy = contract.install(
        wasm,
        args,
        '20000000000',
        keys.publicKey,
        'casper-test',
        [keys]
    );

    try {
        return (await client.putDeploy(deploy))
    } catch (error) {
        return error;
    }
}

// install()
//     .then(deployHash => console.log(deployHash))
//     .catch(error => console.log(error));

async function update_msg() {
    contract.setContractHash('hash-fd9c48a5f50c96aa90c4ae42166b4034a4daabab8406af5a9777a5d43d09d194');
    const args = RuntimeArgs.fromMap({ 'message': CLValueBuilder.string('Hello again!') });

    const deploy = contract.callEntrypoint(
        'update_msg',
        args,
        keys.publicKey,
        'casper-test',
        '1000000000',
        [keys]
    );

    try {
        return (await client.putDeploy(deploy))
    } catch (error) {
        return error;
    }
}

// update_msg()
//     .then(deployHash => console.log(deployHash))
//     .catch(error => console.log(error));

function queryMessage() {
    contract.setContractHash('hash-fd9c48a5f50c96aa90c4ae42166b4034a4daabab8406af5a9777a5d43d09d194');
    return contract.queryContractData(['message']);
}

queryMessage()
    .then(result => console.log(result))
    .catch(error => console.log(error));