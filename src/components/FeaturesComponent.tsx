import Image from "next/image";

interface FeaturesComponentProps {
  heading: string;
  content: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  img: any;
}

const FeaturesComponent = ({ heading, content, img }: FeaturesComponentProps) => {
  return (
    <div className="flex items-center gap-6 space-y-2">
      <div className="w-16 h-16 flex justify-center items-center relative">
        <Image className="min-w-[50px] object-contain" src={img} alt="" width={50} height={50} />
      </div>
      <div className="flex flex-col gap-1 w-fit">
        <div className="text-white font-bold">{heading}</div>
        <div className="text-neutral-500 font-normal">{content}</div>
      </div>
    </div>
  );
};

export default FeaturesComponent;
