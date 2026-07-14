const fs = require('fs');
const targetPath = './src/environments/environment.ts';

const isProduction = process.env.PRODUCTION !== 'false';

const envConfigFile = `export const environment = {
  production: ${isProduction},
  apiUrl: '${process.env.API_URL || "https://api.consultnow.in/api"}',
  socketUrl: '${process.env.SOCKET_URL || "https://api.consultnow.in"}',
  razorpayKeyId: '${process.env.RAZORPAY_KEY_ID || "rzp_test_TCa82OWd3UQkfk"}',
  registerUrl: '${process.env.REGISTER_URL || "https://consultnow.in/register"}'
};
`;

fs.writeFileSync(targetPath, envConfigFile);
console.log('Angular environment.ts dynamically created.');
