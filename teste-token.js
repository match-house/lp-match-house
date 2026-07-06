const axios = require('axios');

const token = 'EAAGSRkfqrUABR1o7ZCsijnmKLQidqTsqDgy8x50aBNRxHGQ5AxBj9zrPVXvE1jRlMLTFqUI6IknXOliZBB0DJGZCJDTcymQJxLgJ1qUnQZAhR2rr6ZCdBoo4WZCXj9tCLNcohlqbQZB9KzgzJMoQdVtqI7sVuRh3YI5ZBZC2hGY0hh8N2PJor93WW4cTteyFchjIlGOfraUaVPxwmW79Xh0i8t3vHkGvbZCfiYJKJGhLZCFjvHiIVhGZARgoiaaSyj74FD10uDC9TpHdIBLCmvVIuemH5MxzHWhSe1mUwXTizH4RpvOAw3W4b7Mw9w1DFzSF5R2tMU3cYw7KCZB4h';

axios.get('https://graph.facebook.com/me', {
  params: { access_token: token }
}).then(res => {
  console.log('✅ Token válido!');
  console.log('Usuário:', res.data);
}).catch(err => {
  console.error('❌ Erro:');
  console.error(err.response?.data || err.message);
});
