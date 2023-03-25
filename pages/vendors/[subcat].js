import { ChevronRightIcon } from "@heroicons/react/outline";
import axios from "axios";
import { useRouter } from "next/router";
import React, { useEffect } from "react";
import { useState } from "react";
import Spinner from "../../src/components/Spinner";

const SubCat = () => {
  const router = useRouter();
  const [vendors, setVendors] = useState([]);
  const [loading, setloading] = useState(false);

  const getVendors = async () => {
    const token = localStorage.getItem("token");
    var config = {
      method: "get",
      maxBodyLength: Infinity,
      url: `https://api.test.festabash.com/v1/vendor-management/vendor?categories.subCategories[$in]=${router.query.subcat}`,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    setloading(true);

    await axios(config)
      .then(function (response) {
        console.log(response.data);
        setVendors(response.data.data);
        setloading(false);
      })
      .catch(function (error) {
        console.log(error);
        setloading(false);
      });
  };

  useEffect(() => {
    if (router.query.subcat) {
      getVendors();
      console.log(router.query);
      console.log(router.params);
    }
  }, [router.query.subcat, router.params]);

  return (
    <div className="flex bg-white rounded-3xl min-h-[95vh] flex-col px-10 py-4 md:mr-6">
      <div className="w-full ">
        <div className="bg-white py-5 border-b border-gray-200">
          <div className="-ml-4 -mt-2 flex items-center justify-between flex-wrap sm:flex-nowrap">
            <div className="ml-4 mt-2">
              <h3 className="text-2xl leading-6 font-medium text-gray-900">
                {router?.query?.title}
              </h3>
            </div>
          </div>
        </div>
        {loading ? (
          <Spinner />
        ) : (
          vendors.map((vendor, index) => (
            <div
              key={index}
              onClick={() => router.push(`/vendor/${vendor._id}`)}
              className="cursor-pointer hover:shadow-xl  flex justify-between my-3 items-center w-full md:w-1/2 p-3 bg-gray-100 rounded-xl"
            >
              <div className="flex-1 flex space-x-3 items-center justify-start">
                <img
                  className="w-20"
                  src={vendor.attachments[0]}
                  alt="vendor"
                />
                <div>
                  <div className="mb-1 text-lg text-gray-700 font-semibold">
                    {vendor.brand}
                  </div>
                  <div className="text-gray-500">{vendor.description}</div>
                </div>
              </div>
              <div>
                <ChevronRightIcon className="text-gray-700 w-5 " />
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default SubCat;
