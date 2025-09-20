import { boot } from 'quasar/wrappers';
import axios, { type AxiosInstance } from 'axios';

const api: AxiosInstance = axios.create();

export default boot(({ app }) => {
  app.config.globalProperties.$api = api;
});

export { api };