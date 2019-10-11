// screen_session.js provides functions to see the screen, to control keyboard and mouse

const FrameworkPath = process.env.FrameworkPath || process.env.HOME + '/Projects/AutoBDD';
const robot = require('robotjs');
const execSync = require('child_process').execSync;

// Robot Property
robot.setXDisplayName(process.env.DISPLAY);
robot.setMouseDelay(1000);
robot.setKeyboardDelay(50);

module.exports = {
  runFindImage: function(onArea, imagePath, imageSimilarity, imageWaitTime, imageAction, imageFindAll) {
    var outputBuffer;
    var outputString;
    var returnVal;
    try {
      outputBuffer = execSync(FrameworkPath + '/framework/libs/find_image.js'
                        + ' --onArea=' + onArea
                        + ' --imagePath=' + imagePath
                        + ' --imageSimilarity=' + imageSimilarity
                        + ' --imageWaitTime=' + imageWaitTime
                        + ' --imageAction=' + imageAction
                        + ' --imageFindAll' + imageFindAll);
      outputString = outputBuffer.toString('utf8');
      console.log(outputString);
      returnVal = outputString.substring(outputString.lastIndexOf('['), outputString.lastIndexOf(']') + 1);
    } catch(e){
      returnVal = 'execSync error: ' + e.message;
    }
    return returnVal;
  },

  screenFindImage: function(imagePath, imageSimilarity, imageWaitTime, imageAction, imageFindAll) {
    var returnVal = this.runFindImage('onScreen', imagePath, imageSimilarity, imageWaitTime, imageAction, imageFindAll);
    return returnVal;
  },

  screenWaitImage: function(imagePath, imageSimilarity, imageWaitTime) {
    var returnVal = this.runFindImage('onScreen', imagePath, imageSimilarity, imageWaitTime);
    return returnVal;
  },

  screenHoverImage: function(imagePath, imageSimilarity, imageWaitTime) {
    var returnVal = this.runFindImage('onScreen', imagePath, imageSimilarity, imageWaitTime, 'hover');
    return returnVal;
  },

  screenClickImage: function(imagePath, imageSimilarity, imageWaitTime) {
    var returnVal = this.runFindImage('onScreen', imagePath, imageSimilarity, imageWaitTime, 'single');
    return returnVal;
  },

  screenDoubleClickImage: function(imagePath, imageSimilarity, imageWaitTime) {
    var returnVal = this.runFindImage('onScreen', imagePath, imageSimilarity, imageWaitTime, 'double');
    return returnVal;
  },

  screenRightClickImage: function(imagePath, imageSimilarity, imageWaitTime) {
    var returnVal = this.runFindImage('onScreen', imagePath, imageSimilarity, imageWaitTime, 'right');
    return returnVal;
  },

  screenHoverCenter: function() {
    var returnVal = this.runFindImage('onScreen', 'center', null, null, 'hover');
    return returnVal;
  },

  keyTap: function(key, modifier) {
    var myKey = key || 'enter';
    var myModifier = modifier || null;

    if (myModifier) {
      robot.keyTap(myKey, myModifier);
    } else {
      robot.keyTap(myKey);
    }
  },

  keyToggle: function(key, keyUpDown, modifier) {
    if (modifier) {
      robot.keyToggle(key, keyUpDown, modifier);
    } else {
      robot.keyToggle(key, keyUpDown);
    }
  },

  typeString: function(string) {
    var myCharArray = string.split('');
    var myShiftCharArray = ['~', '!', '@', '#', '$', '%', '^', '&', '*', '(', ')', '_', '+', ':', '"', '<', '>', '?'];
    myCharArray.forEach(function(myChar) {
      if (myShiftCharArray.indexOf(myChar) >= 0) {
        robot.keyTap(myChar, 'shift');
      } else {
        robot.typeString(myChar);
      }
    });
  },

  drag_and_drop(object, target) {
    robot.moveMouse(object.x, object.y);
    robot.mouseToggle('down');
    robot.dragMouse(object.x+10, object.y);
    robot.dragMouse(target.x-10, target.y);
    robot.mouseToggle('up');
  },

  moveMouse: function(xOffset, yOffset) {
    robot.moveMouse(xOffset, yOffset);
  },

  dragMouse: function(xOffset, yOffset) {
    robot.dragMouse(xOffset, yOffset);
  },

  mouseClick: function(button, double) {
    robot.mouseClick(button, double);
  },

  mouseToggle: function([down], [button]) {
    robot.mouseToggle([down], [button]);
  },

  getMousePos: function() {
    return robot.getMousePos();
  },

  getXDisplayName: function() {
    return robot.getXDisplayName();
  },

  typeStringDelayed: function(string, defaultCPM) {
    robot.typeStringDelayed(string, defaultCPM);
  }
}
