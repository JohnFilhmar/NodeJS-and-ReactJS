import { useEffect, useState } from 'react';
import axios from 'axios';

const Home = () => {
  const baseUrl = 'https://localhost:5000/api';
  const [data, setData] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [payload, setPayload] = useState({
    id: '',
    name: '',
    age: '',
    sex: 'male'
  });
  const [toUpdate, setToUpdate] = useState(false);

  async function getData() {
    try {
      const res = await axios.get(`${baseUrl}/getusers`);
      if (res.data) {
        setData(res?.data?.data);
      }
    } catch (error) {
      console.error(error);
      return null;
    }      
  };

  useEffect(() => {
    getData();
  }, []);
  
  function clean() {
    setPayload({
      name: '',
      age: '',
      sex: 'male'
    });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!toUpdate) {
      try {
        const res = await axios.post(`${baseUrl}/addUser`, payload);
        if (res?.status === 200) {
          setData(prev => ([
            ...prev,
            payload
          ]));
          clean();
        }
      } catch (error) {
        console.error(error);
      }
    }
    setToUpdate(false);
  };

  async function handleUpdate(e) {
    e.preventDefault();
    try {
      const newPayload = {
        ...data[selectedId],
        ...payload,
      }
      const res = await axios.post(`${baseUrl}/editUser`, newPayload);
      if (res?.status === 202) {
        getData();
        clean();
        setToUpdate(false);
      }
    } catch (error) {
      console.error(error);
    }
  }  

  async function handleDelete(e, id) {
    e.preventDefault();
    try {
      const res = await axios.post(`${baseUrl}/deleteUser/${data[selectedId].id}`);
      if (res?.status === 202) {
        setData(prev => prev.filter((_, i) => i !== id));
      }
    } catch (error) {
      console.error(error);
    }
  };

  function handleEdit(e, id) {
    e.preventDefault();
    setToUpdate(true);
    setPayload({
      name: data[id].name,
      age: data[id].age,
      sex: data[id].sex,
    });
    setSelectedId(id);
  };
  
  return ( 
    <div className="flex flex-col min-h-screen justify-center items-center">

      <div className="flex justify-between items-center bg-[#00093f] text-blue-200 font-bold rounded-md">
        <form onSubmit={!toUpdate ? handleSubmit : handleUpdate} className="p-2 rounded-md flex flex-col">
          <p className="p-2 text-xl">Inputs:</p>

          <div className="p-2 flex gap-2 justify-between">
            <label htmlFor="name" className="">Name:</label>
            <input maxLenght={30} required className='bg-blue-950 rounded-sm border-transparent font-semibold underline' placeholder='Enter values...' value={payload.name} onChange={(e) => setPayload(prev => ({ ...prev, name: e.target.value }))} type="text" name="name" id="name" />
          </div>
          
          <div className="p-2 flex gap-2 justify-between">
            <label htmlFor="age" className="">Age:</label>
            <input max={99} required className='bg-blue-950 rounded-sm border-transparent font-semibold underline' placeholder='Enter values...' value={payload.age} onChange={(e) => setPayload(prev => ({ ...prev, age: e.target.value }))} type="number" name="age" id="age" />
          </div>
          
          <div className="p-2 flex gap-2 justify-between">
            <label htmlFor="sex" className="">Sex:</label>
            <input checked={payload.sex === 'male'} onClick={(e) => setPayload(prev => ({ ...prev, sex: e.target.value }))} type="radio" name="sex" id="male" value={"male"} />
            <label htmlFor="male">Male</label>
            <input checked={payload.sex === 'female'} onClick={(e) => setPayload(prev => ({ ...prev, sex: e.target.value }))} type="radio" name="sex" id="female" value={"female"} />
            <label htmlFor="female">Female</label>
          </div>

          <button className='bg-blue-200 text-blue-950 rounded-md hover:text-blue-200 hover:bg-blue-800'>{toUpdate ? 'Update' : 'Add' }</button>
          
        </form>
      </div>
      
      <div className="flex flex-col justify-start items-center p-2 rounded-md drop-shadow-md">
        <div className="p-2 bg-[#00093f] text-blue-100 rounded-tl-md rounded-tr-md w-full">
          <p className="font-bold text-sm md:textbase lg:text-lg">Users Table</p>
        </div>
        <div className="flex justify-around items-center p-2 bg-blue-200 text-blue-800 rounded-bl-md rounded-br-md w-full max-h-[500px] overflow-auto">

          <table className="table-auto w-[500px] text-center">

            {(!data || data.length === 0) && (
              <tbody className='text-lg font-bold animate-pulse text-blue-900'>
                Table Empty, Add some data
              </tbody>
            )}
            
            <thead>
              {data && data.length > 0 && (
              <tr className="p-2 bg-blue-700 text-blue-50 rounded-md">
                {Object.keys(data[0]).map((key, i) => (
                  <th>{key.substring(0,1).toUpperCase() + key.substring(1)}</th>
                ))}
                <th>Options</th>
              </tr>
              )}
            </thead>

            <tbody>
              {data && data.map((dat, i) => (
                <tr key={i}>
                  {Object.values(dat).map((val, j) => (
                    <>
                      <td className="text-base font-medium" key={j}>{val.length > 8 ? String(val).substring(0, 8) + '...' : val}</td>
                    </>
                  ))}
                  <td className="text-base font-medium grid grid-cols-2 items-center p-1 w-full gap-2">

                    <button onClick={(e) => handleDelete(e, i)} className="text-center hover:bg-blue-500 hover:text-blue-950 p-1 bg-blue-400 rounded-md text-blue-800">Delete</button>
                    <button onClick={(e) => handleEdit(e, i)} className="text-center hover:bg-blue-500 hover:text-blue-950 p-1 bg-blue-400 rounded-md text-blue-800">Edit</button>
                    
                  </td>
                </tr>
              ))}
            </tbody>

            <tfoot>
              {data && data.length > 0 && (
                
              <tr className="p-2 bg-blue-700 text-blue-50 rounded-md">
                {Object.keys(data[0]).map((key, i) => (
                  <th>{key.substring(0,1).toUpperCase() + key.substring(1)}</th>
                ))}
                <th>Options</th>
              </tr>
              )}
            </tfoot>

          </table>

        </div>
      </div>
    </div>
  );
}
 
export default Home;