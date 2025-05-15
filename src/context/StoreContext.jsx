/* eslint-disable react/prop-types */

import { createContext, useEffect, useState } from "react";
export const StoreContext = createContext(null)

const StoreContextProvider = (props) => {
    const url =  import.meta.env.VITE_API_URL;
    const [token, setToken] = useState("");
    const [loading, setLoading] = useState(true);

    useEffect(() => {

        async function loadData() {

            if (localStorage.getItem("token")) {
                setToken(localStorage.getItem("token"));

            }
        }
        loadData()
    }, [])
    const contextValue = {

        url,
        token,
        setToken,
        loading, setLoading

    }
    return (
        <StoreContext.Provider value={contextValue}>
            {props.children}
        </StoreContext.Provider>
    )


}

export default StoreContextProvider;