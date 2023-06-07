import { useState } from 'react';
import axios from 'axios';

function Login({ setToken}) {

    const [email, setEmail] = useState();
    const [password, setPassword] = useState();
    const [error, setError] = useState();
    axios.defaults.withCredentials = true;
    axios.defaults.baseURL = 'http://10.76.242.200:8000';

    async function loginUser(credentials) {
        axios.get('/sanctum/csrf-cookie').then(response => {
                axios.post('/api/login', credentials).then(response => {
                    if (response.data.success) {
                        setToken(response.data.user);
                        localStorage.setItem('user', response.data.user.id);
                    }
                }).catch(function (error) {
                    setError(error.response.data.message);
                });
            });
    }

    function handleSubmit(event) {
        event.preventDefault();
        loginUser({email: email, password: password});
    }

    return (
        <>
            <nav className="flex items-center justify-between flex-wrap bg-green-500 p-6 mx-auto w-full fixed">
                <div className="flex items-center flex-shrink-0 text-white mr-6">
                    <svg className="fill-current h-8 w-8 mr-2" width="54" height="54" viewBox="0 0 54 54" xmlns="http://www.w3.org/2000/svg">
                        <path d="M13.5 22.1c1.8-7.2 6.3-10.8 13.5-10.8 10.8 0 12.15 8.1 17.55 9.45 3.6.9 6.75-.45 9.45-4.05-1.8 7.2-6.3 10.8-13.5 10.8-10.8 0-12.15-8.1-17.55-9.45-3.6-.9-6.75.45-9.45 4.05zM0 38.3c1.8-7.2 6.3-10.8 13.5-10.8 10.8 0 12.15 8.1 17.55 9.45 3.6.9 6.75-.45 9.45-4.05-1.8 7.2-6.3 10.8-13.5 10.8-10.8 0-12.15-8.1-17.55-9.45-3.6-.9-6.75.45-9.45 4.05z"/>
                    </svg>
                    <span className="font-semibold text-xl tracking-tight">SPApp</span>
                </div>
                <div className="block lg:hidden">
                    <button className="flex items-center px-3 py-2 border rounded text-teal-200 border-teal-400 hover:text-white hover:border-white">
                        <svg className="fill-current h-3 w-3" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                            <title>Menu</title>
                            <path d="M0 3h20v2H0V3zm0 6h20v2H0V9zm0 6h20v2H0v-2z"/>
                        </svg>
                    </button>
                </div>
                <div className="w-full block flex-grow lg:flex lg:items-center lg:w-auto">
                    <div className="text-sm lg:flex-grow">

                    </div>
                </div>
            </nav>
            <div className="container mx-auto pt-24">

                <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mx-auto mt-20 mb-4 w-1/2 flex flex-col">
                    <div className="mx-auto mb-4">
                        <h3 className="text-xl">Login</h3>
                    </div>

                    { error && <div className="mb-4">
                        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
                            <span className="block sm:inline">{error}</span>
                        </div>
                    </div>}
                    <div className="mb-4">
                        <label className="block text-grey-darker text-sm font-bold mb-2" htmlFor="username">
                            Email
                        </label>
                        <input className="shadow appearance-none border rounded w-full py-2 px-3 text-grey-darker" id="email" type="email" placeholder="Email" onChange={(e) => setEmail(e.target.value)}/>
                    </div>
                    <div className="mb-6">
                        <label className="block text-grey-darker text-sm font-bold mb-2" htmlFor="password">
                            Password
                        </label>
                        <input className="shadow appearance-none border border-red rounded w-full py-2 px-3 text-grey-darker mb-3" id="password" type="password" placeholder="******************" onChange={e => setPassword(e.target.value)}/>
                        <p className="text-red text-xs italic">Please choose a password.</p>
                    </div>
                    <div className="mb-6">
                       <button className="rounded bg-green-500 p-2 text-white font-medium" onClick={(e) => handleSubmit(e)}  >Login</button>
                    </div>
                    <div className="flex items-center justify-between">
                        <button className="bg-blue hover:bg-blue-dark text-white font-bold py-2 px-4 rounded" type="button">
                            Sign In
                        </button>
                    </div>
                </div>
            </div>
        </>

    );
}

export default Login;
