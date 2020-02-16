import getCodeEditor from "./codemirror";

import "codemirror/addon/hint/xml-hint";
import "codemirror/addon/hint/html-hint";
import "codemirror/mode/xml/xml";
import "codemirror/mode/javascript/javascript";
import "codemirror/mode/css/css";
import "codemirror/mode/htmlmixed/htmlmixed";

export default (
  elem = document.querySelector(`#html.window .body`),
  configs = {}
) => {
  return getCodeEditor(elem, {
    mode: "text/html",
    ...configs
  });
};
