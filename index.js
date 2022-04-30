require('dotenv').config()

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
    this.components = [];
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

  async fetchFigmaObject() {
    const { 
      data: {
       document: figmaObject
       } 
     } = await axios.get("https://api.figma.com/v1/files/CSrJ4mApf1CVbYka6GyN9N", {
      headers: {
       "X-Figma-Token": process.env.FIGMA_API_TOKEN
      }
    });

    this.figmaOutput = figmaObject;
    console.dir(this.figmaOutput, { depth: null });
  }

  parseNodes(nodes) {
    // go through the figma object and put all the pages in the pages array
    nodes.forEach((node) => {
      if (node.type === "CANVAS") {
        this.pages.push(node.name)
      } else if (node.type === "COMPONENT") {
        this.components.push(node.name);
      }

      if (node.children) {
        this.parseNodes(node.children);
      }
    });
  }

  async buildCSS() {
    await this.fetchFigmaObject();
    this.parseNodes(this.figmaOutput.children)
    // go through the pages
    this.pages.forEach(page => {
      this.cssString += `
#${page.toLowerCase()} {}
`
    })

    this.components.forEach(component => {
      this.cssString += `
.${component.toLowerCase()} {}
`
    })
    this.outputCSS();
    console.log(this.pages);
    console.log(this.components);
  }

  outputCSS() {
    fs.writeFile("output/style.css", this.cssString).then(() => {
      console.log("CSS successfully generated.")
    })
  }

}

// Functions

const init = async function() {
  const figma = new FigmaObject("hats");;
  figma.buildCSS();
  console.log(cssString)
}


// Interactions

// Init
init();
