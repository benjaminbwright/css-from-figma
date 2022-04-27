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

   this.figmaObject = figmaObject;
   console.dir(this.figmaObject, { depth: null });
  }

  buildCSS() {
    // go through the pages
    this.figmaObject.children.forEach((page) => {
      console.log(page.name)
    });
  }

  outputCSS() {
    fs.writeFile("output/style.css", cssString).then(() => {
      console.log("CSS successfully generated.")
    })
  }

}

// Functions

const init = async function() {
  const figma = new FigmaObject("hats");
  
  figma.outputCSS();
  await figma.getFigmaObject();
  figma.buildCSS();
  console.log(cssString)
}


// Interactions

// Init
init();
