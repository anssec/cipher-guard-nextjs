import Image from "next/image";
import Link from "next/link";
import HeroImg from "../../../public/HeroImg.png";

const Hero = () => {
  return (
    <div className="flex flex-col items-center justify-between text-white mt-10">
      <div className="flex flex-col items-center mx-auto">
        <h1 className="font-semibold mb-[60px] text-center md:text-6xl text-4xl">
          CipherGuard
        </h1>
        <p className="text-[18px] text-neutral-500 text-center max-w-2xl px-4">
          Master Your Digital Keys: CipherGuard - Where Security Meets
          Simplicity.
        </p>
        <Link
          href="/register"
          className="bg-[#F8D57E] text-[#333333] text-lg px-6 py-2 rounded-[15px] mt-[60px] font-medium"
        >
          Get Started
        </Link>
        <div className="mt-20 w-full max-w-4xl mx-auto flex justify-center">
          <Image
            src={HeroImg}
            alt="CipherGuard Dashboard"
            className="lg:w-full w-[80%] object-contain"
            priority
          />
        </div>
      </div>
      <div className="h-0.5 w-full bg-neutral-600 mt-20"></div>
    </div>
  );
};

export default Hero;
