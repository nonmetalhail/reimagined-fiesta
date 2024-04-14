import {LitElement, html, css, nothing} from 'lit';
import {classMap} from 'lit/directives/class-map.js';

import { sharedStyles } from './css/shared-styles';
/**
 * Checkbox component
 *
 * @fires el-checkbox#changed - Indicates when the state of the checkbox input has changed
 */
export class ElCheckbox extends LitElement {
  static shadowRootOptions = {
    ...LitElement.shadowRootOptions, 
    delegatesFocus: true
  };

  static get styles() {
    const s = css`
      :host {
        font-size: 18px;
      }
      input[type="checkbox"] {
        accent-color: #4b95e0;
      }
    `;
    return [sharedStyles, s];
  }

  static get properties() {
    return {
      /**
       * The state of the checkbox.
       * 
       * @type {boolean}
       */
      checked: {
        type: Boolean,
        attribute: true,
        reflect: true
      },
      
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
       * If the checkbox is in an indeterminate state
       * 
       * @type {boolean}
       */
      indeterminate: {
        type: Boolean,
        attribute: true,
        reflect: true
      },

      /**
       * Label for the checkbox
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

  _onChange(evt) {
    const {target} = evt;
    const {checked, indeterminate} = target;
    this.checked = checked;
    this.indeterminate = indeterminate;
    
    const refireEvent = new CustomEvent('el-checkbox#changed', {
      bubbles: true, 
      composed: true, 
      cancelable: true, 
      detail: {checked, indeterminate}
    });
    this.dispatchEvent(refireEvent);

    evt.stopPropagation();
  }

  render() {
    const wrapperClasses = classMap({
      'el-wrapper': true,
      disabled: this.disabled
    });
    return html`
      <div class=${wrapperClasses}>
        <input 
          type="checkbox"
          id="el-checkbox-input" 
          aria-checked=${this.indeterminate ? 'mixed' : this.checked ? 'true' : 'false'}
          aria-label=${this.configAria?.input?.ariaLabel || nothing}
          ?disabled=${this.disabled}
          .indeterminate=${this.indeterminate}
          .checked=${this.checked}
          @change=${this._onChange} />
        <label for="el-checkbox-input">${this.label}</label>
      </div>
    `;
  }
}

window.customElements.define('el-checkbox', ElCheckbox);
