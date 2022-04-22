// Dependencies
const fs = require("fs/promises")

// Data
let css = `/* css */`;


// Classes 
class FigmaObject {
  constructor(options) {

  }

  outputCSS() {
    fs.writeFile("output/style.css", css).then(() => {
      console.log("CSS successfully generated.")
    })
  }

}

// Functions
const init = function() {
  const figma = new FigmaObject("hats");
  figma.outputCSS();
}


// Interactions

// Init
init();
