const template = document.createElement("template");
template.innerHTML = `
<style>
  .cai-input {

  }
</style>
<input type="text" id="caiInput">
`;

class CustomElementStart extends HTMLElement {
  constructor() {
    super();
    this.render();
  }
  render() {
    const shadow = this.attachShadow({ mode: "closed" });
    // const text = document.createElement("span");
    // text.textContent = "Hi";
    // text.style = "color:red";
    // shadow.append(text);
    const content = template.content.cloneNode(true);
    this._input = content.querySelector("#caiInput");
    this._input.value = this.getAttribute("value");
    shadow.appendChild(content);
    this._input.addEventListener("input", (ev) => {
      const target = ev.target;
      const value = target.value;
      this.value = value;
      this.dispatchEvent(new CustomEvent("change", { detail: value }));
    });
  }
  get value() {
    return this.getAttribute("value");
  }
  set value(value) {
    console.log(123);
    this.setAttribute("value", value);
  }
}
customElements.define("custom-element-start", CustomElementStart);
