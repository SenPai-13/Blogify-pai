import { Provider } from "react-redux";
import { store } from "./store/store";
import { BrowserRouter } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import ScrollToTop from "./components/common/ScrollToTop";
import AppRoutes from "./routes";

function App() {
  return (
    <Provider store={store}>
      <BrowserRouter>
        <ScrollToTop />
        <Toaster position="top-right" reverseOrder={false} />
        <AppRoutes />
      </BrowserRouter>
    </Provider>
  );
}

export default App;
