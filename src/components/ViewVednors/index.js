import axios from "axios";
import React from "react";
import { useEffect } from "react";
import { Disclosure } from "@headlessui/react";
import {
  ChevronDownIcon,
  ChevronRightIcon,
  ChevronUpIcon,
} from "@heroicons/react/outline";
import Spinner from "../Spinner";
import { useState } from "react";
import { useRouter } from "next/router";
import { Menu, Transition } from "@headlessui/react";
import { Fragment, useRef } from "react";

const ViewVendors = ({ page = "vendor", eventId }) => {
  const router = useRouter();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedCat, setSelectedCat] = useState({});
  const [selectedSubCat, setSelectedSubCat] = useState({});
  const [vendors, setVendors] = useState([]);

  const getCategories = async () => {
    var config = {
      method: "get",
      maxBodyLength: Infinity,
      url: `${process.env.NEXT_PUBLIC_API_URL}category`,
    };
    setLoading(true);
    await axios(config)
      .then(function (response) {
        console.log(response.data);
        setCategories(response.data.data);
        setLoading(false);
      })
      .catch(function (error) {
        console.log(error);
        setLoading(false);
      });
  };

  const getVendors = async (cat) => {
    const token = localStorage.getItem("token");
    var config = {
      method: "get",
      maxBodyLength: Infinity,
      url: `${process.env.NEXT_PUBLIC_API_URL}vendor-management/vendor?categories.subCategories[$in]=${cat._id}`,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    setLoading(true);

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
    getCategories();
  }, []);

  return (
    <div className="flex z-50 rounded-3xl min-h-[75vh] flex-col ">
      <div className="w-full z-50 ">
        <div className="my-3 z-50 flex space-x-4">
          <div className="flex justify-between space-x-4 items-center">
            <Menu
              as="div"
              className="relative  sm:w-[220px] inline-block text-left mt-2"
            >
              <div>
                <Menu.Button className="z-50 inline-flex text-white hover:bg-gray-200 w-full sm:w-[220px] justify-center rounded-md px-4 py-2 text-sm font-medium bg-gradient-to-b from-violet-400 via-violet-700 to-violet-900 hover:bg-opacity-30 focus:outline-none focus-visible:ring-2 focus-visible:ring-transparent focus-visible:ring-opacity-75">
                  {selectedCat?.title
                    ? categories.filter((cat) => cat._id === selectedCat._id)[0]
                        ?.title
                    : "Category"}
                  <ChevronDownIcon
                    className="ml-2 -mr-1 h-5 w-5 text-violet-200 hover:text-violet-100"
                    aria-hidden="true"
                  />
                </Menu.Button>
              </div>
              <Transition
                as={Fragment}
                enter="transition ease-out duration-100"
                enterFrom="transform opacity-0 scale-95"
                enterTo="transform opacity-100 scale-100"
                leave="transition ease-in duration-75"
                leaveFrom="transform opacity-100 scale-100"
                leaveTo="transform opacity-0 scale-95"
              >
                <Menu.Items className="absolute  mt-2 w-max px- origin-top-right divide-y divide-gray-100 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                  <div className="px-1 py-1 ">
                    {categories?.map((cat, index) => (
                      <Menu.Item
                        key={index}
                        onClick={() => setSelectedCat(cat)}
                      >
                        {({ active }) => (
                          <button
                            className={`${
                              active
                                ? "bg-violet-500 text-white"
                                : "text-gray-900"
                            } group flex w-full items-center rounded-md px-2 py-2 text-sm`}
                          >
                            {cat.title}
                          </button>
                        )}
                      </Menu.Item>
                    ))}
                  </div>
                </Menu.Items>
              </Transition>
            </Menu>
            <Menu
              as="div"
              className="relative sm:w-[220px] inline-block text-left mt-2"
            >
              <div>
                <Menu.Button className="z-50 inline-flex text-white hover:bg-gray-200 w-full sm:w-[220px] justify-center rounded-md px-4 py-2 text-sm font-medium bg-gradient-to-b from-violet-400 via-violet-700 to-violet-900 hover:bg-opacity-30 focus:outline-none focus-visible:ring-2 focus-visible:ring-transparent focus-visible:ring-opacity-75">
                  {selectedSubCat?.title
                    ? categories
                        .filter((cat) => cat._id === selectedCat._id)[0]
                        ?.subCatgories.filter(
                          (cat) => cat._id === selectedSubCat._id
                        )[0]?.title
                    : "Sub Category"}
                  <ChevronDownIcon
                    className="ml-2 -mr-1 h-5 w-5 text-violet-200 hover:text-violet-100"
                    aria-hidden="true"
                  />
                </Menu.Button>
              </div>
              <Transition
                as={Fragment}
                enter="transition ease-out duration-100"
                enterFrom="transform opacity-0 scale-95"
                enterTo="transform opacity-100 scale-100"
                leave="transition ease-in duration-75"
                leaveFrom="transform opacity-100 scale-100"
                leaveTo="transform opacity-0 scale-95"
              >
                <Menu.Items className="absolute  mt-2 w-max px- origin-top-right divide-y divide-gray-100 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                  <div className="px-1 py-1 ">
                    {selectedCat?.subCatgories?.map((cat, index) => (
                      <Menu.Item
                        key={index}
                        onClick={() => {
                          setSelectedSubCat(cat);
                          getVendors(cat);
                        }}
                      >
                        {({ active }) => (
                          <button
                            className={`${
                              active
                                ? "bg-violet-500 text-white"
                                : "text-gray-900"
                            } group flex w-full items-center rounded-md px-2 py-2 text-sm`}
                          >
                            {cat.title}
                          </button>
                        )}
                      </Menu.Item>
                    ))}
                  </div>
                </Menu.Items>
              </Transition>
            </Menu>
          </div>
        </div>
        <div className="w-full mt-5 grid grid-cols-1 md:grid-cols-2 md:gap-5">
          {loading ? (
            <Spinner />
          ) : (
            vendors.map((vendor, index) => (
              <div
                key={index}
                onClick={() => {
                  eventId.trim() !== ""
                    ? router.push(`/${page}/${vendor._id}?eventId=${eventId}`)
                    : router.push(`/${page}/${vendor._id}`);
                }}
                className="cursor-pointer hover:shadow-xl hover:bg-white hover:bg-opacity-40  flex justify-between my-3 items-center w-full p-2 bg-gray-100  rounded-xl"
              >
                <div className="flex-1 flex space-x-3 items-center justify-start">
                  <img
                    className="h-20 object-cover"
                    src={vendor.attachments[0]}
                    alt="vendor"
                  />
                  <div>
                    <div className="mb-1 text-lg text-gray-700 font-semibold">
                      {vendor.brand}
                    </div>
                    <div className="text-gray-600">{vendor.description}</div>
                  </div>
                </div>
                <div>
                  <ChevronRightIcon className="text-white w-5 " />
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default ViewVendors;
