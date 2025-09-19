"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { AvatarProfile } from "../ui/avatar-profile";
import { Button } from "../ui/button";
import { User } from "@/common/types";
import { UserService } from "@/api/user/user";
import { userResponse } from "@/api/user/user-type";
import { extractErrorMessage } from "@/common/helpers";
import LoadingSpinner from "../ui/spinner";

const UserProfile = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [userData, setUserData] = useState<User>();

  useEffect(() => {
    const fetchUserProfile = async () => {
      setIsLoading(true);
      try {
        const response = (await UserService.getUserProfile()) as userResponse;
        setUserData(response.data);
      } catch (error) {
        const errorMessage = extractErrorMessage(error);
        console.log(errorMessage);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserProfile();
  }, []);

  const parts = userData?.fullName?.split(" ") ?? [];

  const firstName = parts[0] ?? "";
  const lastName = parts[1] ?? "";
  const accountType = "Admin";

  return (
    <>
      {isLoading ? (
        <LoadingSpinner size="sm" />
      ) : (
        <Button
          variant={"ghost"}
          onClick={() => router.push(`/profile/${userData?.id}`)}
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
      )}
    </>
  );
};

export default UserProfile;
