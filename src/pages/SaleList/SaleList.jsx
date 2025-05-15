import React, { useContext, useEffect, useState } from 'react'
import "./SaleList.css"
import axios from "axios"
import { toast } from 'react-toastify';
import { Link,  useParams } from "react-router-dom";
import { StoreContext } from "../../context/StoreContext";
import Loader from "../../components/Loader/Loader";
import moment from 'moment';
const SaleList = () => {
  const url =  import.meta.env.VITE_API_URL;
  const [list, setList] = useState([]);
  const { id } = useParams();
 const { setLoading, loading } = useContext(StoreContext);

  
  const fetchList = async () => {
    const response = await axios.get(`${url+"/api/sale/list-sale"}`);
    if (response.data.success) {
      setList(response.data.data);
      setLoading(false);
    } else {
      toast.error("Error");
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchList();

  }, [])
  return (
    <div className='list add flex-col'>
      <p>Verkäufe</p>
      <div className="list-table">
        <div className="list-table-formats title">
          <b>Numer</b>
          <b>Name</b>
          <b>Preis</b>
          <b>Beschreibung</b>
          <b>Kaufdatum</b>
        </div>
        {loading ? <Loader /> : (
        list.map((item,index) => {
          return (
            <div key={item._id} className="list-table-formats">
              <p>{index+1}</p>
              <p className='linkToOneCar'><Link to={`/admin-car-delux/one-sale/${item._id}`}> {item.name}
              </Link></p>
              <p>{item.price}</p>
              <p>{item.description}</p>
                <p>{moment(item.createdAt).format('YYYY-MM-DD')}</p>
                
            </div>
          )
        }))}
      </div>

    </div>
  )
}

export default SaleList

