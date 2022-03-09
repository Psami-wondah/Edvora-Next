import "../styles/globals.css";
import { store } from "../redux/store/store";
import { Provider } from "react-redux";
import { Slide, ToastContainer } from "react-toastify";

import "react-toastify/dist/ReactToastify.css";
function MyApp({ Component, pageProps }) {
  return (
    <Provider store={store}>
      <Component {...pageProps} />
      {/* <ToastContainer /> */}
    </Provider>
  );
}

export default MyApp;
