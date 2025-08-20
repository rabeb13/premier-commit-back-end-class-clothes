import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getOneProduct, editProduct } from "../../JS/Actions/product";
import { useNavigate, useParams } from "react-router-dom";

const EditProduct = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const productToEdit = useSelector((state) => state.product.productToGet);

  const [product, setProduct] = useState({
    name: "",
    category: "",
    price: "",
    colors: [],
    sizes: [],
    images: [] // { url, color, _id?, file? }
  });

  const [loading, setLoading] = useState(false);

  // Charger le produit depuis le backend
  useEffect(() => {
    dispatch(getOneProduct(id));
  }, [dispatch, id]);

  // Mettre à jour le state local quand productToEdit est chargé
  useEffect(() => {
    if (productToEdit) {
      setProduct({
        name: productToEdit.name || "",
        category: productToEdit.category || "",
        price: productToEdit.price || "",
        colors: productToEdit.colors || [],
        sizes: productToEdit.sizes || [],
        images: productToEdit.images?.map(img => ({
          url: img.url,
          color: img.color || "",
          _id: img._id
        })) || []
      });
    }
  }, [productToEdit]);

  // Gestion des champs texte
  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "colors") setProduct({ ...product, colors: value.split(",").map(c => c.trim()) });
    else if (name === "sizes") setProduct({ ...product, sizes: value.split(",").map(s => s.trim()) });
    else setProduct({ ...product, [name]: value });
  };

  // Gestion fichiers sélectionnés
  const handleFiles = (e) => {
    const selected = Array.from(e.target.files);
    const newImages = selected.map(file => ({
      file,
      url: URL.createObjectURL(file),
      color: ""
    }));
    setProduct({ ...product, images: [...product.images, ...newImages] });
  };

  // Supprimer une image
  const handleRemoveImage = (index) => {
    const updatedImages = [...product.images];
    updatedImages.splice(index, 1);
    setProduct({ ...product, images: updatedImages });
  };

  // Associer une couleur à une image
  const handleImageColorSelect = (index, color) => {
    const updatedImages = [...product.images];
    updatedImages[index].color = color;
    setProduct({ ...product, images: updatedImages });
  };

  // Soumission formulaire
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (product.images.some(img => !img.color)) {
      alert("Chaque image doit avoir une couleur !");
      setLoading(false);
      return;
    }

    try {
      const uploadedImages = [];
      for (let img of product.images) {
        if (img.file) {
          const formData = new FormData();
          formData.append("image", img.file);
          const res = await fetch("http://localhost:5901/api/upload", {
            method: "POST",
            body: formData
          });
          const data = await res.json();
          uploadedImages.push({ url: data.url, color: img.color });
        } else {
          uploadedImages.push({ url: img.url, color: img.color, _id: img._id });
        }
      }

      await dispatch(editProduct(id, { ...product, images: uploadedImages }));
      navigate("/admin");
    } catch (err) {
      console.error(err);
      alert("Erreur lors de la modification !");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="edit-product-page">
      <h2>Modifier le produit</h2>
      <form onSubmit={handleSubmit}>
        <input name="name" placeholder="Nom" value={product.name} onChange={handleChange} required />
        <input name="category" placeholder="Catégorie" value={product.category} onChange={handleChange} required />
        <input name="price" type="number" placeholder="Prix" value={product.price} onChange={handleChange} required />
        <input name="colors" placeholder="Couleurs (séparées par ,)" value={product.colors.join(",")} onChange={handleChange} />
        <input name="sizes" placeholder="Tailles (séparées par ,)" value={product.sizes.join(",")} onChange={handleChange} />

        <label htmlFor="file-upload" style={{
          display: "inline-block", padding: "8px 12px", background: "#007bff", color: "#fff",
          cursor: "pointer", borderRadius: 4, marginTop: 10
        }}>Parcourir...</label>
        <input id="file-upload" type="file" multiple accept="image/*" style={{ display: "none" }} onChange={handleFiles} />

        {/* Preview des images avec choix couleur */}
        <div className="preview" style={{ display: "flex", gap: "10px", marginTop: "10px" }}>
          {product.images.map((img, i) => (
            <div key={i} style={{ textAlign: "center" }}>
              <img src={img.url} alt="preview" width={80} />
              <div style={{ display: "flex", marginTop: 4, flexWrap: "wrap", gap: 4 }}>
                {product.colors.map(c => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => handleImageColorSelect(i, c)}
                    style={{
                      background: c,
                      border: img.color === c ? "2px solid black" : "1px solid #ccc",
                      width: 24,
                      height: 24,
                      cursor: "pointer"
                    }}
                  />
                ))}
              </div>
              <button type="button" onClick={() => handleRemoveImage(i)} style={{ marginTop: 4 }}>Supprimer</button>
            </div>
          ))}
        </div>

        <button type="submit" disabled={loading} style={{ marginTop: 10 }}>
          {loading ? "Chargement..." : "Modifier"}
        </button>
      </form>
    </div>
  );
};

export default EditProduct;
