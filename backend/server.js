// server
import Fastify from 'fastify';
import sequelizeInstance from './database.js';
import UserModel from './models/UserModel.js';

// routes
import auth from './routes/auth.js';

const fastify = Fastify({
  logger: true
});

fastify.register(auth, {prefix: "api/auth"});

fastify.listen({ port: 3000 }, function (err, address) {
    if (err) {
      fastify.log.error(err);
      process.exit(1);
    }
});