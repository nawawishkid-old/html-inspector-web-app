import app from "./app";
import Web from "./web";
import getHtmlEditor from "./text-editors/html-editor";
import getAstEditor from "./text-editors/ast-editor";
import Inspector from "./inspector";
import Ast from "./ast";

const web = new Web("#web iframe");
const inspector = new Inspector("#inspector.window .tree");
const editors = {
  html: getHtmlEditor(),
  ast: getAstEditor()
};
const ast = new Ast();

app.init(ast, editors, web, inspector);
