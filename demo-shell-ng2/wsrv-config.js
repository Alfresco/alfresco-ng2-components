module.exports = {
    "host": "0.0.0.0",
    "port": 3000,
    "dir": "./dist",
    "spa": true,
    "proxy": {
        "/ecm/{p*}": {
            "options": {
                "uri": "http://0.0.0.0:8080/{p}"
            }
        },
        "/bpm/{p*}": {
            "options": {
                "uri": "http://0.0.0.0:9999/{p}"
            }
        }
    },
    onResHeaders(headers) {
        if (headers) {
            const authHeader = headers['www-authenticate'];
            if (authHeader) {
                headers['www-authenticate'] = `x${authHeader}`;
            }
        }
    }
}
