import axios from "axios";

const ApiDelivery = axios.create({
  // IP ACTUAL DEL PC
  baseURL: 'http://192.168.80.13:3000/api', // Reemplazar con tu IP actual
  headers: {
    'Content-Type': 'application/json'
  }
});

export { ApiDelivery };