const { ObjectId } = require('mongodb');
const users = require('./users');
const mongoCollections = require("../config/mongoCollections");
const attractions = mongoCollections.attractions;

// async function addAttractions(userId, relatedCommentsId, relatedTravelogueId, description) {
//     const attractionCollection = await attractions();
//     let newAttractions = {
//         userId: userId,
//         relatedCommentsId: relatedCommentsId,
//         relatedTravelogueId: relatedTravelogueId,
//         description: description
//     };
//     const insertInfo = await attractionCollection.insertOne(newAttractions);
//     if (insertInfo.insertedCount === 0) throw "could not add attraction";
//     const newId = insertInfo.insertedId + "";
//     const attraction = await getAttraction(newId);
//     await users.updateUser(userId, {spotsId: newId});
//     return attraction;
// }
async function addAttractions(userId, description) {
    const attractionCollection = await attractions();
    let newAttractions = {
        userId: userId,
        relatedCommentsId: [],
        relatedTravelogueId: [],
        description: description
    };
    const insertInfo = await attractionCollection.insertOne(newAttractions);
    if (insertInfo.insertedCount === 0) throw "could not add attraction";
    const newId = insertInfo.insertedId + "";
    const attraction = await getAttraction(newId);
    await users.updateUser(userId, { spotsId: newId });
    return attraction;
}

async function getAttraction(id) {
    // if (!id) throw "id must be given";
    // if (typeof(id) === "string") id = ObjectId.createFromHexString(id);
    const attractionCollection = await attractions();
    const attraction = await attractionCollection.findOne({ _id: ObjectId(id) });
    if (!attraction) throw "attraction with that id does not exist";
    return attraction;
}

async function getAttractionBySearch(searchTerm) {
    const query = new RegExp(searchTerm, 'i');
    const attractionCollection = await attractions();
    const attractionList = await attractionCollection.find({ "description.Name": query }).toArray();
    return attractionList;
}


//add Travelogue To Attraction data, added by feng liu
async function addTravelogueToAttraction(attractionId, travelogueId) {
    let currentAttaction = await this.getAttraction(attractionId);

    const attractionCollection = await attractions();
    const updateInfo = await attractionCollection.updateOne({ _id: ObjectId(attractionId) }, { $addToSet: { relatedTravelogueId: { id: travelogueId.toString() } } });

    if (!updateInfo.matchedCount && !updatedInfo.modifiedCount) {
        // throw 'Error: update failed';
        return;
    }
    return await this.getAttraction(attractionId);
}

//remove Travelogue from Atrraction data, added by feng liu
async function removeTravelogueFromAttraction(attractionId, travelogueId) {
    let currentAttaction = await this.getAttraction(attractionId);
    const newTravelogue = {};
    newTravelogue.relatedTravelogueId = [];
    let index = 0;
    for (let i of currentAttaction.relatedTravelogueId) {
        if (i.id.toString() == travelogueId) continue;
        newTravelogue.relatedTravelogueId[index++] = i;
    }
    const attractionCollection = await attractions();
    const updateInfo = await attractionCollection.updateOne({ _id: ObjectId(attractionId) }, { $set: newTravelogue });
    if (!updateInfo.matchedCount && !updateInfo.modifiedCount) throw 'Error: delete failed';
    await this.getAttraction(attractionId);
}



//add Comment To Attraction data, added by feng liu
async function addCommentToAttraction(attractionId, commentId) {
    let currentAttaction = await this.getAttraction(attractionId);

    const attractionCollection = await attractions();
    const updateInfo = await attractionCollection.updateOne({ _id: ObjectId(attractionId) }, { $addToSet: { relatedCommentsId: { id: commentId.toString() } } });

    if (!updateInfo.matchedCount && !updatedInfo.modifiedCount) {
        // throw 'Error: update failed';
        return;
    }
    return await this.getAttraction(attractionId);
}

//remove Travelogue from Atrraction data, added by feng liu
async function removeCommentFromAttraction(attractionId, commentId) {
    let currentAttaction = await this.getAttraction(attractionId);
    const newComment = {};
    newComment.relatedCommentsId = [];
    let index = 0;
    for (let i of currentAttaction.relatedCommentsId) {
        if (i.id.toString() == commentId) continue;
        newComment.relatedCommentsId[index++] = i;
    }
    const attractionCollection = await attractions();
    const updateInfo = await attractionCollection.updateOne({ _id: ObjectId(attractionId) }, { $set: newComment });
    if (!updateInfo.matchedCount && !updateInfo.modifiedCount) throw 'Error: delete failed';
    await this.getAttraction(attractionId);
}
module.exports = {
    addAttractions,
    getAttraction,
    getAttractionBySearch,
    addTravelogueToAttraction,
    removeTravelogueFromAttraction,
    addCommentToAttraction,
    removeCommentFromAttraction
}