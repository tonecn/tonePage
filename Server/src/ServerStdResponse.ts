const ServerStdResponse = {
    OK: {
        code: 0,
        message: 'OK'
    },
    PARAMS_MISSING: {
        code: -1,
        message: 'Parameters missing'
    },
    INVALID_PARAMS: {
        code: -2,
        message: 'Invalid parameters'
    },
    INVALID_TOKEN: {
        code: -3,
        message: 'Invalid token'
    },
    SERVER_ERROR: {
        code: -4,
        message: 'Server error'
    },
    API_NOT_FOUND: {
        code: -5,
        message: 'API not found'
    },
    AUTH_ERROR: {
        code: -6,
        message: 'Authentication error'
    },
    IDENTIFY_FAILED: {
        code: -7,
        message: 'Identify failed'
    },
    GOODS: {
        NOTFOUND: {
            code: -4001,
            message: 'Goods not found'
        }
    },
    ORDER: {
        NOTFOUND: {
            code: -5001,
            message: 'Order not found'
        },
        ALREADY_CANCEL: {
            code: -5002,
            message: 'Order already canceled'
        }
    }
} as const;

export default ServerStdResponse;