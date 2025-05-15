import React, { useContext, useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import axios from "axios";
import "./OneCar.css";
import moment from 'moment';
import { StoreContext } from "../../context/StoreContext";
import Loader from "../../components/Loader/Loader";
const OneCar = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [listExpense, setListExpense] = useState([]);
  const [allPrice, setAllPrice] = useState(0);
 const { setLoading, loading } = useContext(StoreContext);
  const url = import.meta.env.VITE_API_URL;
  const fetchList = async () => {
    try {
      const response = await axios.get(`${url}/api/car/list-car-expense/${id}`);
      setListExpense(response.data.data);  // تحديد البيانات في الحالة
    } catch (err) {
      console.error("Error fetching expenses:", err);
    }
  };
  
  // في الأعلى
  const [data, setData] = useState({
    state: "",
    name: "",
    price: "",
    year: "",
    description: "",
    images: [], // الصور القديمة
  });

  const [newImages, setNewImages] = useState([]); // صور جديدة
  const [deletedImages, setDeletedImages] = useState([]); // صور محذوفة

  // جلب البيانات
  useEffect(() => {
    fetchList();
    axios.get(`${url}/api/car/one-item/${id}`)
      .then((res) => {
        setData(res.data);
      })
      .catch((err) => console.error(err));
  }, [id]);

  // حذف صورة قديمة
  const handleOldImageRemove = (index) => {
    const removedImage = data.images[index];
    const updatedImages = data.images.filter((_, i) => i !== index);
    setData((prev) => ({ ...prev, images: updatedImages }));
    setDeletedImages((prev) => [...prev, removedImage.public_id]); // تخزين public_id للحذف من Cloudinary
  };

  // حذف صورة جديدة قبل الإرسال
  const handleNewImageRemove = (index) => {
    const updated = newImages.filter((_, i) => i !== index);
    setNewImages(updated);
  };

  // عند اختيار صور جديدة
  const handleNewImages = (e) => {
    setNewImages([...newImages, ...Array.from(e.target.files)]);
  };

  // التحديث
  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("state", data.state);
    formData.append("name", data.name);
    formData.append("description", data.description);
    formData.append("price", Number(data.price));
    formData.append("year", Number(data.year));

    // الصور القديمة
    data.images.forEach((img) => {
      formData.append("existingImages[]", JSON.stringify(img));
    });

    // الصور الجديدة
    newImages.forEach((img) => {
      formData.append("images", img);
    });

    // الصور المحذوفة
    deletedImages.forEach((public_id) => {
      formData.append("deletedImages[]", public_id);
    });

    try {
      const response = await axios.put(
        `${url}/api/car/update-item/${id}`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      if (response.data.success) {
        alert("تم التحديث بنجاح!");
        navigate("/admin-car-delux");
      } else {
        alert("حدث خطأ أثناء التحديث.");
      }
    } catch (err) {
      console.error("Update failed:", err);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  return (
    <div className="update-car-form">
      <h2>Autoartikel aktualisieren</h2>
      <form onSubmit={handleSubmit}>
        <div className="add-img-upload flex-col">
          <div className="add-img-upload flex-col">
            <p>Bild hochladen</p>
            <p>size: 605*300 px , format: webp</p>

            <div className="image-preview-container">
              {loading ? <Loader /> : (
              data.images.map((img, index) => (
                <div key={`old-${index}`} className="image-preview-item">
                  <img src={img.url} alt={`img-${index}`} className="thumbnail" />
                  <button type="button" onClick={() => handleOldImageRemove(index)}>❌</button>
                </div>
              )))}

              {loading ? <Loader /> : (
              newImages.map((img, index) => (
                <div key={`new-${index}`} className="image-preview-item">
                  <img src={URL.createObjectURL(img)} alt={`new-${index}`} className="thumbnail" />
                  <button type="button" onClick={() => handleNewImageRemove(index)}>❌</button>
                </div>
              )))}
            </div>

            <input type="file" id="image" multiple onChange={handleNewImages} hidden />
            <label htmlFor="image" className="upload-label">إضافة صور</label>
          </div>

        </div>

        <p>black or wight</p>
        <select onChange={handleChange} name="state">
          <option value={data.state}>{data.state}</option>
          <option value="black">black</option>
          <option value="wight">wight</option>
        </select>

        <p>Autoname</p>
        <input type="text" name="name" value={data.name} onChange={handleChange} required />

        <p>Preis</p>
        <input type="number" name="price" value={data.price} onChange={handleChange} required />

        <p>Jahr</p>
        <input type="number" min="1950" max="2099" name="year" value={data.year} onChange={handleChange} required />

        <p>Beschreibung</p>
        <textarea name="description" value={data.description} onChange={handleChange} rows="6" required></textarea>

        <h2>Kosten</h2>
        {loading ? <Loader /> : (
        listExpense.map((item, index) => (
          <div key={item._id} className="list-table-formats">
            <p>{index + 1}</p>
            <p>{item.name}</p>
            <p>{item.price}</p>
            <p>{item.description}</p>
            <p>{moment(item.createdAt).format('YYYY-MM-DD')}</p>
          </div>
        )))}

        <p className="allPrice">{allPrice} <strong>die Gesamtsumme</strong></p>
        <p className="TotalWithCarPrice">{allPrice + data.price} <strong>Gesamtbetrag mit Autopreis</strong></p>

        <button type="submit">Aktualisieren</button>
        <Link className="AddNewExpense-btn" to={"/admin-car-delux/add-expense"}>Neue Ausgabe hinzufügen</Link>
        <button className="delete-btn" onClick={() => removeCar(data._id)}>löschen</button>
      </form>
    </div>
  );
};

export default OneCar;
