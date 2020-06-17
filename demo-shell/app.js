var port = process.env.PORT || 3000,
    http = require('http'),
    fs = require('fs'),
    url = require('url'),
    mime = require('mime'),
    html = fs.readFileSync('index.html');

var log = function(entry) {
    fs.appendFileSync('/tmp/sample-app.log', new Date().toISOString() + ' - ' + entry + '\n');
};

var server = http.createServer(function (req, res) {

    // Parse the request containing file name
    var pathname = url.parse(req.url).pathname;

    // Print the name of the file for which request is made.
    console.log("Request for " + pathname + " received.");

    if (req.method === 'POST') {
        var body = '';

        req.on('data', function(chunk) {
            body += chunk;
        });

        req.on('end', function() {
            if (req.url === '/') {
                log('Received message: ' + body);
            } else if (req.url === '/scheduled') {
                log('Received task ' + req.headers['x-aws-sqsd-taskname'] + ' scheduled at ' + req.headers['x-aws-sqsd-scheduled-at']);
            }

            res.writeHead(200, 'OK', {'Content-Type': 'text/plain'});
            res.end();
        });
    } else {
        var filename = pathname.substr(1);
        if(filename === '' || filename.indexOf('.') === -1){
            filename = 'index.html';
        }
        // Read the requested file content from file system
        fs.readFile(filename, function (err, data) {
            if (err) {
                console.log(err, filename);
                // HTTP Status: 404 : NOT FOUND
                // Content Type: text/plain
                res.writeHead(404, {'Content-Type': 'text/html'});
            }else{
                //Page found
                // HTTP Status: 200 : OK
                // Content Type: text/plain
                var type = mime.lookup(filename);
                console.log('type',type);
                if (!res.getHeader('content-type')) {
                    var charset = mime.charsets.lookup(type);
                    res.setHeader('Content-Type', type + (charset ? '; charset=' + charset : ''));
                }
                if(type.indexOf('image') > -1 || type.indexOf('font') > -1){
                    var img = fs.readFileSync(pathname.substr(1));
                    res.end(img, 'binary');
                }else{
                    res.write(data.toString());
                }
                // Write the content of the file to response body
            }
            // Send the response body
            res.end();
        });
    }
});

// Listen on port 3000, IP defaults to 127.0.0.1
server.listen(port);

// Put a friendly message on the terminal
console.log('Server running at http://127.0.0.1:' + port + '/');
