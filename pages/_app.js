import "@/styles/globals.css";
import { Footer, Header } from "@/components";
import { Providers } from "@/redux/providers";
import store, { persistor } from "@/redux/store";
import { PersistGate } from "redux-persist/integration/react";
import "leaflet/dist/leaflet.css";
import { appWithTranslation } from "next-i18next";


function App({ Component, pageProps }) {
  
  return (
    <Providers store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <div className="flex flex-col min-h-screen">
          <Header/>

          <Component {...pageProps} className="flex-1" />

          <Footer />
        </div>
      </PersistGate>
    </Providers>
  );
}
export default appWithTranslation(App);


