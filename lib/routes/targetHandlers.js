const sendJson = require('send-data/json');

const bodyParser = require('../helpers/bodyParser');
const {
    addNewTarget,
    getAllTargets,
    updateOneTarget,
    getOneTarget
} = require('../services/targetService');

async function targetRootHandler(req, res, opts, cb){
   try{
        switch(req.method){
            case 'GET': 
                return getAllTargetsHandler(req, res, opts, cb);
            case 'POST':
                await bodyParser(req);
                return createNewTargetHandler(req,res, opts, cb);
            default: 
            return cb(notFound());     
        }
    } catch(error){
         return cb(error);
    }
}


async function targetWithIdHandler(req, res, opts, cb){
    try {
        switch(req.method){
            case 'GET': 
                return getOneTargetHandler(req, res, opts, cb);
            case 'POST':
                await bodyParser(req);
                return updateOneTargetHandler(req,res, opts, cb);
            default: 
            return cb(notFound());     
        }
    } catch(error){
        return cb(error);
    }
    
}




async function createNewTargetHandler(req, res ,opts, cb){
    console.log(req.body);
    await addNewTarget(req.body);
    res.end("new created target") ;
}

async function getAllTargetsHandler(req, res, opts, cb){
   const result =  await getAllTargets();
   sendJson(req, res , {data: result});
}

async function getOneTargetHandler(req, res ,opts, cb){
    const target = await getOneTarget(opts.params.id);
    sendJson(req, res , {data: target});
    
}

async function updateOneTargetHandler(req, res ,opts, cb){
    await updateOneTarget(req.body, opts.params.id);
    res.end( "update one target");
}


function notFound(){
    const notFoundError = new Error('not found resource');
    notFoundError.statusCode = 404;
    return notFoundError;
}


module.exports = {
  targetRootHandler, 
  targetWithIdHandler

}

