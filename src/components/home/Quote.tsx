import Image from "next/image";
import Quotation from "../../../public/quotation.png";

const Quote = () => {
  return (
    <div className="my-20">
      <div className="flex flex-col justify-center items-center py-20 bg-[#F8D57E] text-[#333333] rounded-[15px] px-6">
        <div>
          <Image className="w-16 h-16 object-contain" src={Quotation} alt="Quote" />
        </div>
        <div className="md:w-2/3 w-full text-center mt-6 text-lg md:text-xl font-medium">
          Security is mostly a superstition. It does not exist in nature, nor
          do the children of men as a whole experience it. Avoiding danger is
          no safer in the long run than outright exposure. Life is either a
          daring adventure, or nothing.
        </div>
        <div className="mt-10 text-sm font-bold tracking-wider uppercase text-neutral-700">Helen Keller</div>
      </div>
    </div>
  );
};

export default Quote;
