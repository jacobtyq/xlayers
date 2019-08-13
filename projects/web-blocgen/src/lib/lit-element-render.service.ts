import { Injectable } from "@angular/core";
import { FormatService } from "@xlayers/sketch-lib";
import { WebRenderService } from "./web-render.service";
import { WebBlocGenOptions } from "./web-blocgen";

@Injectable({
  providedIn: "root"
})
export class LitElementRenderService {
  constructor(
    private format: FormatService,
    private webRender: WebRenderService
  ) {}

  render(current: SketchMSLayer, options: WebBlocGenOptions) {
    const fileName = this.format.normalizeName(current.name);
    const files = this.webRender.render(current, options);
    const html = files.find(file => file.language === "html");
    const css = files.find(file => file.language === "css");

    return [
      {
        kind: "litElement",
        value: this.renderComponent(current.name, html.value, css.value),
        language: "javascript",
        uri: `${options.componentDir}/${fileName}.js`
      }
    ];
  }

  private renderComponent(name: string, html: string, css: string) {
    const componentName = this.format.componentName(name);
    const tagName = this.format.normalizeName(name);

    return `\
import { LitElement, html, css } from 'lit-element';

class ${componentName} extends LitElement {
  static get styles() {
    return css\`
      ${this.format.indentFile(3, css).join("\n")}
    \`
  }

  render() {
    return html\`
      ${this.format.indentFile(3, html).join("\n")}
    \`
  }
}

customElements.define('${tagName}' , ${componentName});`;
  }
}
