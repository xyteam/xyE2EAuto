#!/usr/bin/env node

const buildOptions = require('minimist-options');
const JSON5 = require('json5');
const minimist = require('minimist');
const Testrail = require('testrail-api');
const testrail_lib = require('../libs/testrail_libs');
const jsonfile = require('jsonfile');
const _ = require ('underscore');

const options = buildOptions({
    // Special Parameters
    apiUrl: {
		type: 'string',
		default: process.env.trApiUrl
    },
    apiUser: {
		type: 'string',
		default: process.env.trApiUser
    },
    apiPassword: {
		type: 'string',
		default: process.env.trApiKey
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
	trCmd: {
		type: 'string',
		default: 'getProjects'
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
		default: 63 // QA Playground
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

	// Special option for positional arguments (`_` in minimist)
	arguments: 'string'
});

const args = minimist(process.argv.slice(2), options);
const trFilter = JSON5.parse('{' + args.trFilter + '}');

var testrail = new Testrail({
    host: args.apiUrl,
    user: args.apiUser,
    password: args.apiPassword,
});

switch (args.trCmd) {
    case 'getCase':
    case 'getCaseById':
        testrail.getCase(/*CASE_ID=*/args.trCaseId, function (err, response, testcase) {
            console.log(testcase);
        });
        break;
    case 'getCases':
        testrail.getCases(/*PROJECT_ID=*/args.trProjectId, /*FILTERS=*/trFilter, function (err, response, cases) {
            console.log(cases);
        });
        break;
    case 'getProjects':
        testrail.getProjects(/*FILTERS=*/trFilter, function (err, response, projects) {
            console.log(projects);
        });
        break;
    case 'getProject':
        testrail.getProject(/*PROJECT_ID=*/args.trProjectId, function (err, response, project) {
            console.log(project);
        });
        break;
    case 'getMilestones':
        testrail.getMilestones(/*PROJECT_ID=*/args.trProjectId, /*FILTERS=*/trFilter, function (err, response, milestones) {
            console.log(milestones);
        });      
        break;
    case 'getMilestone':
        testrail.getMilestone(/*MILESTONE_ID=*/args.trMilestoneId, function (err, response, milestone) {
            console.log(milestone);
        });
        break;
    case 'deleteMilestone':
        testrail.deleteMilestone(/*MILESTONE_ID=*/args.trMilestoneId, function (err, response, body) {
            console.log(body);
        });
        break;    
    case 'getRuns':
        testrail.getRuns(/*PROJECT_ID=*/args.trProjectId, /*FILTERS=*/trFilter, function (err, response, runs) {
            console.log(runs)
        });
        break;
    case 'getRun':
        testrail.getRun(/*RUN_ID=*/args.trRunId, function (err, response, run) {
            console.log(run);
        });
        break;
    case 'getResultsForRun' :
        testrail.getResultsForRun(/*RUN_ID=*/args.trRunId, /*FILTERS=*/trFilter, function (err, response, results) {
            console.log(results);
        });
        break;
    case "getResultsForCase":
        testrail.getResultsForCase(/*RUN_ID=*/args.trRunId, /*CASE_ID=*/args.trCaseId, /*FILTERS=*/trFilter, function (err, response, results) {
            console.log(results);
        });
        break;
    case "getResults_ByTestId" :
        testrail.getResults(/*TEST_ID=*/args.trTestId, /*FILTERS=*/args.trFilter, function (err, response, results) {
            console.log(results);
        });
        break;        
    case 'getSections':
    case 'getFeatures':
        testrail.getSections(/*PROJECT_ID=*/args.trProjectId, /*SUITE_ID=*/args.trSuiteId, function (err, response, sections) {
            console.log(sections)
        });
        break;
    case 'getSection':
    case 'getFeature':
        testrail.getSection(/*SECTION_ID=*/args.trSectionId, function (err, response, section) {
            console.log(section);
        });
        break;
    case 'getSuites':
    case 'getModules':
        testrail.getSuites(/*PROJECT_ID=*/args.trProjectId, function (err, response, suites) {
            console.log(suites);    
        });
        break;
    case 'getSuite':
    case 'getModule':
        testrail.getSuite(/*SUITE_ID=*/args.trSuiteId, function (err, response, suite) {
            console.log(suite);
        });
        break;
    case 'getSuiteByName':
    case 'getModuleByName':
        testrail_lib.getSuiteId_byName(args.trProjectId, args.trSuiteName).then(suiteId => {
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
        testrail.getUser(/*USER_ID=*/args.trUserId, function (err, response, user) {
            console.log(user);
        });
        break;
    case 'getUserByEmail':
        testrail.getUserByEmail(/*EMAIL=*/args.trUserEmail, function (err, response, user) {
            console.log(user);
        });
        break;
    case 'addSuite':
    case 'addModule':
        testrail_lib.addSuite_byName(args.trProjectId, args.trSuiteName).then(addedSuite => {
            console.log(addedSuite);
        })
        break;
    case 'addSection':
    case 'addFeature':
        if (!args.trProjectId) {
            console.log('trProjectId is required');
            break;
        }
        if (!args.trSuiteName) {
            console.log('trSuiteName is required');
            break;
        }
        testrail_lib.addSection_byName(args.trProjectId, args.trSuiteName, args.trSuiteName).then(mySection => {
            console.log(mySection.name);
        });
        break;
    case 'cbAddCases':
        if (!args.trProjectId) {
            console.log('trProjectId is required');
            break;
        }
        if (!args.cbJsonPath) {
            console.log('cbJsonPath is required');
            break;
        }
        const cbJson = jsonfile.readFileSync(args.cbJsonPath);
        const mySuiteName = args.cbJsonPath.substring(args.cbJsonPath.lastIndexOf('/')+1, args.cbJsonPath.lastIndexOf('.'));
        testrail_lib.getSuiteId_byName(args.trProjectId, mySuiteName, /*forceAdd*/args.trForceAdd, /*forceUpdate*/args.trForceUpdate).then(suiteId => {
            cbJson.forEach(feature => {
                var myFeature = {
                    name: feature.keyword + ': ' + feature.name,
                    suite_id: suiteId,
                    description: feature.description
                };
                testrail_lib.getSectionId_byName(/*PROJECT_ID=*/args.trProjectId, mySuiteName, myFeature.name, /*forceAdd*/args.trForceAdd, /*forceUpdate*/args.trForceUpdate).then(sectionId => (async () => {  
                    for (var index = 0; index < feature.elements.length; index++) {
                        scenario = feature.elements[index];
                        await testrail_lib.getCaseId_byScenario(args.trProjectId, mySuiteName, myFeature.name, feature, scenario, /*forceAdd*/args.trForceAdd, /*forceUpdate*/args.trForceUpdate).then(myCaseId => {                            
                            if ( myCaseId != 0 ) console.log('trCaseId: ' + myCaseId)   
                        });
                    };                    
                })()); // convert callback into async func to use await inside (async () => {})()
            })
        });
        break;
    case 'cbUpdateResults' :
    //input :
    /*trProjectId, trSprintId, trSuiteName, cbJsonPath, trForceAdd*/
        var cbTestJson = jsonfile.readFileSync(args.cbJsonPath);
        
        testrail_lib.getMilestones_byProjectId(args.trProjectId, args.trSprintId , args.trForceAdd).then(milestoneId => {
            testrail_lib.getTestRuns_byMilestoneId ( args.trProjectId, milestoneId , args.trSprintId , args.trSuiteName , args.trForceAdd).then ( testRunId => {
                console.log ( testRunId );

                //below is WIP
                cbTestJson.forEach (feature => {
                    var myFeature = {
                        name: feature.keyword + ': ' + feature.name,
                    };
                    feature.elements.forEach ( scenario => {
                        testrail_lib.addTestResult( testRunId, args.trProjectId, args.trSuiteName, myFeature.name, feature ,  scenario , false).then ( resp => {
                            console.log ( resp);
                        })
                    })
                })

            })
        });
        break;
    case 'DeleteSections':
        //use for testing only
        testrail_lib.getSuiteId_byName ( 63, args.trSuiteName ).then ( suiteid => {
            console.log ( "FOUND SUITE : " + suiteid)
            testrail.getSections(/*PROJECT_ID=*/ 63, /*suite-id*/ suiteid , function (err, response, sections) {
                sections.forEach ( sec => {
                    console.log ( "Deleting section => " + sec.name )
                    testrail.deleteSection ( sec.id );
                })
            });            
        })
        break;
}
