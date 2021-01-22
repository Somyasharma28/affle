import './App.css';
import FirstScreen from './Components/FirstScreen';
import { Navbar } from 'reactstrap';
const userData=[{
  username: "Somya",
  email: "somyawork2806@gmail.com",
}]

function App() {
  return (<>
    <Navbar color="danger" light expand="md">
            <h6>Meeting Room Booking</h6>
        </Navbar>
    <div className="mainContainer"> 
    
    <div className="mainRow">
    <FirstScreen userData={userData} />
    </div>
    </div>
  </>);
}

export default App;
