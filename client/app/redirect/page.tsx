"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import axiosInstance from "@/lib/axios";

const Redirect = () => {
  const [error, setError] = useState<boolean>(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const text = "Loading...";

  useEffect(() => {
    const code = searchParams.get("code");

    const fetchToken = async () => {
      try {
        await axiosInstance.post("/auth/callback", { code });
        router.push("/dashboard");
      } catch (error) {
        console.log(error);
        setError(true);
      }
    };

    if (code) {
      fetchToken();
    } else {
      setError(true);
    }
  }, [searchParams]);

  return (
    <>
      {error ? (
        <div className="w-full h-screen flex flex-col items-center justify-center">
          <h1 className="text-red-400 font-bold">ERROR</h1>
          <div>! Something went wrong during authentication</div>
          <Link href="/">
            <button className="w-[180px] h-[40px] cursor-pointer bg-[#6689ed] flex justify-center items-center mt-3 rounded-[1px]">
              BACK TO HOME
            </button>
          </Link>
        </div>
      ) : (
        <div className="w-full h-screen flex items-center justify-center">
          <style>{`
        @keyframes bounce {
          0%, 80%, 100% { transform: translateY(0px); }
          30% { transform: translateY(-30px); }
          60% { transform: translateY(10px); }
        }
      `}</style>
          <div>
            {text.split("").map((char, index) => (
              <span
                key={index}
                className="inline-block text-[3rem] text-white"
                style={{
                  animation: "bounce 1s ease-in-out infinite",
                  animationDelay: `${(index + 1) * 0.1}s`,
                  transformOrigin: "bottom",
                  fontFamily: '"Sour Gummy", sans-serif',
                  fontOpticalSizing: "auto",
                }}
              >
                {char}
              </span>
            ))}
          </div>
        </div>
      )}
    </>
  );
};

export default Redirect;
