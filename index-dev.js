const {
  bootstrapServer,
  bootstrapPetriServer,
  bootstrapHttpServer,
  emitConfigs,
} = require('./environment');

(async () => {
  const app = bootstrapServer();
  const petri = bootstrapPetriServer();
  const httpTestkit = bootstrapHttpServer();

  // mock the response of the petri-server
  // to onConductAllInScope call
  petri.onConductAllInScope(() => ({
    'specs.productstoreori.IsNewButtonEnabled': 'true',
  }));

  await httpTestkit.doStart();
  await petri.start();
  await emitConfigs();
  await app.start();
})();
