var algoliasearch = require("algoliasearch");
var client = algoliasearch('BR3AF6MRA6', '03ea2b2f3d555a241dc9718bccd42f81');
var index = client.initIndex('Science Questions');

function search(query) {
    index.search({query: query}, (err, content) => {
        // console.log(content);
        // var results = JSON.parse(content);
        var result = content["hits"][0];
        if(result == undefined) {
            console.log("No Answer found");
            return;
        }
        console.log(result["Answer"]);
    });
}

search("Why do people sleep?");


