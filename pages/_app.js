import "@/styles/globals.css";
import { Footer, Header } from "@/pages/components";

export default function App({ Component, pageProps }) {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <Component {...pageProps} className="flex-1" />
      <Footer />
    </div>
  );
}
