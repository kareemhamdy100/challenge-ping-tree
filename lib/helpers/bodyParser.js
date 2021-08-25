const REQ_BYTE_MAX =  50000;


module.exports = function (req,) {
    return new Promise((reslove, reject) =>{
        req.rawBody = '';
        var byteCount = 0;
        req.on('data', function(chunk) { 
        byteCount += Buffer.from(chunk).length
        if(byteCount > REQ_BYTE_MAX) {
            const error = new Error('Request content is larger than the limit.');
            error.statusCode = 413;
            reject(error);
        }  
        req.rawBody += chunk;
        });

        req.on('end', function() {
           req.body = JSON.parse(req.rawBody);
           reslove();
        });
    })
}
