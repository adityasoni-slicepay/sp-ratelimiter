# Rate Limiter

## Use
A rate limiter is implemented to limit repeated requests to public APIs and/or endpoints such as OTP generation. This helps us to avoid brute force attacks by limiting attacker request per time span.

## Pre-requisites & Dependencies used

1. [express-rate-limit](https://www.npmjs.com/package/express-rate-limit) & [rate-limit-redis](https://npmjs.com/package/rate-limit-redis) npm packages.
2. We have implemented a [Redis](https://redis.io/) based key-value store for our rate limiting functionality. So there **must** be a redis server instance running in the background at default `PORT=6379`.

## **Install**
```bash
npm i sp-ratelimiter --save
```

## How to use

The rate limiter can be utilized in two ways.

1. Reusing predefined limiters for more generic cases like OTP, Transaction etc.
2. Creating New rate limiters for more dynamic cases which don't or cannot fall under the predefinded cases.


### **Using Predefined Limiters**

You can use the predefined limiters by directly es6 destructuring the predefined limiter from `sp-ratelimiter`.
For example :

```javascript
const { otpLimiter } = require("sp-ratelimiter");
```

or

```javascript
const rateLimiter = require("sp-ratelimiter");
const otpLimiter = rateLimiter.otpLimiter;
```

and use it in a route like :

```javascript
router.post("/otp/request", [otpLimiter], function(req, res) {
    // your code here
}
```

### List of available Predefined Limiters
1. `otpLimiter`
2. `transactionLimiter`

### **Creating New Limiters**

You can also create a new limiter as per a use case using the `createNewRateLimiter` fuction from `sp-ratelimiter` module. <br /><br />
First, import the `createNewRateLimiter` from sp-ratelimiter module.

```javascript
const { createNewRateLimiter } = require("sp-ratelimiter");
```

Then, define a new limiter globally or inline

```javascript
const FileUploadLimiter = createNewRateLimiter(6000, 5, "Limit Exeeded!");
```

Finally, use it in the route 
```javascript
router.post("/fle/upload", [FileUploadLimiter], function(req, res) {
    // your code here
}
```
or you can directly create one in the route
```javascript
router.post("/fle/upload", createNewRateLimiter(6000, 5, "Limit Exeeded!"), function(req, res) {
    // your code here
}
```

## The **createNewRateLimiter** function

The `createNewRateLimiter` function takes in configuration options like `windowMs`, `max`, `message` and `keyGenerator` 


### Configuration Options

### **max**

Max number of connections during `windowMs` milliseconds before sending a 429 response.

### **windowMs**

How long in milliseconds to keep records of requests in memory.

### **message**

Error message sent to user when max is exceeded. Accepts String and JSON object.

### **keyGenerator**

Function used to generate keys.
Currently we are using the device id to generate keys.


## Latency Report

### With Limiter

```
Connection rate: 10.1 conn/s (99.4 ms/conn, <=1 concurrent connections)
Connection time [ms]: min 41.0 avg 41.7 max 45.6 median 41.5 stddev 0.9
Connection time [ms]: connect 0.0
Connection length [replies/conn]: 1.000

Request rate: 10.1 req/s (99.4 ms/req)
Request size [B]: 544.0

Reply rate [replies/s]: min 10.0 avg 10.0 max 10.0 stddev 0.0 (1 samples)
Reply time [ms]: response 41.7 transfer 0.0
Reply size [B]: header 349.0 content 77.0 footer 0.0 (total 426.0)
Reply status: 1xx=0 2xx=3 3xx=0 4xx=97 5xx=0

CPU time [s]: user 4.48 system 5.46 (user 45.1% system 54.9% total 100.0%)
Net I/O: 9.5 KB/s (0.1*10^6 bps)

Errors: total 0 client-timo 0 socket-timo 0 connrefused 0 connreset 0
Errors: fd-unavail 0 addrunavail 0 ftab-full 0 other 0
```

### Without Limiter

```
Total: connections 100 requests 100 replies 100 test-duration 9.902 s

Connection rate: 10.1 conn/s (99.0 ms/conn, <=1 concurrent connections)
Connection time [ms]: min 1.1 avg 1.8 max 47.3 median 1.5 stddev 4.6
Connection time [ms]: connect 0.0
Connection length [replies/conn]: 1.000

Request rate: 10.1 req/s (99.0 ms/req)
Request size [B]: 544.0

Reply rate [replies/s]: min 10.0 avg 10.0 max 10.0 stddev 0.0 (1 samples)
Reply time [ms]: response 1.8 transfer 0.0
Reply size [B]: header 239.0 content 16.0 footer 0.0 (total 255.0)
Reply status: 1xx=0 2xx=100 3xx=0 4xx=0 5xx=0

CPU time [s]: user 4.72 system 5.18 (user 47.7% system 52.3% total 100.0%)
Net I/O: 7.9 KB/s (0.1*10^6 bps)

Errors: total 0 client-timo 0 socket-timo 0 connrefused 0 connreset 0
Errors: fd-unavail 0 addrunavail 0 ftab-full 0 other 0
```

## Notes
1. If the connection to redis is not established/ended the package will automatically skip limiting for future requests.
2. If the connection to redis is established again during the runtime, package will automatically start limiting requests again.

## Author

This was originally created by [Aditya Soni](https://www.slicepay.in).
