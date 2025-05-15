import "./Add.css";
import { assets } from '../../assets/assets';
import axios from "axios";
import { toast } from 'react-toastify';
import MDEditor from '@uiw/react-md-editor';
import '@uiw/react-md-editor/markdown-editor.css';
import { useState } from "react";

const Add = () => {
  const url = import.meta.env.VITE_API_URL;

  const [value, setValue] = useState("**Willkommen!**");
  const [images, setImages] = useState([]); // لدعم صور متعددة
  const [data, setData] = useState({
    state: "",
    name: "",
    price: "",
    year: ""
  });

  const onChangeHandler = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    setData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setImages((prev) => [...prev, ...files]);
  };

  const handleImageRemove = (index) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  const onSubmitHandler = async (event) => {
    event.preventDefault();
    const formData = new FormData();
    formData.append("state", data.state);
    formData.append("name", data.name);
    formData.append("description", value);
    formData.append("price", Number(data.price));
    formData.append("year", Number(data.year));
    images.forEach((img) => formData.append("images", img));

    try {
      const response = await axios.post(`${url}/api/car/add`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (response.data.success) {
        setData({ state: "", name: "", price: "", year: "" });
        setValue("**Willkommen!**");
        setImages([]);
        toast.success(response.data.message);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error("حدث خطأ أثناء الإرسال");
    }
  };

  return (
    <div className='add'>
      <form className="flex-col" onSubmit={onSubmitHandler}>
        <div className="add-img-upload flex-col">
          <p>Bild hochladen</p>
          <p>size: 605×300 px, format: webp</p>

          <label htmlFor="image" className="image-preview-container cursor-pointer">
            {images.length > 0 ? (
              images.map((img, index) => (
                <div key={index} className="image-preview-item">
                  <img
                    src={URL.createObjectURL(img)}
                    alt={`preview-${index}`}
                    className="thumbnail"
                  />
                  <button
                    type="button"
                    onClick={() => handleImageRemove(index)}
                    className="remove-image-btn"
                  >
                    ❌
                  </button>
                </div>
              ))
            ) : (
              <img src={assets.upload_area} alt="Upload Preview" />
            )}
          </label>

          <input
            onChange={handleImageChange}
            type="file"
            id="image"
            hidden
            multiple
            accept="image/*"
            required={images.length === 0}
          />
        </div>

        <p>black or white</p>
        <select value={data.state} onChange={onChangeHandler} name="state" required>
          <option value="">add state</option>
          <option value="black">black</option>
          <option value="white">white</option>
        </select>

        <div className="add-product-name flex-col">
          <p>Autoname</p>
          <input
            onChange={onChangeHandler}
            value={data.name}
            type="text"
            name="name"
            placeholder="Type here"
            required
          />
        </div>

        <div className="add-product-description flex-col">
          <p>Beschreibung (Markdown)</p>
          <div data-color-mode="light">
            <MDEditor value={value} onChange={setValue} height={300} />
          </div>
        </div>

        <div className="add-category-price">
          <div className="add-price flex-col">
            <p>Preis</p>
            <input
              onChange={onChangeHandler}
              value={data.price}
              type="number"
              name="price"
              placeholder="$20"
              required
            />
          </div>
          <div className="add-the-weight flex-col">
            <p>Jahr</p>
            <input
              onChange={onChangeHandler}
              value={data.year}
              type="number"
              min="1950"
              max="2099"
              name="year"
              placeholder="2015"
              required
            />
          </div>
        </div>

        <button type="submit" className="add-btn">Hinzufügen</button>
      </form>
    </div>
  );
};

export default Add;
