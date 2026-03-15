import Image from "next/image";
import Link from "next/link";
import Logo from "../../../public/logo.png";

const Footer = () => {
  return (
    <>
      <div className="h-0.5 w-full bg-neutral-600 mt-20"></div>
      <div className="flex flex-col lg:h-28 h-fit mt-4 lg:mt-0 lg:flex-row justify-between lg:items-center gap-14 lg:0 text-white p-4">
        <Link href="/">
          <Image
            className="cursor-pointer"
            src={Logo}
            alt="CipherGuard logo"
            width={144}
            height={40}
          />
        </Link>
        <div className="text-sm flex flex-col lg:flex-row font-semibold">
          © CipherGuard 2026
          <Link href="/privacy-policy" className="ml-4 lg:mt-0 mt-4 hover:underline">
            Privacy policy
          </Link>
          <Link href="/cookies-policy" className="ml-4 lg:mt-0 mt-4 hover:underline">
            Cookies policy
          </Link>
          <Link href="/terms-of-use" className="ml-4 lg:mt-0 mt-4 hover:underline">
            Terms of use
          </Link>
        </div>
      </div>
    </>
  );
};

export default Footer;
