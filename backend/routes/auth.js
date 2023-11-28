import UserModel from '../models/UserModel.js';
import fastifyPassport from '../config/passport.js';
import STATUS_TYPES from '../helpers/DataTypes.js';

async function auth (fastify, options) {
    fastify.get('/', async (request, reply) => {
        return { hello: 'world' }
    });

    fastify.post('/register', {
        schema: {
            body: {
                username: { type: 'string' },
                displayName: { type: 'string'},
                password: { type: 'string' },
            }
        },
    }, async (req, res) => {
        let user = await UserModel.findOne({ where: { username: req.body.username } })
        if (!user) {
            user = UserModel.build({ 
                    username: req.body.username, 
                    displayName: req.body.displayName,
                    password: req.body.password,
                });
            await user.save();
            console.log(`new user ${req.body.username} was created!`);
            await res.send({ status: STATUS_TYPES.SUCCESS, message: `User created successfully.` });
        } else {
            console.log(`user ${req.body.username} already exists`);
            await res.send({ status: STATUS_TYPES.FAILURE, message: `user ${req.body.username} already exists` });
        }
    })

    fastify.post('/login', {
        preValidation: fastifyPassport.authenticate('local', function(req, res, info) {
            console.log(info);
            if (!user) {
                console.log("bruh");
                return res.send({ success : STATUS_TYPES.FAILURE, message : 'Wrong username or password' });
            }
        })
    }, async (req, res) => {
        await res.send({ status: STATUS_TYPES.SUCCESS, message: `Login successful` })
    });
}

export default auth;