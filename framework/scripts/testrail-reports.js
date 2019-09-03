#!/usr/bin/env node

const meow = require('meow');
const JSON5 = require('json5');
const Testrail = require('testrail-api');
const jsonfile = require('jsonfile');
const Bottleneck = require('bottleneck');
const testrail_lib = require('../libs/testrail_libs');
const _ = require ('underscore');

//TODO: improve help message
optionHelp = `
    Usage
        $ testrail-reports --optionName=optionValue
    Options
        --trApiUrl, testrail API Url, default = process.env.trApiUrl
        --trApiUrl, testrail API User, default = process.env.trApiUser
        --trApiUrl, testrail API Key, default = process.env.trApiKey
        --trCmd, testrail API Command, http://docs.gurock.com/testrail-api2/start, default = getProjects
`;
optionFlags = {
    // Special Parameters
    trApiUrl: {
        type: 'string'
    },
    trApiUser: {
		type: 'string'
    },
    trApiKey: {
		type: 'string'
    },
    trCmd: {
		type: 'string',
		default: 'getProjects'
    },
    // Cucumber Parameters
    cbJsonPath: {
        type: 'string'
    },
    // API parameters
    trCaseId: {
		type: 'number'
    },
    trTestId: {
        type: 'number'
    },
    trFilter: {
        type: 'string',
        default: ''
    },
    trMilestoneId: {
		type: 'number'
    },
	trProjectId: {
		type: 'number',
    },
    trRunId: {
		type: 'number'
    },
    trSectionId: {
		type: 'number'
    },
    trSuiteId: {
		type: 'number'
    },
    trSuiteName: {
		type: 'string'
    },
    trUserEmail: {
		type: 'string'
    },
    trUserId: {
		type: 'number'
    },
    trForceAdd: {
        type: 'boolean',
        default: false
    },
    trForceUpdate: {
        type: 'boolean',
        default: false
    },
    trSprintId: {
        type: 'number',
        default: 0 //0 - autogenerated
    },
    trTestTarget: {
        type: 'string',
        default: "QA"
    },
    trTestrunId: {
        type: 'number'        
    },
    trJenkinsPath: {
        type: 'string'
    },
    trUpdateInBulk: {
        type: 'boolean',
        default: true
    },
    trThrottle: {
        type: 'number', // ms delay per request, 0 for no delay
        default: 333    // 333 ms delay = 3 per second (180 per minute)
    },

	// Special option for positional arguments
	arguments: 'string'
}
const cli = meow(optionHelp, {flags: optionFlags});
const trFilter = JSON5.parse('{' + cli.flags.trFilter + '}');
const cbJson = (cli.flags.cbJsonPath) ? jsonfile.readFileSync(cli.flags.cbJsonPath) : null;

// prepare to throttle API request
// testrail API limites 180 requeset per minutes
const limiter = new Bottleneck({
    maxConcurrent: 1,
    minTime: parseInt(cli.flags.trThrottle)
});

var testrail = new Testrail({
    host: cli.flags.trApiUrl || process.env.trApiUrl,
    user: cli.flags.trApiUser || process.env.trApiUser,
    password: cli.flags.trApiKey || process.env.trApiKey
});

