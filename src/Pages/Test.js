import { useState,useEffect } from "react";
import { useQuery, useQueryClient } from "react-query";
import axios from 'axios';
import { ReactQueryDevtools } from 'react-query/devtools';

function Test() {
    const [page, setPage] = useState(1);
    const [todoInput, setTodoInput] = useState('');
    const [filters, setFilters] = useState();
    const {data:tasks,
        isFetching,
        isSuccess,
        isPreviousData} = useQuery(
            ['tasks', page, filters],
            () => fetchTasks(page, filters),
            { keepPreviousData: true, staleTime: 10000 }
        );

    const queryClient = useQueryClient();
    useEffect(() => {
            queryClient.prefetchQuery(['tasks', page + 1, filters], () =>
                fetchTasks(page + 1, filters)
            )
    },[tasks, page, queryClient]);

    function fetchTasks(page = 1, filters = {'status':'all'}){
        //const response = axios.get('/api/todos?page=' + page).then(response => response.data.data.map(v => ({...v, isEditing: false})));
        var query = "";
        for (var key in filters) {
            query += "&"+key+"="+filters[key];
        }
        const response = axios.get('/api/todos?page=' + page + query).then(response => response.data);
        return response;
    }

    function markAsEditing(id) {
        var updatedTodos = tasks;
        updatedTodos.data = tasks.data.map(todo => {
            if (todo.id === id) {
                todo.isEditing = !todo.isEditing;
            }
            return todo;
        });

        queryClient.setQueryData(['tasks',page, filters], updatedTodos);
    }

    function updateTodo(event, id) {
        axios.put('/api/todo/' + id, {title: event.target.value}).then(response => {
            var updatedTodos = tasks;
            updatedTodos.data = tasks.data.map(todo => {
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
            queryClient.invalidateQueries('tasks');
        }).catch(function (error) {
            alert(error.response.data.message);
        });
    }

    function removeTodo(id) {
        axios.delete('/api/todo/' + id).then(response => {
            queryClient.invalidateQueries('tasks');
        }).catch(function (error) {
            alert(error.response.data.message);
        });
    }

    function markDone(event, id) {

        axios.put('/api/todo/' + id, {is_completed: (event.target.checked ? 1 : 0)}).then(response => {
            var updatedTodos = tasks;
            updatedTodos.data = tasks.data.map(todo => {
                if (todo.id === id) {
                    todo.is_completed = !todo.is_completed;
                }
                return todo;
            });

            queryClient.invalidateQueries('tasks');
        }).catch(function (error) {
            alert(error.response.data.message);
        });
    }

    function handleInput(event) {
        setTodoInput(event.target.value);
    }

    function addTodo(event) {
        event.preventDefault();

        if (todoInput.trim().length === 0) return;

        axios.post('/api/todo', {title: todoInput}).then(response => {
            queryClient.invalidateQueries('tasks');
            setTodoInput('');
        }).catch(function (error) {
            alert(error.response.data.message);
        });
    }

    return (
        <>
            <form action="#" onSubmit={(event ) => addTodo(event)}>
                <input
                    placeholder="Enter new task.."
                    className="my-3 px-2 w-3/4 border border-gray-400 rounded"
                    value={todoInput}
                    onChange={handleInput}
                    name="todo"/>
            </form>
            <div className="page-title font-bold">Task</div>
            {isFetching &&
            <div>Loading...</div>
            }

            <div className="filter-groups">
                <div className="filter-item pr-2 inline-block">
                    <span>Status: </span>
                    <select className="rounded"
                            onChange={(event) => {
                                setFilters({'status': event.target.value})
                                setPage(1);
                                queryClient.invalidateQueries('todos')
                            }}
                    >
                        <option value="all">all</option>
                        <option value="completed">Completed</option>
                        <option value="active">Active</option>
                    </select>
                </div>
                <div className="filter-item pr-2 inline-block">
                    <span>Search: </span>
                    <input type="text" className="rounded" onBlur={(event) => setFilters(previousFilter => ({...previousFilter, search: event.target.value}))}/>
                </div>
            </div>

            {isSuccess && <ul className="todo-list">
                {tasks.data.map(todo => (
                    <li key={todo.id}>
                        <div className="todo-item">
                            <input type="checkbox"  checked={todo.is_completed} onChange={(event) => markDone(event,todo.id)}/>
                            { !todo.isEditing ? (
                                <span className={`todo-item-label px-2 ${todo.is_completed ? `line-through` : ``}`} onDoubleClick={() =>  markAsEditing(todo.id)}>{todo.title}</span>
                            ) : (
                                <input
                                    className="todo-item-input border rounded border-gray-400 m-2 px-2"
                                    defaultValue={todo.title}
                                    onBlur={(event) => updateTodo(event, todo.id)}
                                    autoFocus
                                />
                            )}
                            <button onClick={(event) => removeTodo(todo.id)} className="text-red-600"> X</button>
                        </div>
                    </li>
                ))}
            </ul>
            }
            <button

                className={`bg-blue-500 px-5 text-white rounded ${(isPreviousData||page == 1) ? "opacity-50 cursor-not-allowed " : ""}`}
                onClick={() => setPage(old => Math.max(old - 1, 0))}
                disabled={isPreviousData || page==1}
            >
                Previous Page
            </button>{' '}
            <button
                className={`bg-blue-500 px-5 text-white rounded ${(tasks && page == tasks.last_page) ? "opacity-50 cursor-not-allowed " : ""}`}
                onClick={() => {
                    setPage(old => (old+1));
                }}
                disabled={tasks && page == tasks.last_page}
            >
                Next Page
            </button>
            {' '}
            <ReactQueryDevtools/>
        </>

    );
}

export default Test;
