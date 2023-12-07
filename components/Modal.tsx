"use client";

import { Fragment, useRef, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useRouter } from "next/navigation";
type ModalProps = {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  party: string;
};

export default function Modal({ open, setOpen, party }: ModalProps) {
  const cancelButtonRef = useRef(null);
  const supabase = createClientComponentClient<any>();
  const [blockchain, setBlockchain] = useState<string>("");
  const [votedTwice, setVotedTwice] = useState<string>("");
  const [noneExist, setNonseExist] = useState<string>("");
  const router = useRouter();
  async function checkVoterStatus(inputValue: string) {
    const { data, error } = await supabase
      .from("voters")
      .select("Voted")
      .eq("BlockchainWalletAddress", inputValue);

    if (error) {
      console.error("Error fetching data:", error);
      return "An error occurred while fetching voter status";
    }

    if (data && data.length > 0) {
      if (data[0].Voted) {
        setVotedTwice("Already Voted");
        setNonseExist("");
      } else {
        const { error } = await supabase
          .from("voters")
          .update({ Voted: true, PoliticalAffiliation: party })
          .eq("BlockchainWalletAddress", inputValue);

        if (error) {
          console.error("Error updating voter status:", error);
          return "An error occurred while updating voter status";
        }
        setOpen(false);
        router.refresh();
      }
    } else {
      setVotedTwice("");
      setNonseExist("Blockchain ID does not exist on the system");
    }
  }
  return (
    <Transition.Root show={open} as={Fragment}>
      <Dialog
        as="div"
        className="relative z-10"
        initialFocus={cancelButtonRef}
        onClose={setOpen}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0">
          <div className="fixed inset-0 bg-black bg-opacity-75 transition-opacity" />
        </Transition.Child>

        <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
          <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95">
              <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6">
                <div className=" sm:items-start">
                  <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-center">
                    <Dialog.Title
                      as="h3"
                      className="text-base  font-semibold leading-6 text-gray-900">
                      Cast your Vote for {party}
                    </Dialog.Title>
                    <div className="mt-2">
                      <input
                        onChange={e => setBlockchain(e.target.value)}
                        type="email"
                        name="email"
                        id="email"
                        className="block w-full rounded-md border-0 px-1.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                        placeholder="Enter BlockChain ID"
                      />
                      {votedTwice !== "" && <p className="text-red-600 text-xs text-left">Already Voted</p>}
                      {noneExist !== "" && <p className="text-red-600 text-xs text-left">Blockchain Does not exist on our system</p>}
                    </div>
                  </div>
                </div>
                <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
                  <button
                    onClick={() => checkVoterStatus(blockchain)}
                    type="button"
                    className="inline-flex w-full justify-center rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500 sm:ml-3 sm:w-auto">
                    Cast Vote
                  </button>
                  <button
                    type="button"
                    className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
                    onClick={() => setOpen(false)}
                    ref={cancelButtonRef}>
                    Cancel
                  </button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
}
