import React from 'react'
import "./Sidebar.css"
import { assets } from '../../assets/assets'
import { NavLink } from 'react-router-dom'
const Sidebar = () => {
  return (
    <div className='sidebar'>
        <div className="sidebar-options">
            <NavLink to="/admin-car-delux" className="sidebar-option">
                <img src={assets.order_icon} alt="" />
                <p>Autos</p>
            </NavLink>
            <NavLink to="/admin-car-delux/add" className="sidebar-option">
                <img src={assets.add_icon} alt="" />
                <p>Auto hinzufügen</p>
            </NavLink >

            <hr/><hr/>
            <NavLink to="/admin-car-delux/list-expense" className="sidebar-option">
                <img src={assets.order_icon} alt="" />
                <p>  Käufe</p>
            </NavLink>
            <NavLink to="/admin-car-delux/add-expense" className="sidebar-option">
                <img src={assets.add_icon} alt="" />
                <p> Neben den Einkäufen</p>
            </NavLink >

            <hr/><hr/>
            <NavLink to="/admin-car-delux/list-sale" className="sidebar-option">
                <img src={assets.order_icon} alt="" />
                <p>Verkäufe</p>
            </NavLink>
            <NavLink to="/admin-car-delux/add-sale" className="sidebar-option">
                <img src={assets.add_icon} alt="" />
                <p>Neben dem Verkauf</p>
            </NavLink >

            <hr/><hr/>
            <h2>Käufe und Verkäufe nach Datum</h2>
            <NavLink to="/admin-car-delux/car-by-date" className="sidebar-option">
                <img src={assets.order_icon} alt="" />
                <p>Autokäufe</p>
            </NavLink>
           
            <NavLink to="/admin-car-delux/expense-by-date" className="sidebar-option">
                <img src={assets.order_icon} alt="" />
                <p>Andere Käufe</p>
            </NavLink>

           
            <NavLink to="/admin-car-delux/expense-by-date" className="sidebar-option">
                <img src={assets.order_icon} alt="" />
                <p>Verkäufe</p>
            </NavLink>
            
             <hr/><hr/>
             <NavLink to="/admin-car-delux/list-comment" className="sidebar-option">
                <img src={assets.parcel_icon.png} alt="" />
                <p>ReviewList</p>
            </NavLink>
        </div>
      
    </div>
  )
}

export default Sidebar
