"use client";

import Image from "next/image";
import Link from "next/link";
import { AvatarProfile } from "@/components/ui/avatar-profile";
import { useUser } from "@/contexts/UserContext";

const Header = () => {
  const { user } = useUser();

  return (
    <div className="flex flex-row gap-2 items-center justify-between w-full py-2 px-6 bg-dark">
      <div className="flex items-center gap-2">
        <Image
          src="/logo.png"
          alt="Wright PIA Logo"
          width={25}
          height={25}
          className="object-contain"
        />
        <h1 className="text-lg 2xl:text-xl text-white">Wright PIA Software</h1>
      </div>
      
      {user && (
        <Link 
          href={`/profile/${user.id}`}
          className="flex items-center gap-2 hover:opacity-80 transition-opacity"
        >
          <AvatarProfile name={user.name} size="sm" />
          <span className="text-white text-sm hidden sm:block">{user.name}</span>
        </Link>
      )}
    </div>
  );
};

export default Header;
