import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';

function Form({setTodos}) {
  const handleSubmit = async (event) => {
    event.preventDefault();
    const title = event.target.title.value;

    try {
      const response = await axios.post('https://i74p5hghw3.execute-api.us-east-1.amazonaws.com/PROD/items', [{
        content: "",
        complete: false,
        TodolistID: uuidv4(),
        title: title,
      }], {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      // Assuming the server returns the newly created todo item
      setTodos((prevTodos) => [
        ...prevTodos,
        response.data,
      ]);

      event.target.reset();
    } catch (error) {
      console.error('There was a problem with the fetch operation:', error);
    }
  };
    return (
      <form className="form" onSubmit={handleSubmit}>
        <label htmlFor="title">
          <input
            type="text"
            name="title"
            id="TodolistID"
            placeholder="Write your next task"
            required
          />
        </label>
        <button>
          <span className="visually-hidden">Submit</span>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" id="plus"><g><g><rect width="12" height="12" opacity="0" transform="rotate(180 12 12)"></rect><path d="M19 11h-6V5a1 1 0 0 0-2 0v6H5a1 1 0 0 0 0 2h6v6a1 1 0 0 0 2 0v-6h6a1 1 0 0 0 0-2z"></path></g></g></svg>
        </button>
      </form>
    );
  }
  export default Form;
  