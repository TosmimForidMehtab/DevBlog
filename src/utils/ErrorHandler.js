export const errorHandler = (error, req, res, next) => {
    const statusCode = error?.statusCode || 500;
    const message = error?.message;
    const data = error?.data;
    const stack = error?.stack;
    const success = error?.success;
    return res.status(statusCode).json({
        success,
        message,
        data,
        stack,
    });
};
