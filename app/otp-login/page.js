"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "../../lib/api";
import { useAuth } from "../../lib/auth-context";
import ErrorText from "../../components/ErrorText";

export default function OtpLoginPage() {
  const router = useRouter();
  const { login } = useAuth();
  const [step, setStep] = useState("phone"); // "phone" | "otp"
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [info, setInfo] = useState("");
  const [loading, setLoading] = useState(false);

  const requestOtp = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await api.requestOtp(phone);
      setInfo("OTP sent. In development, check the backend server console/terminal for the code.");
      setStep("otp");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const verify = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await api.verifyOtp({ phone, otp, name });
      login(res.token, res.user);
      router.push("/dashboard");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto card">
      <h1 className="text-xl font-semibold mb-1">Login with phone</h1>
      <p className="text-sm text-slate-500 mb-4">
        Primary login method for workers. Customers can use this too.
      </p>

      {step === "phone" ? (
        <form onSubmit={requestOtp} className="space-y-3">
          <div>
            <label className="label">Phone number</label>
            <input
              className="input"
              required
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="9508280822"
            />
          </div>
          <ErrorText>{error}</ErrorText>
          <button type="submit" className="btn-primary w-full" disabled={loading}>
            {loading ? "Sending..." : "Send OTP"}
          </button>
        </form>
      ) : (
        <form onSubmit={verify} className="space-y-3">
          {info && <p className="text-sm text-blue-700 bg-blue-50 border border-blue-200 rounded-md px-3 py-2">{info}</p>}
          <div>
            <label className="label">Name (only needed for new accounts)</label>
            <input className="input" value={name} onChange={(e) => setName(e.target.value)} />
          </div>
          <div>
            <label className="label">Enter OTP</label>
            <input
              className="input"
              required
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              placeholder="6-digit code"
            />
          </div>
          <ErrorText>{error}</ErrorText>
          <button type="submit" className="btn-primary w-full" disabled={loading}>
            {loading ? "Verifying..." : "Verify & continue"}
          </button>
          <button type="button" onClick={() => setStep("phone")} className="btn-secondary w-full text-sm">
            Change phone number
          </button>
        </form>
      )}
    </div>
  );
}
