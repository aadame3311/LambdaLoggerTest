const winston = require('winston');
const os = require('os');
const forOwn = require('lodash').forOwn;
const { MESSAGE } = require('triple-beam');
const jsonStringify = require('fast-safe-stringify');
const AOP = require('./AOP');

const createServiceMetadata = config => {
    return {
        namespace: config.namespace,
        environment: config.environment,
        category: config.category || 'DEFAULT',
        aws_request_id: config.aws_request_id,
        resource: {
            type: 'lambda',
            provider: 'aws',
            hostname: os.hostname()
        }
    }
}

const createCustomFormat = config => {
    const serviceMetadata = createServiceMetadata(config);

    return winston.format(info => {
        const logObj = {};
        const transformMap = { 
            message: 'text_payload', 
            timestamp: '@timestamp', 
            level: 'severity' 
        };

        forOwn(transformMap, (value, key) => {
            logObj[transformMap[key]] = info[key];
            delete info[key];
        });

        logObj.labels = { ...config.labels, ...info };
        Object.assign(logObj, serviceMetadata);
        info[MESSAGE] = jsonStringify(logObj);
        return info;
    })();
}

const createCustomLoggerConfig = config => {
    const customFormat = createCustomFormat(config);

    return {
        level: config.environment === 'production' ? 'info' : 'debug',
        format: winston.format.combine(
            winston.format.timestamp({ format: 'YYYY-MM-DDTHH:mm:ss:SSSZ'}),
            customFormat
        ),
        transports: [
            new winston.transports.Console()
        ],
    }
}

const addLoggers = (categories, config) => {
    categories.forEach(category => {
        winston.loggers
            .add(
                category, 
                createCustomLoggerConfig({ ...config, category })
            );
    });
}

const getLogger = category => {
    return winston.loggers.get(category);
}

const loggerAspectFactory = params => {
    const {
        loggerName, 
        logLevel
    } = params;

    const logger = getLogger(loggerName);

    // aspect defines action to be taken on Advice definiton (AOP concepts)
    const aspect = (_level=logLevel, ...args) => {
        logger[`${logLevel}`](...args);
    }

    return aspect;
}

module.exports = {
    addLoggers,
    getLogger,
    loggerAspectFactory
}