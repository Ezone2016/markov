function markov(things) {

    var allwords = [];
    var allnames = [];

    for (var i = 0; i < things.length; i++) {
        // Remove the name at the end of the thing
        var re = /(\([^)]+\))$/;
        var matches = re.exec(things[i]);
        allnames = allnames.concat(matches[1]);
        var thing = things[i].replace(matches[1], "");
        var words = thing.split(' ');
        words.pop(); // last element is an empty string
        allwords = allwords.concat(words);
    }

    return makeMarkovText(allwords, allnames);
}

function myInsert(table, index, value) {

    if (!(table[index])) {
        table[index] = [value];
    } else {
        table[index].push(value);
    }
}

function cleanup(string, name) {

    // remove everything after the last period or exclamation point
    var re = /([\.!])([^.!]+)$/;
    string = string.replace(re, '$1');

    // if string has no ending punctuation, add a period
    var lastChar = string.slice(-1);
    if (lastChar !== "." && lastChar !== "!") {
        string = string + ".";
    }

    string = string.replace(/\(/g,'');
    string = string.replace(/\)/g,'');
    string = string.replace(/"/g,'');

    // fix double ending punctuation
    string = string.replace(',.', '.');
    string = string.replace(/\.\./g, '.');

    return string + " " + name;
}

function makeMarkovText(words, names) {

    var MAXLENGTH = 20;
    var NOWORD = "NOWORD";

    // pick a name
    var index = Math.floor(Math.random() * names.length);
    var name = names[index];

    // create table
    var table = {};
    var w = NOWORD;
    for (var i = 0; i < words.length; i++) {
        myInsert(table, w, words[i]);
        w = words[i];
    }
    myInsert(table, w, NOWORD);

    // generate text
    var outputString = "";
    w = NOWORD;

    for (var i = 0; i < MAXLENGTH; i++) {
        var list = table[w];

        var index = Math.floor(Math.random() * list.length);
        var nextword = list[index];

        if (nextword == NOWORD) {
            return cleanup(outputString, name);
        }

        outputString = outputString + " " + nextword;
        w = nextword;
    }

    return cleanup(outputString, name);
}
