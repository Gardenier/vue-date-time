module.exports = {
  "extends": [
    "standard"
  ],
  "env": {
    "browser": true,
    "es6": true
  },
  "plugins": [
    "html"
  ],
  "parser": "babel-eslint",
  "rules": {
    "no-debugger": process.env.NODE_ENV === 'production' ? 2 : 0
  } 
}