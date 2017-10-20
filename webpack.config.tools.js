
const WebpackIsomorphicToolsPlugin = require('webpack-isomorphic-tools/plugin');

module.exports = {

  debug: false,

  // using Webpack's `resolve.modulesDirectories`
  modulesDirectories: ['node_modules'],

  // enables support for `require.context()` and `require.ensure()` functions
  patch_require: false,

  webpack_assets_file_path: 'webpack-assets.json',

  assets: {

    images: {

      extensions: ['png', 'jpg', 'jpeg', 'gif', ],

      parser: WebpackIsomorphicToolsPlugin.url_loader_parser,

    },

    svg: {

      extension: 'svg',

      parser: WebpackIsomorphicToolsPlugin.url_loader_parser,

    },

    fonts: {

      extensions: [ 'woff', 'woff2', 'ttf', 'eot' ],

      parser: WebpackIsomorphicToolsPlugin.url_loader_parser,

    },

    // this whole "bootstrap" asset type is only used once in development mode.
    // the only place it's used is the Html.js file
    // where a <style/> tag is created with the contents of the
    // './src/theme/bootstrap.config.js' file.
    // (the aforementioned <style/> tag can reduce the white flash
    //  when refreshing page in development mode)
    //
    // hooking into 'js' extension require()s isn't the best solution
    // and I'm leaving this comment here in case anyone finds a better idea.
    bootstrap: {

      extension: 'js',

      include: ['./client/theme/bootstrap.config.js'],

      filter: function(module, regex, options, log) {
        function is_bootstrap_style(name) {
          return name.indexOf('./client/theme/bootstrap.config.js') >= 0;
        }
        if (options.development) {
          return is_bootstrap_style(module.name) && WebpackIsomorphicToolsPlugin.style_loader_filter(module, regex, options, log);
        }
        // no need for it in production mode
      },

      // in development mode there's webpack "style-loader",
      // so the module.name is not equal to module.name
      path: WebpackIsomorphicToolsPlugin.style_loader_path_extractor,
      parser: WebpackIsomorphicToolsPlugin.css_loader_parser,

    },

    style_modules: {

      extensions: ['css', 'less', 'scss'],

      filter: function(module, regex, options, log) {
        if (options.development) {
          // in development mode there's webpack "style-loader",
          // so the module.name is not equal to module.name
          return WebpackIsomorphicToolsPlugin.style_loader_filter(module, regex, options, log);
        } else {
          // in production mode there's no webpack "style-loader",
          // so the module.name will be equal to the asset path
          return regex.test(module.name);
        }
      },
      path: function(module, options, log) {
        if (options.development) {
          // in development mode there's webpack "style-loader",
          // so the module.name is not equal to module.name
          return WebpackIsomorphicToolsPlugin.style_loader_path_extractor(module, options, log);
        } else {
          // in production mode there's no webpack "style-loader",
          // so the module.name will be equal to the asset path
          return module.name;
        }
      },
      parser: function(module, options, log) {
        if (options.development) {
          return WebpackIsomorphicToolsPlugin.css_modules_loader_parser(module, options, log);
        } else {
          // in production mode there's Extract Text Loader which extracts CSS text away
          return module.source;
        }
      },

    },

  },
};
