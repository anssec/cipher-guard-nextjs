import Link from "next/link";
import Image from "next/image";
import AssetImg from "../../../public/mail.png";

const Contact = () => {
  return (
    <div className="flex justify-between flex-wrap mt-20 mb-10 w-full px-4 md:px-0">
      {/* left div */}
      <div className="lg:w-1/2 w-full flex flex-col justify-center lg:text-left text-center text-white">
        <div className="lg:text-5xl text-4xl lg:leading-snug font-black leading-snug">
          Questions? <br />
          Let’s talk
        </div>
        <div className="mt-6 text-neutral-400 text-lg">
          Contact us on{" "}
          <a href="mailto:support@cleverpentester.com" className="text-white hover:underline">
            support@cleverpentester.com
          </a>
        </div>
        <div className="text-neutral-400 mt-2 text-lg">We’re always happy to help!</div>

        <div className="mt-10">
          <Link
            href="/register"
            className="bg-[#F8D57E] text-[#333333] text-lg px-8 py-3 rounded-[15px] font-medium transition-transform hover:scale-105 inline-block"
          >
            Get started
          </Link>
        </div>
      </div>

      {/* Right div */}
      <div className="w-full flex justify-center items-center lg:w-5/12 ml-auto mt-16 lg:mt-0">
        <Image src={AssetImg} alt="Contact us" className="lg:w-64 w-48 object-contain" />
      </div>
    </div>
  );
};

export default Contact;
