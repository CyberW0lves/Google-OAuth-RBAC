"use client";
import Image from "next/image";
import axiosInstance from "@/lib/axios";

export default function Home() {
  const handleLogin = async () => {
    try {
      const { data } = await axiosInstance.post("/auth/login");
      window.location.href = data.authUrl;
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="w-screen h-screen flex items-center justify-center">
      <button
        onClick={handleLogin}
        className="w-[400px] h-[80px] cursor-pointer bg-[#6689ed] flex items-center px-[5px] rounded-[1px]"
      >
        <div className="w-[70px] h-[70px] bg-white flex items-center justify-center rounded-[1px]">
          <Image
            src="/google.svg"
            alt="Google logo"
            width={40}
            height={40}
            priority
          />
        </div>
        <div className="flex-grow h-full flex items-center justify-center">
          <p className="text-[24px] font-bold">Sign in with Google</p>
        </div>
      </button>
    </div>
  );
}
