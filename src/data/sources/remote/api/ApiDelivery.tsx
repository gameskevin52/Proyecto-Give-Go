import axios from 'axios';

// Detecta automáticamente la URL del backend según el entorno (Web o Expo Go móvil)
const getBaseUrl = () => {
  if (typeof window !== 'undefined' && window.location && window.location.origin) {
    return `${window.location.origin}/api`;
  }
  return 'http://192.168.1.13:3000/api';
};

const ApiDelivery = axios.create({
  baseURL: getBaseUrl(),
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

export { ApiDelivery };
