require('dotenv').config();
const CSSFromFigma = require("./lib/css-from-figma");

const init = function() {
  const figma = new CSSFromFigma("hats");;
  figma.buildCSS();
}

init();
