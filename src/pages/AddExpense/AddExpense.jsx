import React, { useEffect, useState } from 'react';
import "./AddExpense.css";
import axios from "axios";
import { toast } from 'react-toastify';
import { useNavigate } from "react-router-dom";
const AddExpense = () => {
    const url =  import.meta.env.VITE_API_URL;
    const navigate = useNavigate();

    const [data, setData] = useState({
        car_id: "",
        state:"",
        name: "",
        description: "",
        price: ""
    });

    const [list, setList] = useState([]);

    const fetchList = async () => {
        try {
            const response = await axios.get(`${url}/api/car/list`);
            if (response.data.success) {
                setList(response.data.data);
            } else {
                toast.error("Error fetching car list");
            }
        } catch (error) {
            toast.error("Server error while fetching car list");
            console.error(error);
        }
    };

    const onChangeHandler = (event) => {
        const { name, value } = event.target;
        setData(prev => ({ ...prev, [name]: value }));
    };

    const onSubmitHandler = async (event) => {
        event.preventDefault();
        if (data.price <= 0) {
            toast.error("Price must be greater than zero");
            return;
        }

        try {
            const payload = {
                car_id: data.car_id,
                state: data.state,
                name: data.name,
                description: data.description,
                price: Number(data.price)
            };
            if (!payload.car_id) delete payload.car_id;
            const response = await axios.post(`${url}/api/car/add-expense`, payload);

            if (response.data.success) {
                toast.success(response.data.message);
                setData({
                    car_id: "",
                    state:"",
                    name: "",
                    description: "",
                    price: ""
                });
                navigate("/admin-car-delux/list-expense");
            } else {
                toast.error(response.data.message || "Failed to add expense");
            }
        } catch (error) {
            toast.error("Something went wrong during submission");
            console.error(error);
        }
    };

    useEffect(() => {
        fetchList();
    }, []);

    return (
        <div className='add'>
            <form className="flex-col" onSubmit={onSubmitHandler}>
                <p>Car ID</p>
                <div className="add-product-name flex-col">
                    <select
                        name="car_id"
                        value={data.car_id}
                        onChange={onChangeHandler}
                        
                    >
                        <option value="-----">add car</option>
                        {
                            list.map((item, index) => (
                                <option key={index} value={item._id}>{item.name}</option>
                            ))
                        }
                    </select>
                </div>
                <div className="add-product-name flex-col">
                <p>black or wight</p>
                <select value={data.state} onChange={onChangeHandler} name="state"  required>
                <option value="">add state</option>
                    <option value="black">black</option>
                    <option value="wight">wight</option>
                </select>
                </div>
                <div className="add-product-name flex-col">
                    <p>Autoname</p>
                    <input type="text" name="name" value={data.name} onChange={onChangeHandler} required />
                </div>
                <div className="add-product-name flex-col">
                    <p>Beschreibung</p>
                    <textarea name="description" value={data.description} onChange={onChangeHandler} rows="6" required />
                </div>
                <div className="add-product-name flex-col">
                    <p>Preis</p>
                    <input type="number" name="price" value={data.price} onChange={onChangeHandler} required />
                </div>
                <button type='submit' className='add-btn'>Hinzufügen</button>
            </form>
        </div>
    );
};

export default AddExpense;
