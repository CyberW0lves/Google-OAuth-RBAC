"use client";
import { useRouter } from "next/navigation";

const LogoutBtn = () => {
  const router = useRouter();

  const handleLogout = async () => {
    try {
      router.push("/");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <button
      onClick={handleLogout}
      className="w-[150px] h-[40px] cursor-pointer bg-[#e75555] flex justify-center items-center mt-3 rounded-[1px]"
    >
      LOGOUT
    </button>
  );
};

export default LogoutBtn;
