# Semantic Shepherd

<!-- |Linux/OS X|Windows|Coverage Status|
|:---:|:---:|:---:|
|[![Build Status](https://travis-ci.org/joshuef/node-cli-starter.svg?branch=master)](https://travis-ci.org/joshuef/node-cli-starter)|[![Build status](https://ci.appveyor.com/api/projects/status/uqlsh2o5e5qxfw2s?svg=true)](https://ci.appveyor.com/project/joshuef/node-cli-starter)|[![Coverage Status](https://coveralls.io/repos/github/joshuef/node-cli-starter/badge.svg?branch=master)](https://coveralls.io/github/joshuef/node-cli-starter?branch=master)| -->


Easily convert your js objects to RDF data.

Currently _very_ naive proof of concept.

## Setup:

Install using yarn (needed for postinstall script/retrieval)
`yarn`

## Use 

```js
import shepderd from '../src/shepherd';
import { Book } from 'schema-doter';
import rdflib from 'rdflib';

const sampleObject = {
    'id'            : 'safe://here',
    'author'        : 'Josh',
    'publisher'     : 'Somebody'
};


let rdf;

rdf = await shepderd( sampleObject, Book );


rdflib.serialize( null, rdf, sampleObject.id, 'text/turtle', ( err, result ) =>
{
    console.log( result ) // Logs a turtle graph as a string
} );

```

            
## TODO 

- Publish as npm package?
    - Setup main script / build / etc
- Add tests
- use RDFlib for extracting props etc.
- setup CI
