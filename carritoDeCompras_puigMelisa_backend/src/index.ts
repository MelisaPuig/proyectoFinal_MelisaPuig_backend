import cluster from 'cluster';
import express from 'express';
import { engine } from 'express-handlebars';
import http from 'http';
import os from 'os';
import path from 'path';

import CONFIG from '~/config';
import mongo from './model/db/mongoose';
import chat from './websocket';
import routerCarts from './routes/cart';
import routerOrders from './routes/orders';
import routerProducts from './routes/products';
import routerSessions from './routes/sessions';
import routerUsers from './routes/users';
import viewsRouter from './routes/views';

const { MONGO_URL, RUN_AS_CLUSTER } = CONFIG;
const PUBLIC_PATH = path.join(__dirname, '..', 'public');

const app = express();
const server = http.createServer(app);
chat.listen(server);

/**
 * Views config.
 */
const HBS_VIEWS_PATH = path.join(__dirname, 'views/hbs');
const HBS_LAYOUTS_PATH = path.join(HBS_VIEWS_PATH, 'layouts');
const hbsEngine = engine({
  extname: '.hbs',
  layoutsDir: HBS_LAYOUTS_PATH,
  partialsDir: HBS_LAYOUTS_PATH,
});
app.set(`view engine`, 'hbs');
app.engine(`hbs`, hbsEngine);
app.set(`views`, HBS_VIEWS_PATH);

// /**
//  * RUTEOS.
//  */

/**
 * Routes config.
 */
app.use('/public', express.static(PUBLIC_PATH));
app.use(routerSessions);
app.use('/api/users', routerUsers);
app.use('/api/products', routerProducts);
app.use('/api/carts', routerCarts);
app.use('/api/orders', routerOrders);
app.use(viewsRouter);
app.use((err: Error, _req: unknown, _res: unknown, _next: unknown) => {
  console.error(err);
});

/**
 * SERVER STARTING.
 */
async function startServerClustered() {
  if (cluster.isMaster) {
    const numWorkers = os.cpus().length;
    for (let i = 0; i < numWorkers; i++) {
      cluster.fork({ silent: true });
    }
    cluster.on('online', (worker) => console.log(`Worker ${worker.process.pid} iniciado.`));
    cluster.on('exit', (worker, code, _signal) => {
      const { pid } = worker.process;
      console.log(`Worker ${pid} ended with code ${code}.`);
    });
    return;
  }
  startServerForked();
}

async function startServerForked() {
  try {
    await mongo.connect(MONGO_URL);
    const { pid } = process;
    const listeningServer = server.listen(CONFIG.PORT, () => {
      console.log(`Servidor proceso ${pid} escuchando en el puerto ${CONFIG.PORT}`);
    });
    listeningServer.on(`error`, (error) => console.log(`Este es el error ${error}`));
  } catch (error) {
    throw error;
  }
}

if (RUN_AS_CLUSTER) {
  startServerClustered();
} else {
  startServerForked();
}
