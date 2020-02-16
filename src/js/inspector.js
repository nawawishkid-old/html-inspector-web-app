import ejs from "ejs";
import PubSub from "pubsub-js";

class Inspector {
  constructor(containerSelector) {
    this.containerElem = document.querySelector(containerSelector);
  }

  render(ast) {
    const treeStr = getEjsTemplateString("tree");
    const treeTemplate = ejs.compile(treeStr, { client: true });
    const inspectorHtml = treeTemplate({ tree: ast }, null, handleEjsInclude);

    this.containerElem.innerHTML = inspectorHtml;

    this.setUpEventListeners();
  }

  setUpEventListeners() {
    const labels = this.containerElem.querySelectorAll(".item-header-label");

    [...labels].forEach(label =>
      label.addEventListener("click", this.onItemClick.bind(this))
    );
  }

  onItemClick(e) {
    console.log(`onItemClick(e)`);
    toggleChildrenPanel(e);
    PubSub.publish(
      "inspector:item-click",
      e.target.parentElement.parentElement
    );
  }
}

export default Inspector;

/**
 *  FUNCTIONS
 */
function getEjsTemplateString(name) {
  const dom = document.querySelector(`[data-ejs-template="${name}"]`);

  if (dom === null) {
    throw new Error(`Ejs template '${name}' could not be found.`);
  }

  return dom.innerHTML;
}

function handleEjsInclude(path, d) {
  let templateString = getEjsTemplateString(path);
  const template = ejs.compile(templateString, { client: true });
  const renderedString = template(d, null, handleEjsInclude);

  return renderedString;
}

window.handleItemLabelClick = function(elem) {
  toggleItemChildren(elem);
};

function toggleChildrenPanel(e) {
  const { target: itemLabel } = e;
  const itemHeader = itemLabel.parentElement;
  const childrenPanel = itemHeader.nextElementSibling;

  if (
    childrenPanel === null ||
    !childrenPanel.classList.contains("item-children")
  ) {
    return;
  }

  childrenPanel.classList[
    childrenPanel.classList.contains("active") ? "remove" : "add"
  ]("active");
}
