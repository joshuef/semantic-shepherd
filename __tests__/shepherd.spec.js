import shepderd from '../src/shepherd';
import { Book } from 'schema-doter'
import rdflib from 'rdflib'

describe( 'shepderd', () =>
{
    const sampleObject = {
        id              : 'safE://here',
        'numberOfPages' : 4,
        'title'         : 'Dave',
        'author'        : 'me',
        'published'     : 'now',
        'publisher'     : 'yes'
    };

    it( 'exists', () =>
    {
        expect( shepderd ).not.toBeUndefined()
    } );

    it( 'throws with nothing passed', () =>
    {
        expect( () =>
        {
            shepderd();
        } ).toThrowError( /pass/ )

        expect( () =>
        {
            shepderd( 'string' );
        } ).toThrowError( /pass/ )
    } )

    it( 'throws without an object passed', () =>
    {
        expect( () =>
        {
            shepderd( {}, 'string' );
        } ).toThrowError( /RDF schema/ )
    } )

    it( 'throws without context on the schema', () =>
    {
        expect( () =>
        {
            shepderd( {}, {} );
        } ).toThrowError( /context/ )
    } )


    it( 'throws without an id on the js object', () =>
    {
        expect( () =>
        {
            shepderd( {}, {
                '@context' : {}
            } );
        } ).toThrowError( /"id"/ )
    } )


    it( 'returns a graph from a valid schema/object combo', async () =>
    {
        let rdf;

        await expect( async () =>
        {
            rdf = await shepderd( sampleObject, Book );
        } ).not.toThrow()

        expect( rdf ).not.toBeNull();
        expect( rdf ).not.toBeUndefined();


        rdflib.serialize( null, rdf, sampleObject.id, 'text/turtle', ( err, result ) =>
        {
            expect( err ).toBeNull();
            expect( result.length ).toBeGreaterThan( 0 );
            expect( result ).toMatch( /<>/ );
            expect( result ).toMatch( /:author \"me\"/ );
            expect( result ).toMatch( /:publisher \"yes\"/ );
            expect( result ).not.toMatch( /:title/ ); //not valid for the schema
            expect( result ).not.toMatch( /:published/ ); //not valid for the schema
        } );
    } )

} )
