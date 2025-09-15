import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { addProduct } from "../../JS/Actions/product";
import { useNavigate } from "react-router-dom";

const emptyProduct = () => ({
  name: "",
  category: "",
  price: "",
  colors: [],   // ["red","blue"]
  sizes: [],    // ["S","M","L"]
  images: []    // [{ color, url }]
});

const emptyRow = () => ({
  product: emptyProduct(),
  files: [],    // File[]
  previews: []  // [{file, url, color}]
});

const AddProduct = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // ✅ plusieurs lignes
  const [rows, setRows] = useState([emptyRow()]);
  const [loading, setLoading] = useState(false);

  const handleChange = (idx, e) => {
    const { name, value } = e.target;
    setRows(prev => {
      const copy = [...prev];
      if (name === "colors") {
        copy[idx].product.colors = value.split(",").map(c => c.trim()).filter(Boolean);
      } else if (name === "sizes") {
        copy[idx].product.sizes = value.split(",").map(s => s.trim()).filter(Boolean);
      } else if (name === "price") {
        copy[idx].product.price = value;
      } else {
        copy[idx].product[name] = value;
      }
      return copy;
    });
  };

  // ✅ append des images (ne pas écraser les anciennes)
  const handleFiles = (idx, e) => {
    const selected = Array.from(e.target.files || []);
    if (!selected.length) return;

    const newPreviews = selected.map(file => ({
      file,
      url: URL.createObjectURL(file),
      color: "" // couleur à choisir pour chaque image
    }));

    setRows(prev => {
      const copy = [...prev];
      copy[idx].files = [...(copy[idx].files || []), ...selected];
      copy[idx].previews = [...(copy[idx].previews || []), ...newPreviews];
      return copy;
    });

    // réinitialiser input pour pouvoir re-sélectionner après
    e.target.value = null;
  };

  const handleColorForImage = (rowIdx, previewIdx, color) => {
    setRows(prev => {
      const copy = [...prev];
      copy[rowIdx].previews = copy[rowIdx].previews.map((p, i) =>
        i === previewIdx ? { ...p, color } : p
      );
      return copy;
    });
  };

  const addRow = () => setRows(prev => [...prev, emptyRow()]);

  const removeLine = (idx) => {
    setRows((prev) => {
      if (prev.length === 1) return prev;
      prev[idx].previews.forEach((p) => URL.revokeObjectURL(p.url));
      return prev.filter((_, i) => i !== idx);
    });
  };

  const removePreview = (rowIdx, previewIdx) => {
    setRows(prev => {
      const copy = [...prev];
      const prevs = copy[rowIdx].previews || [];
      const files = copy[rowIdx].files || [];

      const toRemove = prevs[previewIdx];
      if (toRemove?.url) URL.revokeObjectURL(toRemove.url);

      copy[rowIdx].previews = prevs.filter((_, i) => i !== previewIdx);
      copy[rowIdx].files = files.filter((_, i) => i !== previewIdx);
      return copy;
    });
  };

  const isRowFilled = (r) =>
    r.product.name.trim() || r.product.category.trim() || r.product.price || r.files.length;

  const validateRow = (r, idx) => {
    const errors = [];
    if (!isRowFilled(r)) return errors;
    if (!r.product.name.trim()) errors.push(`Ligne ${idx + 1}: nom requis`);
    if (!r.product.category.trim()) errors.push(`Ligne ${idx + 1}: catégorie requise`);
    if (r.product.price === "" || isNaN(Number(r.product.price)) || Number(r.product.price) <= 0)
      errors.push(`Ligne ${idx + 1}: prix invalide`);
    if (r.previews.some(p => !p.color))
      errors.push(`Ligne ${idx + 1}: sélectionnez une couleur pour chaque image`);
    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const flatErrors = rows.flatMap((r, i) => validateRow(r, i));
    if (flatErrors.length) {
      alert("Veuillez corriger:\n\n" + flatErrors.join("\n"));
      return;
    }

    const toCreate = rows.filter(isRowFilled);
    if (!toCreate.length) {
      alert("Aucune ligne remplie.");
      return;
    }

    setLoading(true);
    try {
      for (const r of toCreate) {
        const uploadedImages = [];
        for (const p of r.previews) {
          const formData = new FormData();
          formData.append("image", p.file);
          const res = await fetch("http://localhost:5901/api/upload", {
            method: "POST",
            body: formData
          });
          if (!res.ok) throw new Error(`Upload image échoué (status ${res.status})`);
          const data = await res.json();
          uploadedImages.push({ color: p.color, url: data.url });
        }

        const productData = {
          name: r.product.name.trim(),
          category: r.product.category.trim(),
          price: Number(r.product.price || 0),
          colors: r.product.colors,
          sizes: r.product.sizes,
          images: uploadedImages
        };
        await dispatch(addProduct(productData));
      }

      alert(`✅ ${toCreate.length} produit(s) ajoutés`);
      setRows([emptyRow()]);
      navigate("/admin");
    } catch (err) {
      console.error(err);
      alert("❌ Erreur lors de l'ajout multiple: " + (err?.message || err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="add-product-page">
      <h2>Ajouter un produit</h2>

      <div style={{ marginBottom: 10, display: "flex", gap: 8 }}>
        <button type="button" onClick={addRow}>+ Ajouter une ligne</button>
      </div>

      <form onSubmit={handleSubmit}>
        {rows.map((row, idx) => (
          <div key={idx} style={{ marginBottom: 18 }}>
            <div style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}>
              <input
                name="name"
                placeholder="Nom"
                value={row.product.name}
                onChange={(e) => handleChange(idx, e)}
                style={{ minWidth: 180 }}
              />
              <input
                name="category"
                placeholder="Catégorie"
                value={row.product.category}
                onChange={(e) => handleChange(idx, e)}
                style={{ minWidth: 160 }}
              />
              <input
                name="price"
                type="number"
                step="0.1"
                placeholder="Prix"
                value={row.product.price}
                onChange={(e) => handleChange(idx, e)}
                style={{ width: 90 }}
              />
              <input
                name="colors"
                placeholder="Couleurs (ex: red,blue)"
                value={row.product.colors.join(",")}
                onChange={(e) => handleChange(idx, e)}
                style={{ minWidth: 200 }}
              />
              <input
                name="sizes"
                placeholder="Tailles (ex: S,M,L)"
                value={row.product.sizes.join(",")}
                onChange={(e) => handleChange(idx, e)}
                style={{ minWidth: 180 }}
              />

              <label
                htmlFor={`file-upload-${idx}`}
                style={{
                  display: "inline-block",
                  padding: "8px 12px",
                  background: "#007bff",
                  color: "#fff",
                  cursor: "pointer",
                  borderRadius: 4
                }}
              >
                Parcourir…
              </label>
              <input
                id={`file-upload-${idx}`}
                type="file"
                multiple
                accept="image/*"
                style={{ display: "none" }}
                onChange={(e) => handleFiles(idx, e)}
              />

              {rows.length > 1 && (
                <button type="button" onClick={() => removeLine(idx)} style={{ marginLeft: 6 }}>
                  🗑
                </button>
              )}
            </div>

            {row.previews.length > 0 && (
              <div style={{ display: "flex", gap: 10, marginTop: 8, flexWrap: "wrap" }}>
                {row.previews.map((p, i) => (
                  <div key={i} style={{ textAlign: "center" }}>
                    <img src={p.url} alt="" width={80} height={80} style={{ objectFit: "cover", borderRadius: 6 }} />
                    <div style={{ display: "flex", gap: 6, marginTop: 4, alignItems: "center" }}>
                      <select
                        value={p.color}
                        onChange={(e) => handleColorForImage(idx, i, e.target.value)}
                        style={{ width: 110 }}
                      >
                        <option value="">Couleur ?</option>
                        {row.product.colors.map(c => (
                          <option key={c} value={c}>{c}</option>
                        ))}
                      </select>
                      <button type="button" onClick={() => removePreview(idx, i)}>🗑</button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}

        <button type="submit" disabled={loading} style={{ marginTop: 10 }}>
          {loading ? "Chargement..." : "Ajouter"}
        </button>
      </form>
    </div>
  );
};

export default AddProduct;
