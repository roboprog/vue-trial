# vue-trial

Demonstration of using progressive enhancement with Vue.js
to turn an HTML page mockup into an app, with minimal tools.

This was based upon an earlier such project using AngularJS
(https://github.com/roboprog/ang-prog-enh)

The demonstration resolves around being done in several phases.
Each phase is simulated by having a branch in the repository,
with the files as they would appear within that branch.


## Branches

Note that there is no "view" branch, as the mockup ("view") was simply coped
from the earlier AngularJS based project.

* *model*: defines the view-model to be watched by Vue

* *comp*: defines components which make up the application page

* *events*: adds event handlers to make the page actually do something.

TODO: Ajax/HTTP I/O; routing.

## Getting Started

* Select the branch corresponding to the project phase you wish to see.

* Check out that branch.

* start server.sh in the project directory.

* load localhost:9000 in your browser.

## Why Vue.js?

I liked (for the most part) Angular 1, or as it has been ret-conned, AngularJS.
I don't like Angular 2+.

Vue.js is like Angular[JS], The Good Parts.
It does not require any preprocessing to create a script
to implement a single page app - at least not in version 2.
It runs about as fast as React.
Angular's ugly dependency injection framework is gone.

Also, while I started this demo in mid 2019 while version 2 was current,
Vue.js version 3 is now out.
V 3 has better support for using FP instead of OOP
in your controller logic,
as it doesn't force you to use "this" to get at your view-model properties
within the event handler functions of your controllers.
On the flip side,
version 3 uses a tool chain which is NOT Internet Explorer compatible,
if that matters to you,
as well as pushing you towards additional packaging/preprocessing overhead.

