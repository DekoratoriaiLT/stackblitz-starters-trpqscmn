"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { applyActionCode } from "firebase/auth";
import { auth } from "@/app/firebase";

export default function VerifyPage() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const [message, setMessage] = useState<string>("Patvirtinama...");

  useEffect(() => {
    const oobCode = searchParams.get("oobCode");

    if (!oobCode) {
      setStatus("error");
      setMessage("Nepavyko rasti patvirtinimo kodo.");
      return;
    }

    // Call Firebase to apply the verification code
    applyActionCode(auth, oobCode)
      .then(() => {
        setStatus("success");
        setMessage("Jūsų el. pašto adresas sėkmingai patvirtintas!");
        // Redirect after 3 seconds (optional)
        setTimeout(() => {
          router.push("/prisijungti"); // login page
        }, 3000);
      })
      .catch((error) => {
        console.error("Email verification error:", error);
        setStatus("error");
        setMessage(
          "Įvyko klaida patvirtinant el. paštą. Galbūt nuoroda pasibaigė arba jau buvo patvirtinta."
        );
      });
  }, [searchParams, router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-blue-900 to-teal-800 p-6">
      <div className="bg-white/10 backdrop-blur-2xl rounded-3xl border border-white/20 shadow-2xl p-8 md:p-12 text-center max-w-md w-full">
        {status === "loading" && <p className="text-white/70">{message}</p>}
        {status === "success" && <p className="text-green-400 text-lg">{message}</p>}
        {status === "error" && <p className="text-red-400 text-lg">{message}</p>}
      </div>
    </div>
  );
}
