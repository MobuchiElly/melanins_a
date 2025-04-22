export const getRedirectUrl = () => {
    return process.env.NODE_ENV === "development"
      ? process.env.NEXT_PUBLIC_REDIRECT_URL
      : process.env.NEXT_PUBLIC_REDIRECT_URL_PROD;
};