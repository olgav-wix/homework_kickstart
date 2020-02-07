// https://github.com/wix-platform/wix-node-platform/tree/master/bootstrap/wix-bootstrap-testkit
const testkit = require('@wix/wix-bootstrap-testkit');
const petriTestkit = require('@wix/wix-petri-testkit');
const httpTestkit = require('@wix/wix-http-testkit');
import getPort from 'get-port';

module.exports.bootstrapPetriServer = () => {
  return petriTestkit.server();
};

module.exports.bootstrapHttpServer = async () => {
  return httpTestkit.server({ port: await getPort({ port: 3000 }) });
};

// https://github.com/wix-platform/wix-node-platform/tree/master/config/wix-config-emitter
const configEmitter = require('@wix/wix-config-emitter');
function replaceRedisHost(data, configEntry) {
  const contents = JSON.parse(data);
  if (configEntry.src.indexOf('kickstart-zero-to-prod-olga.json.erb') !== -1) {
    contents.redisHost = 'http://localhost:3000';
  }

  return JSON.stringify(contents);
}

// take erb configurations from source folder, replace values/functions,
// remove the ".erb" extension and emit files inside the target folder
module.exports.emitConfigs = () => {
  return configEmitter()
    .val('node', { node_environment: false })
    .val('scripts_domain', 'static.parastorage.com')
    .emit(replaceRedisHost);
};

// start the server as an embedded app
module.exports.bootstrapServer = () => {
  return testkit.app('./index', {
    env: process.env,
  });
};
