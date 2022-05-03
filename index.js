require('dotenv').config()

// Dependencies
const fs = require("fs/promises");
// const css = require('css');
const axios = require("axios");

// Data 

// Classes 
class FigmaObject {
  constructor(options) {
    this.figmaOutput = {};
    this.pages = [];
    this.components = [];
    this.textStyles = [];
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
        this.pages.push(node)
      } else if (node.type === "COMPONENT") {
        this.components.push(node);
      } else if (node.type === "TEXT") {
        this.textStyles.push(node)
      }

      if (node.children) {
        this.parseNodes(node.children);
      }
    });
  }

  async buildCSS() {
    this.cssString += await fs.readFile(__dirname + "/css/normalize.css");
    this.cssString += await fs.readFile(__dirname + "/css/skeleton.css");
    await this.fetchFigmaObject();
    this.parseNodes(this.figmaOutput.children)
    // go through the pages
    this.pages.forEach(page => {
      this.cssString += `
#${page.name.toLowerCase()} {}
`
    })

    this.components.forEach(component => {
      this.cssString += `
.${component.name.toLowerCase()} {}
`
    })

    this.textStyles.forEach(textStyle => {
      if (textStyle.name.includes("headings")) {
        const headingParts = textStyle.name.split("/");
        const heading = headingParts[headingParts.length - 1];
        const styleToString = (style) => {
          return Object.keys(style).reduce((acc, key) => (
              acc + key.split(/(?=[A-Z])/).join('-').toLowerCase() + ':' + style[key] + ';\n'
          ), '');
          
        };
        const stylePropertyString = styleToString(textStyle.style);
        this.cssString += `
${heading.toLowerCase()} {
${stylePropertyString}
}
` 
      } else {
        this.cssString += `
.${textStyle.name.toLowerCase()} {}
` 
      }
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
}


// Interactions

// Init
init();
