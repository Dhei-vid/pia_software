import Image from "next/image";

const Header = () => {
  return (
    <div className="flex flex-row gap-2 items-center bg-black w-full py-4 px-15">
      <Image
        src="/logo.png"
        alt="Wright PIA Logo"
        width={40}
        height={40}
        className="object-contain"
      />
      <h1 className="text-lg 2xl:text-xl text-white">Wright PIA Software</h1>
    </div>
  );
};

export default Header;
