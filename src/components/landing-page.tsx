import { Button } from "./ui/button";
import Link from "next/link";
import Image from "next/image";

const LandingPage = () => {
  return (
    <div className={"min-h-screen bg-dark"}>
      {/* Header */}
      <header className={"bg-dark border-b header-gradient sticky top-0 z-50"}>
        <div className={"container mx-auto px-6 py-4"}>
          <div className={"flex items-center justify-between"}>
            <div className={"flex items-center space-x-3"}>
              <Image src={"/logo.png"} alt={"Logo"} width={40} height={40} />
              <h1 className={"text-xl font-semibold text-white"}>WRIGHT PIA</h1>
            </div>

            <div className={"flex items-center"}>
              <Link href={"/signin"}>
                <Button className="bg-green hover:bg-green/90 text-white border-0 transition-all duration-300 hover:shadow-lg px-6 py-2">
                  Request a Demo
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center">
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(16,185,129,0.35),transparent_50%)] backdrop-blur-sm"></div>

        <div className="relative container mx-auto px-6 text-center">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-4xl lg:text-6xl font-bold text-white mb-6 leading-tight">
              Transform Nigeria&apos;s Petroleum Law into Your Digital
              Advantage.
            </h1>

            <p className="text-xl text-white/90 mb-12 leading-relaxed max-w-3xl mx-auto">
              Navigate the complexities of the Petroleum Industry Act (PIA) 2021
              with an AI-powered platform. Search, verify, and draft legal
              documents with unparalleled speed and accuracy.
            </p>

            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
              <Link href={"/signup"}>
                <Button className="bg-green-700 hover:bg-green-600 text-white text-lg px-8 py-4 rounded">
                  Request a Demo
                </Button>
              </Link>
              <Link href={"/chat"}>
                <Button
                  variant="outline"
                  className="border-white text-dark hover:bg-white hover:text-dark text-lg px-8 py-4 rounded"
                >
                  Learn More
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Content Placeholder Section */}
      <section className="pt-10 pb-24 px-6">
        <div className="container mx-auto">
          <div className="mx-auto">
            <div className="aspect-video bg-dark border border-white/20 overflow-hidden rounded-lg flex items-center justify-center">
              <video
                className="w-full h-full object-cover"
                loop
                autoPlay
                muted
                playsInline
              >
                <source src={"/video/PIA SAMPLE GIF.MP4"} type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
