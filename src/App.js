import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import MainContent from './components/MainContent';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';



function App() {
    return (
        <BrowserRouter>
            <div className="App d-flex">
                <Sidebar />
                <MainContent />
            </div>
        </BrowserRouter>
    );
}

export default App;
