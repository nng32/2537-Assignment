const express = require('express')
const app = express()
const https = require('https')

app.set('view engine', 'ejs');

app.use(express.static('./public'));

app.listen(process.env.PORT || 5000, function (err) {
    if (err) console.log(err);
})

app.get('/', function (req, res) {
    res.send('Visit index.html to view homepage');
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

            atk = data.stats.filter((object) => {
                return object.stat.name == 'attack';
            }).map((object) => {
                return object.base_stat;
            });

            def = data.stats.filter((object) => {
                return object.stat.name == 'defense';
            }).map((object) => {
                return object.base_stat;
            });

            spatk = data.stats.filter((object) => {
                return object.stat.name == 'special-attack';
            }).map((object) => {
                return object.base_stat;
            });

            spdef = data.stats.filter((object) => {
                return object.stat.name == 'special-defense';
            }).map((object) => {
                return object.base_stat;
            });

            spd = data.stats.filter((object) => {
                return object.stat.name == 'speed';
            }).map((object) => {
                return object.base_stat;
            });

            res.render('profile.ejs', {
                'id': req.params.id,
                'name': data.name,
                'img_path': data.sprites.other['official-artwork']['front_default'],
                'height': data.height,
                'weight': data.weight,
                'hp': hp[0],
                'atk': atk[0],
                'def': def[0],
                'spatk': spatk[0],
                'spdef': spdef[0],
                'spd': spd[0]
            })
        })
    })
})