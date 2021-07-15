const express = require('express');
const app = express();
const { MongoClient } = require('mongodb');
const jwt = require('jsonwebtoken');
const JWT_SIGN_SECRET = "kjlhkvcg12Vhgc12J12";
require('dotenv').config();
var token = null;

app.use(express.json());
app.use(express.urlencoded());

app.get('/', (req, res) => {
    res.send('Hello, find users list in /users');
});

async function theConnection() {
    const uri = "mongodb+srv://" + process.env.DB_USERNAME + ":" + process.env.DB_PASSWORD + "@cluster0.mfyuf.mongodb.net/root?retryWrites=true&w=majority";
    const client = new MongoClient(uri, { useUnifiedTopology: true });
    try {
        await client.connect();
        await getDatas(client);
        await postDatas(client);
        await modifyDatas(client);
    } catch (e) {
        console.error(e);
    }
}

async function getDatas(client) {
    const result = await client.db('db_advize').collection('users').find().toArray();
    if (!result)
        console.log('error');
    app.get('/users', (req, res) => {
        token = jwt.sign({
            datas : result
        }, JWT_SIGN_SECRET, { expiresIn: '3 hours' })
        res.send(result);
    });
}

async function postDatas(client) {
    app.post('/users', async (req, res) => {
        jwt.verify(token, JWT_SIGN_SECRET, async (err, verifiedToken) => {
            var user = {
                nom: req.body.nom,
                prenom: req.body.prenom,
                date: req.body.date
            };
            await client.db('db_advize').collection('users').insertOne(user, function(err, result) {
                if (err)
                    throw (err);
                else
                    res.send(user.prenom + " " + user.nom + " has been added");
            })
        })
    });
}

async function modifyDatas(client) {
    app.put('/users', async (req, res) => {
        jwt.verify(token, JWT_SIGN_SECRET, async (err, verifiedToken) => {
            var query = { prenom: req.body.ancien_prenom }
            var user_updated = {
                $set: {
                    nom: req.body.nouveau_nom,
                    prenom: req.body.nouveau_prenom,
                    date: req.body.nouveau_date
                }
            }
            client.db('db_advize').collection('users').updateOne(query, user_updated, function(err, result) {
                if (err)
                    throw err;
                else
                    res.send('1 document updated');
            })
        })
    });
}

theConnection().catch(console.error);

app.listen(1234);
