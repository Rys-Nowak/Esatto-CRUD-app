import express from "express";

/**
 * @param {string} allowedOrigin
 * @returns Express middleware that checks if the request is coming from the allowed origin
 */
export function privatizeEndpoint(allowedOrigin) {
    /**
     * Checks if the request is coming from the allowed origin
     * @param {express.Request} req
     * @param {express.Response} res
     * @param {express.NextFunction} next
     */
    return function (req, res, next) {
        const origin = req.headers.origin?.replace("localhost", "127.0.0.1");
        if (origin === allowedOrigin) {
            next();
        } else {
            res.status(403).json({
                message: "This is a private Endpoint, access denied",
            });
        }
    };
}
