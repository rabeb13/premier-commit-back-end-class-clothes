// src/Pages/Admin/BulkUpsertProducts.jsx
import React, { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { getProducts, addProduct, editProduct } from "../../JS/Actions/product";

const COLS = [
  { key: "_id", label: "ID", readOnly: true },
  { key: "name", label: "Nom", required: true },
  { key: "category", label: "Catégorie", required: true },
  { key: "price", label: "Prix (DT)", required: true, type: "number", step: "0.1" },
  { key: "colors", label: "Couleurs (ex: red,blue)" },
  { key: "sizes", label: "Tailles (ex: S,M,L)" },
  { key: "images", label: "Images (couleur:url;...)" },
];

const makeEmpty = () => ({
  _id: "", name: "", category: "", price: "", colors: "", sizes: "", images: "",
});

const parseList = (s) => (s || "").split(",").map(x => x.trim()).filter(Boolean);
const parseImages = (s) => (s || "").split(";").map(pair => {
  const [color, url] = pair.split(":").map(x => x?.trim());
  if (!url) return null;
  return { color: color || "", url };
}).filter(Boolean);

const toRow = (p) => ({
  _id: p?._id || "",
  name: p?.name || "",
  category: p?.category || "",
  price: String(p?.price ?? ""),
  colors: (p?.colors || []).join(","),
  sizes: (p?.sizes || []).join(","),
  images: (p?.images || []).map(im => `${im.color || ""}:${im.url}`).join(";"),
});

export default function BulkUpsertProducts() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { listProducts } = useSelector(s => s.product || {});
  const [rows, setRows] = useState([makeEmpty()]);
  const [original, setOriginal] = useState([]); // snapshot des produits existants
  const [saving, setSaving] = useState(false);

  useEffect(() => { dispatch(getProducts()); }, [dispatch]);

  useEffect(() => {
    if (!listProducts) return;
    const mapped = listProducts.map(toRow);
    setRows([...mapped, makeEmpty()]);    // produits existants + 1 ligne vide
    setOriginal(mapped);                  // snapshot pour détecter changements
  }, [listProducts]);

  const isEmpty = (r) =>
    ["name","category","price","colors","sizes","images"].every(k => String(r[k]||"").trim()==="");

  const handleChange = (i, k, v) => {
    setRows(prev => {
      const copy = [...prev];
      copy[i] = { ...copy[i], [k]: v };
      return copy;
    });
  };

  const addLine = () => setRows(p => [...p, makeEmpty()]);
  const removeLine = (idx) => setRows(p => p.filter((_,i) => i !== idx));

  const newRows = useMemo(() => rows.filter(r => !r._id && !isEmpty(r)), [rows]);

  const changedExisting = () => {
    const out = [];
    rows.forEach(r => {
      if (!r._id) return;
      const o = original.find(x => x._id === r._id);
      if (!o) return;
      const changed = COLS.some(c => (o[c.key] || "") !== (r[c.key] || ""));
      if (changed) out.push(r);
    });
    return out;
  };

  const validateRow = (r, idx) => {
    const errs = [];
    if (!String(r.name).trim()) errs.push(`Ligne ${idx+1}: nom requis`);
    if (!String(r.category).trim()) errs.push(`Ligne ${idx+1}: catégorie requise`);
    if (r.price === "" || isNaN(Number(r.price)) || Number(r.price) <= 0)
      errs.push(`Ligne ${idx+1}: prix invalide`);
    return errs;
  };

  const pasteCSV = () => {
    const ex = [
      "name,category,price,colors,sizes,images",
      "Robe satin,dresses,89.9,beige,36-38-40,beige:https://ex.com/robe1.jpg",
      "Jean cargo,jeans,129,blue,30-32-34,blue:https://ex.com/j1.jpg;black:https://ex.com/j1b.jpg",
    ].join("\n");
    const txt = prompt("Collez votre CSV (en-têtes). Exemple:\n\n"+ex);
    if (!txt) return;
    const lines = txt.split(/\r?\n/).filter(Boolean);
    if (!lines.length) return;

    const parseLine = (line) => {
      const out = []; let cur=""; let q=false;
      for (const ch of line) {
        if (ch === '"'){ q=!q; continue; }
        if (ch === ',' && !q){ out.push(cur); cur=""; continue; }
        cur += ch;
      }
      out.push(cur);
      return out.map(x => x.trim());
    };

    const headers = parseLine(lines[0]).map(h => h.toLowerCase());
    const idx = (k) => headers.indexOf(k);

    const mapped = lines.slice(1).map(line => {
      const parts = parseLine(line);
      const r = makeEmpty();
      r.name = parts[idx("name")] || "";
      r.category = parts[idx("category")] || "";
      r.price = parts[idx("price")] || "";
      r.colors = parts[idx("colors")] || "";
      r.sizes = parts[idx("sizes")] || "";
      r.images = parts[idx("images")] || "";
      return r;
    });
    setRows(p => [...p, ...mapped]);
  };

  const handleSave = async () => {
    const edits = changedExisting();
    const target = [...newRows, ...edits];
    const errors = target.flatMap((r, i) => validateRow(r, i));
    if (errors.length) return alert("Corrigez:\n\n" + errors.join("\n"));

    setSaving(true);
    let added = 0, updated = 0;
    try {
      // Ajouts
      for (const r of newRows) {
        const dto = {
          name: r.name,
          category: r.category,
          price: Number(r.price || 0),
          colors: parseList(r.colors),
          sizes: parseList(r.sizes),
          images: parseImages(r.images),
        };
        // @ts-ignore
        await dispatch(addProduct(dto));
        added++;
      }
      // Modifs
      for (const r of edits) {
        const dto = {
          name: r.name,
          category: r.category,
          price: Number(r.price || 0),
          colors: parseList(r.colors),
          sizes: parseList(r.sizes),
          images: parseImages(r.images),
        };
        // @ts-ignore
        await dispatch(editProduct(r._id, dto));
        updated++;
      }
      alert(`✅ Terminé: ${added} ajout(s), ${updated} modification(s).`);
      await dispatch(getProducts());
      navigate("/admin");
    } catch (e) {
      console.error(e);
      alert("❌ Erreur: " + (e?.message || e));
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="p-5">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold">Ajout & Modification en masse</h2>
        <div className="flex gap-2">
          <button className="border rounded-lg px-3 py-2" onClick={() => setRows(p => [...p, makeEmpty()])}>+ Ligne</button>
          <button className="border rounded-lg px-3 py-2" onClick={pasteCSV}>Coller CSV</button>
        </div>
      </div>

      <div className="overflow-auto border rounded-xl">
        <table className="min-w-[1000px] w-full text-sm">
          <thead>
            <tr className="bg-gray-50">
              <th className="p-2 text-left">#</th>
              {COLS.map(c => <th key={c.key} className="p-2 text-left">{c.label}</th>)}
              <th className="p-2 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row, rIdx) => (
              <tr key={rIdx} className="border-t align-top">
                <td className="p-2">{rIdx + 1}</td>
                {COLS.map(c => (
                  <td key={c.key} className="p-1">
                    {c.readOnly ? (
                      <input className="w-full border rounded-lg px-2 py-1 bg-gray-100" value={row[c.key]} readOnly />
                    ) : c.type === "number" ? (
                      <input type="number" step={c.step || "any"} className="w-full border rounded-lg px-2 py-1"
                             value={row[c.key]} onChange={(e)=>handleChange(rIdx, c.key, e.target.value)} />
                    ) : (
                      <input className="w-full border rounded-lg px-2 py-1"
                             value={row[c.key]} onChange={(e)=>handleChange(rIdx, c.key, e.target.value)} />
                    )}
                  </td>
                ))}
                <td className="p-2">
                  <button className="text-red-600" onClick={() => removeLine(rIdx)}>Supprimer</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-4 flex items-center gap-3">
        <button disabled={saving} onClick={handleSave} className="bg-black text-white rounded-xl px-4 py-2 disabled:opacity-50">
          {saving ? "Enregistrement..." : "Enregistrer"}
        </button>
        <button className="border rounded-xl px-4 py-2" onClick={() => navigate(-1)}>Annuler</button>
      </div>

      <div className="mt-4 text-xs text-gray-600">
        <p><strong>Astuce :</strong> La colonne <code>images</code> accepte <code>couleur:url;couleur:url</code>. Exemple : <code>beige:https://ex.com/img1.jpg;noir:https://ex.com/img2.jpg</code></p>
      </div>
    </div>
  );
}
