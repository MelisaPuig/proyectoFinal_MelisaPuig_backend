import dotenv from 'dotenv';
dotenv.config();

const getFromEnvOrError = function getFromEnvOrError(variable: string): string {
  const value = process.env[variable];
  if (typeof value === 'undefined') {
    throw new Error(`Environment variable "${variable}" is not defined.`);
  }
  return value;
};

const getEnvAsNumber = (variable: string): number => {
  const value = getFromEnvOrError(variable);
  if (!/^[0-9]+$/.test(value)) {
    throw new Error(`Environment variarble "${variable}" must be a number.`);
  }
  return Number.parseInt(value, 10);
};

export default {
  RUN_AS_CLUSTER: getFromEnvOrError('RUN_AS_CLUSTER') !== '0',
  MONGO_URL: getFromEnvOrError('MONGO_URL'),
  PORT: getFromEnvOrError('PORT'),
  SESSION_DURATION: getEnvAsNumber('SESSION_DURATION'),
  SESSION_SECRET: getFromEnvOrError('SESSION_SECRET'),
  ADMIN_EMAIL: getFromEnvOrError('ADMIN_EMAIL'),
  MAIL_HOST: getFromEnvOrError('MAIL_HOST'),
  MAIL_USER: getFromEnvOrError('MAIL_USER'),
  MAIL_PASSWORD: getFromEnvOrError('MAIL_PASSWORD'),
};
