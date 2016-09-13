#hangarjs

Use hangar factories from protractor

##Install

Use npm

```bash
npm install hangarjs
```

##Usage

Initialize hangar, passing it the URL where hangar can be reached, as well as the protractor object

```javascript
var hangar = require('hangarjs');

var factory = new hangar('http://localhost/', protractor);
```

Create a record

```javascript
factory.create('user', {
  email: 'somebody@gmail.com',
  password: 'hunter2'
});
```

Get example attributes

```javascript
factory.attributesFor('user').then(function(attributes){
  //...
});
```

Create a record based on the example

```javascript
factory.attributesFor('user').then(function(attributes){
  attributes.admin = true;
  factory.create('user', attributes);
});
```

Create a record based in traits

```javascript
factory.create('user',
  { email: 'somebody@gmail.com', password: 'hunter2'},
  { traits: ["admin", "full"] }
);
```

Empty the db when you're done testing

```
factory.clear();
```
