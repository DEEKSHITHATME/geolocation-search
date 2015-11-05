var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var loremIpsum = require('lorem-ipsum');
var session = require('client-sessions');
var mongoskin = require('mongoskin');

var routes = require('./routes/index');
var users = require('./routes/users');

var app = express();
var db;
mongoskin.connect('mongodb://localhost/geosearch', {
    safe: true
}, function(err, database) {
    db = database;
    db.collection('places', {}, function(err, coll) {
        db.ensureIndex('places', {
            title: "text",
            description: "text"
        }, function(err, index) {
            if (err)
                throw err;
        });
    });
});


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: false
}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// app.use('/', routes);
app.use('/users', users);
app.use(session({
    cookieName: 'session',
    secret: 'rdfgbdgdfgndfbgdbgn',
    duration: 30 * 60 * 1000,
    activeDuration: 5 * 60 * 1000,
}));

// catch 404 and forward to error handler
var ses;
app.get('/', function(req, res) {

    req.session.reset();
    console.log('cookies destroyed');
    db.collection('places').find().limit(5).sort({
        _id: 1
    }).toArray(function(err, items) {
        res.render('index', {
            items: items,
            title: 'geolocation search'
        });
    });

    // }
    // }
});

app.get('/add', function(req, res) {

    var c = 0;

    function addTodb(row) {

        db.collection('places').ensureIndex({
            location: "2dsphere"
        }, function(req, res) {


            var min1 = -180,
                max1 = 179,
                min2 = -90,
                max2 = 89;
            var lon = parseFloat((Math.random() * (max1 - min1 + 1)) + min1);
            var lat = parseFloat((Math.random() * (max2 - min2 + 1)) + min2);

            var struct = {
                title: loremIpsum({
                    count: 2,
                    units: "words",
                    format: "plain"
                }),
                description: loremIpsum({
                    count: 9,
                    units: "words",
                    format: "plain"
                }),
                loc: [lon, lat]
            }

            db.collection('places').insert(struct, {
                safe: true
            }, function(err, items) {
                if (err)
                    throw err;
                if (items)
                    c++;
                if (c < 10000) {
                    // c++;

                    addTodb(row);
                } else {
                    console.log("added");
                }

            });
        });
    };
    addTodb()

    db.collection('places').find().limit(30).sort({
        _id: 1
    }).toArray(function(err, items) {
        res.render('add', {
            items: items

        });

    });

});
app.get('/search', function(req, res) {
    console.log(req.session);

    db.collection('places').find().limit(30).sort({
        _id: 1
    }).toArray(function(err, items) {
        ses = req.session.items;
        if (ses) {

            res.render('search', {
                items: ses
            });
        } else {



            res.render('search', {
                items: items
            });
        }

    });

});



app.post('/search', function(req, res) {
    req.body.lon = req.body.lon || 0;
    req.body.lat = req.body.lat || 0;
    db.collection('places').find({
        loc: {
            $geoWithin: {
                $center: [
                    [parseFloat(req.body.lon), parseFloat(req.body.lat)],
                    0.5 / 6371
                ]
            }
        },

        $text: {
            $search: req.body.title
        }
    })

    .toArray(function(err, items) {
        if (err)
            throw err;
        req.session.items = items;
        console.log(req.session)

        console.log(items);


        res.render('search', {
            items: items
        });


    });

});
module.exports = app;
app.listen(3050);
console.log('on 3050');
