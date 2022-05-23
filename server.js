const express = require('express');
const app = express();
const https = require('https');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const bodyparser = require("body-parser");
const session = require('express-session');
const req = require('express/lib/request');
const res = require('express/lib/response');

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
    user: String,
    text: String,
    hits: Number,
    time: String
});
const timelineModel = mongoose.model("events", timelineSchema);

const userSchema = new mongoose.Schema({
    username: String,
    password: String,
    cart: Array,
    history: Array
})
const userModel = mongoose.model("users", userSchema);

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

app.get('/timeline/getall', (req, res) => {
    timelineModel.find({
        user: req.session.username
    }, (err, timelineevents) => {
        if (err) {
            console.log("Error " + err);
        } else {
            console.log("Data " + JSON.stringify(timelineevents));
        }
        res.json(timelineevents);
    });
})

app.post("/timeline/insert", (req, res) => {
    if (req.session.username == null || req.session.username == '') {
        eventUser = 'Guest';
    }
    else {
        eventUser = req.session.username;
    }

    timelineModel.create({
        user: eventUser,
        text: `${eventUser} ${req.body.text}`,
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
    timelineModel.deleteMany({
        user: req.session.username
    }, (err, data) => {
        if (err) {
            console.log(err);
        }
        res.send("Cleared timeline");
    })
})

app.post('/login', (req, res) => {
    formUsername = req.body.username;
    formPassword = req.body.password;

    userModel.findOne({
        username: formUsername
    }, {
        password: 1
    }, (err, data) => {
        console.log(data);

        if (data == null) {
            // user does not exist in database
            res.send({
                status: "nonexistent",
                username: null
            });
        }
        else {
            // compare the password input with the hashed password from db
            bcrypt.compare(formPassword, data.password, (err, result) => {
                if (result) {
                    req.session.username = formUsername;
                    req.session.authenticated = true;
                    res.send({
                        status: "ok",
                        username: req.session.username
                    });
                }
                else {
                    req.session.username = null;
                    req.session.authenticated = false;
                    res.send({
                        status: "unmatching",
                        username: req.session.username
                    });
                }
            })
        }
    })
})

app.post('/signup', (req, res) => {
    formUsername = req.body.username;
    formPassword = req.body.password;

    const saltRounds = 8;
    bcrypt.hash(formPassword, saltRounds, (err, hash) => {
        if (err) {
            console.log(err);
        }
        else {
            // check if the user already exists
            userModel.findOne({
                username: formUsername
            }, (err, data) => {
                if (data != null) {
                    res.send({
                        status: "already exists",
                        username: null
                    });
                }
                else {
                    // create new user if it doesn't exist
                    userModel.create({
                        username: formUsername,
                        password: hash
                    })

                    req.session.username = formUsername;
                    req.session.authenticated = true;     
                    
                    res.send({
                        status: "ok",
                        username: req.session.username
                    });
                }
            })            
        }
    })
})

app.get('/logout', (req, res) => {
    req.session.username = null;
    req.session.authenticated = false;
    res.redirect('/');
})

app.get('/user/:username', (req, res) => {
    res.render('user-profile.ejs', {
        username: req.params.username
    })
})

app.get('/status', (req, res) => {
    if (req.session.authenticated) {
        res.send(req.session.username);
    }
    else {
        res.send(null);
    }

})

app.get('/addToCart/:id/:qty', (req, res) => {
    if (req.session.username == null || req.session.username == '') {
        res.send('logged out');
    }
    else {
        userModel.updateOne({
            username: req.session.username
        }, {
            $push: {
                cart: {
                    id: req.params.id,
                    qty: req.params.qty
                }
            }
        }, (err, result) => {
            if (err) {
                console.log(err);
            }
            else {
                res.send('ok');                
            }
        })
    }
})

app.get('/getCart', (req, res) => {
    if (req.session.username == null || req.session.username == '') {
        res.send('logged out');
    }
    else {
        userModel.findOne({
            username: req.session.username
        }, {
            cart: 1
        }, (err, result) => {
            if (err) {
                console.log(err);
            }
            else {
                console.log('Found cart!');
                res.send(result);
            }
        })
    }
})

app.get('/checkout', (req, res) => {
    if (req.session.username == null || req.session.username == '') {
        res.send('logged out');
    };

    // store cart to history
    userModel.findOne({
        username: req.session.username
    }, {
        cart: 1
    }, (err, result) => {
        if (err) {
            console.log(err);
        }
        else if (result.cart.length <= 0) {
            res.send('empty');
        }
        else {
            pushToHistory(req, result);
            res.send('ok');
        }
    })
})

function pushToHistory(req, cart) {
    userModel.updateOne({
        username: req.session.username
    }, {
        $push: {
            history: cart
        }
    }, (err, result) => {
        if (err) {
            console.log(err);
        }
        else {
            emptyCart(req);
        }
    })
}

function emptyCart(req) {
    userModel.updateOne({
        username: req.session.username
    }, {
        cart: []
    }, (err, result) => {
        if (err) {
            console.log(err);
        }
    })
}

app.get('/getHistory', (req, res) => {
    userModel.findOne({
        username: req.session.username
    }, {
        history: 1
    }, (err, result) => {
        if (err) {
            console.log(err);
        }
        else {
            res.send(result);
        }
    })
})

app.get('/getHistory/:id', (req, res) => {
    userModel.findOne({
        username: req.session.username
    }, {
        history: 1
    }, (err, result) => {
        if (err) {
            console.log(err);
        }
        else {
            res.send(result.history[req.params.id]);
        }
    })
})

app.get('/clearCart', (req, res) => {
    emptyCart(req);
    res.send('ok');
})

function lockPage(req, res, next) {
    if (!req.session.authenticated) {
        res.redirect('./login.html');
    }

    next();
}