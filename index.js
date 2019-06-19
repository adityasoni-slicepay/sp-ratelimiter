/** Please read the Markup Document before changing or implementing anything.  */

var RateLimit = require("express-rate-limit");
const RATE_LIMITER_DEFAULT_OPTIONS = require("./constants") ;


/**
 * Use this to create a new rate limiter
 * @param {number} [windowMs] This specifies the time window for
 * @param {number} [max] max number of attempts for
 * @param {String | JSON} [message]
 * @returns {Function}
 */
function createNewRateLimiter(windowMs, max, message, keyGenerator) {
    let newOptions = RATE_LIMITER_DEFAULT_OPTIONS;
    if (windowMs) {
        newOptions.windowMs = windowMs;
    }
    if (max) {
        newOptions.max = max;
    }
    if (message) {
        newOptions.message = message;
    }
    if (keyGenerator) {
        newOptions.keyGenerator = keyGenerator;
    }
    return RateLimit(newOptions);
}

// ################### SPECIFIC RATE LIMITERS ###################### //

//** Rate Limiter For All the OTP Rotues. */
const otpLimiter = createNewRateLimiter(6000, 3);

//** Rate Limiter For All the Transaction Rotues. */
const transactionLimiter = createNewRateLimiter(60000, 10);

module.exports = { createNewRateLimiter, otpLimiter, transactionLimiter };
