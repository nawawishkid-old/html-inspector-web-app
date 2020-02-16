import rehype from "rehype";
import PubSub from "pubsub-js";

class Ast {
  constructor(defaultValue = null) {
    this.ast = this.setValue(defaultValue);
    this.lastUpdatedBy = null;
  }

  setValue(input, updateBy = null) {
    if (input === null) return;

    const oldAst = this.ast;
    const newAst = typeof input === "string" ? rehype.parse(input) : input;
    // This line rehype does not maintain the same whitespace as original string
    const firstStr = rehype.stringify(newAst);
    // So we have to parse it again in order to get the correct AST
    // for the aforementioned stringified AST
    const secondAst = rehype.parse(firstStr);

    console.log(`newAst: `, newAst);
    console.log(`secondAst: `, secondAst);

    this.ast = secondAst;
    this.lastUpdatedBy = updateBy;

    PubSub.publish("ast:update", {
      ast: this,
      prev: oldAst,
      current: secondAst,
      updateBy
    });
  }

  getValue() {
    return this.ast;
  }

  toString() {
    return rehype.stringify(this.ast);
  }
}

export default Ast;
