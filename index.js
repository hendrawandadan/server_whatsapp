const {Client, LocalAuth} = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
const express = require("express");
const cors = require("cors");
const port = 5000;

const app = express();
const client = new Client({puppeteer: {headless: true}, authStrategy: new LocalAuth()});

client.on('qr', (qr) => {
    console.log('Token Whatsapp ', qr);
    qrcode.generate(qr, {small: true});
});
client.on('ready', () => {
    console.log('Client Siap !');
});
client.on('authenticated', () => {
    console.log('Terautentikasi');
});
client.initialize();

app.get("/", async (req, res) => {
    res.send("Server Whatsapp Running OK");
})

app.post("/kirimpesan", (req, res) => {
    const nomor = req.body.nomor;
    const pesan = req.body.pesan;
    client.sendMessage(nomor + "@c.us", pesan).then(response => {
        res.status(200).json({
            status: "Berhasil"
        });
        console.log("Pesan Berhasil di Kirim Ke " + nomor);
    }).catch(err => {
        res.status(500).json({
            status: "Gagal"
        });
        console.log("Pesan Gagal di Kirim Ke " + nomor);
    })
})

app.listen(port,() => {
    console.log("Server Berjalana");
})
module.exports = app
