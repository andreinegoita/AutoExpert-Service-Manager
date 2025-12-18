export class AppError extends Error {
    constructor(public statusCode: number, public message: string) {
        super(message);
        Object.setPrototypeOf(this, AppError.prototype);
    }
}

export class ValidationException extends AppError {
    constructor(message: string) {
        super(400, `Validation Error: ${message}`);
    }
}

export class NotFoundException extends AppError {
    constructor(resource: string) {
        super(404, `${resource} was not found.`);
    }
}