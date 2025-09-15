// src/Pages/Auth/ResetPassword.jsx
import React, { useState } from "react";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";

export default function ResetPassword() {
  const nav = useNavigate();
  const { search } = useLocation();
  const token = new URLSearchParams(search).get("token") || "";
  const [pwd, setPwd] = useState("");
  const [pwd2, setPwd2] = useState("");

  const submit = async (e) => {
    e.preventDefault();
    if (pwd !== pwd2) return alert("Passwords do not match");
    try {
      await axios.post("/api/auth/reset-password", { token, newPassword: pwd });
      alert("Your password has been reset. Please log in.");
      nav("/"); // ou ouvre ton LoginPanel
    } catch (err) {
      alert(err?.response?.data?.message || "Invalid or expired link");
    }
  };

  return (
    <div style={{ maxWidth: 360, margin: "40px auto" }}>
      <h2>Reset your password</h2>
      <form onSubmit={submit}>
        <input
          type="password"
          placeholder="New password"
          className="input-field"
          value={pwd}
          onChange={(e)=>setPwd(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Repeat new password"
          className="input-field"
          value={pwd2}
          onChange={(e)=>setPwd2(e.target.value)}
          required
        />
        <button className="login-btn" type="submit">Update password</button>
      </form>
    </div>
  );
}
