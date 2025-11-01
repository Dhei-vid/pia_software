"use client";

import Image from "next/image";

const Header = () => {
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
        <h1 className="text-base 2xl:text-lg text-foreground/70">
          Wright PIA Software
        </h1>
      </div>
    </div>
  );
};

export default Header;
