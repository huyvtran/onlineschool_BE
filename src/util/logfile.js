const winston = require('winston');
const { format } = require('winston');
require('winston-daily-rotate-file');

/* var transport = new (winston.transports.DailyRotateFile)({
    filename: 'info.log',
    datePattern: 'YYYY-MM-DD-HH',
    zippedArchive: true,
    maxSize: '20m',
    maxFiles: '14d',
    level:'info',
    dirname: 'D:'+'/../'+ 'OSLearningLogs'
  })

  var errortransport = new (winston.transports.DailyRotateFile)({
    filename: 'error.log',
    datePattern: 'YYYY-MM-DD-HH',
    zippedArchive: true,
    maxSize: '20m',
    maxFiles: '14d',
    level:'error',
    dirname: 'D:'+'/../'+ 'OSLearningLogs'
  });
 */
 

  /* var logger = winston.createLogger({
    format: format.combine(
      format.splat(),
      format.simple()
    ),
    transports: [
      transport,errortransport
    ]
  }); */
  const formatMeta = (meta) => {
    // You can format the splat yourself
    const splat = meta[Symbol.for('splat')];
    if (splat && splat.length) {
      return splat.length === 1 ? JSON.stringify(splat[0]) : JSON.stringify(splat);
    }
    return '';
  };
  
  const customFormat = winston.format.printf(({
    timestamp,
    level,
    message,
    label = '',
    ...meta
  }) => `[${timestamp}] ${level} \t ${label} ${message} ${formatMeta(meta)}`); 

  const logger = winston.createLogger({
    format: format.combine(
      //format.splat(),          
      format.timestamp({format: 'MMM D, YYYY HH:mm'}),
      customFormat
    ),   
    transports: [
      new winston.transports.File({
        filename: 'D:'+'/../'+ 'OSLearningLogs/combined.log',
        level: 'info',
        maxSize: '20m',
        maxFiles: '14d'        
      }),
      new winston.transports.File({
        filename: 'D:'+'/../'+ 'OSLearningLogs/errors.log',
        level: 'error',
        maxSize: '20m',
        maxFiles: '14d'
      })
    ]
  });

module.exports = {
    'log': logger
  };