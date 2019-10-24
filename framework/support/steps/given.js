const checkContainsAnyTextOrValue = require('../../functions/check/checkContainsAnyTextOrValue');
const checkElementTextValueIsEmpty = require('../../functions/check/checkElementTextValueIsEmpty');
const checkCookieContent = require('../../functions/check/checkCookieContent');
const checkCookieExists = require('../../functions/check/checkCookieExists');
const checkDimension = require('../../functions/check/checkDimension');
const checkElementExists = require('../../functions/check/checkElementExists');
const checkContainsEqualsMatchesTextOrValue = require('../../functions/check/checkContainsEqualsMatchesTextOrValue');
const checkModal = require('../../functions/check/checkModal');
const checkOffset = require('../../functions/check/checkOffset');
const checkProperty = require('../../functions/check/checkProperty');
const checkSelected = require('../../functions/check/checkSelected');
const checkTitle = require('../../functions/check/checkTitle');
const checkUrl = require('../../functions/check/checkURL');
const closeAllButFirstTab = require('../../functions/action/closeAllButFirstTab');
const compareText = require('../../functions/check/compareText');
const deleteDownload = require('../../functions/action/deleteDownload');
const isEnabled = require('../../functions/check/isEnabled');
const isVisible = require('../../functions/check/isVisible');
const openTarget = require('../../functions/action/openTarget');
const resizeScreenSize = require('../../functions/action/resizeScreenSize');

module.exports = function() {
    this.Given(
        /^I open the (file|download file|path|url) "([^"]*)?"$/,
        openTarget
    );

    this.Given(
        /^I delete (the only|all) download file(?:s)? with the name "([^"]*)?"$/,
        deleteDownload
    );

    this.Given(
        /^the element "([^"]*)?" is( not)* visible$/,
        isVisible
    );

    this.Given(
        /^the element "([^"]*)?" is( not)* enabled$/,
        isEnabled
    );

    this.Given(
        /^the element "([^"]*)?" is( not)* selected$/,
        checkSelected
    );

    this.Given(
        /^the checkbox "([^"]*)?" is( not)* checked$/,
        checkSelected
    );

    this.Given(
        /^there is (an|no) element "([^"]*)?" on the page$/,
        checkElementExists
    );

    this.Given(
        /^the title is( not)* "([^"]*)?"$/,
        checkTitle
    );

    this.Given(
        /^the element "([^"]*)?" contains( not)* the same text as element "([^"]*)?"$/,
        compareText
    );

    this.Given(
        /^the element "([^"]*)?"( not)* (contains|equals|matches) the (text|value) "(.*)?"$/,
        checkContainsEqualsMatchesTextOrValue
    );

    this.Given(
        /^the element "([^"]*)?"( not)* contains any (text|value)$/,
        checkContainsAnyTextOrValue
    );

    this.Given(
        /^the element "([^"]*)?" (text|value) is( not)* empty$/,
        checkElementTextValueIsEmpty
    );

    this.Given(
        /^the page url is( not)* "([^"]*)?"$/,
        checkUrl
    );

    this.Given(
        /^the( css)* attribute "([^"]*)?" from element "([^"]*)?" (is|contains|matches)( not)* "(.*)?"$/,
        checkProperty
    );

    this.Given(
        /^the cookie "([^"]*)?" contains( not)* the value "([^"]*)?"$/,
        checkCookieContent
    );

    this.Given(
        /^the cookie "([^"]*)?" does( not)* exist$/,
        checkCookieExists
    );

    this.Given(
        /^the element "([^"]*)?" is( not)* ([\d]+)px (broad|tall)$/,
        checkDimension
    );

    this.Given(
        /^the element "([^"]*)?" is( not)* positioned at ([\d]+)px on the (x|y) axis$/,
        checkOffset
    );

    this.Given(
        /^I have a screen that is ([\d]+) by ([\d]+) pixels$/,
        resizeScreenSize
    );

    this.Given(
        /^I have closed all but the first (window|tab)$/,
        closeAllButFirstTab
    );

    this.Given(
        /^a (alertbox|confirmbox|prompt) is( not)* opened$/,
        checkModal
    );
}