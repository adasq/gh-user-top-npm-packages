# gh-user-top-npm-packages
Show most popular npm packages, used by given github user

# How does it Works?

1. Find all user's repositories
2. Look for package.json file
3. Retrive  `dependencies` and `devDependencies` entries
4. Process data and generate ranking list

# Installation

```sh
$ npm install --save gh-user-top-npm-packages
```
# Usage
```js

var ranking = require('gh-user-top-npm-packages')({
  "token": "", //your github app token
  "auth": "oauth"
});

ranking.getByUser('tj', function(err, ranking){
  if(err){
    return console.log(err);
  }
  console.log(ranking);
});

```

# Example output

Example output generated for github user: `tj`.
[Go tj's profile][tj]
- `name` is an npm package name
- `rank` is a total count of repositories, which a given package is used for

``` json
[
   {
      "name":"mocha",
      "rank":83
   },
   {
      "name":"should",
      "rank":70
   },
   {
      "name":"debug",
      "rank":15
   },
   {
      "name":"commander",
      "rank":14
   },
   {
      "name":"co",
      "rank":11
   },
   {
      "name":"better-assert",
      "rank":8
   },
   {
      "name":"redis",
      "rank":8
   },
   {
      "name":"jade",
      "rank":8
   },
   {
      "name":"request",
      "rank":6
   },
   {
      "name":"mkdirp",
      "rank":5
   },
   {
      "name":"matcha",
      "rank":5
   },
   {
      "name":"superagent",
      "rank":5
   },
   {
      "name":"express",
      "rank":5
   },
   {
      "name":"connect",
      "rank":5
   }
]
  ```

   [tj]: <https://github.com/tj>


