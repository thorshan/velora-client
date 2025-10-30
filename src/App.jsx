import { BrowserRouter } from "react-router-dom";
import AppRoutes from "./routes/AppRoutes";
import { AuthProvider } from "./contexts/AuthContext";
import { ColorModeProvider } from "./contexts/ThemeContext";

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <ColorModeProvider>
          <AppRoutes />
        </ColorModeProvider>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
