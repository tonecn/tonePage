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
        },
        PROTECT_FLAG: {
            code: -4002,
            message: 'Blog is protected, need password'
        },
        PASSWD_ERROR: {
            code: -4003,
            message: 'Blog is protected, and password is not right'
        }
    },
    CAPTCHA: {
        NOTFOUND: {
            code: -5000,
            message: 'captcha session not found'
        },
        MAX_TRY_COUNT: {
            code: -5001,
            message: 'captcha session try max count'
        },
        NOTRIGHT: {
            code: -5002,
            message: 'captcha is not right, please try again'
        }
    },
    USER: {
        NOTFOUND: {
            code: -6000,
            message: 'user is not found'
        },
        PASSWORD_ERROR: {
            code: -6001,
            message: 'user password is error'
        }
    }
} as const;

export default ServerStdResponse;