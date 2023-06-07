import { useContext} from 'react';
import {TodoContext} from "../Context/TodoContext";
import axios from 'axios';

function TodoList() {
    const {todos, setTodos} = useContext(TodoContext);

    function markAsEditing(id) {
        var updatedTodos = todos.map(todo => {
            if (todo.id === id) {
                todo.isEditing = !todo.isEditing;
            }
            return todo;
        });

        setTodos(updatedTodos);
    }

    function updateTodo(event, id) {
        axios.put('/api/todo/' + id, {title: event.target.value}).then(response => {
            var updatedTodos = todos.map(todo => {
                if (todo.id === id) {
                    if (event.target.value.trim().length === 0) {
                        todo.isEditing = false;
                        return todo;
                    }

                    todo.title = event.target.value;
                    todo.isEditing = false;
                }

                return todo;
            });

            setTodos(updatedTodos);
        }).catch(function (error) {
            alert(error.response.data.message);
        });

    }

    function removeTodo(id) {
        axios.delete('/api/todo/' + id).then(response => {
            setTodos(todos.filter(todo => todo.id !== id));
        }).catch(function (error) {
            alert(error.response.data.message);
        });
    }

    return (
        <>
            <ul className="todo-list">
                {todos.map(todo => (
                    <li key={todo.id}>
                        <div className="todo-item">
                            <input type="checkbox"/>
                            { !todo.isEditing ? (
                                <span className="todo-item-label px-2" onDoubleClick={() =>  markAsEditing(todo.id)}>{todo.title}</span>
                            ) : (
                                <input
                                    className="todo-item-input border rounded border-gray-400 m-2 px-2"
                                    defaultValue={todo.title}
                                    onBlur={(event) => updateTodo(event, todo.id)}
                                    onKeyDown={(event) => {
                                        if(event.key === 'Enter') {
                                            updateTodo(event, todo.id);
                                        } else if (event.key === 'Escape'){
                                            markAsEditing(todo.id);
                                        }
                                    }}
                                    autoFocus
                                />
                            )}

                            <button className="text-red-600" onClick={(event) => removeTodo(todo.id)}> X</button>
                        </div>
                    </li>
                ))}
            </ul>
        </>
    );
}

export default TodoList;