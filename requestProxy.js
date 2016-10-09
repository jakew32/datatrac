const protectedHeaders = ['Origin', 'X-MSGR-Region', 'User-Agent', 'Content-Type', 'Accept', 'Referer', 'Accept-Encoding', 'Accept-Language', 'Cookie'];
const ekernalHeader = {
    name: 'ekernal-proxied',
    value: 'true',
}
var blockedRequests = {};
var redirectHeader = {
    name: 'X-Forward-To',
    value: ""
}
var loggedRequestsSize = {};
var loggedRequestsNumber = {};

// For flagging the requests that should be modified, and storing their request body (which can't be accessed through the onBeforeSendHeaders listener)
chrome.webRequest.onBeforeRequest.addListener(
    function(request) {
        if (request.method == 'POST' || request.method == 'GET') {
            var requestBody = decodeBody(request.requestBody.raw[0].bytes);
            if (requestBody) {
                blockedRequests[request.requestId] = requestBody;
                strippedRequestUrl = request.url.split("/")[2];
                loggedRequestsSize[strippedRequestUrl] = loggedRequestsSize[strippedRequestUrl] + JSON.stringify(bigObject).length || JSON.stringify(bigObject).length;
                loggedRequestsNumber[strippedRequestUrl] = loggedRequestsNumber[strippedRequestUrl] + 1 || 1;
                redirectHeader.value = request.url;
            }
        }
        return {cancel: false};
    },
    {urls: ['<all_urls>']},
    ['blocking', 'requestBody']
);

// For dropping the original flagged request and creating a modified request to take its place
chrome.webRequest.onBeforeSendHeaders.addListener(
    function(request) {
        for (var i = 0; i < request.requestHeaders.length; i++) { // check for modified request and don't block it
            if (request.requestHeaders[i].name === redirectHeader.name) { // this is the modified request, strip the ekernalHeader to make it seem normal
                request.requestHeaders.splice(i, 1);
                return {cancel: false};
            }
        }

        if (blockedRequests[request.requestId] === undefined) { // don't block requests that we haven't flagged as requiring kerning
            return {cancel: false};
        }

        // var requestBody = replaceParameterValue(blockedRequests[request.requestId], 'body', function(full, key, value){ // create modified request body
        //     if (value) {
        //         return key + encodeURIComponent(properKerning(decodeURIComponent(value)));
        //     }
        //     return full;
        // });

        var newRequest = {
            'type': 'POST',
            'path': request.url,
            'headers': request.requestHeaders.concat(redirectHeader),
            'body': `(${encodeBody.toString()})(${JSON.stringify(requestBody)})`
        };

        injectRequest(newRequest); // inject modified request and drop original request
        return {cancel: true};
    },
    {urls: ['<all_urls>']},
    ['blocking', 'requestHeaders']
);

// Injects the request into the messenger tab to get around not being able to set the protected headers (even through the onBeforeSendHeaders listener, some don't get changed)
function injectRequest(requestData) {
    chrome.tabs.executeScript({
        code: (`
            var protectedHeaders = ${JSON.stringify(protectedHeaders)};
            (${makeRequest.toString()})(${JSON.stringify(requestData)});
        `)
    });
}

// Gets stringified and sent over to the page as an injected script to be evaluated
function makeRequest(requestData) {
    var self = this;
    var request = new XMLHttpRequest();
    request.open(requestData.type, requestData.path, true);

    for (var i = 0; i < requestData.headers.length; i++) {
        if (protectedHeaders.includes(requestData.headers[i].name)) {
            continue;
        }
        request.setRequestHeader(requestData.headers[i].name, requestData.headers[i].value || requestData.headers[i].binaryValue);
    }

    request.send(eval(requestData.body)); // I feel like it's a valid use of eval, considering everything has to be stringified to be injected
}
