// server
import Fastify from 'fastify';
import fastifySecureSession from '@fastify/secure-session'
import fastifyPassport from './config/passport.js';

import sequelizeInstance from './config/database.js';
import UserModel from './models/UserModel.js';

// routes
import auth from './routes/auth.js';

const fastify = Fastify({
  logger: true
});

// routes
fastify.register(auth, {prefix: "api/auth"});

// register session management
fastify.register(fastifySecureSession, { secret: 'SHINRA TENsei .. . . this WORLD shall know PAIN...' })
fastify.register(fastifyPassport.initialize());
fastify.register(fastifyPassport.secureSession(), {
  cookie: {
    maxAge: 86400
  }
});

fastify.listen({ port: 3000 }, function (err, address) {
    if (err) {
      fastify.log.error(err);
      process.exit(1);
    }
});