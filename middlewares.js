
export const logTheRequest = (req, res, next) => {
    // log the IP adress, the method, the URL and the time
    console.log(`Request IP: ${req.ip} | Request Method: ${req.method} | Request URL: ${req.url} | Request Time: ${new Date()}`);
    next();
}