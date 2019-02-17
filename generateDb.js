var posts = require("./posts.json");
const request = require('request');
posts = posts["data"]['children'];
var algoliasearch = require("algoliasearch");
var client = algoliasearch('BR3AF6MRA6', '03ea2b2f3d555a241dc9718bccd42f81');
var index = client.initIndex('Science Questions');

var NaturalLanguageUnderstandingV1 = require('watson-developer-cloud/natural-language-understanding/v1.js');
var natural_language_understanding = new NaturalLanguageUnderstandingV1({
    'version': '2018-03-16',
    'iam_apikey': "jwDsM9QgSg1F_L5RX5Gzp3scbOfe4NtQVG91Ynoqkiqu",
    'url': "https://gateway.watsonplatform.net/natural-language-understanding/api"
});

var data = {};
async function run() {
    console.log(data);
    for(post of posts) {
        var postData = post["data"];
        getTopComment(postData["permalink"], postData["title"], (title, ans) => {
            getKeywords((title), (tags)=> {
                index.addObjects([{"Question": title, "Answer":ans, "Tags": tags}]);
            });
        });
    }
}

async function getTopComment(uri, title, resolve) {
    const host = "https://www.reddit.com"
    var url = host + uri + ".json";
    request.get(url, (err, res, body) => {
        var json = JSON.parse(body);
        json = json[1]["data"]["children"];
        for(comment of json) {
            if(comment["data"]["stickied"] != true) {
                var finalComment = comment["data"]["body"];
                if(finalComment == "[removed]")
                    continue;
                finalComment = finalComment.replace(/\*/g, "");
                finalComment = finalComment.replace(/edit(.*)/g, "");
                finalComment = finalComment.replace(/Edit(.*)/g, "");
                resolve(title, finalComment);
                break;
            }
        }
    });
}

function getKeywords(data, callback) {
    var parameters = {
        'text': data,
        'features': {
            'entities': {
            },
            'keywords': {
                'limit': 5
            }
        }
    };

    var keywords_list = [];
    if(data == "") {
        callback([]);
        return;
    }
    natural_language_understanding.analyze(parameters, function (err, response) {
        if (err)
            console.log('error:', err);
        else {
            for (var i = 0; i < response.keywords.length; i++) {
                if (JSON.stringify(response.keywords[0].relevance) > .2) {
                    keywords_list.push(response.keywords[i].text);
                }
            }
        }
        if (callback) {
            callback(keywords_list);
        }
    });

    // return keywords_list;
}

run();