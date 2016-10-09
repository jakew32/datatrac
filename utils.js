function replaceParameterValue(queryString, parameter, replaceFunc) {
    return queryString.replace(RegExp('([?&]' + parameter + '=)([^&]*)'), replaceFunc);
}

function decodeBody(buf) {
    return String.fromCharCode.apply(null, new Uint8Array(buf));
}

function encodeBody(str) {
    var buf = new ArrayBuffer(str.length * 2); // 2 bytes for each char
    var bufView = new Uint8Array(buf);
    for (var i = 0; i < str.length; i++) {
        bufView[i] = str.charCodeAt(i);
    }
    return buf;
}

function stringToObject(text) {
    var obj = {};
    for (var i = 0; i < text.length; i++) {
        obj[i] = text[i];
    }
    return obj;
}

function objectToString(obj) {
    var text = "";
    for (key in obj) {
        text += obj[key];
    }
    return text;
}

function pickRandom(selection) {
    if (typeof selection != 'object') {
        return null;
    }

    if (selection.length) {
        var random
        return selection[Math.trunc(Math.random() * selection.length)];
    }

    return selection[pickRandom(Object.keys(selection))];
}
