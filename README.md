# auth-middleware

[![Codeship Status for 3beca/auth-middleware](https://app.codeship.com/projects/5189faa0-0a39-0137-f8a4-0aa1d68286f3/status?branch=master)](https://app.codeship.com/projects/326179)
[![CodeFactor](https://www.codefactor.io/repository/github/3beca/auth-middleware/badge)](https://www.codefactor.io/repository/github/3beca/auth-middleware)
[![codecov](https://codecov.io/gh/3beca/auth-middleware/branch/master/graph/badge.svg)](https://codecov.io/gh/3beca/auth-middleware)
[![Greenkeeper badge](https://badges.greenkeeper.io/3beca/auth-middleware.svg)](https://greenkeeper.io/)

Express auth middleware for tribeca auth service.

This middleware verifies JWT tokens against the tribeca auth service. It returns 401 Unauthorized Http Response if the token is not set in the http header (**Authorization: Bearer TOKEN**), expired or invalid, and set in req.user the decoded JWT when valid.

## Installation

```
$ npm install @tribeca/auth-middleware --save
```

## Example

```js
const express = require("express");
const authMiddleware = require("@tribeca/auth-middleware");

const app = express();

app.get("/", authMiddleware(), function handleRequest(req, res) {
    // If token is valid it set decoded jwt in req.user
    res.json(req.user);
});

const port = process.NODE_ENV || 3000;
app.listen(port, function() {
    console.log(`Server listening at port ${port}`);
})
```

## License
Licensed under [MIT](./LICENSE).