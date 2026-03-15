import FeaturesComponent from "../FeaturesComponent";
import meterImg from "../../../public/meter.png";
import emergencyImg from "../../../public/emergency.png";
import exportImg from "../../../public/export-file.png";
import passwordImg from "../../../public/WebsitePassword.png";
import Image from "next/image";

const Features = () => {
  return (
    <div className="flex justify-between flex-wrap mt-14 mb-10 gap-10 lg:gap-0">
      {/* leftDiv */}
      <div className="lg:w-1/2 w-full flex flex-col justify-center xl:items-start items-center gap-10">
        <FeaturesComponent
          heading={"Password Strength Meter"}
          content={
            "Provide a visual indicator of password strength to encourage users to create strong passwords."
          }
          img={meterImg}
        />
        <FeaturesComponent
          heading={"Emergency Access"}
          content={
            "Implement a feature that allows users to designate trusted contacts who can access their account in case of emergencies."
          }
          img={emergencyImg}
        />
        <FeaturesComponent
          heading={"Import/Export Functionality"}
          content={
            "Provide the ability to import/export passwords to and from various file formats for easy migration."
          }
          img={exportImg}
        />
      </div>

      {/* rightDiv */}
      <div className="w-full flex justify-center items-center lg:w-5/12 ml-auto">
        <Image src={passwordImg} alt="Password illustration" className="w-full max-w-sm lg:max-w-full lg:w-full object-contain" />
      </div>
    </div>
  );
};

export default Features;
