const express = require('express');
const app = express();
const https = require('https');
const mongoose = require('mongoose');
const bodyparser = require("body-parser");
const session = require('express-session');

app.set('view engine', 'ejs');

app.use(express.static('./public'));
app.use(session({
    secret: "hey shikikan",
    saveUninitialized: true,
    resave: true,
}))

app.use(bodyparser.urlencoded({
    extended: true
}));

mongoose.connect("mongodb+srv://UMP45:XZnlJVbkANg6I4vp@pokemon.etrpp.mongodb.net/pokegallery?retryWrites=true&w=majority",
    { useNewUrlParser: true, useUnifiedTopology: true });

const timelineSchema = new mongoose.Schema({
    text: String,
    hits: Number,
    time: String
});
const timelineModel = mongoose.model("events", timelineSchema);

const userSchema = new mongoose.Schema({
    username: String,
    password: String,
    cart: Array
})

app.listen(process.env.PORT || 5000, function (err) {
    if (err) console.log(err);
})

app.get('/', function (req, res) {
    res.send('Visit index.html to view homepage');
})

app.get('/profile/:id', (req, res) => {
    const url = `https://ump45-pokeapi.herokuapp.com/api/v2/pokemon/${req.params.id}`;

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

app.get('/timeline/getall', (req, res) => {
    timelineModel.find({}, (err, timelineevents) => {
        if (err) {
            console.log("Error " + err);
        } else {
            console.log("Data " + JSON.stringify(timelineevents));
        }
        res.json(timelineevents);
    });
})

app.post("/timeline/insert", (req, res) => {
    timelineModel.create({
        text: req.body.text,
        hits: req.body.hits,
        time: req.body.time
    }), (err, data) => {
        if (err) console.log(err);
        else
            console.log(data);
        res.send("Insertion complete.")
    }
});

app.get('/timeline/update/:id', (req, res) => {
    console.log(req.params.id);

    timelineModel.updateOne({
        _id: req.params.id
    }, {
        $inc: {hits: 1}
    }, (err, data) => {
        if (err) 
        {
            console.log(err);
        }
        else 
        {
            res.send("Hits +1");
        }
    })
})

app.get('/timeline/remove/:id', (req, res) => {
    console.log(req.params.id);

    timelineModel.deleteOne({
        _id: req.params.id
    }, (err, data) => {
        if (err) console.log(err);
        res.send("Removed");
    })
})

app.get('/timeline/clear', (req, res) => {
    timelineModel.deleteMany({}, (err, data) => {
        if (err) {
            console.log(err);
        }
        res.send("Cleared timeline");
    })
})