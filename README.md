# LitElement UI example

This project was based on the LitElement starter kit. As such, there are several files and folders not currently being used, namely `./docs/`, `./docs-src/`, and `./test/`.

### To run:
1. `npm i` to install dependencies
2. `npm run serve` to start up the web server

### Files:
The entry point is `./index.html` which specifies CSS variables and loads a demo app component.

`./dev/el-app.js` is the demo app component. It loads data from `./dev/demo-data.js` and applies it to a reusable component. 

All reusable components are under the `./components/` folder. `./components/el-download-list.js` is the main component. It is built using the three other more generic components also found in that folder. 