import {LitElement, html, css} from 'lit';
import { sharedStyles } from './css/shared-styles.js';
import './el-checkbox.js';
import './el-icon-button.js';
import './el-grid.js';

/**
 * My application which handles the data
 *
 */
export class ElDownloadList extends LitElement {
  static get styles() {
    const s = css`
      .list-controls {
        display: flex;
        align-items: center;      
        gap: 25px;
        padding-bottom: 10px;
      }
    `;
    return [sharedStyles, s];
  }

  static get properties() {
    return {
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

      _numSelected: {state: true},
      _selectedItems: {state: true}
    };
  }

  constructor() {
    super();
    this._numSelected = 0;
    this._selectedItems = [];
    this._configAria = {
      table: {
        'aria-label': 'Download list'
      }
    };
    this.addEventListener('el-checkbox#changed', this._selectAllChanged);
    this.addEventListener('el-icon-button#clicked', this._downloadClicked)
    this.addEventListener('el-grid#selectionChanged', this._itemSelectedChanged);
  }

  _downloadClicked() {
    if (this._numSelected === 0) {
      window.alert('No items selected');
      return;
    }
    window.alert(`Downloading ${this._numSelected} files:\n${this._selectedItems.map((itm) => {
        return this.config.reduce((acc, conf) => {
          if (conf.key === this.selectionCriteria.key) return acc;
          acc.push(`${conf.label}: ${itm[conf.key]}`);
          return acc;
        },[]).join(', ')
      }).join('\n\n')}
    `);

  }

  _selectAllChanged(evt) {
    if (evt.detail.checked) {
      this.renderRoot.getElementById('data-grid').selectAllItems();
    } else {
      this.renderRoot.getElementById('data-grid').unselectAllItems();
    }
  }

  _itemSelectedChanged(evt) {
    const {checked, dataIndex} = evt.detail;
    const data = this.data[dataIndex];
    if (checked) {
      this._selectedItems.push(data);
      this._numSelected = this._selectedItems.length;
    } else {
      this._selectedItems = this._selectedItems.filter((d) => d !== data);
      this._numSelected = this._selectedItems.length;
    }
  }

  _getSelectedLabel() {
    return this._numSelected === 0 ? 'None Selected' : `Selected ${this._numSelected}`;
  }

  render() { 
    const selectableCount = this.data.filter((d) => this.selectionCriteria.values.includes(d[this.selectionCriteria.key])).length;
    return html`
      <h2>Download list</h2>
      <div class="list-controls">
        <el-checkbox 
          id="selectAll" 
          label=${this._getSelectedLabel()}
          ?indeterminate=${this._numSelected > 0 && this._numSelected < selectableCount}
          ?checked=${this._numSelected === selectableCount}
          .configAria=${{input: { ariaLabel: this._getSelectedLabel() + '. Click to select all items.'}}}
        ></el-checkbox>
        <el-icon-button icon="download" label="Download Selected"></el-icon-button>
      </div>
      <el-grid id="data-grid" .data=${this.data} .config=${this.config} .configAria=${this._configAria} .selectionCriteria=${this.selectionCriteria}></el-grid>
    `;
  }
}

window.customElements.define('el-download-list', ElDownloadList);
