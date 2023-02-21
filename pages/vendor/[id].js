import axios from "axios";
import { useRouter } from "next/router";
import React from "react";
import { useState } from "react";
import { useEffect } from "react";
import Spinner from "../../src/components/Spinner";

const Vendor = () => {
  const router = useRouter();
  const [vendor, setvendor] = useState({});
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState(true);

  const getDetails = async () => {
    const token = localStorage.getItem("token");
    var config = {
      method: "get",
      maxBodyLength: Infinity,
      url: `https://api.test.festabash.com/v1/vendor-management/vendor/${router.query.id}`,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    setLoading(true);
    await axios(config)
      .then(function (response) {
        console.log(response.data);
        setvendor(response.data);
        setLoading(false);
      })
      .catch(function (error) {
        console.log(error);
        setLoading(false);
      });
  };

  useEffect(() => {
    if (router.query.id) {
      getDetails();
    }
  }, [router.query.id]);

  return (
    <div className="flex bg-white rounded-3xl min-h-[95vh] flex-col px-10 py-4 md:mr-6">
      <div className="bg-white py-5 border-b border-gray-200">
        <div className="-ml-4 -mt-2 flex items-center justify-between flex-wrap sm:flex-nowrap">
          <div className="ml-4 mt-2">
            <h3 className="text-2xl leading-6 font-medium text-gray-900">
              Vendor Details
            </h3>
          </div>
        </div>
      </div>
      <div className="mt-5">
        {loading ? (
          <Spinner />
        ) : (
          <div className="w-full">
            <div className="flex space-x-3 items-center">
              {vendor && vendor?.attachments && vendor.attachments.length > 0 ? (
                <img src={vendor?.attachments[0]} className="h-40" />
              ) : (
                <div className="bg-gray-200 w-40 h-40 rounded-full"></div>
              )}
              <div className="">
                <div className="text-gray-700 text-xl font-semibold">
                  {vendor.brand}
                </div>
                <div className="text-gray-500">Locality and regionx</div>
                <div className="text-gray-500">{vendor.description}</div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Vendor;
