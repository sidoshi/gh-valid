# gh-valid

[![Build Status](https://travis-ci.org/sidoshi/gh-valid.svg?branch=master)](https://travis-ci.org/sidoshi/gh-valid) [![contributions welcome](https://img.shields.io/badge/contributions-welcome-brightgreen.svg?style=flat)](https://github.com/sidoshi/gh-valid/issues) [![HitCount](http://hits.dwyl.io/sidoshi/gh-valid.svg)](http://hits.dwyl.io/sidoshi/gh-valid) [![npm](https://img.shields.io/npm/v/gh-valid.svg)](https://www.npmjs.com/package/gh-valid) [![npm](https://img.shields.io/npm/l/gh-valid.svg)](https://www.npmjs.com/package/gh-valid)

> Check if a GitHub token is valid and has the right scopes

## Install

```bash
npm install --save gh-valid
```

## Usage

```js
import ghValid from 'gh-valid'

// A github token with notification and repo scope
const token = process.env.GITHUB_TOKEN

// Check if the token is valid
ghValid(token).then(({ tokenValid, scopesValid, scopes }) => {
  console.log(tokenValid) // true
  console.log(scopesValid) // true
  console.log(scopes) // ['notifications', 'repo']
})

// Check if a token is valid and has required scopes
ghValid(token, ['notification', 'gists']).then(
  ({ tokenValid, scopesValid, scopes }) => {
    console.log(tokenValid) // true
    console.log(scopesValid) // false, Since gists scope is not available
    console.log(scopes) // ['notifications', 'repo']
  }
)

// When token is invalid
ghValid('invalid_token').then(({ tokenValid, scopesValid, scopes }) => {
  console.log(tokenValid) // false
  console.log(scopesValid) // false
  console.log(scopes) // []
})
```

## License

MIT © [Siddharth Doshi](https://sid.sh)
