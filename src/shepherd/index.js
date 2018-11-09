import logger from '../logger';
import rdflib from 'rdflib';

/**
 * Make a JS object become an RDF graph, via a given Schema
 * @param  {[type]}  dataObject [description]
 * @param  {[type]}  schema     [description]
 * @return {Boolean}            [description]
 */
const rdfThisPlease = (  dataObject, schema ) =>
{
    if( ! dataObject || typeof dataObject !== 'object' )
    {
        throw new Error( 'A valid javascript object must be passed for conversion' );
    }

    if( ! schema || typeof schema !== 'object' )
    {
        throw new Error( 'A valid javascript RDF schema object must be passed for conversion' );
    }

    if( ! schema['@context'] )
    {
        throw new Error( 'Schema must have a context defined to extract vocabularies');
    }

    const vocabs = {};

    const idUri = dataObject['@id'] || dataObject.id;

    if( !idUri ) throw new Error( 'No "id" passed to make RDF (should be a url).' )

    //lets get a simple vocab object setup for RDF
    Object.entries( schema['@context'] ).forEach( ( [ voc, uri ] ) =>
    {
        vocabs[voc] = rdflib.Namespace( uri );
    } )

    logger.trace( 'Vocabs:', vocabs );

    const creatingGraph = rdflib.graph();

    const id = rdflib.sym( idUri );

    const schemaPropertyArray = schema['@graph'];


    schemaPropertyArray.forEach( prop =>
    {

        const label = prop['rdfs:label'];
        const typeInfoArray = prop['@id'].split( ':' );

        const vocabToUse = typeInfoArray[0];
        const vocabType = typeInfoArray[1];

        if( label && dataObject[ label ] )
        {
            logger.warn( 'the label:', label );

            // for each schema prop item:

            try {
                // `tODO:` ccheck what kind of type to be adding: 'literal' etc....
                if( typeof dataObject[ label ] === 'string' )
                {
                    creatingGraph.add( id, vocabs[ vocabToUse ]( vocabType ), rdflib.literal( dataObject[ label ] )  );
                }

                if( Array.isArray( dataObject[ label ] ) )
                {
                    const collection = new rdflib.Collection( dataObject[ label ] )
                    creatingGraph.add( id, vocabs[ vocabToUse ]( vocabType ), collection );
                }
                else if ( typeof dataObject[ label ] === 'object' )
                {
                    const arrayOfEntries = Object.entries( dataObject[ label ] );
                    const collection = new rdflib.Collection( arrayOfEntries  )
                    creatingGraph.add( id, vocabs[ vocabToUse ]( vocabType ), collection );
                }

            } catch (e) {
                console.error('Problem adding to graph',e);
                throw new Error( e );
                logger.error('was passing::::::::::: id:', id );
                logger.error('was passing::::::::::: vocab:', vocabs[ vocabToUse ](vocabType) );
                logger.error('was passing::::::::::: label:', dataObject[ label ] );
            }

        }

    } )

    return creatingGraph



}

export default rdfThisPlease
