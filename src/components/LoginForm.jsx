import { useState } from "react";
import { useLogin } from "../api/auth";
import { useVerify2FA } from "../hooks/useVerify2FA";
import logo from "../../public/logo.svg";

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [step, setStep] = useState("login");
  const [code, setCode] = useState("");

  const loginMutation = useLogin();
  const verifyMutation = useVerify2FA();

  const handleSubmit = (e) => {
    e.preventDefault();

    if (step === "login") {
      loginMutation.mutate(
        { email, password },
        {
          onSuccess: (data) => {
            if (data.twoFactorRequired) {
              setStep("2fa");
            } else {
              setStep("success");
            }
          },
        }
      );
    }

    if (step === "2fa") {
      verifyMutation.mutate(
        { code },
        {
          onSuccess: () => setStep("success"),
        }
      );
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-10 rounded-xl shadow-lg w-[520px]"
      >
        {/* Логотип + название компании */}
        <div className="flex items-center justify-center gap-2 mb-6">
          <img src={logo} alt="Company Logo" className="w-8 h-8" />
          <span className="text-lg font-medium text-gray-800">Company</span>
        </div>

        {/* === Шаг 1: Логин === */}
        {step === "login" && (
          <>
            <h2 className="text-3xl font-semibold text-gray-900 text-center mb-8">
              Sign in to your account to continue
            </h2>

            <div className="mb-4">
              <input
                id="email"
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
                className="w-full h-12 border border-gray-300 rounded-lg px-3 text-gray-800 placeholder-gray-400 
                bg-white focus:border-[#1677FF] focus:ring-0 outline-none transition"
                required
              />
            </div>

            <div className="mb-6">
              <input
                id="password"
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
                className="w-full h-12 border border-gray-300 rounded-lg px-3 text-gray-800 placeholder-gray-400 
                bg-white focus:border-[#1677FF] focus:ring-0 outline-none transition"
                required
              />
            </div>

            <button
              type="submit"
              disabled={!email || !password || loginMutation.isLoading}
              className={`w-full h-12 font-semibold rounded-lg transition-colors duration-200 
                ${
                  !email || !password || loginMutation.isLoading
                    ? "bg-[#F5F5F5] text-[#A6A6A6] cursor-not-allowed border border-[#CFCFCF]"
                    : "bg-[#1677FF] text-white hover:bg-[#125ed6] active:bg-[#0d4db1]"
                }`}
            >
              {loginMutation.isLoading ? "Signing in..." : "Log in"}
            </button>

            {loginMutation.isError && (
              <p className="text-red-500 mt-4 text-center text-sm animate-fade-in">
                {loginMutation.error?.message ||
                  "Ошибка входа. Проверьте данные."}
              </p>
            )}
          </>
        )}

        {/* === Шаг 2: 2FA === */}
        {step === "2fa" && (
          <>
            <h2 className="text-2xl font-semibold text-gray-900 text-center mb-4">
              Two-Factor Authentication
            </h2>
            <p className="text-gray-600 text-center mb-6">
              Enter the 6-digit code from the Google <br /> Authenticator app
            </p>

            <div className="flex justify-center gap-3 mb-6">
              {Array.from({ length: 6 }).map((_, i) => (
                <input
                  key={i}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={code[i] || ""}
                  onChange={(e) => {
                    const val = e.target.value.replace(/\D/, ""); // только цифры
                    if (!val) return;
                    const newCode = code.split("");
                    newCode[i] = val;
                    setCode(newCode.join(""));

                    // автофокус на следующий
                    const next = document.getElementById(`code-${i + 1}`);
                    if (next) next.focus();
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "Backspace" && !code[i] && i > 0) {
                      const prev = document.getElementById(`code-${i - 1}`);
                      if (prev) prev.focus();
                    }
                  }}
                  id={`code-${i}`}
                  className={`w-12 h-12 text-center text-lg font-semibold border rounded-lg 
            focus:border-[#1677FF] focus:ring-0 outline-none transition
            ${
              verifyMutation.isError
                ? "border-red-500 text-gray-800"
                : "border-gray-300 text-gray-800"
            }`}
                />
              ))}
            </div>

            <button
              type="submit"
              disabled={verifyMutation.isLoading || code.length < 6}
              className="w-full h-12 bg-[#1677FF] text-white rounded-lg hover:bg-[#125ed6] active:bg-[#0d4db1] font-semibold"
            >
              {verifyMutation.isLoading ? "Verifying..." : "Continue"}
            </button>

            {verifyMutation.isError && (
              <p className="text-red-500 mt-4 text-sm animate-fade-in">
                Invalid code
              </p>
            )}
          </>
        )}

        {/* === Шаг 3: Успех === */}
        {step === "success" && (
          <p className="text-green-500 mt-4 text-center text-lg font-medium animate-fade-in">
            🎉 Успешный вход!
          </p>
        )}
      </form>
    </div>
  );
}
