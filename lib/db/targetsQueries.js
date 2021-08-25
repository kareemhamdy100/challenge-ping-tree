const  {
    getAsync,
    setAsync,
    msetAsync,
    mgetAsync,
    zaddAsync,
    zrangebyscoreAsync,
    zremAsync,
    scanAsync,
    keysAsync,
    incrbyAsync
} = require('./redisToPromises');

async function getAll() {
    const startSegment = await scanAsync(0, 'match' ,"_*");
    let nextStart = startSegment[0];
    const listOfMgetPromises = [mgetAsync(startSegment[1])];
    while(nextStart !== "0"){
        const nextSegment =  await scanAsync(nextStart, 'match' ,"_*");
        nextStart = nextSegment[0];
        listOfMgetPromises.push(mgetAsync(nextSegment[1]))
    }
    const listOfArrays = await Promise.all(listOfMgetPromises);
    let arrayOfTargets = [];
    listOfArrays.forEach(segment =>{
        arrayOfTargets = [...arrayOfTargets, ...segment];
    });
    return arrayOfTargets.map(target => JSON.parse(target));
}

async function insert(data){
   const newId = await getNextId();
    const newTarget = {id: newId , ...data};
    await setAsync(`_${newId}` , JSON.stringify(newTarget));
    await addingIdToStateHour(newTarget);
    await setLastId(newId);
}

async function findOneById(id){
    const targetObjString = await getAsync(`_${id}`);
    return JSON.parse(targetObjString);
}

async function findOneAndUpateById(id, newData){
    const oldTarget = await findOneById(id);
    const newTarget = {...oldTarget, ...newData};
    await setAsync(`_${id}` , JSON.stringify(newTarget));
    if(newData.value || newData.accept){
        if(newData.accept){
            await removeIdFromStatHour(oldTarget);
        }
        await addingIdToStateHour(newTarget);
    }
    if(newData.maxAcceptsPerDay !== undefined){
        const differance = Number(newData.maxAcceptsPerDay) - Number(oldTarget.maxAcceptsPerDay);
        await updateDaysCapcity(oldTarget.id , differance);
    }
}
async function removeIdFromStatHour(oldTarget){
    const stats = oldTarget.accept.geoState.$in;
    const hours  =  oldTarget.accept.hour.$in;
    stats.forEach(state => {
        hours.forEach(async hour =>{
            await zremAsync(`${state}_${hour}`, oldTarget.id);
        });
    })
}
async function addingIdToStateHour(newTarget){
    const stats = newTarget.accept.geoState.$in;
    const hours  =  newTarget.accept.hour.$in;
    stats.forEach(state => {
        hours.forEach(async hour =>{
            await zaddAsync(`${state}_${hour}`, newTarget.value, newTarget.id);
        });
    })

}


async function findAcceptedTarget(stateHourName, dayString){
    const allCouldAcceptedIds = await zrangebyscoreAsync(stateHourName, '-inf','+inf');
    for(let i = allCouldAcceptedIds.length - 1 ; i >= 0 ; i--){
        const currentId = allCouldAcceptedIds[i];
        const currIdDateString = `${currentId}@${dayString}`;
        const remaingAcceptPerDay = await getAsync(currIdDateString);
        if(remaingAcceptPerDay === null){
            const target = await findOneById(currentId);
            await setAsync(currIdDateString, `${Number(target.maxAcceptsPerDay) -1}`)
            return  target;
        }else if(Number(remaingAcceptPerDay) > 0 ){
            const target = await findOneById(currentId);
            await setAsync(currIdDateString, `${Number(remaingAcceptPerDay) -1}`)
            return target;
        }
    }
    return null;
}

async function updateDaysCapcity(targetId, differance){
    console.log(targetId);
    const allKeys = await keysAsync(`${targetId}@*`);
    const arrayOfPromises = [];
    allKeys.forEach(idPerDay =>{
        arrayOfPromises.push(incrbyAsync(idPerDay, differance));
    })

  const res =  await Promise.all(arrayOfPromises);
  console.log(res, differance);
    console.log(await mgetAsync(allKeys));
   
  
}


async function getNextId(){
    const lastId = await getAsync('lastId');
    return Number(lastId) + 1;
}
async function setLastId(newId){
   await setAsync('lastId', newId);
}
module.exports = {
    findOneById,
    findOneAndUpateById,
    getAll,
    insert,
    findAcceptedTarget
}