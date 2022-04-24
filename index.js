require('dotenv').config()
console.log(process.env)

// Dependencies
import fs from "fs/promises";
// const css = require('css');
import CJS3 from "CJS3";

// Data
// let cssString = `/* css */
// * {
//   box-sizing: border-box;
// }

// body {
//   margin: 0;
//   padding: 0;
// }
// `;

let cssString = new CJS3({
  "*": {
    boxSizing: "border-box" 
  },
  "body": {
    margin: 0,
    padding: 0
  }
})


// Classes 
class FigmaObject {
  constructor(options) {

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
  console.log(cssString)
}


// Interactions

// Init
init();
