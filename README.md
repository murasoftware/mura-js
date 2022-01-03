# Mura JS

Mura JS is a javscript utility to interact with the Mura CMS JSON/REST API

Mura CMS is source content management system created by [Mura Software](http://www.murasoftware.com). Mura has been designed to be used by marketing departments, web designers and developers.

## Installation

Mura is available as both @murasoftware/mura and mura.js packages

```
npm install mura.js
```
```
npm install @murasoftware/mura
```
## Example usage:

## In Browser

```
Mura.init(
  {
    siteid:'YOUR_SITEID',
    rootpath:'https://domain.com'
  }
);

Mura(function(Mura){
  Mura.addEventHandler(
    {
      asyncObjectRendered:function(event){
        alert(this.innerHTML);
      }
    }
  );

  Mura('#my-id').addDisplayObject('objectname',{..});

  Mura.login('userame','password')
    .then(function(data){
      alert(data.success);
    });

  Mura.logout())
    .then(function(data){
      alert('you have logged out!');
    });

  Mura.renderFilename('')
    .then(function(item){
      alert(item.get('title'));
    });

  Mura.getEntity('content').loadBy('contentid','${contentid}')
    .then(function(item){
      alert(item.get('title'));
    });

  Mura.getEntity('content').loadBy('contentid','${contentid}')
    .then(function(item){
      item.get('kids').then(function(kids){
        alert(kids.get('items').length);
      });
    });

  Mura.getEntity('content').loadBy('contentid','${contentid}')
    .then(function(item){
      item.get('parent').then(function(parent){
        alert(parent.get('title'));
      });
    });

  Mura.getEntity('content').
    .set('parentid''${contentid}')
    .set('approved',1)
    .set('title','test 5')
    .save()
    .then(function(item){
      alert(item.get('title'));
    });

  Mura.getEntity('content').
    .set(
      {
        parentid:'${contentid}',
        approved:1,
        title:'test 5'
      }
    .save()
    .then(
      function(item){
        alert(item.get('title'));
      });

  Mura.getFeed('content')
    .where()
    .prop('title').isEQ('About')
    .andProp('type').isEQ('Page')
    .getQuery()
    .then(function(collection){
      alert(collection.item(0).get('title'));
    });

});
```

## In Node

### Cookie Based Requests

If you want client cookie support you must use a custom RequestContext
that contains the current executions request and response objects.

```
const express = require('express');
const app = express();
const env = {
    siteid:'default',
    rootpath:'http://localhost:8080'
  };

app.get('/', function (req, res) {
  let Mura=require('mura.js');

  Mura.init(Mura.extend(
    {
      request:req,
      response:res
    },
    env
    )
  );

  Mura.renderFilename('about').then(
    function(content){
      res.send("<br/>rendered content:<pre>" + JSON.stringify(content.getAll()) + "</pre>")
    },
    function(error){
      console.log(error);
    }
  );
});

app.get('/content', function (req, res) {

  let Mura=require('mura.js');

  Mura.init(Mura.extend(
    {
      request:req,
      response:res
    },
    env
    )
  );

  Mura.getFeed('content')
    .getQuery()
    .then(function(items){
        res.send("<br/>content feed:<pre>" + JSON.stringify(items.getAll()) + "</pre>");
  });
})

app.listen(3000, function () {
  console.log('Example app listening on port 3000!')
})
```

## REST Based Requests

```
const express = require('express')
const app = express()
const env = {
    siteid:'default',
    rootpath:'http://localhost:8080',
    mode:'REST'
  };

app.get('/', function (req, res) {

  let Mura=require('../index');

  Mura.init({
    siteid:'default',
    rootpath:'http://localhost:8080'
    mode:'REST'
  });

  //Per Execution Request Headers
  Mura.setRequestHeader('Authorization','Bearer: ...');

  Mura .renderFilename('about').then(
    function(content){
      res.send("<br/>rendered content:<pre>" + JSON.stringify(content.getAll()) + "</pre>")
    },
    function(error){
      console.log(error);
    }
  );
});
```
