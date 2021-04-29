import { Provider } from "next-auth/client";
import "./styles.css";
import "semantic-ui-css/semantic.min.css";
import { useEffect } from "react";
import * as gtag from "../lib/gtag";
import { useRouter } from "next/router";

export default function App({ Component, pageProps }) {
  const router = useRouter();
  useEffect(() => {
    const handleRouteChange = (url) => {
      gtag.pageview(url);
    };
    router.events.on("routeChangeComplete", handleRouteChange);
    return () => {
      router.events.off("routeChangeComplete", handleRouteChange);
    };
  }, [router.events]);

  return (
    <Provider
      options={{
        clientMaxAge: 0,
        keepAlive: 0,
        signIn: "/signin",
      }}
      session={pageProps.session}
    >
      <Component {...pageProps} />
    </Provider>
  );
}
