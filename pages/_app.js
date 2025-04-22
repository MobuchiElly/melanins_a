import Layout from "@/components/Layout";
import "@/styles/globals.css";
import store from "@/redux/store";
import { Provider } from "react-redux";
import Script from "next/script";

export default function App({ Component, pageProps, router }) {
  const isAuthRoute = router.pathname.startsWith("/auth");

  const getLayout = Component.getLayout || ((page) => isAuthRoute ? page : <Layout>{page}</Layout>)

  return (
    <>
      <Script async src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA_ENDPOINT}`}></Script>
      <Script id="google-analytics">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${process.env.NEXT_PUBLIC_GA_ENDPOINT}');
        `}
      </Script>
      <Provider store={store}>
        {getLayout(
          <Component {...pageProps} />
      )}
      </Provider>
    </>
  );
}