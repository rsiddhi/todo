import {useState, useEffect} from 'react';
import {TodoContext} from "../Context/TodoContext";
import TodoForm from "../Components/TodoForm";
import TodoList from "../Components/TodoList";
import axios from 'axios';

function Todo() {

    const [todos, setTodos] = useState([]);

    useEffect(() => {
        axios.get('/api/todos').then(response => {
            console.log(response);

            let initialArr = response.data.data;
            const newArr1 = initialArr.map(v => ({...v, isEditing: false}))
            setTodos(newArr1);
        }).catch(function (error) {
            alert(error.response.data.message);
        });
    },[]);

    return (
        <TodoContext.Provider value={{todos, setTodos}}>
            <div className="page-title font-bold">Todo</div>
            <TodoForm/>
           <TodoList/>
        </TodoContext.Provider>

    );
}

export default Todo;
