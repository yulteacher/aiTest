import { AppDataProvider } from "./context/AppDataContext";
import MainApp from "./MainApp";

export default function App() {
  return (
    <AppDataProvider>
      <MainApp />
    </AppDataProvider>
  );
}


