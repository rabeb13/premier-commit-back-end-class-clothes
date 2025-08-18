import React, { useEffect, useState } from "react";
import axios from "axios";

export default function ProductForm({ token, editingProduct, setEditingProduct, refresh }) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [colors, setColors] = useState("");
  const [sizes, setSizes] = useState("");
  const [images, setImages] = useState("");
  const [category, setCategory] = useState("");

  useEffect(() => {
    if (editingProduct) {
      setName(editingProduct.name);
      setDescription(editingProduct.description);
      setPrice(editingProduct.price);
      setColors(editingProduct.colors.join(","));
      setSizes(editingProduct.sizes.join(","));
      setImages(JSON.stringify(editingProduct.images));
      setCategory(editingProduct.category);
    } else {
      setName(""); setDescription(""); setPrice(""); setColors(""); setSizes(""); setImages(""); setCategory("");
    }
  }, [editingProduct]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const body = {
      name, description, price: Number(price),
      colors: colors.split(","), sizes: sizes.split(","),
      images: JSON.parse(images),
      category
    };

    if (editingProduct) {
      await axios.put(`http://localhost:5901/api/products/${editingProduct._id}`, body, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setEditingProduct(null);
    } else {
      await axios.post("http://localhost:5901/api/products", body, {
        headers: { Authorization: `Bearer ${token}` }
      });
    }
    refresh();
  };

  return (
    <form onSubmit={handleSubmit} style={{ marginBottom:20 }}>
      <input placeholder="Name" value={name} onChange={e=>setName(e.target.value)} />
      <input placeholder="Description" value={description} onChange={e=>setDescription(e.target.value)} />
      <input placeholder="Price" value={price} onChange={e=>setPrice(e.target.value)} />
      <input placeholder="Colors (comma)" value={colors} onChange={e=>setColors(e.target.value)} />
      <input placeholder="Sizes (comma)" value={sizes} onChange={e=>setSizes(e.target.value)} />
      <input placeholder='Images {"red":"url"}' value={images} onChange={e=>setImages(e.target.value)} />
      <input placeholder="Category" value={category} onChange={e=>setCategory(e.target.value)} />
      <button type="submit">{editingProduct ? "Update" : "Add"} Product</button>
    </form>
  );
}
