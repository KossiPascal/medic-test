const readline = require('readline');
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});
const { fileRouter } = require('./routers/routers');

const express = require('express');
const http = require('http');
const { ask, srcDir } = require('./utils/functions');
const app = express();

const port = 5000;

app.use(express.static(`${srcDir()}/views`, {maxAge: `1y`}));

app.use('/', fileRouter)
// app.all('*', (req, res) => res.status(200).redirect("/"))

app.get('/', (req, res)  => res.sendFile(`${srcDir()}/views/index.html`));

// app.post('/', (req, res))


const server = http.createServer(app);


server.listen(port, () => {
  console.log(`Listen on port ${port}`);
  // ask question to get .CSV file name 
  ask(rl, `Please provide the name or the path of the .CSV file, without the extension: `);
});

// server.on('error', (err) => console.log(err));
// server.on('listening', () => console.log('listening'));



