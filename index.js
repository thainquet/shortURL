const http = require('http');
const router = require('router');
const finalhandler = require('finalhandler');
const view = require('consolidate');
const path = require('path');

const server = http.createServer();
const app = new router();

app.use((req, res, next) => {
    res.render = function render(filename, params){
        let link = path.resolve(__dirname + '/view', filename);
        view.mustache(link, params || {}, function(err, html) {
            if (err) return next(err);
            res.setHeader('Content-Type', 'text/html');
            res.end(html);
        })
    }

    next();
})
app.get('/', (req, res) => {
    res.render('home.html', {
        name : 'thai'
    })
})


server.on('request', (req,res) => {
    app(req, res, finalhandler)
})
server.listen(process.env.PORT || 7777);