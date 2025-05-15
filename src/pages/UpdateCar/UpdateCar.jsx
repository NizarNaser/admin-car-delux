import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { assets } from '../../assets/assets';
import "./UpdateCar.css";

const UpdateCar = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const url = import.meta.env.VITE_API_URL;

  const [data, setData] = useState({
    name: "",
    price: "",
    year: "",
    description: "",
  });

  const [oldImages, setOldImages] = useState([]); // صور موجودة مسبقًا
  const [newImages, setNewImages] = useState([]); // صور جديدة

  useEffect(() => {
    axios.get(`${url}/api/car/one-item/${id}`)
      .then((res) => {
        setData(res.data);
        if (res.data.images) {
          setOldImages(res.data.images);
        }
      })
      .catch((err) => console.error(err));
  }, [id]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setNewImages((prev) => [...prev, ...files]);
  };

  const handleOldImageRemove = (index) => {
    setOldImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleNewImageRemove = (index) => {
    setNewImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();

    formData.append("name", data.name);
    formData.append("description", data.description);
    formData.append("price", Number(data.price));
    formData.append("year", Number(data.year));

    oldImages.forEach((img) => {
      formData.append("existingImages[]", JSON.stringify(img));
    });

    newImages.forEach((img) => {
      formData.append("images", img);
    });

    try {
      const response = await axios.put(
        `${url}/api/car/update-item/${id}`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      if (response.data.success) {
        alert("تم التحديث بنجاح!");
        navigate("/list");
      } else {
        alert("حدث خطأ أثناء التحديث.");
      }
    } catch (err) {
      console.error("Update failed:", err);
    }
  };

  return (
    <div className="update-car-form">
      <h2>Autoartikel aktualisieren</h2>
      <form onSubmit={handleSubmit}>
        <div className="add-img-upload flex-col">
          <p>Bild hochladen</p>
          <p>size: 205*300 px , format: webp</p>

          <label htmlFor="image" className="image-preview-container cursor-pointer">
            {(oldImages.length > 0 || newImages.length > 0) ? (
              <>
                {oldImages.map((img, index) => (
                  <div key={`old-${index}`} className="image-preview-item">
                    <img src={img.url} alt={`old-${index}`} className="thumbnail" />
                    <button type="button" onClick={(e) => {
                      e.preventDefault();
                      handleOldImageRemove(index);
                    }}>❌</button>
                  </div>
                ))}
                {newImages.map((img, index) => (
                  <div key={`new-${index}`} className="image-preview-item">
                    <img src={URL.createObjectURL(img)} alt={`new-${index}`} className="thumbnail" />
                    <button type="button" onClick={(e) => {
                      e.preventDefault();
                      handleNewImageRemove(index);
                    }}>❌</button>
                  </div>
                ))}
              </>
            ) : (
              <img src={assets.upload_area} alt="placeholder" />
            )}
          </label>

          <input
            type="file"
            id="image"
            multiple
            accept="image/*"
            onChange={handleImageChange}
            style={{ display: "none" }}
          />
        </div>

        <p>Autoname</p>
        <input type="text" name="name" value={data.name} onChange={handleChange} required />

        <p>Preis</p>
        <input type="number" name="price" value={data.price} onChange={handleChange} required />

        <p>Jahr</p>
        <input type="number" min="1950" max="2099" name="year" value={data.year} onChange={handleChange} required />

        <p>Beschreibung</p>
        <textarea name="description" value={data.description} onChange={handleChange} rows="6" required></textarea>

        <button type="submit">Aktualisieren</button>
      </form>
    </div>
  );
};

export default UpdateCar;
