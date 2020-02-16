import getCodeEditor from "./codemirror";

import "codemirror/mode/javascript/javascript";

export default (
  elem = document.querySelector("#ast.window .body"),
  configs = {}
) => {
  return getCodeEditor(elem, {
    mode: "application/json",
    ...configs
  });
};
