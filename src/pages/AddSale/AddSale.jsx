import React, { useEffect, useState } from 'react';
import "./AddSale.css";
import axios from "axios";
import { toast } from 'react-toastify';
import { useNavigate } from "react-router-dom";
const AddSale = () => {
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
                car_id: data.car_id ,
                state: data.state,
                name: data.name,
                description: data.description,
                price: Number(data.price)
            };
            if (!payload.car_id) delete payload.car_id;
            const response = await axios.post(`${url}/api/sale/add-sale`, payload);

            if (response.data.success) {
                if(data.car_id){
                    removeCar(data.car_id)
                }
                
                toast.success(response.data.message);
                setData({
                    car_id: "",
                    state:"",
                    name: "",
                    description: "",
                    price: ""
                });
                navigate("/admin-car-delux/list-sale");
            } else {
                toast.error(response.data.message || "Failed to add sale");
            }
        } catch (error) {
            toast.error("Something went wrong during submission");
            console.error(error);
        }
    };

    const removeCar = async (carId) => {
        const response = await axios.post(`${url + "/api/car/remove"}`, { id: carId });
        if (response.data.success) {
          alert("تم التحديث بنجاح!");
                  navigate("/admin-car-delux");
        } else {
          toast.error("Error");
        }
      }

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
                    disabled={list.length === 0}
                >
                    <option value="">-- Select Car --</option>
                    {list.length === 0 ? (
                        <option disabled>No cars available</option>
                    ) : (
                        list.map((item, index) => (
                            <option key={index} value={item._id}>{item.name}</option>
                        ))
                    )}
                </select>
                </div>
                <div className="add-product-name flex-col">
                <p>black or wight</p>
                <select onChange={onChangeHandler} name="state" value={data.state} required>
                <option value="">add state</option>
                    <option value="black">black</option>
                    <option value="wight">wight</option>
                </select>
                </div>
                <div className="add-product-name flex-col">
                    <p>Spesenname</p>
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

export default AddSale;
