class AppError extends Error {
    constructor(statusCode, message) {
        super();
        this.statusCode = statusCode || 500;
        this.success = false;
        this.stack = Error.captureStackTrace(this, this.constructor);
        this.data = null;
        this.message = message;
    }
}

export { AppError };
