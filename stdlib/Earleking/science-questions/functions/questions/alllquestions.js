var algoliasearch = require("algoliasearch");
var client = algoliasearch('BR3AF6MRA6', '03ea2b2f3d555a241dc9718bccd42f81');
var index = client.initIndex('Science Questions');

function search(query, callback) {
    index.search({query: query}, (err, content) => {
        // console.log(content);
        // var results = JSON.parse(content);
        var result = content["hits"];
        if(result == undefined) {
            callback(null, "No Answer found");
            return;
        }
        callback(null, result);
    });
}
  
module.exports = (context, callback) => {
    search("", callback);
  
};