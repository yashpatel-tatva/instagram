import './App.css';
import SideBottomBar from './layouts/SideBottomBar';
import { useSelectorUserState } from './redux/slices/AuthSlice';
import { AuthRoutes, NormalRoutes } from './routes/CustomRoutes';

function App() {

  const { isLoggedIn } = useSelectorUserState();
  return (
    <>
      {!isLoggedIn ? (
        <AuthRoutes />
      ) : (
        <SideBottomBar>
          <NormalRoutes />
        </SideBottomBar>
      )}
    </>
  );
}

export default App;
