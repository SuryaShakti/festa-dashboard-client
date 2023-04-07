import { Dialog, Transition } from "@headlessui/react";
import { ChevronRightIcon } from "@heroicons/react/outline";
import axios from "axios";
import { useRouter } from "next/router";
import React, { Fragment, useEffect, useState } from "react";
import Spinner from "../Spinner";
import ViewVendors from "../ViewVednors";

const VendorDialog = ({ vendorsOpen, setVendorsOpen, eventId }) => {
  const [loading, setLoading] = useState(false);
  const [vendors, setVendors] = useState([]);
  const [addVendorOpen, setAddVendorOpen] = useState(false);
  const [addLoading, setAddLoading] = useState(false);

  const router = useRouter();

  const getVendors = async () => {
    const token = localStorage.getItem("token");
    setLoading(true);
    var config = {
      method: "get",
      maxBodyLength: Infinity,
      url: `${process.env.NEXT_PUBLIC_API_URL}event-management/event-vendor?event=${eventId}&$populate=vendor`,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    await axios(config)
      .then(function (response) {
        console.log(response.data);
        setVendors(response.data.data);
        setLoading(false);
      })
      .catch(function (error) {
        console.log(error);
        setLoading(false);
      });
  };

  useEffect(() => {
    getVendors();
  }, []);

  const addVendor = async () => {};

  return (
    <div>
      {" "}
      <Transition appear show={vendorsOpen} as={Fragment}>
        <Dialog
          as="div"
          className="relative z-50"
          onClose={() => setVendorsOpen(false)}
        >
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black bg-opacity-25" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                  <Dialog.Title
                    as="h3"
                    className="text-lg font-medium leading-6 text-gray-900"
                  >
                    Vendors
                  </Dialog.Title>
                  <div>
                    <div className="mt-2">
                      {loading ? (
                        <Spinner />
                      ) : vendors.length > 0 ? (
                        vendors
                          ?.filter((vendor, index) => vendor.status === 1)
                          .map((vendor, index) => (
                            <div
                              key={index}
                              onClick={() =>
                                router.push(
                                  `/choose-vendor/${vendor?.vendor?._id}?eventId=${eventId}`
                                )
                              }
                              className="cursor-pointer hover:shadow-xl hover:bg-white hover:bg-opacity-40  flex justify-between my-3 items-center w-full p-2 bg-gray-100  rounded-xl"
                            >
                              <div className="flex-1 flex space-x-3 items-center justify-start">
                                <img
                                  className="h-20 object-cover"
                                  src={vendor?.vendor.attachments[0]}
                                  alt="vendor"
                                />
                                <div>
                                  <div className="mb-1 text-lg text-gray-700 font-semibold">
                                    {vendor?.vendor?.brand}
                                  </div>
                                  <div className="text-gray-600">
                                    {vendor?.vendor.description}
                                  </div>
                                </div>
                              </div>
                              <div>
                                <ChevronRightIcon className="text-white w-5 " />
                              </div>
                            </div>
                          ))
                      ) : (
                        <div className="mt-5 text-center">
                          There are no vendors added
                        </div>
                      )}
                    </div>

                    <div className="mt-4">
                      <button
                        type="button"
                        className="inline-flex justify-center rounded-md border border-transparent bg-blue-100 px-4 py-2 text-sm font-medium text-blue-900 hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                        onClick={() => setAddVendorOpen(true)}
                      >
                        Add a vendor
                      </button>
                    </div>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
      <Transition appear show={addVendorOpen} as={Fragment}>
        <Dialog
          as="div"
          className="relative z-50"
          onClose={() => setAddVendorOpen(false)}
        >
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black bg-opacity-25" />
          </Transition.Child>

          <div className="fixed  inset-0 overflow-y-auto">
            <div className="flex  min-h-full items-center justify-center p-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full max-w-5xl transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                  <Dialog.Title
                    as="h3"
                    className="text-lg font-medium leading-6 text-gray-900"
                  >
                    Vendors
                  </Dialog.Title>
                  <div>
                    <div className="mt-2">
                      <ViewVendors eventId={eventId} page="choose-vendor" />
                    </div>

                    <div className="mt-4">
                      <button
                        type="button"
                        className="inline-flex justify-center rounded-md border border-transparent bg-blue-100 px-4 py-2 text-sm font-medium text-blue-900 hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                        onClick={() => setAddVendorOpen(false)}
                      >
                        Save
                      </button>
                    </div>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </div>
  );
};

export default VendorDialog;
