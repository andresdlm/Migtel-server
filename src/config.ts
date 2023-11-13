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
    apiKey: process.env.API_KEY,
    jwtSecret: process.env.JWT_SECRET,
    crmUrl: process.env.CRM_URL,
    crmApikey: process.env.CRM_API_KEY,
  };
});
