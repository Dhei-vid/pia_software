"use client";

import { useState, useRef } from "react";
import { useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CircleCheck, X } from "lucide-react";
import { AvatarProfile } from "@/components/ui/avatar-profile";
import { useUser } from "@/contexts/UserContext";
import { toast } from "sonner";

const UserProfilePage = () => {
  const params = useParams();
  const { user, setUser } = useUser();
  const userId = params.userId as string;

  // Check if the current user is viewing their own profile
  const isOwnProfile = user?.id === userId;

  const [firstName, setFirstName] = useState(user?.name.split(" ")[0] || "");
  const [lastName, setLastName] = useState(
    user?.name.split(" ").slice(1).join(" ") || ""
  );
  const [email, setEmail] = useState(user?.email || "");
  const [isEmailVerified, setIsEmailVerified] = useState(true);
  const [profileImage, setProfileImage] = useState<string | null>(
    user?.avatar || null
  );
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSaveChanges = () => {
    if (isOwnProfile && user) {
      const updatedUser = {
        ...user,
        name: `${firstName} ${lastName}`.trim(),
        email: email,
        avatar: profileImage,
      };
      setUser(updatedUser);
      toast.success("Profile updated successfully!");
    }
    console.log("Saving changes...");
  };

  const handleFile = (file: File) => {
    if (file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setProfileImage(e.target?.result as string);
        toast.success("Profile picture updated!");
      };
      reader.readAsDataURL(file);
    } else {
      toast.error("Please select an image file");
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const removeProfileImage = () => {
    setProfileImage(null);
    toast.success("Profile picture removed!");
  };

  const handleContactSupport = () => {
    console.log("Contacting support...");
  };

  const handleSignOut = () => {
    console.log("Signing out...");
  };

  const handleDeleteAccount = () => {
    console.log("Deleting account...");
  };

  if (!user) {
    return (
      <div className="h-full p-8 flex items-center justify-center">
        <p className="text-gray-400">Loading user profile...</p>
      </div>
    );
  }

  return (
    <div className="min-h-full p-8 2xl:px-12 space-y-6">
      {/* Header */}
      <div className="border-b border-lightgrey">
        <h1 className="text-3xl font-serif text-white mb-6">Account</h1>
      </div>

      {/* Profile Photo Section */}
      <div className="grid grid-cols-2 mb-8 pb-8 border-b border-lightgrey">
        <div>
          <h3 className="text-lg font-semibold text-white mb-2">
            Profile Photo
          </h3>
          <p className="text-gray-400 mb-6">
            This image will be displayed on your profile
          </p>

          <div className="space-y-3">
            <Button
              size={"lg"}
              variant="outline"
              onClick={() => fileInputRef.current?.click()}
              className="border-gray-100/10 bg-transparent text-white hover:bg-lightgrey hover:text-white"
            >
              Change Profile Picture
            </Button>

            {/* Hidden file input */}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileInput}
              className="hidden"
            />
          </div>
        </div>

        <div className="justify-self-center flex items-center">
          <div className="relative">
            <AvatarProfile
              name={`${firstName} ${lastName}`}
              size={"xl"}
              imageUrl={profileImage || undefined}
            />
            {profileImage && (
              <button
                onClick={removeProfileImage}
                className="cursor-pointer absolute -top-2 -right-1 w-6 h-6 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center transition-colors"
              >
                <X size={12} />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Personal Information Section */}
      <div className="grid grid-cols-3 mb-8 pb-8 border-b border-[#3a3a3a]">
        <div className={"cols-span-1"}>
          <h3 className="text-lg font-semibold text-white mb-2">
            Personal Information
          </h3>
          <p className="text-gray-400 mb-6">
            Update your personal information here
          </p>

          <Button
            size={"lg"}
            variant="outline"
            onClick={handleSaveChanges}
            className="border-gray-100/10 bg-transparent text-white hover:bg-lightgrey hover:text-white"
          >
            Save Changes
          </Button>
        </div>

        <div className="h-full space-y-8 col-span-2 mb-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                First Name
              </label>
              <Input
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                className="bg-transparent border-[#3a3a3a] text-white placeholder:text-gray-400 focus:border-yellow-400"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Last Name
              </label>
              <Input
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                className="bg-[#2a2a2a] border-[#3a3a3a] text-white placeholder:text-gray-400 focus:border-yellow-400"
              />
            </div>
          </div>

          <div className="w-full mb-6 h-15">
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Email Address
            </label>
            <div className="p-4 flex items-center space-x-3 rounded-md bg-grey border-gray-100/10 border">
              <div className="flex-1">
                <p className="text-white">{email}</p>
              </div>
              {isEmailVerified && (
                <div className="flex items-center space-x-2 text-green">
                  <CircleCheck className="w-4 h-4" />
                  <span className="text-sm">Verified</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-6">
        {/* Support Section */}
        <div className="flex flex-row justify-between">
          <div>
            <h3 className="text-lg font-semibold text-white">Support</h3>
            <p className="text-gray-400 mb-4">Contact our team here.</p>
          </div>
          <div className="">
            <Button
              size={"lg"}
              onClick={handleContactSupport}
              variant="outline"
              className="border-gray-100/10 bg-transparent text-white hover:bg-lightgrey hover:text-white"
            >
              Contact Support
            </Button>
          </div>
        </div>

        {/* Sign Out Section */}
        <div className="flex flex-row justify-between">
          <p className="text-lg font-semibold text-white  mb-4">
            You are signed in as Williams Chang
          </p>
          <div className="flex justify-end">
            <Button
              size={"lg"}
              onClick={handleSignOut}
              variant="outline"
              className="border-gray-100/10 bg-transparent text-white hover:bg-lightgrey hover:text-white"
            >
              Sign Out
            </Button>
          </div>
        </div>

        {/* Delete Account Section */}
        <div className="flex flex-row justify-between">
          <div>
            <h3 className="text-lg font-semibold text-white">Delete Account</h3>
            <p className="text-gray-400 mb-4">
              Permanently delete your account and data
            </p>
          </div>
          <div className="flex justify-end">
            <Button
              size={"lg"}
              onClick={handleDeleteAccount}
              variant="outline"
              className="border border-destructive/50 text-destructive/80 bg-transparent hover:bg-destructive/50 hover:text-white/70"
            >
              Delete Account
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfilePage;
