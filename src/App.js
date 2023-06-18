import logo from './logo.svg';
import './assets/css/style.css';
import 'antd/dist/antd.css';
import Routes from './View/Routes';
import { UserProvider } from './Contexts/UserContext';
import { BrowserRouter as Router } from "react-router-dom";

function App() {
  return (
    <>
      <UserProvider>
        <Router>
          <Routes />
        </Router>
      </UserProvider>
    </>
  );
}

export default App;
