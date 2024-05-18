import "@/styles/globals.css";
import { Footer, Header } from "@/components";
import { Providers } from "@/redux/providers";

export default function App({ Component, pageProps }) {
  return (
    <Providers>
      <div className="flex flex-col min-h-screen">
        <Header />

        <Component {...pageProps} className="flex-1" />

        <Footer />
      </div>
    </Providers>
  );
}
