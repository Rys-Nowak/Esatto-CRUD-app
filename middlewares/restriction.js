import express from "express";

/**
 * Checks if the request is same-origin
 * @param {express.Request} req
 * @param {express.Response} res
 * @param {express.NextFunction} next
 */
export function restrict(req, res, next) {
    const origin = req.headers["sec-fetch-site"];
    if (origin === "same-origin") {
        next();
    } else {
        res.status(403).json({
            message: "Access denied",
        });
    }
};
