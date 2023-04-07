import axios from "axios";
import { useRouter } from "next/router";
import React from "react";
import { useState } from "react";
import { useEffect } from "react";
import Spinner from "../../src/components/Spinner";
import ReactStars from "react-rating-stars-component";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, Navigation } from "swiper";

// Import Swiper styles
import "swiper/css";
import "swiper/css/pagination";

const Vendor = () => {
  const router = useRouter();
  const [vendor, setvendor] = useState({});
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState(0);
  const [ratings, setRatings] = useState(0);
  const [packageLoading, setPackageLoading] = useState(false);

  const thirdExample = {
    size: 20,
    count: 5,
    isHalf: false,
    value: vendor?.averageRating ? vendor?.averageRating : 0,
    color: "#cccccc",
    activeColor: "yellow",
    onChange: (newValue) => {},
  };

  const getDetails = async () => {
    const token = localStorage.getItem("token");
    var config = {
      method: "get",
      maxBodyLength: Infinity,
      url: `${process.env.NEXT_PUBLIC_API_URL}vendor-management/vendor/${router.query.id}`,
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

  const getPackages = async () => {
    const token = localStorage.getItem("token");
    var config = {
      method: "get",
      maxBodyLength: Infinity,
      url: `${process.env.NEXT_PUBLIC_API_URL}vendor-management/vendor-package?vendor=${vendor._id}`,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    setPackageLoading(true);
    await axios(config)
      .then(function (response) {
        console.log(response.data);
        setPackageLoading(false);
      })
      .catch(function (error) {
        console.log(error);
        setPackageLoading(false);
      });
  };

  useEffect(() => {
    if (router.query.id) {
      getDetails();
    }
  }, [router.query.id]);

  const requestVendor = async () => {
    const token = localStorage.getItem("token");

    var data = JSON.stringify({
      event: router.query.eventId,
      vendor: router.query.id,
    });

    var config = {
      method: "post",
      maxBodyLength: Infinity,
      url: `${process.env.NEXT_PUBLIC_API_URL}event-management/event-vendor`,
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      data: data,
    };

    axios(config)
      .then(function (response) {
        console.log(response.data);
        router.push(
          `/messages/${response.data.conversationVendorData._id}?user=vendor&eventId=${router.query.eventId}&vendor=${response.data?._id}&status=${response.data.status}`
        );
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  return (
    <div className="flex z-50 bg-[#0D0821] rounded-3xl min-h-[95vh] flex-col px-10 py-4 md:mr-6">
      <div className="z-50 text-white py-5 border-b border-gray-200">
        <div className="z-50 -ml-4 -mt-2 flex items-center justify-between flex-wrap sm:flex-nowrap">
          <div className="z-50  ml-4 mt-2">
            <h3 className="z-50 text-2xl leading-6 font-medium">
              Vendor Details
            </h3>
          </div>
        </div>
      </div>
      <div className="mt-5">
        {loading ? (
          <Spinner />
        ) : (
          <div className="w-full z-50">
            <div className="flex flex-col justify-center text-center items-center">
              <div className="grid grid-cols-1 md:grid-cols-2 md:gap-3">
                <div className="w-max">
                  {vendor &&
                  vendor?.attachments &&
                  vendor.attachments.length > 0 ? (
                    <img
                      src={vendor?.attachments[0]}
                      className="h-40 w-40 z-50 rounded-full"
                    />
                  ) : (
                    <div className="bg-gray-200 w-40 h-40 rounded-full"></div>
                  )}
                  <div className="">
                    <div className="text-xl text-white font-semibold">
                      {vendor.brand}
                    </div>
                    <div className="text-gray-300">Locality and regionx</div>
                    <ReactStars
                      classNames={"mx-auto"}
                      emptyIcon={<i className="far fa-star"></i>}
                      halfIcon={<i className="fa fa-star-half-alt"></i>}
                      fullIcon={<i className="fa fa-star"></i>}
                      {...thirdExample}
                    />
                  </div>
                </div>
                <div className="mt-5 bg-gray-100 rounded-xl bg-opacity-20 shadow-xl p-4 h-max">
                  <div className="text-left  text-white text-lg font-semibold">
                    About us
                  </div>
                  <div className="text-left max-w-2xl text-white">
                    {vendor.description}
                  </div>
                </div>
              </div>

              <div className="my-4 z-50 w-full">
                <div className="rounded-xl shadow grid grid-cols-3 h-8 gap-5">
                  <div
                    onClick={() => setStatus(0)}
                    className={
                      status === 0
                        ? "bg-indigo-700 rounded-xl w-full cursor-pointer text-white flex justify-center items-center font-medium text-lg"
                        : "bg-white rounded-xl w-full cursor-pointer text-gray-700 flex justify-center items-center font-medium text-lg"
                    }
                  >
                    Overview
                  </div>
                  <div
                    onClick={() => {
                      getPackages();
                      setStatus(1);
                    }}
                    className={
                      status === 1
                        ? "bg-indigo-700 rounded-xl w-full cursor-pointer text-white flex justify-center items-center font-medium text-lg"
                        : "bg-white rounded-xl w-full cursor-pointer text-gray-700 flex justify-center items-center font-medium text-lg"
                    }
                  >
                    Packages
                  </div>
                  <div
                    onClick={() => setStatus(2)}
                    className={
                      status === 2
                        ? "bg-indigo-700 rounded-xl w-full cursor-pointer text-white flex justify-center items-center font-medium text-lg"
                        : "bg-white rounded-xl w-full cursor-pointer text-gray-700 flex justify-center items-center font-medium text-lg"
                    }
                  >
                    Reviews
                  </div>
                </div>
                {status === 0 ? (
                  <div>
                    <div className="mt-5">
                      <dl class="max-w-md text-white divide-y divide-gray-200 dark:text-white ">
                        <div class="flex flex-col pb-3">
                          <dt class="mb-1 text-white text-left md:text-lg dark:text-gray-400">
                            Brand Name
                          </dt>
                          <dd class="text-lg text-left font-semibold">
                            {vendor.brand}
                          </dd>
                        </div>
                        <div class="flex flex-col py-3">
                          <dt class="mb-1 text-white text-left md:text-lg dark:text-gray-400">
                            Address
                          </dt>
                          <dd class="text-lg text-left font-semibold">
                            {vendor?.address?.addressLine1}
                          </dd>
                        </div>
                        <div class="flex flex-col pt-3">
                          <dt class="mb-1 text-white text-left md:text-lg dark:text-gray-400">
                            Categories
                          </dt>
                          <dd class="text-lg text-left font-semibold">
                            {vendor?.categories?.map((cat, index) => (
                              <div className="my-1">
                                {cat.title ? cat.title : "N/A"}
                              </div>
                            ))}
                          </dd>
                        </div>
                      </dl>
                    </div>
                    <div className="my-10 z-50 w-full">
                      <Swiper
                        slidesPerView={1}
                        spaceBetween={2}
                        loop={true}
                        autoplay={{
                          delay: 2500,
                          disableOnInteraction: false,
                        }}
                        pagination={{
                          clickable: true,
                        }}
                        modules={[Pagination]}
                        className="mySwiper"
                        breakpoints={{
                          640: {
                            slidesPerView: 2,
                            spaceBetween: 20,
                          },
                          768: {
                            slidesPerView: 3,
                            spaceBetween: 40,
                          },
                          1024: {
                            slidesPerView: 4,
                            spaceBetween: 50,
                          },
                        }}
                      >
                        {vendor?.attachments?.map((vendor, index) => (
                          <SwiperSlide key={index}>
                            <img
                              src={vendor}
                              className="w-60 h-60 object-cover"
                            />
                          </SwiperSlide>
                        ))}
                      </Swiper>
                    </div>
                  </div>
                ) : status === 1 ? (
                  <div>
                    <div className="my-10 z-50 w-full">
                      <Swiper
                        slidesPerView={1}
                        spaceBetween={2}
                        loop={true}
                        autoplay={{
                          delay: 2500,
                          disableOnInteraction: false,
                        }}
                        pagination={{
                          clickable: true,
                        }}
                        modules={[Pagination]}
                        className="mySwiper"
                        breakpoints={{
                          640: {
                            slidesPerView: 2,
                            spaceBetween: 20,
                          },
                          768: {
                            slidesPerView: 3,
                            spaceBetween: 40,
                          },
                          1024: {
                            slidesPerView: 4,
                            spaceBetween: 50,
                          },
                        }}
                      >
                        {vendor?.packages?.map((vendor, index) => (
                          <SwiperSlide key={index}>
                            <img
                              src={vendor}
                              className="w-60 h-60 object-cover"
                            />
                          </SwiperSlide>
                        ))}
                      </Swiper>
                    </div>
                  </div>
                ) : (
                  ""
                )}
              </div>
            </div>
          </div>
        )}
      </div>
      <div className="z-50 flex justify-end w-full">
        <button
          onClick={() => requestVendor()}
          className="px-8 py-2 bg-indigo-600 text-white hover:bg-indigo-500 rounded-xl shadow-lg"
        >
          Have a chat
        </button>
      </div>
    </div>
  );
};

export default Vendor;
