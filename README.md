# requiret
Require module as Worker Thread in Node.js

# Requirements

- Node.js 10.5.0+

# Install
```
npm install requiret
```

# Demo (converting a sync function to an async function)

readfile.js (this is our thread)

```javascript
const fs = require('fs')

//It must exports an async function
module.exports = async function(file){
	const data = fs.readFileSync(file, 'utf-8')
	return data
}
```

index.js
```javascript
const requiret = require('requiret')
const readfile = requiret('./readfile.js')

readfile('test.txt')
.then(text => {
	console.log(text)
})
.catch(error => {
	console.error('An error has ocurred:', error)
})
```

# Running
You must run node with the --experimental-worker flag enabled.

```
node --experimental-worker index.js
```
