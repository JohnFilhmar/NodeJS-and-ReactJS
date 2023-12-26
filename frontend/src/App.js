/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';

const App = () => {
  const [firstname, setFirstName] = useState('');
  const [lastname, setLastName] = useState('');
  const [response, setResponse] = useState('');
  const [res, setRes] = useState('');
  const [users, setUsers] = useState([]);
  const [toEdit, setToEdit] = useState(null);

  const BASE_URL = 'https://localhost:5000/api/';
  const headers = (method, body, token) => {
    const baseHeaders = {
      method: method,
      headers: {
        'Content-Type': 'application/json',
      },
    };
    if (body) {
      baseHeaders.body = JSON.stringify(body);
    }
    if (token) {
      baseHeaders.headers.authorization = `Bearer ${token}`;
    }
    return baseHeaders;
  };
  
  const fetchUsers = async() => {
    try {
      const response = await fetch(`${BASE_URL}getUsers`, headers('GET'));
      const data = await response.json();
      setUsers(data.data);
    } catch (error) {
      setRes(`Something have gone wrong: ${error.message}`);
    }
  };

  const handleAddUser = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${BASE_URL}users`, headers('POST', {firstname,lastname}));
      const data = await response.json();
      setUsers(data.data);
      setRes('Successfully Added!');
      setFirstName('');
      setLastName('');
    } catch (error) {
      setRes('Error sending POST request:', error.message);
      setFirstName('');
      setLastName('');
    }
  };

  const handleEditUser = async (e) => {
    e.preventDefault();
    try {
      const userId = toEdit.id;
      const response = await fetch(`${BASE_URL}editUser`, headers('POST', {firstname,lastname,userId}));
      const data = await response.json();
      setUsers(data.data);
      setFirstName('');
      setLastName('');
      setToEdit(null);
      setRes('User Updated!');
    } catch (error) {
      setRes('Error sending POST request:', error.message);
      setFirstName('');
      setLastName('');
    }
  };

  const handleDelete = async (id) => {
    try {
      const response = await fetch(`${BASE_URL}deleteUser`, headers('POST', {id}));
      const data = await response.json();
      setUsers(data.data);
      setRes('User Deleted!');
    } catch (error) {
      setRes('Error sending POST request:', error.message);
    }
  }

  const editUser = async (id) => {
    try {
      const response = await fetch(`${BASE_URL}searchUser/${id}`, headers('GET'));
      const data = await response.json();
      if (data.data[0] !== undefined) {
        const firstUserData = data.data[0];
        const { first_name, last_name } = firstUserData;
        setFirstName(first_name);
        setLastName(last_name);
        setToEdit(firstUserData);
      } else {
        setRes('No user data found.');
      }
    } catch (error) {
      setRes('Error sending GET request:', error.message);
    }
  };

  useEffect(() => {
    fetchUsers();
  },[]);

  useEffect(() => {
    const cleanup = () => {
      setResponse('');
      setRes('');
    };
    const timeout = setTimeout(() => {
      cleanup();
    },3000);
    setResponse(res);
    return () => clearTimeout(timeout);
  },[res]);

  return (
    <div>
      <h1>REACTJS & NODE EXPRESSJS 'CRUD'</h1>
      <form onSubmit={toEdit !== null ? handleEditUser : handleAddUser}>
        <label>
          First Name:
          <input 
            type="text" 
            value={firstname} 
            onChange={(e) => setFirstName(e.target.value)}
          />
        </label>
        <label>
          Last Name:
          <input 
            type="text" 
            value={lastname}
            onChange={(e) => setLastName(e.target.value)}
          />
        </label>
        <button type="submit">{toEdit !== null ? 'Update' : 'Submit'}</button>
      </form>
      <table style={{border:'solid 2px black'}}>
          <tr>
            <th style={{border:'solid 2px black'}}>Id</th>
            <th style={{border:'solid 2px black'}}>First Name</th>
            <th style={{border:'solid 2px black'}}>Last Name</th>
            <th style={{border:'solid 2px black'}}>Action</th>
          </tr>
        <tbody>
          {
            users && 
            users.map((user,i) => (
              <tr key={i}>
                <td style={{border:'solid 2px black'}}>{user.id}</td>
                <td style={{border:'solid 2px black'}}>{user.first_name}</td>
                <td style={{border:'solid 2px black'}}>{user.last_name}</td>
                <td style={{border:'solid 2px black'}}>
                  <button onClick={() => handleDelete(user.id)}>Delete</button>
                  <button onClick={() => editUser(user.id)}>Edit</button>
                </td>
              </tr>
            ))
          }
        </tbody>
      </table>
      {
        response && (
          <p>Server Response: {response}</p>
        )
      }
    </div>
  );
};

export default App;
