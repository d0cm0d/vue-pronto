const test = require("ava");
const Utils = require("../../lib/utils");
const LRU = require("lru-cache")

const lruCache = LRU({
    max: 500,
    maxAge: 1000 * 60 * 60,
});

test.cb("Layout Default", t => {
    const context = {
        head: "",
        css: "",
        script: "",
    };
    const layout = Utils.BuildLayout(context, lruCache);
    const expected = {
        start: '<!DOCTYPE html><html><head><style></style></head><body><div id="app">',
        end: `</div><script>(function(){"use strict";var createApp=function(){return new Vue({})};"undefined"!=typeof module&&module.exports?module.exports=createApp:this.app=createApp()}).call(this),app.$mount("#app");</script></body></html>`,
    };
    t.deepEqual(layout, expected);
    t.end();
});

test.cb("Layout With Stuff", t => {
    const context = {
        head: "",
        css: "",
        script: "",
        template: {
            html: {
                start: '<!DOCTYPE html lang="en"><html>',
            },
            body: {
                start: '<body id="foo">',
            },
        },
    };
    const layout = Utils.BuildLayout(context, lruCache);
    const expected = {
        start: '<!DOCTYPE html lang="en"><html><head><style></style></head><body id="foo"><div id="app">',
        end: `</div><script>(function(){"use strict";var createApp=function(){return new Vue({})};"undefined"!=typeof module&&module.exports?module.exports=createApp:this.app=createApp()}).call(this),app.$mount("#app");</script></body></html>`,
    };
    t.deepEqual(layout, expected);
    t.end();
});

test.cb("Layout With Javascript error", t => {
    const context = {
        head: "",
        css: "",
        script: "const foo = true",
        template: {
            html: {
                start: '<!DOCTYPE html lang="en"><html>',
            },
            body: {
                start: '<body id="foo">',
            },
        },
    };
    const layout = t.throws(() => {
        Utils.BuildLayout(context, lruCache);
    });

    t.is(layout.message, "Unexpected token: keyword (const)");
    t.end();
});
