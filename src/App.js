import React, { useState, useEffect, Suspense } from 'react';
import './App.css';
import Login from './Auth/Login';
// import Dashboard from './Pages/Dashboard';
// import About from './Pages/About';
// import Todo from './Pages/Todo';
//import Test from './Pages/Test';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import NavigationBar from "./Components/NavigationBar";
import { UserContext } from './Context/UserContext';
import axios from 'axios';

const Dashboard = React.lazy(() => import('./Pages/Dashboard'));
const About = React.lazy(() => import('./Pages/About'));
const Todo = React.lazy(() => import('./Pages/Todo'));
const Test = React.lazy(() => import('./Pages/Test'));

function App() {
    const [token,setToken] = useState();

    useEffect(() =>{
        if (localStorage.getItem('user')) {
            axios.defaults.withCredentials = true;
            axios.defaults.baseURL = 'http://10.76.242.208:8000';
            axios.get('/api/user')
                .then(response => {
                    setToken(response.data);
                });
        }

        console.log("seesion check");
    },[]);

    if(!token) {
        return (
            <><Login setToken={setToken}/></>
        )
    }

    return (
        <Router>
            <UserContext.Provider value={{token}}>
            <NavigationBar  setToken={setToken}/>
            <div className="container mx-auto p-10 pt-24">

                <Suspense fallback={<div>Loading...</div>}>
                <Switch>
                    <Route exact path="/login">
                        <Login setToken={setToken}/>
                    </Route>
                    <Route exact path="/">
                        <Dashboard/>
                    </Route>
                    <Route path="/about">
                        <About/>
                    </Route>
                    <Route path="/todo">
                        <Todo/>
                    </Route>
                    <Route path="/test">
                        <Test/>
                    </Route>
                </Switch>
                </Suspense>
            </div>
            </UserContext.Provider>
        </Router>

    );
}

export default App;
