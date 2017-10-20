
import dotenv from 'dotenv/config';
//import dotenv from 'dotenv';
import express from 'express';
import helmet from 'helmet';
import http from 'http';
import path from 'path';
import bodyParser from 'body-parser';
import compression from 'compression';
import morgan from 'morgan';
import mongoose from 'mongoose';
import favicon from 'serve-favicon';
import serialize from 'serialize-javascript';
import webpack from 'webpack';
import webpackConfigDev from '../webpack.config.dev.js';
import webpackDevMiddleware from 'webpack-dev-middleware';
import webpackHotMiddleware from 'webpack-hot-middleware';
//dotenv.config();

global.__CLIENT__ = false;
global.__SERVER__ = true;
global.__DEVELOPMENT__ = process.env.NODE_ENV !== 'production';

const app = express();

// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

if (process.env.NODE_ENV === 'development') {

  const compiler = webpack(webpackConfigDev);

  app.use(webpackDevMiddleware(compiler, {
      noInfo: false, 
      publicPath: webpackConfigDev.output.publicPath 
    },
  ));

  app.use(webpackHotMiddleware(compiler));

}

// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

app.use(compression());
// app.use(express.static(path.join(__dirname, '../public')));
app.use('/public', express.static(path.join(__dirname, '../public')));
app.use(favicon(path.join(__dirname, '../public/favicon', 'favicon.ico')));

app.use(morgan('dev'));
app.use(bodyParser.json({}));
app.use(bodyParser.urlencoded({ extended: false }));

// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

app.use(helmet())
app.use((req, res, next) => {
  // res.header('Access-Control-Allow-Origin', '*');
  // res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});

// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

app.use((req, res, next) => {
  console.log('>>>>>>>>>>> GOING THROUGH APP NOW <<<<<<<<<<<<<');
  res.locals.publicViews = path.join(__dirname, 'public')
  console.log('REQ.method +++++: ', req.method);
  console.log('REQ.url ++++++++: ', req.url);
  console.log('REQ.headers ++++: ', req.headers)
  next();
});

// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++


mongoose.Promise = global.Promise;
const mongooseOptions = { useMongoClient: true, autoReconnect: true, keepAlive: 2, connectTimeoutMS: 400000 };
mongoose.connect(process.env.MONGO_URL, mongooseOptions, error => {
  if (error) {
    console.error('>>>>>> mongoose.connect error <<<<<<<: ', error);
    let err = new Error('>>>>>> mongoose.connect error <<<<<<<: ', error);
    throw error;
  }
});

// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++


// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

app.listen(process.env.PORT, (error) => {
  if (!error) {
    console.log(`Express server running on port ${process.env.PORT}`);
  }
});

export default app;
