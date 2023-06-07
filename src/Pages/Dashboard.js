import {useContext} from 'react';
import { Redirect } from 'react-router-dom';
import { UserContext } from "../Context/UserContext";

function Dashboard() {

    const {token} = useContext(UserContext);

    return (
        <>
            <div className="page-title font-bold">Dashboard</div>
            Hi { token.name } <br/>
            Dashboard Content goes here
        </>

    );
}

export default Dashboard;
