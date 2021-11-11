const Pool = require('pg').Pool
const pool = new Pool({
  user: 'postgres',
  host: '10.2.21.159',
  database: 'bim_master',
  password: 'Idombim',
  port: 5432,
})

const getData = (request, response) => {
    pool.query('select qsid, description, uom, "Modificado por" from bor', 
    (error, results) => {
      if (error) {
        throw error
      }
      response.status(200).json(results.rows)
    })
  }
  const getDataById = (request, response) => {
    const id = request.params.id
  
    pool.query('select qsid, uom,description,technical_spec,"Section",ff_e_extras,"CBS (NRM1)" from bor where qsid = $1', [id], (error, results) => {
      if (error) {
        throw error
      }
      response.status(200).json(results.rows)
    })
  }
  // const execute = (request, response) => { 
  //   pool.query('select * from "BoR_List"', 
  //   (error, results) => {
  //     if (error) {
  //       throw error
  //     }
  //     response.status(200).json(results.rows)
  //   })
  // }
  
module.exports = { 
    getData: getData,
    getDataById: getDataById
};
  