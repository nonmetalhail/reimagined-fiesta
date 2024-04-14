import {LitElement, html, css, nothing} from 'lit';
import {classMap} from 'lit/directives/class-map.js';
import {icons} from './assets/icons.js';
import { sharedStyles } from './css/shared-styles.js';
/**
 * Button component
 *
 * @fires count-changed - Indicates when the count changes
 */
export class ElIconButton extends LitElement {
  static get styles() {
    const btn = css`
      .btn {
        display: inline-flex;
        align-items: center;      
        border-color: transparent;
        background-color: transparent;
        color: var(--el-font-color, #000);
        font-size: 18px;
      }
      .btn:hover {
        background-color: var(--el-hover-background-color, #ccc);
      }
    `;
    return [sharedStyles, btn];
  }

  static get properties() {
    return {      
      /**
       * A11y properties to pass down
       * 
       * @type {object}
       */
      configAria: {type: Object},
      
      /**
       * If the checkbox is disabled
       * 
       * @type {boolean}
       */
      disabled: {
        type: Boolean,
        attribute: true,
        reflect: true
      },

      /**
       * Name of the icon to use
       * 
       * @type {string}
       */
      icon: {
        type: String
      },

      /**
       * Label for the Button
       * 
       * @type {string}
       */      
      label: {type: String}
    };
  }

  constructor() {
    super();
    this.configAria = {};
  }

  _onClick(evt) {
    const refireEvent = new CustomEvent('el-icon-button#clicked', {
      bubbles: true, 
      composed: true, 
      cancelable: true
    });
    this.dispatchEvent(refireEvent);

    evt.stopPropagation();
  }

  render() {
    
    return html`
        <button 
          class="btn"
          ?disabled=${this.disabled}
    aria-disabled=${this.disabled ? 'true' : nothing}
          @click=${this._onClick}>
          <svg xmlns="http://www.w3.org/2000/svg" version="1.1" width="35px" height="35px" viewBox="0 -20 110.0 135.0">
              ${icons[this.icon]}
          </svg>
          ${this.label}
      </button>

    `;
  }
}

window.customElements.define('el-icon-button', ElIconButton);
