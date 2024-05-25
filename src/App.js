import axios from "axios";
import { useEffect, useState } from "react";
import Form from "./components/Form";
import Header from "./components/Header";
import TODOHero from "./components/TODOHero";
import TODOList from "./components/TODOList";

function Home() {
  const [todos, setTodos] = useState([])  
  const [error, setError] = useState(null);

  const fetchData = async () => {
    try {
      const response = await axios.get('https://i74p5hghw3.execute-api.us-east-1.amazonaws.com/PROD/items', {
        headers: {
          'Content-Type': 'application/json',
        },
        timeout: 5000, // Set a timeout of 5 seconds
      });
      if (!response || response.status !== 200) {
        throw new Error('Network response was not ok');
      }
      const {items} = response.data
      setTodos(items); // Set the retrieved data to state
    } catch (error) {
      if (error.code === 'ECONNABORTED') {
        console.error('Request timed out');
        setError('Request timed out. Please try again later.');
      } else {
        console.error('There was a problem with the fetch operation:', error);
        setError('There was a problem with the fetch operation.');
      }
    }
  };
  useEffect(() => {
    fetchData();
    console.log(todos)
  }, []);
  const todos_completed = todos.length>0 ? todos.filter(
    (todo) => todo.complete ===true).length : 0;
  const total_todos = todos.length
  return (
    <div className="wrapper">
      <Header />
      <TODOHero todos_completed={todos_completed} total_todos={total_todos} />
      <Form setTodos={setTodos} />
      <TODOList todos={todos} setTodos={setTodos} />
    </div>
  );
}
export default Home;
