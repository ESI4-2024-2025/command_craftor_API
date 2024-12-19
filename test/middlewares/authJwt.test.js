const jwt = require("jsonwebtoken");
const authJwt = require("../../middlewares/authJwt");

describe("authJwt middleware", () => {
    let originalConsoleLog;

    beforeAll(() => {
        // Save the original console.log function
        originalConsoleLog = console.log;
        // Mock console.log to suppress logs during tests
        console.log = jest.fn();
    });

    afterAll(() => {
        // Restore the original console.log function
        console.log = originalConsoleLog;
    });

    describe("verifyToken", () => {
        let req, res, next;

        beforeEach(() => {
            req = {
                headers: {}
            };
            res = {
                status: jest.fn().mockReturnThis(),
                send: jest.fn(),
                sendStatus: jest.fn().mockReturnThis()
            };
            next = jest.fn();
        });

        it("should return 403 if no token is provided", () => {
            authJwt.verifyToken(req, res, next);
            expect(res.status).toHaveBeenCalledWith(403);
            expect(res.send).toHaveBeenCalledWith({ message: "No token provided!" });
        });

        it("should return 401 if token is expired", () => {
            req.headers["x-access-token"] = "expiredToken";
            jwt.verify = jest.fn((token, secret, callback) => {
                callback(new jwt.TokenExpiredError("jwt expired", new Date()), null);
            });

            authJwt.verifyToken(req, res, next);
            expect(res.status).toHaveBeenCalledWith(401);
            expect(res.send).toHaveBeenCalledWith({ message: "Unauthorized! Access Token was expired!" });
        });

        it("should return 401 if token is invalid", () => {
            req.headers["x-access-token"] = "invalidToken";
            jwt.verify = jest.fn((token, secret, callback) => {
                callback(new Error("Invalid token"), null);
            });

            authJwt.verifyToken(req, res, next);
            expect(res.sendStatus).toHaveBeenCalledWith(401);
            expect(res.send).toHaveBeenCalledWith({ message: "Unauthorized!" });
        });

        it("should call next if token is valid", () => {
            req.headers["x-access-token"] = "validToken";
            jwt.verify = jest.fn((token, secret, callback) => {
                callback(null, { id: "userId" });
            });

            authJwt.verifyToken(req, res, next);
            expect(req.userId).toBe("userId");
            expect(next).toHaveBeenCalled();
        });
    });

    describe("identifyUser", () => {
        it("should reject with 'No token provided!' if no token is provided", async () => {
            await expect(authJwt.identifyUser("")).rejects.toEqual("No token provided!");
        });

        it("should reject with an error if token is invalid", async () => {
            jwt.verify = jest.fn((token, secret, callback) => {
                callback(new Error("Invalid token"), null);
            });

            await expect(authJwt.identifyUser("invalidToken")).rejects.toThrow("Invalid token");
        });

        it("should resolve with decoded token if token is valid", async () => {
            const decodedToken = { id: "userId" };
            jwt.verify = jest.fn((token, secret, callback) => {
                callback(null, decodedToken);
            });

            await expect(authJwt.identifyUser("validToken")).resolves.toEqual(decodedToken);
        });
    });
});