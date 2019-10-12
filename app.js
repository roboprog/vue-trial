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

        /** generates and displays results of raffle */
        RES: 'raf-res',

        /** edits participant entry */
        PART_EDIT: 'raf-part-edit',

        /** lists participants */
        PART_LIST: 'raf-part-list',

        /** row in participant list */
        PART_LIST_ROW: 'raf-part-row',

        /** page footer */
        PG_FTR: 'raf-pg-ftr',

    } )

    /** an empty participant entry (must be complete to clear "reactive" data */
    const EMPTY_PART = Object.freeze( {

        /** internal ID - perhaps from a database??? */
        id: 0,

        /** first name */
        fname: '',

        /** last name */
        lname: '',

        /** number of raffle tickets */
        tickets: 0,

    } )

    /** synthesize a "key" on a participant for Vue */
    const gen_part_key = ( part ) => (
        Object.defineProperty(
            part,
            /** a synthetic ID for Vue.js to recognize instances in a list */
            'key',
            { get: () => ( part.id ) }  // this changed, but hide what it is today from the view template
        )
    )

    /** global application state (TODO - put in store manager like Vuex) */
    var app_state = ( function () {
        const meta = Object.freeze( {

            /** copyright year */
            cr_yr: 2019,

            /** how is the company branded *this* year? */
            corp_alias: 'AcmeCorp',
        } )
        var part_seq = 0
        var entrants = R.map(
            R.pipe(
                function ( part ) {
                    part.id = ( ++ part_seq )  // MUTATE! / decorate
                    return part
                },
                gen_part_key
            ),
            [
                { fname: 'Joe', lname: 'Blow', tickets: 3 },
                { fname: 'Susan', lname: 'Queue', tickets: 2 },
                { fname: 'Lucky', lname: 'Strikes', tickets: 7 },
            ]
        )
        return {
            // if it doesn't absolutely need to be in here,
            // don't put it in here.
            // this is essentially the app DATA-DIVISION :-)

            /** metadata for page header/footer */
            meta,

            /** message list */
            msgs: [],

            /** raffle winner */
            winner: {},  // see below

            /** form entry buffer */
            entry: {},  // see below

            /** DB sequence emulation */
            part_seq,

            /** (temp) list of participants / contestants (to be loaded from server) */
            entrants,

        }
    } )()

    /** emulate a database sequence for participants (since no actual server backing this) */
    const next_part = function () {
        return (
            ++ app_state.part_seq  // MUTATE!
        )
    }

    app_state.entrants.forEach( function ( part ) {
        part.id = next_part()
    } )

    /**
     * Copy into "reactive" view model data.
     * @param dst {object} - the destination view model which has been decorated by Vue to be reactive.
     * @param src {object} - a source of new properties to be copied into the view model.
     */
    const cp_react = function ( dst, src ) {
        R.mapObjIndexed(
            function ( val, key ) {
                // TODO - detect and cope with array properties
                dst[ key ]= val
            },
            src
        )
    }

    /** clear out a participant view-model */
    const clear_part = R.partialRight(
        cp_react,
        [ EMPTY_PART ]
    )

    /** clear message list */
    const clear_msgs = function () {
        // work around Vue array reactivity constraints
        while ( app_state.msgs.length ) {
            app_state.msgs.shift()  // toss any & all
        }
    }

    /** add a message to show */
    const add_msg = function ( msg ) {
        app_state.msgs.push( msg )
    }

    add_msg( 'If something happened, I would tell you here' )
    clear_part( app_state.entry )
    clear_part( app_state.winner )

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

    // IIFE for results component
    ; ( function () {

        const template = `
<div id="results">
    <fieldset>
        <legend>Results</legend>
        <input type="button" value="Draw"
            v-on:click="run_raffle()"
        />
        <div></div>
        <label>Winner:</label>
        <span>{{ winner.fname }} {{ winner.lname }}</span>
    </fieldset>
</div>
        `

        /** define event handler functions */
        const get_event_handlers = function () {

            /** run the raffle, randomly select a winner */
            const run_raffle = function () {

                /**
                 * Expand an entrant's entry N times, based upon number of tickets.
                 * @param entrant - the raffle entrant record
                 */
                const expander = ( entrant ) => (
                    R.map(
                        ( ignore ) => ( entrant ),
                        R.range( 0, entrant.tickets )
                    )
                )

                /**
                 * Return a random integer between 0 to N-1
                 * @param limit - the N which the result must be less than
                 */
                const bounded_rand_whole = ( limit ) => (
                    Math.floor(
                        Math.random() * limit
                    )
                )

                clear_msgs()
                add_msg( 'Selecting raffle winner...' )
                clear_part( app_state.winner )

                /** basket of entries - N tickets per entrant */
                const basket = R.flatten(
                    R.map(
                        expander,
                        app_state.entrants
                    )
                )
                add_msg( 'Sifting through ' + basket.length + ' tickets...' )

                // pretend this takes time...
                setTimeout(
                    function () {
                        clear_msgs()
                        add_msg( 'We have a winner!' )
                        cp_react(
                            app_state.winner,
                            basket[
                                bounded_rand_whole( basket.length )
                            ]
                        )
                    },
                    3000
                )
            }

            return {
                run_raffle,
            }
        }

        /** generates and displays results of raffle */
        Vue.component(
            COMP.RES,
            {
                template,
                // no props - it's a singleton
                data: () => ( { winner: app_state.winner, } ),
                methods: get_event_handlers(),
            }
        )

    } )()

    // IIFE for participant entry component
    ; ( function () {

        const template = `
<div id="entry">
    <fieldset>
        <!-- using empty divs as spacers, as cannot assign size to br/ -->
        <legend>Participant Entry</legend>
        <label for="fname">First Name:</label>
        <input id="fname" width="20"
           v-model="entry.fname"
        >
        <div></div>
        <label for="lname">Last Name:</label>
        <input id="lname" width="20"
           v-model="entry.lname"
        >
        <div></div>
        <label for="tickets">Number of Tickets:</label>
        <select id="tickets"
            v-model="entry.tickets"
        >
            <option
                v-for="option in [ 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10 ]"
                v-bind:value="option"
            >
                {{ option }}
            </option>
        </select>
        <div
            v-if="entry.id"
        >
            <input type="button" value="Save"
                v-on:click="save()"
            />
            <input type="button" value="Delete" style="float: right"
                v-on:click="rm()"
            />
        </div>
    </fieldset>
</div>
        `

        /** define event handler functions */
        const get_event_handlers = function () {

            /** generate a function to match the ID of the currently selected row */
            const _id_matcher = function () {
                const comp = this  // OOP shim :-(
                return R.propEq( 'id', comp.entry.id )
            }

            /** save any edits in the currently selected row */
            const save = function () {
                const comp = this  // no to OOP!
                cp_react(
                    R.find(
                        comp._id_matcher(),
                        app_state.entrants
                    ),
                    comp.entry
                )
            }

            /** delete / remove the currently selected row */
            const rm = function () {
                const comp = this  // no to OOP!
                app_state.entrants.splice(
                    R.findIndex(
                        comp._id_matcher(),
                        app_state.entrants
                    ),
                    1
                )
                clear_part( app_state.entry )
            }

            return {
                _id_matcher,
                save,
                rm,
            }
        }
        /** edits participant entry */
        Vue.component(
            COMP.PART_EDIT,
            {
                template,
                // no props - it's a singleton
                data: () => ( { entry: app_state.entry, } ),
                methods: get_event_handlers(),
            }
        )

    } )()

    // IIFE for participant list component
    ; ( function () {

        const template = `
<div id="list">
    <fieldset>
        <legend>Participants</legend>
        <table>
            <thead>
                <tr>
                    <th>First Name</th>
                    <th>Last Name</th>
                    <th>Number of Tickets</th>
                </tr>
            </thead>
            <tbody>
                <!-- TODO: style="font-size: 1.25em; font-weight: bold;" on selected row -->
                <${ COMP.PART_LIST_ROW }
                    v-for="entrant in entrants"
                    v-bind:entrant="entrant"
                    v-bind:key="entrant.key"
                >
                </${ COMP.PART_LIST_ROW }>
            </tbody>
            <tfoot>
                <tr>
                    <th>
                        <input type="button" value="Add" />
                    </th>
                </tr>
            </tfoot>
        </table>
    </fieldset>
</div>
        `

        // IIFE for participant row component
        ; ( function () {

            const template = `
<tr
    v-on:click="sel_row()"
>
    <td>{{ entrant.fname }}</td>
    <td>{{ entrant.lname }}</td>
    <td>{{ entrant.tickets }}</td>
</tr>
            `

            /** define event handler functions */
            const get_event_handlers = function () {

                /** select this row for edit */
                const sel_row = function () {
                    const comp = this  // an object - party like it's 1967! (and quickly bind it to something less slippery)
                    cp_react( app_state.entry, comp.entrant )
                }

                return {
                    sel_row,
                }
            }

            /** shows participant row */
            Vue.component(
                COMP.PART_LIST_ROW,
                {
                    template,
                    props: [
                        'entrant',
                    ],
                    methods: get_event_handlers(),
                }
            )

        } )()

        /** lists participants */
        Vue.component(
            COMP.PART_LIST,
            {
                template,
                // no props - it's a singleton
                data: () => ( { entrants: app_state.entrants, } ),
            }
        )

    } )()

    // IIFE for page footer component
    ; ( function () {

        const template = `
<div id="ftr">
    <p>
        Copyright {{ meta.cr_yr }}, {{ meta.corp_alias }},
        void where prohibited by law...
    </p>
</div>
        `

        /** page footer */
        Vue.component(
            COMP.PG_FTR,
            {
                template,
                // no props - it's a singleton
                data: () => ( { meta: app_state.meta, } ),
            }
        )

    } )()

    // make sure components (above) are defined *before* you start the app

    new Vue( {

        /** element to which to bind Vue app */
        el: '#demo',

        /** view model data */
        data: {},  // empty object, as state will be in components

    } )

} )()


// vi: ts=4 sw=4 expandtab
// *** EOF ***
