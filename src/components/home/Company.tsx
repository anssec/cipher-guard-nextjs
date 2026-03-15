import { SiAccenture } from "react-icons/si";
import { FaMicrosoft, FaApple, FaGoogle } from "react-icons/fa";
import { RiNetflixFill } from "react-icons/ri";

const Company = () => {
  return (
    <>
      <div className="flex flex-col justify-center text-xl text-neutral-500 font-medium py-14">
        <div className="flex md:justify-evenly items-center justify-center flex-wrap gap-8 w-full">
          <div className="flex flex-col items-center">
            <SiAccenture className="text-4xl mb-2" />
            <p>Accenture</p>
          </div>
          <div className="flex flex-col items-center">
            <FaApple className="text-4xl mb-2" />
            <p>Apple</p>
          </div>
          <div className="flex flex-col items-center">
            <FaMicrosoft className="text-4xl mb-2" />
            <p>Microsoft</p>
          </div>
          <div className="flex flex-col items-center">
            <FaGoogle className="text-4xl mb-2" />
            <p>Google</p>
          </div>
          <div className="flex flex-col items-center">
            <RiNetflixFill className="text-4xl mb-2" />
            <p>Netflix</p>
          </div>
        </div>
      </div>
      <div className="h-0.5 w-full bg-neutral-600"></div>
    </>
  );
};

export default Company;
