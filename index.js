const express = require('express');
const path = require('path');
const ejsMate = require('ejs-mate');
const morgan = require('morgan');
const os = require('os');

const app = express();
const PORT = 3000;

function getLocalIP() {
    const networkInterfaces = os.networkInterfaces();
    for (const interfaceName in networkInterfaces) {
        for (const interfaceDetails of networkInterfaces[interfaceName]) {
            if (interfaceDetails.family === 'IPv4' && !interfaceDetails.internal) {
                return interfaceDetails.address;
            }
        }
    }
    return '127.0.0.1'; // Default to localhost if no external IP is found
}

const IP_ADDRESS = getLocalIP();


app.engine('ejs', ejsMate)
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'))

app.use(morgan('combined'));
app.use(express.urlencoded({ extended: true }));
app.use((req, res, next) => {
    res.locals.IP_ADDRESS = IP_ADDRESS;
    res.locals.PORT = PORT;
    next();
});

message_list = []

app.get('/', (req, res) => {
    res.render('home', {message_list})
});

app.post('/', (req, res) => {
    if (!req.body) throw new ExpressError('Invalid Data', 400);
    message_list.push(req.body)
    res.redirect(`/`)
})

app.all('*', (req, res, next) => {
    next(new ExpressError('Page Not Found', 404))
})

app.use((err, req, res, next) => {
    const { statusCode = 500 } = err;
    if (!err.message) err.message = 'Oh No, Something Went Wrong!'
    res.status(statusCode).render('error', { err })
})

app.listen(PORT, () => {
    console.log(`Server IP:       ${IP_ADDRESS}`);
    console.log(`Serving Port:    ${PORT}`)
    console.log(`Url:             http://${IP_ADDRESS}:${PORT}\n`)
})