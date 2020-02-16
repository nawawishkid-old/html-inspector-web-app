import CodeMirror from "codemirror";
import "codemirror/lib/codemirror.css";
import "codemirror/theme/ambiance.css";
import "codemirror/addon/hint/show-hint";
import "codemirror/addon/hint/show-hint.css";
import "codemirror/addon/selection/mark-selection";

export default (elem, userConfigs = {}) => {
  const configs = {
    extraKeys: { "Ctrl-Space": "autocomplete" },
    theme: "ambiance",
    lineNumbers: true,
    lineWrapping: true,
    styleSelectedText: true,
    ...userConfigs
  };
  const codeMirror = CodeMirror(elem, configs);

  return codeMirror;
};
