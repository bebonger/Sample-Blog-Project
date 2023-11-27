import { Authenticator } from '@fastify/passport'
import LocalStrategy from 'passport-local';
import UserModel from './models/UserModel.js';

const fastifyPassport = new Authenticator();

fastifyPassport.registerUserSerializer(async (user, request) => user.id);
fastifyPassport.registerUserDeserializer(async (id, request) => {
    return await UserModel.findOne({ where: { id: id } });
});

fastifyPassport.use(new LocalStrategy({
    usernameField: 'username',
    passwordField: 'password',
    passReqToCallback: true
}, async (req, username, password, done) => {
    console.log("authenticating");
    const user = await UserModel.findOne({ where: {
        username: username,
        password: password
    }});

    if (!user) { console.log("user not found"); return done(null, false, {message: "Incorrect username or password."}) };
    console.log(user); 
    return done(null, user); 
}));

export default fastifyPassport;