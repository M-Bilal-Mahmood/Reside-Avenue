let mongoose = require('mongoose');
mongoose.set("debug", false);
let Data = require('./data.js');
let ListingModel = require('../Models/listingModel.js');
let ReviewModel = require('../Models/reviewModel.js');

// Mongo connection
let siteURL = "mongodb://localhost:27017/Reside_Avenue";
main().then(() => {
    console.log("Mongo Connection Open");
    dataInsertion()
        .then(() => {
            console.log("Closing connection...");
            mongoose.connection.close();
        });
}).catch(err => {
    console.log("Mongo Connection Error");
});
async function main () {
    await mongoose.connect(siteURL);    
}

const dataInsertion = async () => {
    console.log("START");
    await ListingModel.deleteMany({});
    await ReviewModel.deleteMany({});
    const processedData = Data.data.map((obj) => ({
        ...obj,
        image: {
            url: obj.image.url,
            filename: obj.image.filename || ""
        },
        owner: "6a210f7dd6c07f1c824028f5"
    }));
    await ListingModel.insertMany(processedData, { ordered: false }); ;
}
