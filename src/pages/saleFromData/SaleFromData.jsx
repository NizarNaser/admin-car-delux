import React, { useState , useRef, useEffect, useContext } from 'react';
import "./SaleFromData.css";
import { StoreContext } from "../../context/StoreContext";
import Loader from "../../components/Loader/Loader";
const SaleFromData = () => {
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [cars, setCars] = useState([]);
        const [state, setState] = useState('');
    const printRef = useRef();
    const [allPrice, setAllPrice] = useState(0);
const { setLoading, loading } = useContext(StoreContext);
    const url =  import.meta.env.VITE_API_URL;

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!startDate || !endDate || !state) {
            alert(" يرجى تحديد تاريخ البداية والنهاية والستات");
            return;
        }

        try {
            const res = await fetch(`${url}/api/car/sale-by-date?start=${startDate}&end=${endDate}&state=${state}`);
            const data = await res.json();
            setCars(data);
            setLoading(false);
        } catch (error) {
            console.error("حدث خطأ أثناء جلب البيانات", error);
            setLoading(false);
        }
    };

    // ✅ حساب مجموع الأسعار بعد كل تحديث للبيانات
    useEffect(() => {
        const total = cars.reduce((sum, car) => sum + (car.price || 0), 0);
        setAllPrice(total);
    }, [cars]);

    const handlePrint = () => {
        const printContents = printRef.current.innerHTML;
        const originalContents = document.body.innerHTML;

        document.body.innerHTML = printContents;
        window.print();
        document.body.innerHTML = originalContents;
        window.location.reload();
    };

    return (
        <div className='list add flex-col'>
            {/* 🔍 نموذج البحث */}
            <form onSubmit={handleSubmit} className="flex-col no-print">
            <div className="add-product-name flex-col">
            <label>أبيض أو أسود</label>
                    <select value={state} onChange={e => setState(e.target.value)} name="state" required>
                    <option value="">add state</option>
                        <option value="black">black</option>
                        <option value="wight">wight</option>
                    </select>
                </div>
                <div className="add-product-name flex-col">
                    <label>تاريخ البداية</label>
                    <input type="date" value={startDate} onChange={e => setStartDate(e.target.value)} className="border p-2 rounded text-right" />
                </div>
                <div className="add-product-name flex-col">
                    <label>تاريخ النهاية</label>
                    <input type="date" value={endDate} onChange={e => setEndDate(e.target.value)} className="border p-2 rounded text-right" />
                </div>
                <button type="submit" className='add-btn'>بحث</button>
            </form>

            {/* زر الطباعة */}
            {cars.length > 0 && (
                <div className="text-center mb-4 no-print">
                    <button onClick={handlePrint} className='add-btn'>
                        طباعة النتائج
                    </button>
                </div>
            )}

            {/* ✅ منطقة الطباعة */}
            <div ref={printRef}>
                <div>
                    <h2 className="text-center mb-2">قائمة السيارات</h2>
                    <div className="list-table">
                        <div className="list-table-formats title">
                            <b>N</b>
                            <b>{t('Name')}</b>
                            <b>{t('Price')}</b>
                            <b>{t('description')}</b>
                            <b>{t('PurchaseDate')}</b>
                        </div>

                        {cars.length === 0 && <p className="text-center text-gray-500">لا توجد نتائج لعرضها</p>}

                        {loading ? <Loader /> : (
                        cars.map((car, index) => (
                            <div key={car._id || index} className="list-table-formats">
                                <p>{index + 1}</p>
                                <p className='linkToOneCar'>{car.name}</p>
                                <p>{car.price}</p>
                                <p>{car.description}</p>
                                <p>{car.createdAtFormatted}</p>
                            </div>
                        )))}

                        {/* ✅ مجموع الأسعار */}
                        <div className="list-table-formats total-row">
                            <p colSpan="4"><strong>المجموع الكلي</strong></p>
                            <p></p>
                            <p></p>
                            <p></p><p><strong>{allPrice} €</strong></p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default SaleFromData;
