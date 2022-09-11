import axiosBase from "axios";

const { NEXT_PUBLIC_GATEWAY_URL } = process.env;

// eslint-disable-next-line no-console
console.log(`Using gateway ${NEXT_PUBLIC_GATEWAY_URL}`);

const axios = axiosBase.create({
  baseURL: NEXT_PUBLIC_GATEWAY_URL
});

export default axios;
