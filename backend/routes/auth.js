async function auth (fastify, options) {
    fastify.get('/', async (request, reply) => {
        return { hello: 'world' }
    });
}

export default auth;