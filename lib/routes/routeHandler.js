const sendJson = require('send-data/json');

const bodyParser = require('../helpers/bodyParser');

const { getAcceptedUrl } = require('../services/routeService');
async function routeHandler(req, res, opts, cb){
    try{
         switch(req.method){
             case 'POST':
                 await bodyParser(req);
                 return getAcceptedUrlHandler(req,res, opts, cb);
             default: 
             return cb(notFound());     
         }
     } catch(error){
          return cb(error);
     }
 }
 async function getAcceptedUrlHandler(req, res ,opts, cb){
    const result = await getAcceptedUrl(req.body);
    return sendJson(req, res ,{data : result});
 }
module.exports = {
    routeHandler
  }
  
  