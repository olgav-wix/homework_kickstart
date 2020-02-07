const {
  emitConfigs,
  bootstrapServer,
  bootstrapPetriServer,
  bootstrapHttpServer,
} = require('./environment');

// The purpose of this file is to start your server and possibly additional servers
// like RPC/Petri servers.
//
// Because tests are running in parallel, it should start a different server on a different port
// for every test file (E2E and server tests).
//
// By attaching the server object (testkit result) on `globalObject` it will be available to every
// test file globally by that name.
module.exports = {
  bootstrap: {
    setup: async ({ globalObject }) => {
      globalObject.petri = bootstrapPetriServer(); // 2. set globalObject.petri
      globalObject.httpTestkit = await bootstrapHttpServer();
      await emitConfigs();

      globalObject.app = bootstrapServer();
      await globalObject.petri.start();
      await globalObject.httpTestkit.doStart();
      await globalObject.app.start();
    },
    teardown: async ({ globalObject }) => {
      await globalObject.app.stop();
      await globalObject.petri.stop();
      await globalObject.httpTestkit.doStop();
    },
  },
  puppeteer: {
    // launch options: https://github.com/GoogleChrome/puppeteer/blob/master/docs/api.md#puppeteerlaunchoptions
    // debugging tips: https://github.com/GoogleChrome/puppeteer#debugging-tips
    devtools: false,
  },
};
