"use client";
import React, { useState } from "react";

const ServiceRequestPage = () => {
  const [form, setForm] = useState({
    userId: "",
    serviceId: "",
    addressId: "",
    requestedStartTime: "",
    requestedDurationHours: "",
    specialNotes: "",
  });
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<null | { success: boolean; message: string }>();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setResult(null);
    try {
      const res = await fetch("https://localhost:7192/api/ServiceRequests/CreateRequest", {
        method: "POST",
        headers: {
          "Content-Type": "application/json;odata.metadata=minimal;odata.streaming=true",
          accept: "*/*",
        },
        body: JSON.stringify({
          userId: Number(form.userId),
          serviceId: Number(form.serviceId),
          addressId: Number(form.addressId),
          requestedStartTime: form.requestedStartTime,
          requestedDurationHours: Number(form.requestedDurationHours),
          specialNotes: form.specialNotes,
        }),
      });
      const data = await res.json();
      setResult({ success: data.success, message: data.message });
    } catch (error) {
      setResult({ success: false, message: "Request failed. Please try again." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 500, margin: "40px auto", padding: 24, border: "1px solid #eee", borderRadius: 8 }}>
      <h2>Create Service Request</h2>
      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        <input
          name="userId"
          type="number"
          placeholder="User ID"
          value={form.userId}
          onChange={handleChange}
          required
        />
        <input
          name="serviceId"
          type="number"
          placeholder="Service ID"
          value={form.serviceId}
          onChange={handleChange}
          required
        />
        <input
          name="addressId"
          type="number"
          placeholder="Address ID"
          value={form.addressId}
          onChange={handleChange}
          required
        />
        <input
          name="requestedStartTime"
          type="datetime-local"
          placeholder="Requested Start Time"
          value={form.requestedStartTime}
          onChange={handleChange}
          required
        />
        <input
          name="requestedDurationHours"
          type="number"
          placeholder="Requested Duration (hours)"
          value={form.requestedDurationHours}
          onChange={handleChange}
          required
        />
        <textarea
          name="specialNotes"
          placeholder="Special Notes"
          value={form.specialNotes}
          onChange={handleChange}
          rows={3}
        />
        <button type="submit" disabled={loading} style={{ padding: 8, background: "#0070f3", color: "#fff", border: "none", borderRadius: 4 }}>
          {loading ? "Submitting..." : "Submit Request"}
        </button>
      </form>
      {result && (
        <div style={{ marginTop: 16, color: result.success ? "green" : "red" }}>
          {result.message}
        </div>
      )}
    </div>
  );
};

export default ServiceRequestPage; 