import { AuthProvider, useAuth } from './context/AuthContext';
import { SocketProvider } from './context/SocketContext';
import Login from './pages/Login';
import Chat from './pages/Chat';

/**
 * Router component — shows Login or Chat based on auth state.
 */
const AppRouter = () => {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Login />;
  }

  return (
    <SocketProvider>
      <Chat />
    </SocketProvider>
  );
};

/**
 * Root App component.
 * Wraps the application with AuthProvider.
 * SocketProvider is only mounted when authenticated (to avoid unnecessary connections).
 */
const App = () => {
  return (
    <AuthProvider>
      <AppRouter />
    </AuthProvider>
  );
};

export default App;
