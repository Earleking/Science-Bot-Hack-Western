var algoliasearch = require("algoliasearch");
var client = algoliasearch('BR3AF6MRA6', '03ea2b2f3d555a241dc9718bccd42f81');
var index = client.initIndex('Science Questions');
index.setSettings({
    maxFacetHits: 200
});
function search(query, callback) {
    index.search({query: query}, (err, content) => {
        // console.log(content);
        // var results = JSON.parse(content);
        var result = content["hits"][0];
        if(result == undefined) {
            callback(null, "No Answer found");
            return;
        }
        var t = {
            question: result["question"],
            answer: result["answer"]
        }
        callback(null, t);
    });
}

function all(callback) {
    index.browse({query: ""}, (err, content) => {
        var result = content["hits"];
        if(result == undefined) {
            callback(null, "No Answer found");
            return;
        }
        callback(null, result);
    });
}
  
module.exports = (query = '-1', context, callback) => {
    console.log(query);
    if(query == "-1") {
        all(callback);
    }
    else {
        search(query, callback);
    }
  
};