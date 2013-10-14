var express = require("express");
var app = express();

// compress content using gzip
app.use(express.compress());

app.use(express.static(__dirname + '/public'));


app.get("/string", function(req, res) {
//    var strings = ["rad", "bla", "ska"]
//    var n = Math.floor(Math.random() * strings.length)
//    res.send(strings[n])
    res.send("lolololol")
})

app.listen(process.env.PORT || 3000);
