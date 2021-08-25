const {
    findAcceptedTarget
} = require('../db/targetsQueries');


async function getAcceptedUrl(data){
    const date = new Date(data.timestamp);
    const dayString = date.toISOString().split('T')[0];
    const target = await findAcceptedTarget(`${data.geoState}_${date.getUTCHours()}`, dayString);
    if(target){
        return {url : target.url};
    }
    return {"decision":"reject"};
}


module.exports = {
    getAcceptedUrl
}