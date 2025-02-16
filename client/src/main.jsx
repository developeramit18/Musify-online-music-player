import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { BrowserRouter } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";
import { Provider } from "react-redux";
import { store } from "./redux/store.js";

createRoot(document.getElementById("root")).render(

    <Provider store={store}>
        <BrowserRouter>
          <ToastContainer
            theme="dark"
            position="top-center lg:bottom-left"
            autoClose={2000}
            hideProgressBar={true}
            closeOnClick
            pauseOnHover={false}
          />
          <App />
        </BrowserRouter>
    </Provider>
);
