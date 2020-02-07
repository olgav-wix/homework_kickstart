import { Router, Request, Response, json, NextFunction } from 'express';
import { hot } from 'bootstrap-hot-loader';
import wixExpressCsrf from '@wix/wix-express-csrf';
import wixExpressRequireHttps from '@wix/wix-express-require-https';
import LRU from 'lru-cache';
import { symbolSearch, globalQuote } from './services';
import axios from 'axios';

const experimentName = 'specs.kickstart.Ovirchen';

const options = { max: 500, maxAge: 1000 * 60 * 10 };
export const cache = new LRU(options);

// This function is the main entry for our server. It accepts an express Router
// (see http://expressjs.com) and attaches routes and middlewares to it.
//
// `context` is an object with built-in services from `wix-bootstrap-ng`. See
// https://github.com/wix-platform/wix-node-platform/tree/master/bootstrap/wix-bootstrap-ng).
export default hot(module, (app: Router, context) => {
  // We load the already parsed ERB configuration (located at /templates folder).
  const config = context.config.load('kickstart-zero-to-prod-olga');

  // Attach CSRF protection middleware. See
  // https://github.com/wix-platform/wix-node-platform/tree/master/express/wix-express-csrf.
  app.use(wixExpressCsrf());

  // Require HTTPS by redirecting to HTTPS from HTTP. Only active in a production environment.
  // See https://github.com/wix-platform/wix-node-platform/tree/master/express/wix-express-require-https.
  app.use(wixExpressRequireHttps);

  // Attach a rendering middleware, it adds the `renderView` method to every request.
  // See https://github.com/wix-private/fed-infra/tree/master/wix-bootstrap-renderer.
  app.use(context.renderer.middleware());

  // Define a route to render our initial HTML.
  app.get('/', (req, res) => {
    // Extract some data from every incoming request.
    const renderModel = getRenderModel(req);

    // Send a response back to the client.
    res.renderView('./index.ejs', renderModel);
  });

  app.get(
    '/api/v1/prices',
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        const query = req.query; //  query: { company: 'WIX' }

        if (!query.company) {
          return res.status(400).send('Please enter the company');
        }
        const result: { name?: string; price?: string } = {};
        const dataFirst = await symbolSearch(query.company);

        if (!dataFirst.bestMatches || !dataFirst.bestMatches[0]) {
          return res.status(400).send('Such company not found');
        }
        const symbol = dataFirst.bestMatches[0]['1. symbol'];
        result.name = dataFirst.bestMatches[0]['2. name'];

        if (cache.get(symbol)) {
          console.log('cache');
          return res.status(200).json(cache.get(symbol));
        }
        const dataSecond = await globalQuote(symbol);
        result.price = dataSecond['Global Quote']['05. price'];
        console.log(result);
        cache.set(symbol, result);
        return res.status(200).json(result);
      } catch (error) {
        console.error(error);
        res.status(500).send('The server cannot handle the request');
      }
    },
  );

  app.get('/greeting', async (req: Request, res: Response) => {
    try {
      const petriResponse = await context.petri
        .client(req.aspects)
        .conductExperiment('specs.kickstart.Ovirchen', 'false');
      if (petriResponse === 'false') {
        return res.status(200).json({ message: 'Hello, world!' });
      }
      return res.status(200).send({ message: 'Hey, you!' });
    } catch (error) {
      console.error(error);
      res.status(500).send('The server cannot handle the request');
    }
  });

  app.get('/user', async (req: Request, res: Response) => {
    try {
      const petriResponse = await context.petri
        .client(req.aspects)
        .conductExperiment('specs.kickstart.OvirchenTest', 'false');
      const id = petriResponse === 'false' ? 1 : 2;
      const result = await axios.get(`${config.redisHost}/users/${id}`);
      return res.status(200).send(result.data);
    } catch (error) {
      console.error(error);
      res.status(500).send('The server cannot handle the request');
    }
  });

  function getRenderModel(req: Request) {
    const { language, basename, debug } = req.aspects['web-context'];

    return {
      language,
      basename,
      debug: debug || process.env.NODE_ENV === 'development',
      title: 'Wix Full Stack Project Boilerplate',
      staticsDomain: config.clientTopology.staticsDomain,
    };
  }

  return app;
});
