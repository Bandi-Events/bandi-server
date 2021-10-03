process.env['NODE_CONFIG_DIR'] = __dirname + '/configs';

import http from 'http';
import 'dotenv/config';

import App from '@/app';
import AuthRoute from '@routes/auth.route';
import IndexRoute from '@routes/index.route';
import UsersRoute from '@routes/users.route';
import TransactionsRoute from '@routes/transactions.route';
import BalancesRoute from '@routes/balances.route';
import validateEnv from '@utils/validateEnv';

const app = new App([new AuthRoute(), new IndexRoute(), new UsersRoute(), new TransactionsRoute(), new BalancesRoute()]);
const server = http.createServer(app.getServer());
const io = require('socket.io')(server);

io.on('connection', socket => {
  socket.on('disconnect', () => {
    console.log('socket closed');
  });
});

validateEnv();

server.listen(3000);
