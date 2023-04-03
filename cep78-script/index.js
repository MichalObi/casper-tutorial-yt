const { CasperClient, Keys, Contracts, RuntimeArgs, CLValueBuilder, encodeBase16 } = require('casper-js-sdk');
const fs = require('fs');

const keys = Keys.Ed25519.loadKeyPairFromPrivateFile('./keys/secret_key.pem');
const client = new CasperClient('http://188.40.47.161:7777/rpc');
const contract = new Contracts.Contract(client);

async function installContract() {
    const args = RuntimeArgs.fromMap({
        collection_name: CLValueBuilder.string('Test'),
        collection_symbol: CLValueBuilder.string('TST'),
        total_token_supply: CLValueBuilder.u64(1000),
        ownership_mode: CLValueBuilder.u8(2), // Transferable
        nft_kind: CLValueBuilder.u8(1), // Digital
        holder_mode: CLValueBuilder.u8(2), // Holdable by Accounst & Contracts
        whitelist_mode: CLValueBuilder.u8(0), // Unlock
        minting_mode: CLValueBuilder.u8(1), // Public
        nft_metadata_kind: CLValueBuilder.u8(2), // Raw metadata
        identifier_mode: CLValueBuilder.u8(0), // Ordinal,
        metadata_mutability: CLValueBuilder.u8(0), // Immutable,
        burn_mode: CLValueBuilder.u8(0), // Burnable
        owner_reverse_lookup_mode: CLValueBuilder.u8(1), // No Lookup
        json_schema: CLValueBuilder.string(''), // Empty JSON Schema
    });

    const deploy = contract.install(
        (new Uint8Array(fs.readFileSync('./../cep-78-enhanced-nft/contract/target/wasm32-unknown-unknown/release/contract.wasm').buffer)),
        args,
        '250000000000',
        keys.publicKey,
        'casper-test',
        [keys]
    );

    try {
        await client.putDeploy(deploy);
        const result = await waitForDeploy(deploy, 120000);

        console.log(result);
    } catch (error) {
        console.error(error.message);
    }
}

async function mint() {
    const args = RuntimeArgs.fromMap({
        token_owner: CLValueBuilder.key(keys.publicKey),
        token_meta_data: CLValueBuilder.string('Test metadata'),
    });

    contract.setContractHash('hash-e918a6ad4f49e2184731a51ff07825d0a7b8a2bcbf304f106a13a6c2f2214638');

    const deploy = contract.callEntrypoint(
        'mint',
        args,
        keys.publicKey,
        'casper-test',
        '10000000000', // 10 CSPR 
        [keys]
    );

    try {
        await client.putDeploy(deploy);
        const result = await waitForDeploy(deploy, 120000);

        console.log(result);
    } catch (error) {
        console.error(error.message);
    }
}

function balanceOf() {
    contract.setContractHash('hash-e918a6ad4f49e2184731a51ff07825d0a7b8a2bcbf304f106a13a6c2f2214638');
    contract
        .queryContractDictionary('balances', keys.publicKey.toAccountHashStr().substring(13)) // substring remove 'account-hash'
        .then(response => console.log(parseInt(response.data._hex, 16)))
        .catch(error => console.log(error));
}

function readMetadata() {
    contract.setContractHash('hash-e918a6ad4f49e2184731a51ff07825d0a7b8a2bcbf304f106a13a6c2f2214638');
    contract
        .queryContractDictionary('metadata_raw', '0')
        .then(response => console.log(response.data))
        .catch(error => console.log(error));
}

async function waitForDeploy(signedDeploy, timeout = 60000) {
    const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));

    const timer = setTimeout(() => {
        throw new Error('Timeout');
    }, timeout);

    while (true) {
        const deploy = await client.nodeClient.getDeployInfo(encodeBase16(signedDeploy.hash));

        if (deploy.execution_results.length > 0) {
            clearTimeout(timer);
            return deploy;
        } else {
            await sleep(400);
        }
    }
}

// installContract();

// mint();

balanceOf();

// readMetadata();