import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { addProduct } from "../../JS/Actions/product";
import { useNavigate } from "react-router-dom";

const AddProduct = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [product, setProduct] = useState({
    name: "",
    category: "",
    price: "",
    colors: [],
    sizes: [],
    images: [] // { color, url }
  });

  const [files, setFiles] = useState([]); // fichiers sélectionnés
  const [previews, setPreviews] = useState([]); // {file, url, color}
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // nettoyer les URLs temporaires
    return () => {
      previews.forEach(p => URL.revokeObjectURL(p.url));
    };
  }, [previews]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "colors") setProduct({ ...product, colors: value.split(",").map(c => c.trim()) });
    else if (name === "sizes") setProduct({ ...product, sizes: value.split(",").map(s => s.trim()) });
    else setProduct({ ...product, [name]: value });
  };

  const handleFiles = (e) => {
    const selected = Array.from(e.target.files);
    const newPreviews = selected.map(file => ({
      file,
      url: URL.createObjectURL(file),
      color: "" // couleur à sélectionner pour chaque image
    }));
    setFiles(selected);
    setPreviews(newPreviews);
  };

  const handleColorForImage = (index, color) => {
    const newPreviews = [...previews];
    newPreviews[index].color = color;
    setPreviews(newPreviews);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Vérifier que chaque image a une couleur
    if (previews.some(p => !p.color)) {
      alert("Veuillez sélectionner une couleur pour chaque image !");
      setLoading(false);
      return;
    }

    try {
      // 1️⃣ Upload images vers Cloudinary
      const uploadedImages = [];
      for (let p of previews) {
        const formData = new FormData();
        formData.append("image", p.file);

        const res = await fetch("http://localhost:5901/api/upload", {
          method: "POST",
          body: formData
        });
        const data = await res.json(); // { url, public_id }
        uploadedImages.push({ color: p.color, url: data.url });
      }

      // 2️⃣ Créer le produit avec les images Cloudinary
      const productData = { ...product, images: uploadedImages };
      await dispatch(addProduct(productData));

      navigate("/admin");
    } catch (err) {
      console.error("Erreur lors de l'ajout du produit:", err);
      alert("Erreur lors de l'ajout du produit !");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="add-product-page">
      <h2>Ajouter un produit</h2>
      <form onSubmit={handleSubmit}>
        <input name="name" placeholder="Nom" value={product.name} onChange={handleChange} required />
        <input name="category" placeholder="Catégorie" value={product.category} onChange={handleChange} required />
        <input
          name="price"
          type="number"
          step="0.1"
          placeholder="Prix"
          value={product.price}
          onChange={handleChange}
          required
        />
        <input
          name="colors"
          placeholder="Couleurs (ex: red,blue)"
          value={product.colors.join(",")}
          onChange={handleChange}
        />
        <input
          name="sizes"
          placeholder="Tailles (ex: S,M,L)"
          value={product.sizes.join(",")}
          onChange={handleChange}
        />

        <label htmlFor="file-upload" style={{ display: "inline-block", padding: "8px 12px", background: "#007bff", color: "#fff", cursor: "pointer", borderRadius: 4, marginTop: 10 }}>
          Parcourir...
        </label>
        <input id="file-upload" type="file" multiple accept="image/*" style={{ display: "none" }} onChange={handleFiles} />

        {/* Preview et sélection couleur */}
        <div className="preview" style={{ display: "flex", gap: "10px", marginTop: "10px" }}>
          {previews.map((p, i) => (
            <div key={i} style={{ textAlign: "center" }}>
              <img src={p.url} alt="preview" width={80} />
              <select value={p.color} onChange={(e) => handleColorForImage(i, e.target.value)} style={{ marginTop: 4 }}>
                <option value="">Choisir couleur</option>
                {product.colors.map(c => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
          ))}
        </div>

        <button type="submit" disabled={loading} style={{ marginTop: 10 }}>
          {loading ? "Chargement..." : "Ajouter"}
        </button>
      </form>
    </div>
  );
};

export default AddProduct;
