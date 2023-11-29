require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const { TextServiceClient } = require('@google-ai/generativelanguage').v1beta2;
const { GoogleAuth } = require('google-auth-library');
const cors = require('cors');

const app = express();
const port = process.env.PORT || 3000;
app.use(cors());

app.use(bodyParser.json());

const MODEL_NAME = 'models/text-bison-001';
const API_KEY = process.env.API_KEY;

const client = new TextServiceClient({
    authClient: new GoogleAuth().fromAPIKey(API_KEY),
});

app.post('/generate-post', (req, res) => {
    console.log(req.body)
    const topic = req.body.topic;

    const prompt = `You are Hashify Writer.Our topic is "${topic}", Write 3-4 hashtags for this.`;

    client
        .generateText({
            model: MODEL_NAME,
            prompt: {
                text: prompt,
            },
        })
        .then((result) => {
            console.log(JSON.stringify(result, null, 2));
            console.log("ok");
            console.log(result[0].candidates[0].output);
            const generatedText = result[0]?.candidates[0]?.output || 'Failed to generate text.';
            res.json({ generatedText });
        })
        .catch((error) => {
            console.error('Text generation error:', error);
            res.status(500).json({ error: 'Internal Server Error' });
        });
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
