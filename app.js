/**
 * Demo application.
 * Note that this uses some ES6/2015 syntax,
 * so a transpiler such as Babel or Closure would be needed for IE11 compatibility
 */


"use strict"

// use "IIFE" so none of our variables "leak" into the global namespace
; ( function () {

    /** global application state (TODO - put in store manager like Vuex) */
    var app_state = {

        /** metadata for page header/footer */
        meta: {

            /** copyright year */
            cr_yr: 2016,

            /** how is the company branded *this* year? */
            corp_alias: 'AcmeCorp',
        },

        /** message list */
        msgs: [],

        /** raffle winner */
        winner: {},  // see below

        /** form entry buffer */
        entry: {},  // see below

        /** (temp) list of participants / contestants (to be loaded from server) */
        entrants: [
            { fname: 'Joe', lname: 'Blow', tickets: 3 },
            { fname: 'Susan', lname: 'Queue', tickets: 2 },
            { fname: 'Lucky', lname: 'Strikes', tickets: 7 },
        ],

    }

    app_state.msgs.push( 'If something happened, I would tell you here' )
    app_state.entry = app_state.entrants[ 0 ]  // alias
    app_state.winner = app_state.entrants[ 0 ]  // alias

    new Vue( {

        /** element to which to bind Vue app */
        el: '#demo',

        /** view model data */
        data: { mod: app_state },

    } )

} )()


// EOF
