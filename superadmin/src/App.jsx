import "./App.css";
import { Suspense } from "react";
import { Route, Routes } from "react-router-dom";
import { Toaster } from "react-hot-toast";

import Loader from "./components/Loader";
import { AllRoutes } from "./routes/PageRoutes";
import PrivateRoute from "./layout/PrivateRoutes";

function App() {
  return (
    <Suspense fallback={<Loader />}>
      <Toaster
        position="top-center"
        reverseOrder={false}
      />

      <Routes>
        {AllRoutes.map((route) => (
          <Route
            key={route.path}
            path={route.path}
            element={
              route.isPrivate ? (
                <PrivateRoute>
                  {route.element}
                </PrivateRoute>
              ) : (
                route.element
              )
            }
          />
        ))}

      </Routes>
    </Suspense>
  );
}

export default App;