const path = require('path');
const express = require('express');
const fs = require('fs');
const https = require('https')
//Postgres code
const bodyParser = require('body-parser')
const db = require('./routes/queries');
const cors = require('cors');

const PORT = process.env.PORT || 8080;
const config = require('./config');
if (config.credentials.client_id == null || config.credentials.client_secret == null) {
    console.error('Missing FORGE_CLIENT_ID or FORGE_CLIENT_SECRET env. variables.');
    return;
}

let app = express();


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true,})
);
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json({ limit: '50mb' }));
app.use('/api/forge/oauth', require('./routes/oauth'));
app.use('/api/forge/oss', require('./routes/oss'));
app.use('/api/forge/modelderivative', require('./routes/modelderivative'));
app.use((err, req, res, next) => {
    console.error(err);
    res.status(err.statusCode).json(err);
});
//Postgres code
app.get('/alldata',db.getData);
app.get('/alldata/:id',db.getDataById);
// app.get('/alldataview/',db.getDataView)

//load data routes
var routes = require('./routes/routes');
//routes
app.use('/api', cors(), routes);

app.listen(PORT, () => { console.log(`Server listening on port ${PORT}`); });

module.exports = app;