const express = require('express')
const app = express()
const https = require('https')

app.set('view engine', 'ejs');

app.use(express.static('./public'));

app.listen(5000, function (err) {
    if (err) console.log(err);
})

app.get('/', function (req, res) {
    res.send('GET request to homepage');
})

app.get('/profile/:id', (req, res) => {
    const url = `https://pokeapi.co/api/v2/pokemon/${req.params.id}`;

    https.get(url, (http_res) => {
        data = '';

        http_res.on('data', (chunk) => {
            data += chunk
        })

        http_res.on('end', () => {
            data = JSON.parse(data);

            hp = data.stats.filter((object) => {
                return object.stat.name == 'hp';
            }).map((object) => {
                return object.base_stat;
            });

            res.render('profile.ejs', {
                'id': req.params.id,
                'name': data.name,
                'img_path': data.sprites.other['official-artwork']['front_default'],
                'hp': hp[0]
            })
        })
    })
})