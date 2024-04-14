import {LitElement, html, css} from 'lit';
import { sharedStyles } from '../components/css/shared-styles.js';
import {data, config, selectionCriteria} from './demo-data.js';
import '../components/el-download-list.js';

/**
 * My application which handles the data
 *
 */
export class ElApp extends LitElement {
  static get styles() {
    return [sharedStyles];
  }

  static get properties() {
    return {};
  }

  constructor() {
    super();
  }


  render() {
    return html`
      <h1>Files</h1>
      <el-download-list .data=${data} .config=${config} .selectionCriteria=${selectionCriteria}></el-download-list>
    `;
  }
}

window.customElements.define('el-app', ElApp);
