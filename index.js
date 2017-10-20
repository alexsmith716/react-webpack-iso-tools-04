
const WebpackIsomorphicTools = require('webpack-isomorphic-tools');
const projectBasePath = require('path').resolve(__dirname, './');


require('babel-register')({
  "plugins": [
    
  ]
});

require('babel-polyfill');

if (process.env.NODE_ENV === 'production') {

  global.webpackIsomorphicTools = new WebpackIsomorphicTools(require('./webpack.config.tools'))

  .server(projectBasePath, () => {

    require('./build/server/server.bundle');

  });

} else {

  global.webpackIsomorphicTools = new WebpackIsomorphicTools(require('./webpack.config.tools'))

  .server(projectBasePath, () => {

    require('./server/server');

  });

};
