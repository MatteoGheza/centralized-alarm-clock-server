import express from 'express';
import { Logs } from '../_globals/logs';
import { version } from './version';

export var apiRouter = express.Router();

/**
 * GET /version
 * @description Get server version.
 * @response {Version} 200 - Version object.
 */
apiRouter.get('/version', function(req, res) {
    res.send({
        version: version
    });
});

/**
 * GET /logs
 * @description Get a list of logs.
 * @response {Logs} 200 - Logs object.
 */
apiRouter.get('/logs', function(req, res) {
    res.json({
        logs: Logs
    });
});

/**
 * GET /ping
 * @description Reply with "pong".
 * @response {Ping} 200 - pong.
 */
apiRouter.get('/ping', function(req, res) {
    res.send('pong');
});