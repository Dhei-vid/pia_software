import Image from "next/image";

const Header = () => {
  return (
    <div className="flex flex-row gap-2 items-center w-full py-2 px-6 bg-dark">
      <Image
        src="/logo.png"
        alt="Wright PIA Logo"
        width={25}
        height={25}
        className="object-contain"
      />
      <h1 className="text-lg 2xl:text-xl text-white">Wright PIA Software</h1>
    </div>
  );
};

export default Header;
