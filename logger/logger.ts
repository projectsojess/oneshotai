import winston from 'winston';
const { combine, timestamp, json } = winston.format;

let logger = null;

if(process.env.NODE_ENV === 'production') {

    logger =  winston.createLogger({
        level: "info",
        format: combine(timestamp(), json()),
        transports: [
          new winston.transports.File({
            filename: "/var/log/NEXT_APP/app.log",
          }),
        ],
      });
}

if(process.env.NODE_ENV === 'development') {
    logger = winston.createLogger({
        level: "debug",
        format: combine(timestamp(), json()),
        transports: [
          new winston.transports.Console
        ],
      });
}

export { logger };