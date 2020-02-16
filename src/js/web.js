class Web {
  constructor(iframeSelector) {
    this.iframe = document.querySelector(iframeSelector);
  }

  update(html) {
    const { document } = this.iframe.contentWindow;

    document.open();
    document.write(html);
    document.close();
  }
}

export default Web;
