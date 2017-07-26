<div align="center">
  <a href="https://github.com/sghall/chunky-monkey">
  	<img src="https://user-images.githubusercontent.com/4615775/28554415-32c8fa48-70ae-11e7-8917-f19659b27be4.png" alt="Chunky Monkey Logo" style="width:450px;"/>
  </a>
</div>

Under development.  Feedback welcome.

## CLI:

```
npm install -g chunky-monkey
```

Basic usage:
```
chunky-monkey /path/to/webpack/stats.json
```

See a demo:
```
chunky-monkey --demo
```

## Webpack Plugin:

```
npm install chunky-monkey --save-dev
```

### CJS Import:

```
const ChunkyMonkey = require('chunky-monkey');

// In your webpack config...
// ...
plugins: [new ChunkyMonkey()]
// ...
```

### ES6 Import:

```
import ChunkyMonkey from 'chunky-monkey';

// In your webpack config...
// ...
plugins: [new ChunkyMonkey()]
// ...
```

The server listens via websockets so it will update as your developing.
The 3D graph can be resource intensive, so it may be better to keep it on the treemap while your working.
It will refresh to the page your currently on each time webpack updates.

## Shoutouts

Uses the data processing from the awesome [Webpack Bundle Analyzer](https://github.com/th0r/webpack-bundle-analyzer).
The app is built using [Create React App](https://github.com/facebookincubator/create-react-app).
Lot of ideas and inspiration from [Bundle Buddy](https://github.com/samccone/bundle-buddy).

## Data Views:

### 3D Force Directed Graph

Uses:

[d3-force-3d](https://github.com/vasturiano/d3-force-3d) - 3D layout

[three.js](https://github.com/mrdoob/three.js/) - JavaScript WebGL

[subunit](https://github.com/sghall/subunit) - WebGL Selections

### Zoomable Treemap

Uses:

[d3](https://github.com/vasturiano/d3-force-3d) - Data Visualization Library

Uses the [zoomable treemaps](https://bost.ocks.org/mike/treemap/) concept by Mike Bostock.

## Screenshots:

<a href="https://github.com/sghall/chunky-monkey">
	<img src="https://user-images.githubusercontent.com/4615775/28555665-2659bcfe-70b6-11e7-8844-d8f3e4a9381a.png" alt="Chunky Monkey" style="width:450px;"/>
</a>

<a href="https://github.com/sghall/chunky-monkey">
	<img src="https://user-images.githubusercontent.com/4615775/28555672-3187cbe8-70b6-11e7-97b4-2dd688aa8b72.png" alt="Chunky Monkey" style="width:450px;"/>
</a>


## Roadmap

It's early days for this project.  Lots of work to be done on the visualizations to make them more helpful.

Have a suggestion/idea/comment/criticism?  Open an issue.


Logo image created by Oksana Latysheva from the [Noun Project](https://thenounproject.com/)
