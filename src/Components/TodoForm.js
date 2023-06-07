import React, {useState, useContext} from 'react';
import {TodoContext} from "../Context/TodoContext";
import axios from 'axios';

function TodoForm() {
    const [todoInput, setTodoInput] = useState('');
    const {todos,setTodos} = useContext(TodoContext);

    function handleInput(event) {
        setTodoInput(event.target.value);
    }

    function addTodo(event) {

        event.preventDefault();

        if(todoInput.trim().length === 0) return;

        axios.post('/api/todo', {title: todoInput}).then(response => {
            setTodos([...todos, response.data]);
            setTodoInput('');

        }).catch(function (error) {
            alert(error.response.data.message);
        });
    }x

    return (
        <form action="#" onSubmit={(event) => addTodo(event)}>
            <input
                placeholder="Enter new task.."
                className="my-3 px-2 w-3/4 border border-gray-400 rounded"
                value={todoInput}
                onChange={handleInput}
                name="todo"/>
        </form>
    );
}

export default TodoForm;