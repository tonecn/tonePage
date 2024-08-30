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
    SERVER_ERROR: {
        code: -3,
        message: 'Server error'
    },
    API_NOT_FOUND: {
        code: -4,
        message: 'API not found'
    },
    AUTH_ERROR: {
        code: -5,
        message: 'Authentication error'
    },
    BLOG: {
        NOTFOUND: {
            code: -4001,
            message: 'Blog not found'
        }
    },
} as const;

export default ServerStdResponse;