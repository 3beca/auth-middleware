import request from "request";
import unless from "express-unless";

function authMiddleware(uri = "https://auth.tribeca.ovh/token/verify") {
    const handleRequest = function handleRequest(req, res, next) {
        const authorizationHeader = req.get("Authorization");
        if (!authorizationHeader) {
            res.status(401).end();
            return;
        }

        const [bearer, token ] = authorizationHeader.trim().split(" ");
        if (!bearer || bearer !== "Bearer") {
            res.status(401).end();
            return;
        }

        request({
            uri,
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ token })
        }, function onResponse(err, response, body) {
            if (!response || response.statusCode !== 200) {
                res.status(401).end();
                return;
            }
            req.user = JSON.parse(body);
            next();
        });
    };
    handleRequest.unless = unless;
    return handleRequest;
}
export default authMiddleware;
