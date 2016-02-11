var parse = require('csv-parse'),
    stringify = require('csv-stringify'),
    fs = require('fs');

// -------
var jobKeywords = [
    'driver',
];

var companyKeywords = [

];

var generalKeywords = [
    'uber',
    'lyft',
];
// -------

function containsKeyword(row) {
    var company = row[2],
        job = row[1];

    for (var i = 0; i < jobKeywords.length; ++i) {
        if (job.indexOf(jobKeywords[i]) != -1) {
            return true;
        }
    }
    for (var i = 0; i < companyKeywords.length; ++i) {
        if (company.indexOf(companyKeywords[i]) != -1) {
            return true;
        }
    }
    for (var i = 0; i < generalKeywords.length; ++i) {
        if (job.indexOf(generalKeywords[i]) != -1 ||
            company.indexOf(generalKeywords[i]) != -1) {
            return true;
        }
    }

    return false;
}

var input = fs.readFileSync('2016-tech-contribs.txt');

parse(input, {delimiter: '\t'}, function(err, data) {
    var contrib = [data[0]];

    for (var i = 1; i < data.length; ++i) {
        var row = data[i],
            company = row[2],
            job = row[1],
            candidate = row[7],
            amount = parseInt(row[6].replace(/\$/g, '').replace(/,/g, ''));

        


        if (containsKeyword(row)) {
            console.log(row[2], ' : ', row[1], ' : ', row[6]);
            contrib.push(row);
        }
    }

    stringify(contrib, function(err, output){
        fs.writeFileSync('gigData.csv', output);
    });
});
