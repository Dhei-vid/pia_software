"use client";

import { useRouter } from "next/navigation";
import { AvatarProfile } from "../ui/avatar-profile";
import { Button } from "../ui/button";

const UserProfile = () => {
  const router = useRouter();

  const firstName = "William";
  const lastName = "Chang";
  const accountType = "Admin";

  return (
    <Button
      variant={"ghost"}
      onClick={() => router.push("/profile")}
      className="justify-start text-left cursor-pointer hover:bg-lightgrey p-8 w-full rounded-lg border border-gray-700"
    >
      <div className="flex items-center space-x-3">
        <AvatarProfile name={`${firstName} ${lastName}`} size="md" />
        <div>
          <p className="text-sm font-medium text-white">
            {firstName} {lastName}
          </p>
          <p className="text-xs text-gray-400">{accountType}</p>
        </div>
      </div>
    </Button>
  );
};

export default UserProfile;
