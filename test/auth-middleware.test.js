import "./request-mock";
import authMiddleware from "../src/index";
import request from "request";

describe("authMiddleware", () => {
    
    beforeEach(() => {
        jest.resetModules();
    });

    it("should return 401 Unauthorized response if Authorization: Bearer header is not present", () => {
        const auth = authMiddleware();
        const req = {
            get: () => undefined
        };
        const res = {
            status: jest.fn(function() { return this; }),
            end: jest.fn()
        };

        auth(req, res);

        expect(res.status).toBeCalledWith(401);
        expect(res.end).toBeCalled();
    });

    it("should return 401 Unauthorized response if Authorization: Bearer header is not valid", () => {
        const auth = authMiddleware();
        const req = {
            get: () => "Invalid Bearer Header"
        };
        const res = {
            status: jest.fn(function() { return this; }),
            end: jest.fn()
        };

        auth(req, res);

        expect(res.status).toBeCalledWith(401);
        expect(res.end).toBeCalled();
    });

    it("should return 401 Unauthorized response if token verification fails", () => {
        const auth = authMiddleware();
        const req = {
            get: () => "Bearer MYTOKENHERE"
        };
        const res = {
            status: jest.fn(function() { return this; }),
            end: jest.fn()
        };
        request.mockImplementation(function(options, callback) {
            expect(options).toEqual({
                uri: "https://auth.tribeca.ovh/token/verify",
                headers: {
                    "Content-Type": "application/json"
                },
                method: "POST",
                body: JSON.stringify({ token: "MYTOKENHERE" })    
            });

            callback(null, { statusCode: 400 }, {});
        });

        auth(req, res);

        expect(res.status).toBeCalledWith(401);
        expect(res.end).toBeCalled();
    });
    
    it("should set req.user with verification response and call next if token is valid", () => {
        const auth = authMiddleware();
        const req = {
            get: () => "Bearer MYTOKENHERE"
        };
        const res = {
            status: jest.fn(function() { return this; }),
            end: jest.fn()
        };
        request.mockImplementation(function(options, callback) {
            expect(options).toEqual({
                uri: "https://auth.tribeca.ovh/token/verify",
                headers: {
                    "Content-Type": "application/json"
                },
                method: "POST",
                body: JSON.stringify({ token: "MYTOKENHERE" })    
            });

            callback(null, { statusCode: 200 }, "{ \"user\": \"Francesco\" }");
        });
        const next = jest.fn();

        auth(req, res, next);

        expect(next).toBeCalled();
        expect(req.user).toEqual({ user: "Francesco" });
    });

    it("should call next if unless is specified and matches original url", () => {
        const auth = authMiddleware().unless({ path: ["/public/favicon.ico"] });
        const req = {
            originalUrl: "/public/favicon.ico"
        };
        const res = {};
        const next = jest.fn();

        auth(req, res, next);

        expect(next).toBeCalled();
        expect(req.user).toBeUndefined();
    });
});
