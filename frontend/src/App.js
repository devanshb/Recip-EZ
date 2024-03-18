import './App.css';
import {BrowserRouter, Routes, Route} from 'react-router-dom';
import {Login} from "./components/login";
import {Home} from "./components/home";
import {Navigation} from './components/navigation';
import {Logout} from './components/logout';
import {Signup} from './components/signup';
import {AboutUs} from './components/aboutUs';


function App() {
    return <BrowserRouter>
    <Navigation></Navigation>
        <Routes>
            <Route path="/login" element={<Login/>}/>
            <Route path="/" element={<Home/>}/>
            <Route path="/signup" element = {<Signup/>}/>
            <Route path="/logout" element={<Logout/>}/>
            <Route path="/AboutUs" element={<AboutUs/>} />
        </Routes>
    </BrowserRouter>;
}

export default App;