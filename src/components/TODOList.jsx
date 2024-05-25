import axios from "axios";
import { useEffect, useRef, useState } from "react";

function TODOList({ todos, setTodos }) {
  return (
    <ol className="todo_list">
      {todos.length > 0 ? (
        todos.map((item, index) => <Item key={index} item={item} setTodos={setTodos} />)
      ) : (
        <p>Seems lonely in here, what are you up to?</p>
      )}
    </ol>
  );
}

function Item({ item, setTodos }) {
  const [editing, setEditing] = useState(false);
  const [viewing, setViewing] = useState(false); // State for viewing
  const inputRef = useRef(null);

  const completeTodo = async () => {
    const updatedCompleteStatus = !item.complete;
    try {
      await axios.put(`https://i74p5hghw3.execute-api.us-east-1.amazonaws.com/PROD/items/${item.TodolistID}/complete`, {
        title: item.title,
        complete: updatedCompleteStatus,
        content: item.content,
      }, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      setTodos((prevTodos) =>
        prevTodos.map((todo) =>
          todo.TodolistID === item.TodolistID ? { ...todo, complete: updatedCompleteStatus } : todo
        )
      );
    } catch (error) {
      console.error('There was a problem with the update operation:', error);
    }
  };

  const handleEdit = (event) => {
    event.stopPropagation();
    setEditing(true);
  };

  const handleDelete = async (event) => {
    event.stopPropagation();
    try {
      await axios.delete(`https://i74p5hghw3.execute-api.us-east-1.amazonaws.com/PROD/items/${item.TodolistID}`, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      // Remove the item from the state
      setTodos((prevTodos) => prevTodos.filter((todo) => todo.TodolistID !== item.TodolistID));
    } catch (error) {
      console.error('There was a problem with the delete operation:', error);
    }
  };

  const handleInputSubmit = async (event) => {
    event.preventDefault();
    setEditing(false);
    const updatedTitle = event.target.editTodo.value;
    try {
      await axios.put(`https://i74p5hghw3.execute-api.us-east-1.amazonaws.com/PROD/items/${item.TodolistID}`, {
        title: updatedTitle,
        complete: item.complete,
        content: item.content,
      }, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      setTodos((prevTodos) =>
        prevTodos.map((todo) =>
          todo.TodolistID === item.TodolistID ? { ...todo, title: updatedTitle } : todo
        ));
    } catch (error) {
      console.error('There was a problem with the update operation:', error);
    }
  };

  const handleInputBlur = () => {
    setEditing(false);
  };

  const handleInputChange = (e) => {
    setTodos((prevTodos) =>
      prevTodos.map((todo) =>
        todo.TodolistID === item.TodolistID ? { ...todo, title: e.target.value } : todo
      )
    );
  };

  const toggleViewing = (event) => {
    event.stopPropagation();
    setViewing((prevViewing) => !prevViewing);
  };

  useEffect(() => {
    if (editing && inputRef.current) {
      inputRef.current.focus();
      // position the cursor at the end of the text
      inputRef.current.setSelectionRange(
        inputRef.current.value.length,
        inputRef.current.value.length
      );
    }
  }, [editing]);

  return (
    <li id={item?.TodolistID} className="todo_item" onClick={completeTodo}>
      {editing ? (
        <form className="edit-form" onSubmit={handleInputSubmit}>
          <label htmlFor="editTodo">
            <input
              ref={inputRef}
              type="text"
              name="editTodo"
              id="editTodo"
              defaultValue={item?.title}
              onBlur={handleInputBlur}
              onChange={handleInputChange}
            />
          </label>
        </form>
      ) : (
        <>
          <div className="todo_items_left">
            <svg fill={item.complete ? "#22C55E" : "#c2b39a"} height="25" width="25">
              <circle cx="12" cy="12" fillRule="nonzero" r="10" />
            </svg>
            <p style={item.complete ? { textDecoration: "line-through" } : {}}>
              {item?.title}
            </p>
            {viewing && (
            <div className="todo_item_details">
              <p>{item?.content}</p>
            </div>
          )}
          </div>
          <div className="todo_items_right">
            <button onClick={handleEdit}>
              <span className="visually-hidden">Edit</span>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" id="edit" width="17" height="17">
                <path
                  d="M3.5,24h15A3.51,3.51,0,0,0,22,20.487V12.95a1,1,0,0,0-2,0v7.537A1.508,1.508,0,0,1,18.5,22H3.5A1.508,1.508,0,0,1,2,20.487V5.513A1.508,1.508,0,0,1,3.5,4H11a1,1,0,0,0,0-2H3.5A3.51,3.51,0,0,0,0,5.513V20.487A3.51,3.51,0,0,0,3.5,24Z"
                  fill="white"
                ></path>
                <path
                  d="M9.455,10.544l-.789,3.614a1,1,0,0,0,.271.921,1.038,1.038,0,0,0,.92.269l3.606-.791a1,1,0,0,0,.494-.271l9.114-9.114a3,3,0,0,0,0-4.243,3.07,3.07,0,0,0-4.242,0l-9.1,9.123A1,1,0,0,0,9.455,10.544Zm10.788-8.2a1.022,1.022,0,0,1,1.414,0,1.009,1.009,0,0,1,0,1.413l-.707.707L19.536,3.05Zm-8.9,8.914,6.774-6.791,1.4,1.407-6.777,6.793-1.795.394Z"
                  fill="white"
                ></path>
              </svg>
            </button>
            <button onClick={handleDelete}>
              <span className="visually-hidden">Delete</span>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" id="delete" fill="white" width="18" height="18">
                <path
                  d="M24.2,12.193,23.8,24.3a3.988,3.988,0,0,1-4,3.857H12.2a3.988,3.988,0,0,1-4-3.853L7.8,12.193a1,1,0,0,1,2-.066l.4,12.11a2,2,0,0,0,2,1.923h7.6a2,2,0,0,0,2-1.927l.4-12.106a1,1,0,0,1,2,.066Zm1.323-4.029a1,1,0,0,1-1,1H7.478a1,1,0,0,1,0-2h3.1a1.276,1.276,0,0,0,1.273-1.148,2.991,2.991,0,0,1,2.984-2.694h2.33a2.991,2.991,0,0,1,2.984,2.694,1.276,1.276,0,0,0,1.273,1.148h3.1A1,1,0,0,1,25.522,8.164Zm-11.936-1h4.828a3.3,3.3,0,0,1-.255-.944,1,1,0,0,0-.994-.9h-2.33a1,1,0,0,0-.994.9A3.3,3.3,0,0,1,13.586,7.164Zm1.007,15.151V13.8a1,1,0,0,0-2,0v8.519a1,1,0,0,0,2,0Zm4.814,0V13.8a1,1,0,0,0-2,0v8.519a1,1,0,0,0,2,0Z"
                  fill="white"
                ></path>
              </svg>
            </button>
            
          </div>
        </>
      )}
      
    </li>
  );
}

export default TODOList;
