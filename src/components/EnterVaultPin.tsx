"use client";

import { useRef, useState } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { MdErrorOutline } from "react-icons/md";
import JSCookies from "js-cookie";
import Link from "next/link";
import { useRouter } from "next/navigation";

const EnterVaultPin = () => {
  const inputRefs = useRef<Array<HTMLInputElement | null>>([]);
  const [vaultPin, setVaultPin] = useState<string>("");
  const [error, setError] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const router = useRouter();

  const handleInputChange = (index: number, value: string) => {
    // Move to the next input if value is entered
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }

    // Update the vault pin
    const newVaultPin = Array.from({ length: 6 }, (_, i) => {
      return i === index ? value : vaultPin[i] || "";
    }).join("");
    setVaultPin(newVaultPin);
  };

  // Function to handle form submission
  const handleSubmit = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    await axios
      .post(
        `/api/auth/vault-auth`,
        {
          vaultPin: vaultPin,
        },
        {
          withCredentials: true,
        }
      )
      .then(function (response) {
        setError(false);
        JSCookies.set("v_pin", response.data.data, {
          expires: 1 / 48, // 30 mins
          path: "/",
          secure: true,
          sameSite: "strict",
        });
        toast.success(response.data.message);
        router.refresh();
      })
      .catch(function (error) {
        setErrorMessage(error.response?.data?.message || "An error occurred");
        setError(true);
      });
  };

  return (
    <div className="flex justify-center relative items-center h-full w-full">
      <div className="absolute flex flex-col items-center gap-3">
        <div className="text-center">Enter VaultPin</div>
        {error && (
          <div className="text-red-500 w-full flex items-center gap-1">
            <MdErrorOutline />
            {errorMessage}
          </div>
        )}
        <div className="flex flex-row space-x-2">
          {Array.from({ length: 6 }, (_, index) => (
            <input
              key={index}
              ref={(el) => { inputRefs.current[index] = el; }}
              className="w-10 h-10 rounded-lg text-center outline-none border-2 text-black"
              maxLength={1}
              minLength={1}
              type="text"
              value={vaultPin[index] || ""}
              onChange={(e) => handleInputChange(index, e.target.value)}
            />
          ))}
        </div>
        <button
          className="border w-fit px-3 py-1 rounded-lg bg-black text-white"
          onClick={handleSubmit}
        >
          Go
        </button>
        <Link
          href={"/settings/create-vault-pin"}
          className="border w-fit px-3 py-1 rounded-lg bg-white text-black"
        >
          Create New
        </Link>
      </div>
    </div>
  );
};

export default EnterVaultPin;
