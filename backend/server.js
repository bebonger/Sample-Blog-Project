// server
import Fastify from 'fastify';
import fastifyCors from '@fastify/cors';
import fastifySession from '@fastify/session';
import fastifyCookie from '@fastify/cookie';
import fastifyFormbody from '@fastify/formbody';

import sequelizeInstance from './config/database.js';
import UserModel from './models/UserModel.js';
import PostModel from './models/PostModel.js';
import PostCommentModel from './models/PostCommentModel.js';

// routes
import auth from './routes/auth.js';
import me from './routes/me.js';
import posts from './routes/posts.js';

const fastify = Fastify({
  logger: true
});

fastify.register(fastifyFormbody);

// register session management
fastify.register(fastifyCookie);
fastify.register(fastifySession, { 
  secret: 'this world SHALL know PAIN. .. . SHINRA TENSEI!',
  saveUninitialized: true,
  cookie: {
    secure: false,
    httpOnly: true,
  }
})

fastify.addHook('preHandler', (request, reply, next) => {
  if (request.session.isAuthenticated == null) {
    request.session.isAuthenticated = false;
  } 
  next();
})

fastify.register(fastifyCors, {
  origin: 'http://127.0.0.1',
  credentials: true
})

// routes
fastify.register(auth, {prefix: "api/auth"});
fastify.register(me, {prefix: "api/me"});
fastify.register(posts, {prefix: "api/posts"});

// Model association
PostModel.belongsTo(UserModel);
PostModel.hasMany(PostCommentModel);
PostCommentModel.belongsTo(UserModel);
PostCommentModel.belongsTo(PostModel);
UserModel.hasMany(PostModel);
UserModel.hasMany(PostCommentModel);

(async () => {
  await sequelizeInstance.sync({ force: true });
  // Code here
})();

fastify.listen({ port: 3000 }, function (err, address) {
    if (err) { 
      fastify.log.error(err);
      process.exit(1);
    }
});