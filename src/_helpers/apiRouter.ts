import express from 'express';
import { body, validationResult } from 'express-validator';
import { Logs } from '../_globals/logs';
import { version } from './version';
import { connection } from './db';
import { User } from '../entity/User';

export var apiRouter = express.Router();
apiRouter.use(express.json());
apiRouter.use(express.urlencoded({ extended: false }));

/**
 * GET /users
 * @description Get users list.
 * @response 200 - List of user objects.
 * @responseContent {User} 200.application/json
 * @tag users
 */
apiRouter.get('/users', function(req, res) {
    let userRepository = connection.getRepository(User);
    userRepository.find().then((users: User[]) => {
        users.forEach((u) => { delete u["password"] });
        res.json({
            users: users
        });
    });
});

/**
 * POST /users
 * @description Create a new user.
 * @response 200 - Add user response.
 * @responseContent {UserAdd} 200.application/json
 * @bodyContent {UserAddRequest} application/x-www-form-urlencoded
 * @bodyContent {UserAddRequest} application/json
 * @bodyRequired
 * @tag users
 */
apiRouter.post('/users',
    body('username').isLength({ min: 5 }),
    body('password').isLength({ min: 5 }),
function(req, res) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    
    let user = new User();
    user.username = req.body.username;
    if(req.body.name) user.name = req.body.name;
    user.password = req.body.password;

    let userRepository = connection.getRepository(User);
    userRepository.save(user).then((user: User) => {
        delete user["password"];
        res.json({
            status: "ok",
            user: user
        });
    });
});

/**
 * GET /version
 * @description Get server version.
 * @response 200 - Version object.
 * @responseContent {Version} 200.application/json
 */
apiRouter.get('/version', function(req, res) {
    res.send({
        version: version
    });
});

/**
 * GET /logs
 * @description Get a list of logs.
 * @response 200 - Logs object.
 * @responseContent {Logs} 200.application/json
 */
apiRouter.get('/logs', function(req, res) {
    res.json({
        logs: Logs
    });
});

/**
 * GET /ping
 * @description Reply with "pong".
 * @response 200 - pong.
 * @responseContent {Pong} 200.text/plain
 */
apiRouter.get('/ping', function(req, res) {
    res.type('text/plain');
    res.send('pong');
});