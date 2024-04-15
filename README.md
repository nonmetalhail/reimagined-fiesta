# LitElement UI example

This project was based on the LitElement starter kit. As such, there are several files and folders not currently being used, namely `./docs/`, `./docs-src/`, and `./test/`.

### To run:
1. `npm i` to install dependencies
2. `npm run serve` to start up the web server

### Files:
The entry point is `./index.html` which specifies CSS variables and loads a demo app component.

`./dev/el-app.js` is the demo app component. It loads data from `./dev/demo-data.js` and applies it to a reusable component. 

All reusable components are under the `./components/` folder. `./components/el-download-list.js` is the main component. It is built using the three other more generic components also found in that folder, a checkbox component, a button component, and a grid component. 

### TODOs
Given time, there is of course a number of things I didnt get to that I would have hoped:
* testing - should write functional tests
* docs and comments - obviously, would be good for actual reusable components and code to write better API docs and comment things in the code for future devs
* Screen reader testing - I very quickly ran through VoiceOver on Safari, but using more commonly used screen readers like NVDA and JAWS would be necessary
* AXE - I ran axe and it highlighted that the html elem needs a lang attr. Obviously this is just an issue with the demo, but still...
* I worry that the Select All checkbox should have more aria attrs to connect it to the other checkboxes, but would have to do more research. If it does, applying them becomes difficult  with shadow roots. Basically, this is an area for more research to confirm if I did it well or not.
* There are API issues on my reusable components that feel a little rough; I would have liked to have spent more time considering other use cases in order to make them more generic and better.
