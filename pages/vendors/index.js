import axios from "axios";
import React from "react";
import { useEffect } from "react";
import { Disclosure } from "@headlessui/react";
import { ChevronUpIcon } from "@heroicons/react/outline";
import Spinner from "../../src/components/Spinner";
import { useState } from "react";
import { useRouter } from "next/router";

const Vendors = () => {
  const router = useRouter();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);

  const getCategories = async () => {
    var config = {
      method: "get",
      maxBodyLength: Infinity,
      url: "https://api.test.festabash.com/v1/category",
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

  useEffect(() => {
    getCategories();
  }, []);

  return (
    <div className="flex bg-white rounded-3xl min-h-[95vh] flex-col px-10 py-4 md:mr-6">
      <div className="w-full ">
        <div className="bg-white py-5 border-b border-gray-200">
          <div className="-ml-4 -mt-2 flex items-center justify-between flex-wrap sm:flex-nowrap">
            <div className="ml-4 mt-2">
              <h3 className="text-2xl leading-6 font-medium text-gray-900">
                Vendors
              </h3>
            </div>
          </div>
        </div>
        <div className="w-full mt-5">
          {loading ? (
            <Spinner />
          ) : (
            categories.map((category, index) => (
              <Disclosure>
                {({ open }) => (
                  <>
                    <Disclosure.Button
                      key={index}
                      className="flex w-full mt-3 justify-between rounded-lg bg-purple-100 px-4 py-2 text-left text-sm font-medium text-purple-900 hover:bg-purple-200 focus:outline-none focus-visible:ring focus-visible:ring-purple-500 focus-visible:ring-opacity-75"
                    >
                      <span>{category.title}</span>
                      <ChevronUpIcon
                        className={`${
                          open ? "rotate-180 transform" : ""
                        } h-5 w-5 text-purple-500`}
                      />
                    </Disclosure.Button>
                    <Disclosure.Panel className="px-4 bg-purple-100 pb-2 text-sm text-gray-700">
                      {category.subCatgories.map((subcat, index) => (
                        <div
                          onClick={() =>
                            router.push(
                              `/vendors/${subcat._id}?title=${subcat.title}`
                            )
                          }
                          className="cursor-pointer hover:bg-slate-100 py-2 border-b-2 border-gray-50"
                          key={index}
                        >
                          {subcat.title}
                        </div>
                      ))}
                    </Disclosure.Panel>
                  </>
                )}
              </Disclosure>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Vendors;
