import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "CipherGuard - Cookie Policy",
  description: "Cipher Guard Cookie Policy page.",
};

export default function CookiesPolicy() {
  return (
    <div className="bg-[#2B2B2B] md:px-24 px-8 min-h-screen text-neutral-400 font-poppins flex flex-col">
      <Navbar />
      <main className="flex-grow max-w-4xl mx-auto py-10 w-full">
        <div className="flex flex-col gap-6 mt-5 bg-[#333333] p-8 rounded-2xl shadow-lg border border-neutral-700">
          <h1 className="text-4xl font-semibold text-white border-b border-neutral-600 pb-4 mb-2">
            Cookie Policy
          </h1>

          <p className="text-lg leading-relaxed">
            This is the Cookie Policy for cipherguard.cleverpentester.com,
            accessible from <span className="font-mono bg-black/30 px-2 py-1 rounded text-[#F8D57E]">https://cipherguard.cleverpentester.com</span>
          </p>

          <h2 className="text-2xl font-semibold text-neutral-200 mt-6 flex items-center gap-2">
            <span className="text-[#BFAFF2]">#</span> What Are Cookies
          </h2>

          <p className="leading-relaxed">
            As is common practice with almost all professional websites this site
            uses cookies, which are tiny files that are downloaded to your
            computer, to improve your experience. This page describes what
            information they gather, how we use it and why we sometimes need to
            store these cookies. We will also share how you can prevent these
            cookies from being stored however this may downgrade or break
            certain elements of the sites functionality.
          </p>

          <h2 className="text-2xl font-semibold text-neutral-200 mt-6 flex items-center gap-2">
            <span className="text-[#BFAFF2]">#</span> How We Use Cookies
          </h2>

          <p className="leading-relaxed">
            We use cookies for a variety of reasons detailed below. Unfortunately
            in most cases there are no industry standard options for disabling
            cookies without completely disabling the functionality and features
            they add to this site. It is recommended that you leave on all cookies
            if you are not sure whether you need them or not in case they are used
            to provide a service that you use.
          </p>

          <h2 className="text-2xl font-semibold text-neutral-200 mt-6 flex items-center gap-2">
            <span className="text-[#BFAFF2]">#</span> Disabling Cookies
          </h2>

          <p className="leading-relaxed">
            You can prevent the setting of cookies by adjusting the settings on
            your browser (see your browser Help for how to do this). Be aware that
            disabling cookies will affect the functionality of this and many other
            websites that you visit. Disabling cookies will usually result in also
            disabling certain functionality and features of the this site.
            Therefore it is recommended that you do not disable cookies.
          </p>

          <h2 className="text-2xl font-semibold text-neutral-200 mt-6 flex items-center gap-2">
            <span className="text-[#BFAFF2]">#</span> The Cookies We Set
          </h2>

          <ul className="flex flex-col gap-6 ml-6 list-none">
            <li className="relative pl-6 before:content-[''] before:absolute before:left-0 before:top-2.5 before:w-2 before:h-2 before:bg-[#FF6A3D] before:rounded-full">
              <p className="font-semibold text-neutral-200 text-lg mb-2">Account related cookies</p>
              <p className="leading-relaxed">
                If you create an account with us then we will use cookies for the
                management of the signup process and general administration. These
                cookies will usually be deleted when you log out however in some
                cases they may remain afterwards to remember your site preferences
                when logged out.
              </p>
            </li>

            <li className="relative pl-6 before:content-[''] before:absolute before:left-0 before:top-2.5 before:w-2 before:h-2 before:bg-[#FF6A3D] before:rounded-full">
              <p className="font-semibold text-neutral-200 text-lg mb-2">Login related cookies</p>
              <p className="leading-relaxed">
                We use cookies when you are logged in so that we can remember this
                fact. This prevents you from having to log in every single time
                you visit a new page. These cookies are typically removed or
                cleared when you log out to ensure that you can only access
                restricted features and areas when logged in.
              </p>
            </li>

            <li className="relative pl-6 before:content-[''] before:absolute before:left-0 before:top-2.5 before:w-2 before:h-2 before:bg-[#FF6A3D] before:rounded-full">
              <p className="font-semibold text-neutral-200 text-lg mb-2">Forms related cookies</p>
              <p className="leading-relaxed">
                When you submit data to through a form such as those found on
                contact pages or comment forms cookies may be set to remember your
                user details for future correspondence.
              </p>
            </li>
          </ul>

          <h2 className="text-2xl font-semibold text-neutral-200 mt-6 flex items-center gap-2">
            <span className="text-[#BFAFF2]">#</span> Third Party Cookies
          </h2>

          <p className="leading-relaxed">
            In some special cases we also use cookies provided by trusted third
            parties. The following section details which third party cookies you
            might encounter through this site.
          </p>

          <ul className="flex flex-col gap-3 ml-6 list-none mt-2">
            <li className="relative pl-6 before:content-[''] before:absolute before:left-0 before:top-2.5 before:w-2 before:h-2 before:bg-[#FF6A3D] before:rounded-full">
              <p className="leading-relaxed">
                From time to time we test new features and make subtle changes to
                the way that the site is delivered. When we are still testing new
                features these cookies may be used to ensure that you receive a
                consistent experience whilst on the site whilst ensuring we
                understand which optimisations our users appreciate the most.
              </p>
            </li>
          </ul>

          <h2 className="text-2xl font-semibold text-neutral-200 mt-6 flex items-center gap-2">
            <span className="text-[#BFAFF2]">#</span> More Information
          </h2>

          <p className="leading-relaxed">
            Hopefully that has clarified things for you and as was previously
            mentioned if there is something that you aren&apos;t sure whether you need
            or not it&apos;s usually safer to leave cookies enabled in case it does
            interact with one of the features you use on our site.
          </p>
          
          <p className="leading-relaxed mt-2 text-white bg-black/20 p-4 rounded-lg border border-neutral-600">
            However if you are still looking for more information then you can
            contact us through one of our preferred contact methods:
            <br /><br />
            <strong>Email:</strong> <a href="mailto:support@cleverpentester.com" className="text-[#BFAFF2] hover:underline">support@cleverpentester.com</a>
          </p>
        </div>
      </main>
      <Footer />
    </div>
  );
}
