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
    this.figmaOutput = {};
    this.pages = [];
    this.cssString = `/* css */
* {
  box-sizing: border-box;
}

body {
  margin: 0;
  padding: 0;
}
    `;
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

   this.figmaOutput = figmaObject;


   console.dir(this.figmaOutput, { depth: null });

   // go through the figma object and put all the pages in the pages array
   this.figmaOutput.children.forEach((node) => {
      if(node.type === "CANVAS") {
        this.pages.push(node.name)
      }
  });

   console.log(this.pages);
  }

  buildCSS() {
    // go through the pages
    this.pages.forEach(page => {
      this.cssString += `
#${page.toLowerCase()} {}
`
    })
    this.outputCSS();
  }

  outputCSS() {
    fs.writeFile("output/style.css", this.cssString).then(() => {
      console.log("CSS successfully generated.")
    })
  }

}

// Functions

const init = async function() {
  const figma = new FigmaObject("hats");
  
  
  await figma.getFigmaObject();
  figma.buildCSS();
  console.log(cssString)
}


// Interactions

// Init
init();
