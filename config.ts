/* eslint-disable prettier/prettier */
import { registerAs } from '@nestjs/config';

export default registerAs('config', () => {
  return {
    database: {
      name: process.env.DATABASE_NAME,
      host: process.env.HOST,
      user: process.env.USER,
      password: process.env.PASSWORD,
      port: parseInt(process.env.DATABASE_PORT, 10),
    },
  };
});
