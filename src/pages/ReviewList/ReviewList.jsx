import React, { useContext, useEffect, useState } from 'react'
import "./ReviewList.css"
import axios from "axios"
import { toast } from 'react-toastify';
import { Link,  useParams } from "react-router-dom";
import { StoreContext } from "../../context/StoreContext";
import Loader from "../../components/Loader/Loader";
import moment from 'moment';
const ReviewList = () => {
  const url =  import.meta.env.VITE_API_URL;
  const [list, setList] = useState([]);
  const { id } = useParams();
 const { setLoading, loading } = useContext(StoreContext);

  
  const fetchList = async () => {
    const response = await axios.get(`${url+"/api/reviews/list-comment"}`);
    if (response.data.success) {
      setList(response.data.data);
      setLoading(false);
    } else {
      toast.error("Error");
      setLoading(false);
    }
  }

  const removeComment = async (id) => {
    try {
      const res = await axios.post(`${url}/api/reviews/remove`, { id });
      if (res.data.success) {
        toast.success("Comment Removed");
        fetchList(); // إعادة تحميل القائمة بعد الحذف
      } else {
        toast.error(res.data.message || "Error removing comment");
      }
    } catch (error) {
      console.error(error);
      toast.error("Error removing comment");
    }
  };
  

  useEffect(() => {
    fetchList();

  }, [])
  return (
    <div className='list add flex-col'>
      <p>Comments</p>
      <div className="list-table">
        <div className="list-table-formats title">
          <b>Numer</b>
          <b>carId</b>
          <b>user</b>
          <b>rating</b>
          <b>comment</b>
          <b>createdAt</b>
          <b>remove</b>
        </div>
        {loading ? <Loader /> : (
        list.map((item,index) => {
          return (
            <div key={item._id} className="list-table-formats">
              <p>{index+1}</p>
              <p>{item.carId}</p>
              <p className='linkToOneCar'> {item.user}</p>
              <p>{item.rating}</p>
              <p>{item.comment}</p>
                <p>{moment(item.createdAt).format('YYYY-MM-DD-H-M-S')}</p>
                <p><button className="delete-btn" onClick={() => removeComment(item._id)} >löschen</button></p>
                
            </div>
          )
        }))}
      </div>

    </div>
  )
}

export default ReviewList

