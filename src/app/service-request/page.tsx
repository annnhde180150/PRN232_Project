"use client";
import React, { useState } from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/design-system/Card";
import { TextInput } from "@/components/design-system";
import { Button } from "@/components/design-system";
import { Textarea } from "@/components/ui/textarea";

const initialFormState = {
    userId: "",
    serviceId: "",
    addressId: "",
    requestedStartTime: "",
    requestedDurationHours: "",
    specialNotes: "",
  status: "",
  latitude: "",
  longitude: "",
};

const ServiceRequestPage = () => {
  const [form, setForm] = useState(initialFormState);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<null | { success: boolean; message: string }>();
  const [editMode, setEditMode] = useState(false);
  const [editRequestId, setEditRequestId] = useState("");
  const [loadError, setLoadError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleEditIdChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditRequestId(e.target.value);
  };

  const handleLoadRequest = async () => {
    setLoading(true);
    setLoadError("");
    setResult(null);
    try {
      const res = await fetch(`https://localhost:7192/api/ServiceRequests/GetRequest/${editRequestId}`);
      const data = await res.json();
      if (data.success && data.data) {
        setForm({
          userId: data.data.userId?.toString() || "",
          serviceId: data.data.serviceId?.toString() || "",
          addressId: data.data.addressId?.toString() || "",
          requestedStartTime: data.data.requestedStartTime ? data.data.requestedStartTime.slice(0, 16) : "",
          requestedDurationHours: data.data.requestedDurationHours?.toString() || "",
          specialNotes: data.data.specialNotes || "",
          status: data.data.status || "",
          latitude: data.data.latitude?.toString() || "",
          longitude: data.data.longitude?.toString() || "",
        });
        setEditMode(true);
      } else {
        setLoadError(data.message || "Request not found");
      }
    } catch (error) {
      setLoadError("Failed to load request");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setResult(null);
    try {
      let res, data;
      if (editMode) {
        res = await fetch("https://localhost:7192/api/ServiceRequests/EditRequest", {
          method: "PUT",
          headers: {
            "Content-Type": "application/json;odata.metadata=minimal;odata.streaming=true",
            accept: "*/*",
          },
          body: JSON.stringify({
            requestId: Number(editRequestId),
            userId: Number(form.userId),
            serviceId: Number(form.serviceId),
            addressId: Number(form.addressId),
            requestedStartTime: form.requestedStartTime,
            requestedDurationHours: Number(form.requestedDurationHours),
            specialNotes: form.specialNotes,
            status: form.status,
            latitude: form.latitude ? Number(form.latitude) : null,
            longitude: form.longitude ? Number(form.longitude) : null,
          }),
        });
        data = await res.json();
      } else {
        res = await fetch("https://localhost:7192/api/ServiceRequests/CreateRequest", {
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
        data = await res.json();
      }
      setResult({ success: data.success, message: data.message });
    } catch (error) {
      setResult({ success: false, message: "Request failed. Please try again." });
    } finally {
      setLoading(false);
    }
  };

  const handleSwitchMode = () => {
    setEditMode(false);
    setEditRequestId("");
    setForm(initialFormState);
    setResult(null);
    setLoadError("");
  };

  return (
    <div className="flex justify-center items-center min-h-[80vh] bg-gray-50 py-8">
      <Card variant={"elevated"} className="w-full max-w-lg shadow-lg">
        <CardHeader>
          <CardTitle>{editMode ? "Edit Service Request" : "Create Service Request"}</CardTitle>
          <CardDescription>
            {editMode
              ? "Update the details of your service request."
              : "Fill out the form to create a new service request."}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2 mb-4">
            <TextInput
              label="Request ID"
              placeholder="Enter Request ID to Edit"
              value={editRequestId}
              onChange={handleEditIdChange}
              disabled={editMode || loading}
              className="w-1/2"
            />
            <Button
              type="button"
              variant={"secondary"}
              onClick={handleLoadRequest}
              disabled={editMode || loading || !editRequestId}
              loading={loading && !editMode}
            >
              Load for Edit
            </Button>
            {editMode && (
              <Button
                type="button"
                variant={"ghost"}
                onClick={handleSwitchMode}
                className="ml-2"
              >
                Switch to Create
              </Button>
            )}
          </div>
          {loadError && <div className="text-error-600 mb-2 text-sm">{loadError}</div>}
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <TextInput
          name="userId"
          type="number"
              label="User ID"
              placeholder="Enter your user ID"
          value={form.userId}
          onChange={handleChange}
          required
        />
            <TextInput
          name="serviceId"
          type="number"
              label="Service ID"
              placeholder="Enter the service ID"
          value={form.serviceId}
          onChange={handleChange}
          required
        />
            <TextInput
          name="addressId"
          type="number"
              label="Address ID"
              placeholder="Enter the address ID"
          value={form.addressId}
          onChange={handleChange}
          required
        />
            <TextInput
          name="requestedStartTime"
          type="datetime-local"
              label="Requested Start Time"
              placeholder="Select start time"
          value={form.requestedStartTime}
          onChange={handleChange}
          required
        />
            <TextInput
          name="requestedDurationHours"
          type="number"
              label="Requested Duration (hours)"
              placeholder="Enter duration in hours"
          value={form.requestedDurationHours}
          onChange={handleChange}
          required
        />
            <div>
              <label className="block font-medium text-text-primary mb-1">Special Notes</label>
              <Textarea
          name="specialNotes"
                placeholder="Any special notes?"
          value={form.specialNotes}
          onChange={handleChange}
                className="w-full"
          rows={3}
        />
            </div>
            {editMode && (
              <>
                <TextInput
                  name="status"
                  type="text"
                  label="Status"
                  placeholder="Status"
                  value={form.status}
                  onChange={handleChange}
                />
                <div className="flex gap-2">
                  <TextInput
                    name="latitude"
                    type="number"
                    label="Latitude"
                    placeholder="Latitude"
                    value={form.latitude}
                    onChange={handleChange}
                    className="w-1/2"
                  />
                  <TextInput
                    name="longitude"
                    type="number"
                    label="Longitude"
                    placeholder="Longitude"
                    value={form.longitude}
                    onChange={handleChange}
                    className="w-1/2"
                  />
                </div>
              </>
            )}
            <CardFooter className="justify-end px-0 pb-0">
              <Button
                type="submit"
                variant={"primary"}
                loading={loading}
                fullWidth
              >
                {editMode ? "Save Changes" : "Submit Request"}
              </Button>
            </CardFooter>
      </form>
      {result && (
            <div className={`mt-4 text-center text-base font-medium ${result.success ? "text-success-600" : "text-error-600"}`}>
          {result.message}
        </div>
      )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ServiceRequestPage; 