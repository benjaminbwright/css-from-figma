require('dotenv').config()
console.log(process.env)

// Dependencies
const fs = require("fs/promises");
// const css = require('css');
const axios = require("axios");

// Data
let cssString = `/* css */
* {
  box-sizing: border-box;
}

body {
  margin: 0;
  padding: 0;
}
`;



// Classes 
class FigmaObject {
  constructor(options) {

  }

  async getFigmaObject() {
   const { 
     data: {
      document: figmaObject
      } 
    } = await axios.get("https://api.figma.com/v1/files/CSrJ4mApf1CVbYka6GyN9N", {
     headers: {
      "X-Figma-Token": process.env.FIGMA_API_TOKEN
     }
   })
   console.dir(figmaObject, { depth: null });
  }

  outputCSS() {
    fs.writeFile("output/style.css", cssString).then(() => {
      console.log("CSS successfully generated.")
    })
  }

}

// Functions

const init = function() {
  const figma = new FigmaObject("hats");
  figma.outputCSS();
  figma.getFigmaObject();
  console.log(cssString)
}


// Interactions

// Init
init();
