"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _logger = _interopRequireDefault(require("../logger"));

var _rdflib = _interopRequireDefault(require("rdflib"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Make a JS object become an RDF graph, via a given Schema
 * @param  {[type]}  dataObject [description]
 * @param  {[type]}  schema     [description]
 * @return {Boolean}            [description]
 */
const shepherd = (dataObject, schema) => {
  if (!dataObject || typeof dataObject !== 'object') {
    throw new Error('A valid javascript object must be passed for conversion');
  }

  if (!schema || typeof schema !== 'object') {
    throw new Error('A valid javascript RDF schema object must be passed for conversion');
  }

  if (!schema['@context']) {
    throw new Error('Schema must have a context defined to extract vocabularies');
  }

  const vocabs = {};
  const idUri = dataObject['@id'] || dataObject.id;
  if (!idUri) throw new Error('No "id" passed to make RDF (should be a url).'); //lets get a simple vocab object setup for RDF

  Object.entries(schema['@context']).forEach(([voc, uri]) => {
    vocabs[voc] = _rdflib.default.Namespace(uri);
  });

  _logger.default.trace('Vocabs:', vocabs);

  const creatingGraph = _rdflib.default.graph();

  const id = _rdflib.default.sym(idUri);

  const schemaPropertyArray = schema['@graph'];
  schemaPropertyArray.forEach(prop => {
    const label = prop['rdfs:label'];
    const typeInfoArray = prop['@id'].split(':');
    const vocabToUse = typeInfoArray[0];
    const vocabType = typeInfoArray[1];

    if (label && dataObject[label]) {
      _logger.default.warn('the label:', label); // for each schema prop item:


      try {
        // `tODO:` ccheck what kind of type to be adding: 'literal' etc....
        if (typeof dataObject[label] === 'string') {
          creatingGraph.add(id, vocabs[vocabToUse](vocabType), _rdflib.default.literal(dataObject[label]));
        }

        if (Array.isArray(dataObject[label])) {
          const collection = new _rdflib.default.Collection(dataObject[label]);
          creatingGraph.add(id, vocabs[vocabToUse](vocabType), collection);
        } else if (typeof dataObject[label] === 'object') {
          const arrayOfEntries = Object.entries(dataObject[label]);
          const collection = new _rdflib.default.Collection(arrayOfEntries);
          creatingGraph.add(id, vocabs[vocabToUse](vocabType), collection);
        }
      } catch (e) {
        console.error('Problem adding to graph', e);
        throw new Error(e);

        _logger.default.error('was passing::::::::::: id:', id);

        _logger.default.error('was passing::::::::::: vocab:', vocabs[vocabToUse](vocabType));

        _logger.default.error('was passing::::::::::: label:', dataObject[label]);
      }
    }
  });
  return creatingGraph;
};

var _default = shepherd;
exports.default = _default;