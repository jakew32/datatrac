var spaceTypes = {
    'default': String.fromCharCode(32),
    'noWidth': String.fromCharCode(6158),
    'hair': String.fromCharCode(8202),
    'punctuation': String.fromCharCode(8200),
}

var kernStyles = {
    'default': [{
        'spaceType': 'hair',
        'probability': 8 / 10,
        'multiple': 1,
    }, {
        'spaceType': 'punctuation',
        'probability': 2 / 10,
        'multiple': 1,
    }, {
        'spaceType': 'default',
        'probability': 1 / 10,
        'multiple': 1,
    }, ],

    'halfKerned': [{
        'spaceType': 'hair',
        'probability': 4 / 10,
        'multiple': 1,
    }, {
        'spaceType': 'punctuation',
        'probability': 1 / 10,
        'multiple': 1,
    }, {
        'spaceType': 'default',
        'probability': 1 / 20,
        'multiple': 1,
    }, ],

    'a e s t h e t i c': [{
        'spaceType': 'default',
        'probability': 1,
        'multiple': 1,
    }, ],

    'hair a e s t h e t i c': [{
        'spaceType': 'hair',
        'probability': 1,
        'multiple': 1,
    }, ],

    'extraVariance': [{
        'spaceType': 'hair',
        'probability': 5 / 10,
        'multiple': 1,
    }, {
        'spaceType': 'hair',
        'probability': 3 / 10,
        'multiple': 1,
    }, {
        'spaceType': 'hair',
        'probability': 3 / 10,
        'multiple': 1,
    }, {
        'spaceType': 'punctuation',
        'probability': 2 / 10,
        'multiple': 1,
    }, {
        'spaceType': 'default',
        'probability': 1 / 10,
        'multiple': 1,
    }, ],
}

function properKerning(text, kernStyle) {
    var textObj = stringToObject(text);
    var kernOptions = kernStyle ? kernStyles[kernStyle] : pickRandom(kernStyles);

    for (letter in textObj) {
        for (var i = 0; i < kernOptions.length; i++) {
            var kernOption = kernOptions[i];
            if (Math.random() < kernOption.probability) {
                textObj[letter] += spaceTypes[kernOption.spaceType].repeat(kernOption.multiple);
            }
        }
    }

    return objectToString(textObj);
}
