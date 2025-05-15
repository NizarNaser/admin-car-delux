import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import axios from "axios";
import "./OneExpense.css";
const OneExpense = () => {
  const url =  import.meta.env.VITE_API_URL;
  const { id } = useParams();
  const navigate = useNavigate();


  const [list,setList] = useState([]);
  const fetchList = async () =>{
    const response = await axios.get(`${url+"/api/car/list"}`);
    if(response.data.success){
      setList(response.data.data);
    }else{
      toast.error("Error");
    }
  }

  const [data, setData] = useState({
    car_id: "",
    state:"",
    name: "",
    price: "",
    description: ""

  });

  useEffect(() => {
    axios.get(`${url + "/api/car/one-expense/" + id}`)
      .then((res) => {
        setData(res.data);

      })
      .catch((err) => console.error(err));

  }, [id]);

  const handleChange = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    setData(data => ({ ...data, [name]: value }))
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    const updatedData = {
      car_id: data.car_id,
      state: data.state,
      name: data.name,
      description: data.description,
      price: Number(data.price),
    };
  
    try {
      const response = await axios.put(`${url}/api/car/update-expense/${id}`,updatedData);
  
      if (response.data.success) {
        alert("تم التحديث بنجاح!");
        navigate("/admin-car-delux/list-expense");
      } else {
        alert("حدث خطأ أثناء التحديث.");
      }
    } catch (err) {
      console.error("Update failed:", err);
    }
  };
  
  const removeExpense = async (expenseId) => {
    const response = await axios.post(`${url + "/api/car/remove-expense"}`, { id: expenseId });
    if (response.data.success) {
      alert("تم التحديث بنجاح!");
      navigate("/admin-car-delux/expense-list");
    } else {
      toast.error("Error");
    }
  }
  useEffect(()=>{

    fetchList();
 },[])
  return (


    <div className="update-car-form">
      <h2>Autoartikel aktualisieren</h2>
      <form onSubmit={handleSubmit}>
        {/* الحقول */}
        <p>car id</p>
        <select onChange={handleChange} name="car_id" >
        <option value={data.car_id}>{data.car_id}</option>
        <option value="------">-- Select Car --</option>
          {list.map((item, index) => {
            return (
              
              <option key={index} value={item._id}>{item.name}</option>
            )
          })}
        </select>
        <p>black or wight</p>
                <select value={data.state} onChange={handleChange} name="state" >
                    <option value="black">black</option>
                    <option value="wight">wight</option>
                </select>
        <p>Autoname</p>
        <input type="text" name="name" value={data.name} onChange={handleChange} required />

        <p>Beschreibung</p>
        <textarea name="description" value={data.description} onChange={handleChange} rows="6" required></textarea>
        <p>Preis</p>
        <input type="number" name="price" value={data.price} onChange={handleChange} required />
        <button type="submit">Aktualisieren</button>
        <Link className="AddNewExpense-btn" to={"/admin-car-delux/add-expense"}>Neue Ausgabe hinzufügen</Link>
        <button className="delete-btn" onClick={() => removeExpense(data._id)} >löschen</button>
      </form>
    </div>

  );
};

export default OneExpense;
