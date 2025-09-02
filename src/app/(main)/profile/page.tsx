"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CircleCheck, User } from "lucide-react";

const ProfilePage = () => {
  const [firstName, setFirstName] = useState("Williams");
  const [lastName, setLastName] = useState("Chang");
  const [email, setEmail] = useState("williams.change@example.com");
  const [isEmailVerified, setIsEmailVerified] = useState(true);

  const handleSaveChanges = () => {
    // Handle save changes logic
    console.log("Saving changes...");
  };

  const handleContactSupport = () => {
    // Handle contact support logic
    console.log("Contacting support...");
  };

  const handleSignOut = () => {
    // Handle sign out logic
    console.log("Signing out...");
  };

  const handleDeleteAccount = () => {
    // Handle delete account logic
    console.log("Deleting account...");
  };

  return (
    <div className="h-full p-8 2xl:px-12 space-y-6">
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

          <Button
            size={"lg"}
            variant="outline"
            className="border-gray-100/10 bg-transparent text-white hover:bg-transparent hover:border-green"
          >
            Change Profile Picture
          </Button>
        </div>

        <div className="justify-self-center flex items-center">
          <div className="w-20 h-20 rounded-full overflow-hidden bg-gradient-to-r from-blue-400 to-purple-500 flex items-center justify-center">
            <User className="w-10 h-10 text-white" />
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
            onClick={handleSaveChanges}
            className="border border-gray-100/10 bg-transparent text-white hover:bg-transparent hover:border-green"
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
              className="border border-gray-100/10 bg-transparent text-white hover:bg-transparent hover:border-green"
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
              className="border border-gray-100/10 bg-transparent text-white hover:bg-transparent hover:border-green"
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

export default ProfilePage;
