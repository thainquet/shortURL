const http = require('http');
const router = require('router');
const finalhandler = require('finalhandler');
const view = require('consolidate');
const path = require('path');
const level = require('level');
const shortId = require('shortid');


const pathDb = path.resolve('./db');
const db = level(pathDb);

const server = http.createServer();
const app = new router();

app.use((req, res, next) => {
    res.render = function render(filename, params) {
        let link = path.resolve(__dirname + '/view', filename);
        view.mustache(link, params || {}, function (err, html) {
            if (err) return next(err);
            res.setHeader('Content-Type', 'text/html');
            res.end(html);
        })
    }

    next();
})

app.use((req, res, next) => {
    res.json = function json(obj) {
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify(obj));
    }

    next();
})

app.get('/', (req, res) => {
    res.render('home.html', {
        name: 'thai'
    })
})

app.post('/', (req, res) => {
    if (!req.body.url) {
        res.render('home.html', {
            msg: "URL is required"
        })
    }

    let id = shortId.generate();
    db.put(id, req.body.url, (err) => {
        if (err) return res.render('home.html', {
            msg: err.toString()
        })

        let url = 'thaidzvl.com/' + id;
        res.render('home.html', {
            msg: `URL: ${url}`
        })
    })
})


server.on('request', (req, res) => {
    app(req, res, finalhandler)
})
server.listen(process.env.PORT || 7777);