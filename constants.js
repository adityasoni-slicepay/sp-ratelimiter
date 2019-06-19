var RedisStore = require("rate-limit-redis");
var redis = require("redis").createClient();

var skip_flag = false;

const DEFAULT_WINDOW_MS = 6000;
const DEFAULT_MAX_TRIES = 3;
const DEFAULT_MESSAGE = {
    // message to send when failed
    status: "false",
    error: { message: "Too many request! Please wait 5-10 min" }
};
const DEFAULT_STORE = new RedisStore({
    // Please dont change this
    client: redis,
    prefix: "rateLimiter:"
});

const DEFAULT_KEY_GENERATOR = _keyGen;

const RATE_LIMITER_DEFAULT_OPTIONS = {
    windowMs: DEFAULT_WINDOW_MS, //6000 milliseconds
    max: DEFAULT_MAX_TRIES, //max request in windowMs
    message: DEFAULT_MESSAGE,
    store: DEFAULT_STORE,
    keyGenerator: DEFAULT_KEY_GENERATOR, // please dont change this
    skip : _skipRequest
};


/**
 * This function is used to generate key for storing the request count in Redis.
 * @param {Object} req Request object
 */
function _keyGen(req) {
    if (req.headers.hasOwnProperty("sp-device-id") || req.headers.hasOwnProperty("deviceId"))
        return req.headers["sp-device-id"] ? req.headers["sp-device-id"] : req.headers["deviceId"];
    else if (req.headers.hasOwnProperty("browser-id")) {
        return req.headers["browser-id"];
    }
}
function _skipRequest(){
    return skip_flag
};


module.exports =  RATE_LIMITER_DEFAULT_OPTIONS ;



//####################### REDIS EVENT LISTENER ####################//


redis.on("end", function () {
    console.log("Connection to Redis Server Ended. Skipping limiter for requests.")
    skip_flag = true;
});


redis.on("connect",function(){
    console.log("Connection to Redis Server Established. Applying limiter for requests.")
    skip_flag = false;
});


