import { registerAs } from '@nestjs/config';

export default registerAs('config', () => {
  return {
    database: {
      name: process.env.DB_NAME,
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      port: parseInt(process.env.DB_PORT, 10),
    },
    apiKey: process.env.API_KEY,
    jwtSecret: process.env.JWT_SECRET,
    crmUrl: process.env.CRM_URL,
    crmApikey: process.env.CRM_API_KEY,
  };
});
