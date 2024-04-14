import {LitElement, html, css, nothing} from 'lit';
import {classMap} from 'lit/directives/class-map.js';
import { sharedStyles } from './css/shared-styles.js';
import './el-checkbox.js';

/**
 * Button component
 *
 * @fires count-changed - Indicates when the count changes
 */
export class ElGrid extends LitElement {
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

      table {
        width: 100%;
        border-collapse: collapse;
      }

      tr {
        border-block: 1px solid var(--el-border-color, #000);
      }

      tr:not(.header-row):hover {
        background-color: var(--el-hover-background-color, #ccc);
      }

      tr:has(el-checkbox[checked]) {
        background-color: var(--el-selected-background-color, #aaa);
      }

      th {
        padding-top: 15px;
        padding-bottom: 15px;
        text-align: left;
        font-size: 16px;
        font-weight: normal;
      }

      th.selection-criteria {
        padding-left: 25px;
      }

      td {
        padding-top: 5px;
        padding-bottom: 5px;
        font-size: 14px;
      }

      td.selection-criteria {
        text-transform: capitalize;
      }

      td.selection-criteria::before {
        content: '';
        display: inline-block;
        width: 15px;
        height: 15px;
        border-radius: 7.5px;
        background-color: transparent;
        margin: 0px 10px -3px 0;
      }

      td.pass-criteria::before {
        background-color: var(--el-available-color, green);
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
       * A configuration object specifying accessor keys and human readable labels
       * @type {Array}
       */
      config: {type: Array},

      /**
       * A list of data to display
       * @type {Array}
       */
      data: {type: Array},

      /**
       * The data key and values which determines if a row is selectable
       * @type {Object}
       */
      selectionCriteria: {type: Object},

      _currentCell: {state: true}
    }
  }

  constructor() {
    super();
    this.configAria = {};
    this.data = [];
    this._currentCell = [0,0];
    this.addEventListener('el-checkbox#changed', this._checkboxChanged);
  }

  _processConfig() {
    if (!this.config?.length) {
      const keys = Object.keys(this.data[0]);
      return {keys, labels:[...keys], selection: null};
    }

    return this.config.reduce((acc, val) => {
      const {key, label} = val;
      acc.keys.push(key);
      acc.labels.push(label);
      // map the label to the selection key
      if (key === this.selectionCriteria.key) {
        acc.selection = label;
      }
      return acc;
    }, {keys: [], labels: [], selection: null});
  }

  firstUpdated() {
    const table = this.renderRoot.getElementById('data-table');
    this._currentCell = [0,0];
    let cell = table.querySelector(`[grid-row="${this._currentCell[0]}"][grid-col="${this._currentCell[1]}"]`);
    if (cell.hasAttribute('disabled')) {
      this._currentCell[1]++;
      cell = table.querySelector(`[grid-row="${this._currentCell[0]}"][grid-col="${this._currentCell[1]}"]`);
    }
    cell.setAttribute('tabindex', 0);
  }

  _checkboxChanged(evt) {
    const dataIndex = evt.composedPath()[0].getAttribute('data-index');
    const refireEvent = new CustomEvent('el-grid#selectionChanged', {
      bubbles: true, 
      composed: true, 
      cancelable: true, 
      detail: {checked: evt.detail.checked, dataIndex}
    });
    this.dispatchEvent(refireEvent);

    evt.stopPropagation();
  }

  _onKeyUp(evt) {
    let delta = [0,0]
    switch(evt.key) {
      case 'ArrowUp':
        delta[0] = this._currentCell[0] === 0 ? 0 : -1;
        break;
      case 'ArrowDown':
        delta[0] = this._currentCell[0] === this.data.length - 1 ? 0 : 1;
        break;
      case 'ArrowRight':
        delta[1] = this._currentCell[1] === this.config.length ? 0 : 1;
        break;
      case 'ArrowLeft':
        delta[1] = this._currentCell[1] === 0 ? 0 : -1;
        break;
      default: 
        delta = null;
        break;
    }

    if(!delta) return;

    const table = this.renderRoot.getElementById('data-table');
    const lastCell = table.querySelector(`[grid-row="${this._currentCell[0]}"][grid-col="${this._currentCell[1]}"]`);
    lastCell.setAttribute('tabindex', -1);
    lastCell.blur();

    this._currentCell[0] += delta[0];
    this._currentCell[1] += delta[1];
    let newCell = table.querySelector(`[grid-row="${this._currentCell[0]}"][grid-col="${this._currentCell[1]}"]`);
    if (newCell.hasAttribute('disabled')) {
      this._currentCell[1]++;
      newCell = table.querySelector(`[grid-row="${this._currentCell[0]}"][grid-col="${this._currentCell[1]}"]`);
    }
    newCell.setAttribute('tabindex', 0);
    newCell.focus();
  }

  _isSelectable(row) {
    const {key, values} = this.selectionCriteria;
    const field = row[key];
    return !values.includes(field);
  }

  selectAllItems() {
    this.renderRoot.querySelectorAll('el-checkbox:not([disabled])')
      .forEach((cb) => {
        if (cb.hasAttribute('checked')) return;

        cb.setAttribute('checked', true);
        const evt = new CustomEvent('el-grid#selectionChanged', {
          bubbles: true, 
          composed: true, 
          cancelable: true, 
          detail: {checked: true, dataIndex: cb.getAttribute('data-index')}
        });
        this.dispatchEvent(evt);
      });
  }

  unselectAllItems() {
    this.renderRoot.querySelectorAll('el-checkbox:not([disabled])')
      .forEach((cb) => {
        cb.removeAttribute('checked');
        const evt = new CustomEvent('el-grid#selectionChanged', {
          bubbles: true, 
          composed: true, 
          cancelable: true, 
          detail: {checked: false, dataIndex: cb.getAttribute('data-index')}
        });
        this.dispatchEvent(evt);
      });
  }

  render() {
    if (!this.data.length) {
      return html`<h3>No data to display</h3>`;
    }
    const {keys, labels, selection} = this._processConfig();
    const thHTML = labels.map((l) => {
      const classname = classMap({
        'selection-criteria': l === selection
      });
      return html`<th class=${classname}>${l}</th>`
    });
    const tdHTML = this.data.map((row, rowIdx) => {
      return html`
        <tr>
          <td>
            <el-checkbox 
              tabindex="-1"
              grid-row=${rowIdx}
              grid-col="0"
              data-index=${rowIdx}
              ?disabled=${this._isSelectable(row)}
              .configAria=${{input: { ariaLabel: `Click to select ${row[keys[0]]}`}}}
            ></el-checkbox>
          </td>
          ${keys.map((k, colIdx) => {
            const classname = classMap({
              'selection-criteria': k === this.selectionCriteria.key,
              'pass-criteria': k === this.selectionCriteria.key && this.selectionCriteria.values.includes(row[k])
            });
            return html`<td class=${classname} tabindex="-1" grid-row=${rowIdx} grid-col=${colIdx+1}>${row[k]}</td>`
          })}
        </tr>
      `;
    });
    
    return html`
      <table 
        id="data-table" 
        role="grid" 
        aria-label=${this.configAria.table['aria-label']} 
        @keyup=${this._onKeyUp}
      >
        <tbody>
          <tr class="header-row">
            <th></th>
            ${thHTML}
          </tr>
          ${tdHTML}
        </tbody>
      </table>
    `;
  }
}

window.customElements.define('el-grid', ElGrid);
