// Dependencies
const fs = require("fs/promises")
// Data
let css = `/* css */`;

fs.writeFile("output/style.css", css).then(() => {
  console.log("CSS successfully generated.")
})