const Axios = require('axios');
const querystring = require('querystring');

const models = {
    get: async function (req, res) {
        project_base64 = req.query.project;
        project_buffer = Buffer.from(project_base64, 'base64');
        project_utf = project_buffer.toString('utf-8');
        model_base64 = req.query.model;
        model_buffer = Buffer.from(model_base64, 'base64');
        model_utf = model_buffer.toString('utf-8');
        p1 = getToken()
        Promise.resolve(p1).then(v => {
            Axios({
                method: 'GET',
                url: 'https://developer.api.autodesk.com/data/v1/projects/' + project_utf + '/items/' + model_utf + '/versions',
                headers: {
                    'Authorization': 'Bearer ' + v
                },
            })
                .then(function (response) {
                    // Success
                    urn = response.data.data[0].relationships.derivatives.data.id
                    res.send({urn: urn})

                })
                .catch(function (error) {
                    // Failed
                    console.log(error)
                })

        })

    }
}

async function getToken (req, res){
    arr = []
     await Axios({
        method: 'POST',
        url: 'https://developer.api.autodesk.com/authentication/v1/authenticate',
        headers: {
            'content-type': 'application/x-www-form-urlencoded',
        },
        data: querystring.stringify({
            client_id: 'CuwuKTAQPg0Vdy8MH6VjoSG2IMQC91qW',
            client_secret: 'e85fgp7TdlPFgh9l',
            grant_type: 'client_credentials',
            scope: 'data:read'
        })
    })
        .then(function (response) {
            // Success
           a = response.data.access_token;
           arr.push(a); 
           //console.log('Paso 1: Token ' + access_token);
            // res.send('Token de acceso: '+access_token)
        })
        .catch(function (error) {
            // Failed
           next(error);
            //res.send('Failed to authenticate');
        });
 return arr

}

module.exports = models