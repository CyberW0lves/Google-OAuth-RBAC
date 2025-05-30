import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import LogoutBtn from "@/components/LogoutBtn";

const getUserInfo = async () => {
  const cookieStore = await cookies();
  const refreshToken = cookieStore.get("refreshToken");
  if (!refreshToken) return redirect("/");

  const userInfo: any = cookieStore.get("userInfo");
  return JSON.parse(userInfo?.value);
};

const Deshboard = async () => {
  const userInfo = await getUserInfo();
  console.log(userInfo);

  return (
    <div className="w-full h-screen flex items-center justify-center">
      <div className="flex flex-col items-center">
        {userInfo && (
          <>
            <img
              src={userInfo.picture}
              alt="Profile Picture"
              referrerPolicy="no-referrer"
              className="w-[100px] h-[100px] rounded-full"
            />
            <h1 className="text-[26px] capitalize mt-3">
              {userInfo.firstName} {userInfo.lastName}
            </h1>
          </>
        )}
        <LogoutBtn />
      </div>
    </div>
  );
};

export default Deshboard;
