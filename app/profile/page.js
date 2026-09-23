"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { api } from "../../lib/api";
import { useAuth } from "../../lib/auth-context";
import RequireAuth from "../../components/RequireAuth";
import ErrorText from "../../components/ErrorText";

function ProfileForm() {
  const { user, refresh } = useAuth();
  const [form, setForm] = useState({ name: "", phone: "", address: "" });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [locating, setLocating] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    let mounted = true;
    api
      .getMyProfile()
      .then((response) => {
        const profile = response.profile || response.customerProfile || response.user || response.data?.user || {};
        if (mounted) {
          setForm({
            name: profile.name || user?.name || "",
            phone: profile.phone || user?.phone || "",
            address: profile.address || user?.address || "",
          });
        }
      })
      .catch((err) => mounted && setError(err.message))
      .finally(() => mounted && setLoading(false));
    return () => {
      mounted = false;
    };
  }, [user?.address, user?.name, user?.phone]);

  const save = async (event) => {
    event.preventDefault();
    setError("");
    setSuccess("");
    setSaving(true);
    try {
      await api.updateMe(form);
      await refresh();
      setSuccess("Profile updated successfully.");
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const updateLocation = () => {
    if (!navigator.geolocation) {
      setError("Location is not supported by this browser.");
      return;
    }
    setError("");
    setSuccess("");
    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      async ({ coords }) => {
        try {
          await api.updateMyLocation({ lat: coords.latitude, lng: coords.longitude });
          await refresh();
          setSuccess("Saved location updated.");
        } catch (err) {
          setError(err.message);
        } finally {
          setLocating(false);
        }
      },
      () => {
        setError("Could not get your location. Allow location access and try again.");
        setLocating(false);
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 300000 }
    );
  };

  if (loading) return <div className="mx-auto max-w-xl px-4 py-16 text-sm text-slate-500">Loading profile...</div>;

  return (
    <div className="min-h-screen bg-[#F7F5F0] px-4 py-10">
      <div className="mx-auto max-w-xl">
        <Link href="/dashboard" className="text-sm font-medium text-[#2E6E8E]">← Back to bookings</Link>
        <div className="mt-4 rounded-2xl bg-white p-7 shadow-sm ticket-border">
          <h1 className="font-display text-3xl text-[#101B2B]">Your profile</h1>
          <p className="mt-1 text-sm text-slate-500">Keep your contact and service location details up to date.</p>
          <form onSubmit={save} className="mt-6 space-y-4">
            <label className="block text-sm font-medium text-slate-600">
              Name
              <input className="input mt-1" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
            </label>
            <label className="block text-sm font-medium text-slate-600">
              Phone
              <input className="input mt-1" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
            </label>
            <label className="block text-sm font-medium text-slate-600">
              Address
              <input className="input mt-1" value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} />
            </label>
            <ErrorText>{error}</ErrorText>
            {success && <p className="rounded-xl bg-[#E9F5EE] px-3 py-2 text-sm text-[#3F7D5C]">{success}</p>}
            <div className="flex flex-wrap gap-3">
              <button type="submit" className="btn-primary" disabled={saving}>{saving ? "Saving..." : "Save profile"}</button>
              <button type="button" className="btn-secondary" onClick={updateLocation} disabled={locating}>
                {locating ? "Detecting..." : "Update saved location"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default function ProfilePage() {
  return <RequireAuth><ProfileForm /></RequireAuth>;
}
