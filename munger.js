var parse = require('csv-parse'),
    stringify = require('csv-stringify'),
    fs = require('fs');

var recipients = [
    "TRUMP, DONALD J",
    "CRUZ, RAFAEL EDWARD TED",
    "SANTORUM, RICHARD J.",
    "SANTORUM, RICHARD J",
    "SANDERS, BERNARD",
    "CARSON, BENJAMIN S SR MD",
    "CLINTON, HILLARY RODHAM",
    "RUBIO, MARCO",
    "BUSH, JEB",
    "KASICH, JOHN R",
    "CHRISTIE, CHRISTOPHER J",
    "RIGHT TO RISE USA",
    "RIGHT TO RISE PAC, INC.",
    "AMERICA LEADS",
    "CONSERVATIVE, AUTHENTIC, RESPONSIVE LEADERSHIP FOR YOU AND FOR AMERICA (CARLY FOR AMERICA)",
    "READY PAC",
    "CONSERVATIVE SOLUTIONS PAC",
    "NATIONAL DRAFT BEN CARSON FOR PRESIDENT COMMITTEE",
    "PRIORITIES USA ACTION"
];

var googles = [
    "adecco at google",
    "google nest",
    "google, in",
    "google inc",
    "google, inc",
    "google",
    "adecco at google express",
    "google,inc",
    "adecco @ google",
    "google uk ltd"
];

var googleManagers = [
    "director",
    "project manager",
    "product manager",
    "security program manager",
    "software manager",
    "head of human social dynamics",
    "ux manager",
    "facility manager",
    "program manager",
    "manager, site reliability engineering",
    "technical program manager",
    "manager",
    "operations manager",
    "technical account manager",
    "it program manager",
    "finance manager",
    "engineering manager",
    "product ops manager",
    "account executive",
    "vice president",
    "public policy manager",
    "strategy",
    "ceo",
    "people development director",
    "vp, corporate development",
    "technical manager",
    "head of industry, education",
    "global director of business developmen",
    "chief accountant",
    "director of engineering",
    "sr hr director",
    "vp, product management",
    "director, global partnerships",
    "chief of staff",
    "executive",
    "tech executive",
    "head of university relations",
    "senior director",
    "stock administration manager",
    "cto",
    "marketing director",
    "sales operations manager",
    "hr director",
    "account manager"
]

var appleManagers = [
    "account executive",
    "manager",
    "software manager",
    "sr employee relations manager",
    "claims ins manager",
    "engineering project manager",
    "team manager",
    "quality manager",
    "general manager",
    "engineering manager",
    "recruiting coordinator",
    "director of learning",
    "quality program manager",
    "supervisor",
    "global supply manager",
    "software engineering manager",
    "localization manager",
    "executive",
    "vice president",
    "project manager",
    "head of worldwide buzz marketing",
    "director",
    "supply demand management",
    "senior program manager",
    "marketing manager",
    "director, business development",
    "senior manager",
    "partnership manager",
    "strategic initiatives manager"
];

var apples = [
    "bozeman apple inc",
    "apple inc uc davis",
    "apple computer",
    "apple, inc; univ of california",
    "apple, inc",
    "apple",
    "apple inc"
];

function managerWorkerBreakdown(byCompany, company) {
    var managerContribs = {};
    for (var i = 0; i < googleManagers.length; ++i) {
        var contribs = byCompany[company][googleManagers[i]];
        for (cand in contribs) {
            if (!managerContribs[cand]) {
                managerContribs[cand] = 0;
            }

            managerContribs[cand] += contribs[cand];
        }
    }

    var workerContribs = {};
    var totals = {};
    for (job in byCompany[company]) {
        var contribs = byCompany[company][job];
        for (cand in contribs) {
            if (!totals[cand]) {
                totals[cand] = 0;
            }
            totals[cand] += contribs[cand];
        }

        if (googleManagers.indexOf(job) > -1) {
            continue;
        }

        var contribs = byCompany[company][job];
        for (cand in contribs) {
            if (!workerContribs[cand]) {
                workerContribs[cand] = 0;
            }

            workerContribs[cand] += contribs[cand];
        }
    }


    // console.log('-----------------------');

    // console.log(managerContribs);
    // console.log('=====');
    // console.log(workerContribs);
    // console.log('=====')
    // console.log(totals);

    return {
        managerContribs: managerContribs,
        workerContribs: workerContribs
    }

}

var input = fs.readFileSync('2016-tech-contribs.txt');

parse(input, {delimiter: '\t'}, function(err, data) {
    var byCompany = {};
    var byCompanyNoJob = {};
    var byCandidate = {};

    for (var i = 0; i < data.length; ++i) {
        var row = data[i],
            company = row[2],
            job = row[1],
            candidate = row[7],
            amount = parseInt(row[6].replace(/\$/g, '').replace(/,/g, ''));

        if (googles.indexOf(company) > -1) {
            company = "google";
        }
        else if (apples.indexOf(company) > -1) {
            company = 'apple';
        }

        if (company == "google") {
            console.log(row[1], row[6], row[7]);
        }

        if (!byCompany[company]) {
            byCompany[company] = {};
            byCompanyNoJob[company] = {};
        }
        if (!byCompany[company][job]) {
            byCompany[company][job] = {};
        }
        if (!byCompany[company][job][candidate]) {
            byCompany[company][job][candidate] = 0;
        }
        if (!byCompanyNoJob[company][candidate]) {
            byCompanyNoJob[company][candidate] = 0;
        }
        if (!byCandidate[candidate]) {
            byCandidate[candidate] = 0;
        }

        

        // if (amount >= 200) {
            byCandidate[candidate] += amount;
            byCompany[company][job][candidate] += amount;
            byCompanyNoJob[company][candidate] += amount;
        // }
        // byCompany[company][job][candidate] += 1;
        // byCompanyNoJob[company][candidate] += 1;
    }

    console.log('>>>>>>>>>');
    console.log(byCandidate);
    console.log('<<<<<<<<<');


    // console.log(byCompany['apple']);


    var moreBernie = {};
    var moreHillary = {};

    for (company in byCompanyNoJob) {
        data = byCompanyNoJob[company];
        var amountBernie = data['SANDERS, BERNARD'];
        var amountHillary = data['CLINTON, HILLARY RODHAM'];

        if (amountHillary > amountBernie) {
            moreHillary[company] = data;
        } else if (amountBernie > amountHillary) {
            moreBernie[company] = data;
        }
    }


    // console.log(moreBernie);
    // console.log('========================')
    // console.log(moreHillary);





    // ---------
    var companies = ['google','apple'];

    var outDict = {};

    for (var i = 0; i < companies.length; ++i) {
        outDict[companies[i]] = managerWorkerBreakdown(byCompany, companies[i]);
    }

    console.log(outDict);

    var outArray = [
        ['Group', 'Bernie', 'Hillary']
    ];

    for (var i = 0; i < companies.length; ++i) {
        var company = companies[i];
        outArray.push([company + ' managers', outDict[company]['managerContribs']['SANDERS, BERNARD'], outDict[company]['managerContribs']['CLINTON, HILLARY RODHAM']]);
        outArray.push([company + ' workers', outDict[company]['workerContribs']['SANDERS, BERNARD'], outDict[company]['workerContribs']['CLINTON, HILLARY RODHAM']]);
    }

    stringify(outArray, function(err, output){
        fs.writeFileSync('data.csv', output);
    });

    // -----------



});
