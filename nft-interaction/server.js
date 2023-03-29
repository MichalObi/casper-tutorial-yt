const express = require('express');
const app = express();
const cors = require('cors');
const port = 3001;
const { CasperClient, Contracts, CLPublicKey, DeployUtil } = require('casper-js-sdk');

app.use(express.json());
app.use(cors());

const client = new CasperClient('http://188.40.47.161:7777/rpc');
const contract = new Contracts.Contract(client);

contract.setContractHash('hash-e918a6ad4f49e2184731a51ff07825d0a7b8a2bcbf304f106a13a6c2f2214638');

app.get('/metadata', async (req, res) => {
    try {
        const result = (
            await contract.queryContractDictionary(
                'metadata_raw',
                req.query.tokenId
            )
        ).data;
    } catch (error) {
        res.status(400).send(error.message);
    }
});

app.get('/ownedNFTs', async (req, res) => {
    const accountHash = CLPublicKey.fromHex(req.query.publicKey).toAccountHashStr().substring(13); // account-hash-
    let owned = [];

    try {
        const pages = (await contract.queryContractDictionary('page_table', accountHash)).data; // get list of pages

        // iterate pages containings NFTs
        for (let i = 0; i < pages.length; i++) {
            // account has NFTs in this page

            if (pages[i].data) {
                const page = (await contract.queryContractDictionary(`page_${i}`, accountHash)).data;

                // iterate page
                for (let j = 0; j < page; j++) {

                    // account own Nft
                    if (page[j].data) {
                        owned.push(i * page.length + j); // return Ordinal Token ID (page table index * page size + page index)
                    }
                }
            }
        }

        res.send(owned);
    } catch (error) {
        res.status(400).send(error.message);
    }
});

app.post('/deploy', async (req, res) => {
    try {
        const deploy = DeployUtil.deployFromJson(req.body).unwrap();
        const deployHash = await client.putDeploy(deploy);

        console.log('deploy', deploy);
        console.log('deployHash', deployHash);
    } catch (error) {
        res.status(400).send(error.message);
    }
});

app.listen(port, () => console.log(`App listening on port ${port}`));