<div align="center">
  <a href="https://github.com/posquit0/koa-rest-api-boilerplate" title="Koa REST API Boilerplate">
    <img alt="Koa Legit" src="" width="240px" />
  </a>
  <br />
  <h1>Koa Legit</h1>
</div>

<p align="center">
  :traffic_light: Koa middleware to validate and sanitize HTTP request
</p>

<div align="center">
  <a href="https://circleci.com/gh/posquit0/koa-legit">
    <img alt="CircleCI" src="https://circleci.com/gh/posquit0/koa-legit.svg?style=shield" />
  </a>
  <a href="https://coveralls.io/github/posquit0/koa-legit">
    <img src="https://coveralls.io/repos/github/posquit0/koa-legit/badge.svg" alt='Coverage Status' />
  </a>
  <a href="https://badge.fury.io/js/koa-legit">
    <img alt="npm version" src="https://badge.fury.io/js/koa-legit.svg" />
  </a>
  <a href="https://www.npmjs.com/package/koa-legit">
    <img alt="npm" src="https://img.shields.io/npm/dt/koa-legit.svg" />
  </a>
  <a href="https://david-dm.org/posquit0/koa-legit">
    <img alt="npm" src="https://img.shields.io/david/posquit0/koa-legit.svg?style=flat-square" />
  </a>
  <a href="https://opensource.org/licenses/mit-license.php">
    <img alt="MIT License" src="https://badges.frapsoft.com/os/mit/mit.svg?v=103" />
  </a>
  <a href="https://github.com/ellerbrock/open-source-badge/">
    <img alt="Open Source Love" src="https://badges.frapsoft.com/os/v1/open-source.svg?v=103" />
  </a>
</div>

<br />

**Koa Legit** is a Koa middleware to easily validate HTTP request data including headers, cookies, body, query strings, and url params. It's based on [validator](https://github.com/chriso/validator.js).

- It was written for us on [**OMNIOUS**](http://www.omnious.com) which provides fashion A.I API service.


## Installation

```bash
# NPM
$ npm install --save koa-legit
# Yarn
$ yarn add koa-legit
```


## Example

```node
const Koa = require('koa');
const bodyParser = require('koa-bodyparser');
const legit = require('koa-legit');
const Router = require('koa-router');


const app = new Koa();

// Set middlewares
app.use(bodyParser({ enableTypes: ['json', 'form'] }));
app.use(legit());


// Bootstrap application router
const router = new Roter();
app.use(router.routes());
app.use(router.allowedMethods());

app.listen(3000);
```


## API

To be updated


## Contributing

This project follows the [**Contributor Covenant**](http://contributor-covenant.org/version/1/4/) Code of Conduct.

#### Bug Reports & Feature Requests

Please use the [issue tracker](https://github.com/posquit0/koa-legit/issues) to report any bugs or ask feature requests.


## Contact

If you have any questions, feel free to join me at [`#posquit0` on Freenode](irc://irc.freenode.net/posquit0) and ask away. Click [here](https://kiwiirc.com/client/irc.freenode.net/posquit0) to connect.


## License

Provided under the terms of the [MIT License](https://github.com/posquit0/koa-legit/blob/master/LICENSE).

Copyright © 2017, [Byungjin Park](http://www.posquit0.com).
