/**
 * Demo application.
 * Note that this uses some ES6/2015 syntax,
 * so a transpiler such as Babel or Closure would be needed for IE11 compatibility
 */


"use strict"


// @formatter:off
//
// see:  https://www.google.com/webhp?sourceid=chrome-instant&ion=1&espv=2&ie=UTF-8#q=intellij+disable+auto+format&*
// e.g. -
//      http://www.gamefromscratch.com/post/2015/02/01/Preventing-IntelliJ-code-auto-formatting-from-ruining-your-day.aspx
//      http://stackoverflow.com/questions/3375307/how-to-disable-code-formatting-for-some-part-of-the-code-using-comments


// use "IIFE" so none of our variables "leak" into the global namespace
; ( function () {

    /** component name constants - helps list/find them all */
    const COMP = Object.freeze( {

        /** displays messages (nominally near the top of the page - "flash message" style) */
        MSGS: 'raf-msgs',

    } )

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

    // IIFE for message component
    ; ( function () {

        const template = `
<div id="msgs">
    <ul>
        <li
            v-for="msg in msgs"
        >
            {{ msg }}
        </li>
    </ul>
</div>
        `

        /** displays messages (nominally near the top of the page - "flash message" style) */
        Vue.component(
            COMP.MSGS,
            {
                template,
                // no props - it's a singleton
                data: () => ( { msgs: app_state.msgs, } ),
            }
        )

    } )()

    // make sure components are defined *before* you start the app

    new Vue( {

        /** element to which to bind Vue app */
        el: '#demo',

        /** view model data */
        data: { mod: app_state },  // TODO - empty object, as state will be in components

    } )

} )()


// vi: ts=4 sw=4 expandtab
// *** EOF ***
