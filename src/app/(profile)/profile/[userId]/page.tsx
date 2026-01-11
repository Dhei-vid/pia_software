"use client";

import { useState, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CircleCheck, X } from "lucide-react";
import { AvatarProfile } from "@/components/ui/avatar-profile";
import LoadingSpinner from "@/components/ui/loading";
import { useUser } from "@/contexts/UserContext";
import { toast } from "sonner";
import AuthService from "@/api/auth/auth";
import { UserService } from "@/api/user/user";
import { extractErrorMessage } from "@/common/helpers";

const UserProfilePage = () => {
  const params = useParams();
  const { user, setUser } = useUser();
  const userId = params.userId as string;
  const router = useRouter();

  // Check if the current user is viewing their own profile
  const isOwnProfile = user?.id === userId;
  const fullname = user?.fullName;

  const splitName = fullname?.split(" ") ?? [];
  const firstname = splitName[0] ?? "";
  const lastname = splitName[1] ?? "";

  const [firstName, setFirstName] = useState(firstname);
  const [lastName, setLastName] = useState(lastname);
  const [isEmailVerified, setIsEmailVerified] = useState(true);
  const [profileImage, setProfileImage] = useState<string | null>(
    user?.avatar || null
  );
  const [mail,setMail] = useState<string|null>("info@wrightenergytech.com") 
  const [subject,setSubject] = useState<string|null>("Support: ") 
  const [message,setMessage] = useState<string|null>("Looking for support...") 
  const fileInputRef = useRef<HTMLInputElement>(null);

  const mailTo = "mailto:" + mail + "?subject=" + subject + "&body=" + message;

  const handleSaveChanges = async () => {
    if (isOwnProfile && user) {
      const updatedUser = {
        ...user,
        fullName: `${firstName} ${lastName}`.trim(),
        avatar: profileImage || undefined,
        phone: "09067676676",
      };
      await UserService.updateUser(updatedUser);
      setUser(updatedUser);
      toast.success("Profile updated successfully!");
    }
  };

  // Handling Image upload
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

  // Remove selected image
  const removeProfileImage = () => {
    setProfileImage(null);
    toast.success("Profile picture removed!");
  };

  // Contact Support
  const handleContactSupport = (e: React.MouseEvent<HTMLButtonElement>): void => {
    e.preventDefault();
    if (mail && subject && message) {
      window.location.href = mailTo;
      setMail(null);
      setSubject(null);
      setMessage(null);
    } else {
      alert("No mail, subject or message");
    }
  };

  // Sign User Out
  const handleSignOut = async () => {
    try {
      await AuthService.logout(router);
      toast.success("Logged out successfully");
    } catch (error) {
      const errorMessage = extractErrorMessage(error);
      toast.error(`Failed to Sign out. ${errorMessage}`);
    }
  };

  // Delete User Account
  const handleDeleteAccount = () => {
    console.log("Deleting account...");
  };

  if (!user) {
    return (
      <div className="h-full p-8 flex items-center justify-center">
        <div className="flex items-center gap-2">
          <LoadingSpinner size="sm" />
          <p className="text-gray-400">Loading user profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-full p-8 2xl:px-12 space-y-6">
      {/* Header */}
      <div className="border-b border-foreground/30">
        <h1 className="text-3xl font-serif text-foreground/70 mb-6">Account</h1>
      </div>

      {/* Profile Photo Section */}
      <div className="grid grid-cols-2 mb-8 pb-8 border-b border-foreground/30">
        <div>
          <h3 className="text-lg font-semibold text-foreground/70 mb-2">
            Profile Photo
          </h3>
          <p className="text-muted-foreground mb-6">
            This image will be displayed on your profile
          </p>

          <div className="space-y-3">
            <Button
              size={"lg"}
              variant="outline"
              onClick={() => fileInputRef.current?.click()}
              className="bg-transparent text-foreground/70 hover:bg-lightgrey"
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
                className="cursor-pointer absolute -top-2 -right-1 w-6 h-6 bg-red-500 hover:bg-red-600 text-foreground/70 rounded-full flex items-center justify-center transition-colors"
              >
                <X size={12} />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Personal Information Section */}
      <div className="grid grid-cols-3 mb-8 pb-8 border-b border-foreground/30">
        <div className={"cols-span-1"}>
          <h3 className="text-lg font-semibold text-foreground/70 mb-2">
            Personal Information
          </h3>
          <p className="text-gray-400 mb-6">
            Update your personal information here
          </p>

          <Button
            size={"lg"}
            variant="outline"
            onClick={handleSaveChanges}
            className="bg-transparent text-foreground/70 hover:bg-lightgrey"
          >
            Save Changes
          </Button>
        </div>

        <div className="h-full space-y-8 col-span-2 mb-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-foreground/70 mb-2">
                First Name
              </label>
              <Input
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                className="bg-transparent border-foreground/30 text-foreground/70 placeholder:text-gray-400"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground/70 mb-2">
                Last Name
              </label>
              <Input
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                className="bg-transparent border-foreground/30 text-foreground/70 placeholder:text-gray-400"
              />
            </div>
          </div>

          <div className="w-full mb-6 h-15">
            <label className="block text-sm font-medium text-foreground/70 mb-2">
              Email Address
            </label>
            <div className="p-4 flex items-center space-x-3 rounded-md bg-grey border-foreground/30 border">
              <div className="flex-1">
                <p className="text-sm text-foreground/70">
                  {user?.email || ""}
                </p>
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
            <h3 className="text-lg font-semibold text-foreground/70">
              Support
            </h3>
            <p className="text-muted-foreground mb-4">Contact our team here.</p>
          </div>
          <div className="">
            <Button
              size={"lg"}
              onClick={handleContactSupport}
              variant="outline"
              className="bg-transparent text-foreground/70 hover:bg-lightgrey"
            >
              Contact Support
            </Button>
          </div>
        </div>

        {/* Sign Out Section */}
        <div className="flex flex-row justify-between">
          <p className="text-lg font-semibold text-foreground/70 mb-4">
            You are signed in as {`${fullname}`}
          </p>
          <div className="flex justify-end">
            <Button
              size={"lg"}
              onClick={handleSignOut}
              variant="outline"
              className="bg-transparent text-foreground/70 hover:bg-lightgrey"
            >
              Sign Out
            </Button>
          </div>
        </div>

        {/* Delete Account Section */}
        <div className="flex flex-row justify-between">
          <div>
            <h3 className="text-lg font-semibold text-foreground/70">
              Delete Account
            </h3>
            <p className="text-muted-foreground mb-4">
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
