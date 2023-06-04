import logo from './logo.svg';
import './assets/css/style.css';
import 'antd/dist/antd.css';
import Routes from './View/Routes';
import { UserProvider } from './Contexts/UserContext';

function App() {
  return (
    <>
      <UserProvider>
          <Routes/>
      </UserProvider>
    </>
  );
}

export default App;
