import PubSub from "pubsub-js";
import debounce from "lodash-es/debounce";
import rehype from "rehype";
import rehypeMinifyWhitespace from "rehype-minify-whitespace";

export default {
  init(ast, editors, web, inspector) {
    PubSub.subscribe(
      "ast:update",
      getAstUpdateHandler(ast, editors, web, inspector)
    );
    PubSub.subscribe(
      "inspector:item-click",
      getSelectTextHandler(editors.html)
    );

    ast.setValue(defaultCodes);

    editors.html.on("focus", handleEditorFocus);
    editors.html.on("blur", handleEditorBlur);
    editors.html.on(
      "changes",
      debounce(getHtmlEditorUpdateHandler(ast, editors, web, inspector), 600)
    );
    editors.ast.on("focus", handleEditorFocus);
    editors.ast.on("blur", handleEditorBlur);
    editors.ast.on(
      "changes",
      debounce(getAstEditorUpdateHandler(ast, editors, inspector), 600)
    );
  }
};

function handleEditorFocus(cm) {
  cm.isUpdatedByUser = true;
}

function handleEditorBlur(cm) {
  cm.isUpdatedByUser = false;
}

function getAstUpdateHandler(_, editors, web, inspector) {
  return (_, data) => {
    console.log(`ast:update!!!`);
    // console.log(`data: `, data);
    console.log(`updateBy: `, data.updateBy);

    if (data.updateBy !== "ast") {
      editors.ast.setValue(JSON.stringify(data.current, null, 2));
    }

    if (data.updateBy !== "html") {
      editors.html.setValue(data.ast.toString());
    }

    if (data.updateBy !== "inspector") {
      renderInspector(inspector, data.current);
    }

    web.update(data.ast.toString());
  };
}

function getHtmlEditorUpdateHandler(ast, editors) {
  return function handleHtmlEditorUpdate(cm) {
    console.log(`handleHtmlEditorUpdate()`);

    if (!editors.html.isUpdatedByUser) return;

    const html = cm.getValue();

    ast.setValue(html, "html");
  };
}

function getAstEditorUpdateHandler(ast, editors) {
  return function handleAstEditorUpdate(cm) {
    console.log(`handleAstEditorUpdate()`);

    if (!editors.ast.isUpdatedByUser) return;

    const value = cm.getValue();

    ast.setValue(value ? JSON.parse(value) : value, "ast");
  };
}

function getSelectTextHandler(htmlEditor) {
  return function selectHtmlCode(_, item) {
    const positionElem = item.firstElementChild;
    const { itemPosition } = positionElem.dataset;

    if (itemPosition === undefined) return;

    const [start, end] = positionElem.dataset.itemPosition
      .split(":")
      .map(pos => pos.split(",").map(x => x - 1));

    console.log(`marker position: `, start, end);
    // Clear marker
    htmlEditor.getAllMarks().forEach(marker => marker.clear());
    htmlEditor.markText(
      { line: start[0], ch: start[1] },
      { line: end[0], ch: end[1] },
      { className: "highlight" }
    );
  };
}

function renderInspector(inspector, ast) {
  const result = rehype()
    .use(rehypeMinifyWhitespace)
    .runSync(ast);

  inspector.render(result);
}

const defaultCodes = `<html>
  <head>
    <style>
      * {
        box-sizing: border-box;
      }
      
      html, body {
        width: 100%;
        margin: 0;
      }
      
      h1 {
        color: red;
        background-color: black;
      }
    </style>
  </head>
  <body>
    <h1>Hello, strangerrrr!!!</h1>
    <script>
      function greet(name) { console.log(\`Hello \${name}\`); }

      greet('DevPed.io!!!');
    </script>
  </body>
</html>`;
