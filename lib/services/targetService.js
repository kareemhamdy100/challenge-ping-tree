const {
    findOneById,
    findOneAndUpateById,
    getAll,
    insert
} = require('../db/targetsQueries');
async function addNewTarget(data){
    const newCreatedTarget = await insert(data);
    return newCreatedTarget;
}


async function getAllTargets(){
    const allTargets = await getAll();
    return allTargets;
}

async function updateOneTarget(newData, id){
    const targetAfterUpdate = await findOneAndUpateById(id, newData);
    return targetAfterUpdate;
}

async function getOneTarget(id){
    const target = await findOneById(id);
    return target;
}


module.exports = {
    addNewTarget,
    getAllTargets,
    updateOneTarget,
    getOneTarget
}