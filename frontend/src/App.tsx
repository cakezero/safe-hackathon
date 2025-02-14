import { MainProvider } from "./context/MainProvider";
import AppRoutes from "./routes";

function App() {
  return (
    <MainProvider>
      <AppRoutes />
    </MainProvider>
  );
}

export default App;
