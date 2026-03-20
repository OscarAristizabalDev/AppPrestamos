const ENV = {
  dev: {
    API_URL: "https://sirenically-slippiest-lylah.ngrok-free.dev",
  },
  prod: {
    API_URL: "https://api.backend.com",
  },
};

export const config = __DEV__ ? ENV.dev : ENV.prod;
