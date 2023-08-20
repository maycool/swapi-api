"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = void 0;
function errorHandler(err, req, res, next) {
    console.error('An error occurred:', err.message);
    res.status(500).json({ error: 'Internal server error' });
}
exports.errorHandler = errorHandler;
