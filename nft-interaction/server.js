const express = require('express'),
    app = express(),
    cors = require('cors'),
    port = 3001,
    { CasperClient, Contracts, CLPublicKey, DeployUtil } = require('casper-js-sdk');

app.use(express.json());
app.use(cors());

const client = new CasperClient('http://188.40.47.161:7777/rpc'),
    contract = new Contracts.Contract(client);

contract.setContractHash('hash-e918a6ad4f49e2184731a51ff07825d0a7b8a2bcbf304f106a13a6c2f2214638');

app.get('/metadata', async (req, res) => {
    try {
        const result = (
            await contract.queryContractDictionary(
                'metadata_raw',
                req.query.tokenId
            )
        ).data;

        res.send(result);
    } catch ({ message }) {
        res.status(400).send(message);
    }
});

app.get('/ownedNFTs', async (req, res) => {
	const accountHash = CLPublicKey.fromHex(req.query.publicKey).toAccountHashStr().substring(13);
	var owned = [];
	try {
        const pages = (await contract.queryContractDictionary('page_table', accountHash)).data;

		for (var i = 0; i < pages.length; i++) { // Iterate pages containing NFTs
			if (pages[i].data == true) { // Account has NFTs in this page
				const page = (await contract.queryContractDictionary('page_' + i.toString(), accountHash)).data;
                
				for (var j = 0; j < page.length; j++) {
					if (page[j].data == true) { // Account owns this NFT
						owned.push(i * page.length + j) // Page Table Index * Page Size + Page Index = Ordinal Token ID
					}
				}
			}
		}
		res.send(pages);
	} catch (error) {
		res.status(400).send(error.message);
	}
});

app.post('/deploy', async (req, res) => {
    try {
        const deploy = DeployUtil.deployFromJson(req.body).unwrap(),
            deployHash = await client.putDeploy(deploy);

        res.send(deployHash);
    } catch ({ message }) {
        res.status(400).send(message);
    }
});

app.listen(port, () => console.log(`App listening on port ${port}`));