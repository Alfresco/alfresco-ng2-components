var alfUrl = 'http://192.168.99.100:8080/alfresco', loginUrl = '/service/api/login',
    logoutUrl = '/service/api/login/ticket';

function sendXhr(options) {
    if (!options.url) {
        throw 'URL must be specified';
    }
    return new Promise(function(resolve, reject) {
        var xhr = new XMLHttpRequest(), url = alfUrl + options.url, ticket = getTicket(), defaultMethod, requestBody = null;
        if (ticket && url != loginUrl) {
            console.log('Adding ticket ' + ticket);
            url += (url.indexOf('?') == -1 ? '?' : '&') + 'alf_ticket=' + ticket;
        }
        if (options.data) {
            requestBody = options.data;
        } else if (options.jsonData) {
            requestBody = JSON.stringify(options.jsonData);
        }
        defaultMethod = requestBody === null ? 'GET' : 'POST';
        xhr.addEventListener('load', function reqListener () {
            var status = this.status,
                json = this.responseText !== null && this.responseText.indexOf('{') == 0 ?
                    JSON.parse(this.responseText) : null;
            this.json = json;
            if (status >= 200 && status < 300) {
                resolve(this);
            } else {
                reject(this);
            }
        });
        xhr.addEventListener('error', function reqListener () {
            reject(this);
        });
        xhr.open(options.method || defaultMethod, url);
        if (options.acceptType) {
            xhr.setRequestHeader('Accept', options.acceptType);
        }
        if (requestBody) {
            xhr.setRequestHeader('Content-Type', options.contentType || 'application/json');
            xhr.send(requestBody);
        } else {
            xhr.send();
        }
    });
}

function getTicket() {
    return sessionStorage.getItem('loginTicket');
}

function setTicket(ticket) {
    sessionStorage.setItem('loginTicket', ticket);
}

function deleteTicket() {
    sessionStorage.removeItem('loginTicket');
}