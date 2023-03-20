const express = require('express');
const app = express();
const cors = require('cors');
const port = 3001;

const { CasperClient, Contracts, RuntimeArgs, CLValueBuilder, CLPublicKey, DeployUtil } = require('casper-js-sdk');

app.use(express.json());
app.use(cors());

const client = new CasperClient('http://95.216.1.154:7777/rpc');
const contract = new Contracts.Contract(client);

contract.setContractHash('hash-fd9c48a5f50c96aa90c4ae42166b4034a4daabab8406af5a9777a5d43d09d194');

app.post('/update_msg', async (req, res) => {
    try {
        const deploy = DeployUtil.deployFromJson(req.body).unwrap();
        const deployHash = await client.putDeploy(deploy);
        res.send(deployHash);
    } catch (error) {
        res.status(400).send(error.message);
    }
});

app.get('/query_msg', async (req, res) => {
    return res.send(await contract.queryContractData(['message']));
});

app.listen(port, () => {
    console.log(`App listening on port ${port}`);
});