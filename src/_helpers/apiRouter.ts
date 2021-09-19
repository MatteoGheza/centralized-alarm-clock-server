import express from 'express';
import { body, validationResult } from 'express-validator';
import { Logs } from '../_globals/logs';
import { version } from './version';
import { connection } from './db';
import { User } from '../entity/User';
import { addUser, authenticate, validateAccessToken } from '../_helpers/auth';
import { AddUserSettings } from '../_models/AddUserSettings';

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
 * @response 400 - Api request malformed.
 * @responseContent {ValidationError} 400.application/json
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
    
    let user_settings: AddUserSettings = {
        username: req.body.username,
        name: req.body.name,
        password: req.body.password,
        isHidden: req.body.isHidden
    };
    
    addUser(user_settings).then((user) => {
        delete user["password"];
        res.json({
            status: "ok",
            user: user
        });
    });
});

/**
 * POST /login
 * @description Create a new user.
 * @response 400 - Api request malformed.
 * @responseContent {ValidationError} 400.application/json
 * @response 401 - Auth error.
 * @responseContent {AuthErrorResponse} 401.application/json
 * @response 200 - Add user response.
 * @responseContent {AuthResponse} 200.application/json
 * @bodyContent {LoginRequest} application/x-www-form-urlencoded
 * @bodyContent {LoginRequest} application/json
 * @bodyRequired
 */
apiRouter.post('/login',
    body('username').isLength({ min: 5 }),
    body('password').isLength({ min: 5 }),
function(req, res) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    
    authenticate(req.body.username, req.body.password).then((response) => {
        delete response.user["password"];
        res.json({
            access_token: response.access_token,
            user: response.user
        });
    }).catch((err) => {
        res.status(401).json({
            status: 'error',
            message: err.message
        });
    });
});

/**
 * POST /validate_token
 * @description Validate JWT Access Token.
 * @response 400 - Api request malformed.
 * @response 401 - Auth error.
 * @response 200 - Add user response.
 * @responseContent {ValidationError} 400.application/json
 */
apiRouter.post('/validate_token', body('access_token').isLength({ min: 5 }), function(req, res) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    validateAccessToken(req.body.access_token).then((response) => {
        res.json({
            status: "ok",
            user: response
        });
    }).catch((err) => {
        res.status(401).json({
            status: 'error',
            message: err.message
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