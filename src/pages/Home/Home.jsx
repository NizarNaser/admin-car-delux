import React, { useContext, useEffect, useState } from 'react'
import "./Home.css"
import axios from "axios"
import { toast } from 'react-toastify';
import { Link} from "react-router-dom";
import moment from 'moment';
import { StoreContext } from "../../context/StoreContext";
import Loader from "../../components/Loader/Loader";
const Home = () => {
  const url =  import.meta.env.VITE_API_URL;
  const [list, setList] = useState([]);
  const { setLoading, loading } = useContext(StoreContext);
  
  const fetchList = async () => {
    const response = await axios.get(`${url + "/api/car/list"}`);
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
      <p>All Cars list</p>
      <div className="list-table">
        <div className="list-table-formats title">
          <b>Bild</b>
          <b>Name</b>
          <b>Preis</b>
          <b>Jahr</b>
          <b>Beschreibung</b>
          <b>Kaufdatum</b>
        </div>
        {loading ? <Loader /> : (
        list.map((item, index) => {
          return (
            <div key={index} className="list-table-formats">
              <p><img src={item.images[0]?.url} alt={item.name} />
              </p>
              <p className='linkToOneCar'><Link to={`/admin-car-delux/one-car/${item._id}`}> {item.name}
              </Link></p>
              <p>{item.price}</p>
              <p>{item.year}</p>
              <p>{item.description}</p>
                <p>{moment(item.createdAt).format('YYYY-MM-DD')}</p>
                
            </div>
          )
        }))}
      </div>

    </div>
  )
}

export default Home