switch (cli.flags.trCmd) {
    case 'getCase':
    case 'getCaseById':
    console.log ( "get case")
        testrail.getCase(/*CASE_ID=*/cli.flags.trCaseId, function (err, response, testcase) {
            console.log(testcase);
        });
        break;
    case 'getCases':
        testrail.getCases(/*PROJECT_ID=*/cli.flags.trProjectId, /*FILTERS=*/trFilter, function (err, response, cases) {
            console.log(cases);
        });
        break;
    case 'getProjects':
        testrail.getProjects(/*FILTERS=*/trFilter, function (err, response, projects) {
            console.log(projects);
            // console.log(response);
        });
        break;
    case 'getProject':
        testrail.getProject(/*PROJECT_ID=*/cli.flags.trProjectId, function (err, response, project) {
            console.log(project);
        });
        break;
    case 'getMilestones':
        testrail.getMilestones(/*PROJECT_ID=*/cli.flags.trProjectId, /*FILTERS=*/trFilter, function (err, response, milestones) {
            console.log(milestones);
        });      
        break;
    case 'getMilestone':
        testrail.getMilestone(/*MILESTONE_ID=*/cli.flags.trMilestoneId, function (err, response, milestone) {
            console.log(milestone);
        });
        break;
    case 'deleteMilestone':
        testrail.deleteMilestone(/*MILESTONE_ID=*/cli.flags.trMilestoneId, function (err, response, body) {
            console.log(body);
        });
        break;    
    case 'getRuns':
        testrail.getRuns(/*PROJECT_ID=*/cli.flags.trProjectId, /*FILTERS=*/trFilter, function (err, response, runs) {
            console.log(runs)
        });
        break;
    case 'getRun':
        testrail.getRun(/*RUN_ID=*/cli.flags.trRunId, function (err, response, run) {
            console.log(run);
        });
        break;
    case 'getResultsForRun' :
        testrail.getResultsForRun(/*RUN_ID=*/cli.flags.trRunId, /*FILTERS=*/trFilter, function (err, response, results) {
            console.log(results);
        });
        break;
    case "getResultsForCase":
        testrail.getResultsForCase(/*RUN_ID=*/cli.flags.trRunId, /*CASE_ID=*/cli.flags.trCaseId, /*FILTERS=*/trFilter, function (err, response, results) {
            console.log(results);
        });
        break;
    case "getResults_ByTestId" :
        testrail.getResults(/*TEST_ID=*/cli.flags.trTestId, /*FILTERS=*/cli.flags.trFilter, function (err, response, results) {
            console.log(results);
        });
        break;        
    case 'getSections':
    case 'getFeatures':
        testrail.getSections(/*PROJECT_ID=*/cli.flags.trProjectId, /*SUITE_ID=*/cli.flags.trSuiteId, function (err, response, sections) {
            console.log(sections)
        });
        break;
    case 'getSection':
    case 'getFeature':
        testrail.getSection(/*SECTION_ID=*/cli.flags.trSectionId, function (err, response, section) {
            console.log(section);
        });
        break;
    case 'getSuites':
    case 'getModules':
        testrail.getSuites(/*PROJECT_ID=*/cli.flags.trProjectId, function (err, response, suites) {
            console.log(suites);    
        });
        break;
    case 'getSuite':
    case 'getModule':
        testrail.getSuite(/*SUITE_ID=*/cli.flags.trSuiteId, function (err, response, suite) {
            console.log(suite);
        });
        break;
    case 'getSuiteByName':
    case 'getModuleByName':    
        testrail_lib.getSuiteId_byName(cli.flags.trProjectId, cli.flags.trSuiteName).then(suiteId => {
            testrail.getSuite(/*SUITE_ID=*/suiteId, function (err, response, suite) {
                console.log(suite);
            });
        });
        break;
    case 'getUsers':
        testrail.getUsers(/*FILTERS=*/trFilter, function (err, response, users) {
            console.log(users);
        });
        break;
    case 'getUserById':
        testrail.getUser(/*USER_ID=*/cli.flags.trUserId, function (err, response, user) {
            console.log(user);
        });
        break;
    case 'getUserByEmail':
        testrail.getUserByEmail(/*EMAIL=*/cli.flags.trUserEmail, function (err, response, user) {
            console.log(user);
        });
        break;
    case 'addSuite':
    case 'addModule':
        testrail_lib.addSuite_byName(cli.flags.trProjectId, cli.flags.trSuiteName).then(addedSuite => {
            console.log(addedSuite);
        })
        break;
    case 'addSection':
    case 'addFeature':
        if (!cli.flags.trProjectId) {
            console.log('trProjectId is required');
            break;
        }
        if (!cli.flags.trSuiteName) {
            console.log('trSuiteName is required');
            break;
        }
        testrail_lib.addSection_byName(cli.flags.trProjectId, cli.flags.trSuiteName, cli.flags.trSuiteName).then(mySection => {
            console.log(mySection.name);
        });
        break;
    case 'cbPretestCheck' :
        if (!cli.flags.cbJsonPath) {
            console.log('cbJsonPath is required');
            break;
        }   
        testrail_lib.getPretestStatus(cbJsonPretest)
        .then( result => {
            console.log ("No issue detected in the JSON result. All good!")
        }).catch ( preTestError  => {                
            console.error ( preTestError );
        }); 
        break;
    case 'cbAddCases':
    /*Input: 
    [Required: trProjectId, cbJsonPath]
    [Optional: trForceAdd(false), trForceUpdate(false)]*/
        if (!cli.flags.trProjectId) {
            console.log('trProjectId is required');
            break;
        }
        if (!cli.flags.cbJsonPath) {
            console.log('cbJsonPath is required');
            break;
        }
        // Create suite if not exist
        var suiteNames = Array.from(testrail_lib.getSuiteNames_byResultJson(cbJson));
        suiteNames.forEach(suiteName => {
            testrail_lib.getSuiteId_byName(cli.flags.trProjectId, suiteName, cli.flags.trForceAdd).then(suiteId => {
                // Add case by cbJson result file
                cbJson.forEach(feature => {
                    if (feature.uri.indexOf('/' + suiteName + '/') >= 0) {
                        var myFeature = {
                            name: testrail_lib.getGeneratedSectionName (feature),
                            suite_id: suiteId,
                            description: feature.description           
                        };
                        // throttle per feature API request
                        limiter.schedule(() => testrail_lib.getSectionId_byName(/*PROJECT_ID=*/cli.flags.trProjectId, suiteName, myFeature.name, myFeature, /*forceAdd*/cli.flags.trForceAdd, /*forceUpdate*/cli.flags.trForceUpdate)
                        .then(sectionId => (async () => {
                            for (var index = 0; index < feature.elements.length; index++) {
                                scenario = feature.elements[index];
                                await testrail_lib.getCaseId_byScenario(cli.flags.trProjectId, suiteName, myFeature.name, feature, scenario, /*forceAdd*/cli.flags.trForceAdd, /*forceUpdate*/cli.flags.trForceUpdate)
                                .then(myCaseId => {
                                    if ( myCaseId != 0 ) console.log('   > trCaseId: ' + myCaseId);
                                }).catch (getCaseError => {
                                    console.error (getCaseError);
                                });
                            };
                        })()).catch (getSectionError => {
                            console.error (getSectionError);
                        })); // end throttle per feature API request block
                    }
                });
            })
        })
        break;
    
    case 'cbUpdateResults' :
    /*Input: 
    [Required: trProjectId, cbJsonPath]
    [Optional: trSprintId (auto), trForceAdd(false), trForceUpdate(false), trTestTarget(QA), trJenkinsPath]*/
        if (!cli.flags.trProjectId) {
            console.log('trProjectId is required');
            break;
        }
        if (!cli.flags.cbJsonPath) {
            console.log('cbJsonPath is required');
            break;
        }  
        testrail_lib.getMilestone_byProjectId(cli.flags.trProjectId, cli.flags.trSprintId , cli.flags.trForceAdd).then(milestoneId => {
            testrail_lib.getSuiteNames_byResultJson(cbJson).forEach(mySuiteName => {
                testrail_lib.getCaseDicts_bySuiteName ( cli.flags.trProjectId, mySuiteName, cbJson )
                .then ( caseDicts => {
                    testrail_lib.getTestRuns_byMilestoneId ( cli.flags.trProjectId, milestoneId , cli.flags.trSprintId , mySuiteName , caseDicts , cli.flags.trJenkinsPath, cli.flags.trForceAdd, cli.flags.trForceUpdate)
                    .then ( testRunId => {                
                        console.log ( "> Test Run ID : " + testRunId);
                        if ( cli.flags.trUpdateInBulk ) {
                            // throttle API request
                            limiter.schedule(() => testrail_lib.addTestResultInBulk( testRunId, cbJson, caseDicts, cli.flags.trTestTarget, cli.flags.trJenkinsPath))
                        } else {
                            // throttle API request
                            limiter.schedule(() => testrail_lib.addTestResultIndividually( testRunId, cbJson, caseDicts, cli.flags.trTestTarget, cli.flags.trJenkinsPath))
                        }                                                   
                    }).catch ( testrunError => {
                        console.error ( testrunError );
                    })
                }).catch ( caseDictError => {
                    console.error (caseDictError );
                });   
            });
        }).catch ( milestoneError => {
            console.error ( milestoneError );
        });  
        break;

    //@samplecode
    case 'xUpdateResultIndividually' :
    /*Input: 
    [Required: trProjectId, cbJsonPath]
    [Optional: trSprintId (auto), trForceAdd(false), trForceUpdate(false), trTestTarget(QA)]*/
        if (!cli.flags.trProjectId) {
            console.log('trProjectId is required');
            break;
        }
        if (!cli.flags.cbJsonPath) {
            console.log('cbJsonPath is required');
            break;
        }          
        testrail_lib.getSuiteNames_byResultJson(cbJson).forEach(mySuiteName => {
            testrail_lib.getCaseDicts_bySuiteName ( cli.flags.trProjectId, mySuiteName, cbJson )
            .then ( caseDicts => {
                cbJson.forEach(feature => {
                    var myFeature = {
                        name: testrail_lib.getGeneratedSectionName(feature)
                    };                            
                    feature.elements.forEach ( scenario => { 
                        testrail_lib.addTestResultIndividually ( testRunId, cli.flags.trProjectId, mySuiteName, myFeature.name, feature, scenario , false, cli.flags.trTestTarget)//.then( resp => {
                        console.log ( resp );
                    })
                testrail_lib.addTestResultInBulk ( cli.flags.trTestrunId, cbJsonUpdate, caseDicts, cli.flags.trTestTarget)
                })
            })
        })
        break;

    //@samplecode
    case 'xDeleteSections':
        //use for testing only
        testrail_lib.getSuiteId_byName (cli.flags.trProjectId, cli.flags.trSuiteName , false ).then ( suiteid => {
            console.log ( "FOUND SUITE : " + suiteid)
            testrail.getSections(/*PROJECT_ID=*/cli.flags.trProjectId, /*suite-id*/ suiteid , function (err, response, sections) {
                sections.forEach ( sec => {
                    console.log ( "Deleting section => " + sec.name )
                    testrail.deleteSection ( sec.id );
                })
            });            
        })
        break;

    //@samplecode
    case 'xDeleteSuites':
        //use for testing only
        testrail_lib.getSuiteId_byName (cli.flags.trProjectId, cli.flags.trSuiteName , false ).then ( suiteid => {
            console.log ( "FOUND SUITE : " + suiteid)
            console.log ( "Deleting suite => " + suiteid )
            testrail.deleteSuite ( suiteid );
            });            
        break;
    default:
        console.error ( "Unknown command \"" + cli.flags.trCmd + "\" provided to trCmd parameter. ");
        break;
}
