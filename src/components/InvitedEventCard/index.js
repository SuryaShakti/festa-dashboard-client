import { useRouter } from "next/router";
import React from "react";

const InvitedEventCard = ({ item, section }) => {
  const router = useRouter();

  return (
    <div
      className="z-50 cursor-pointer"
      onClick={() => router.push(`/${section}/${item._id}`)}
    >
      {" "}
      <div
        className={
          item.status === 1
            ? "relative rounded-2xl bg-gray-100 bg-opacity-10 text-white mx-auto my-2 md:my-2 w-full max-w-[256px]"
            : "relative rounded-2xl bg-gradient-to-r from-purple-600  to-violet-800 text-white mx-auto my-2 md:my-2 w-full max-w-[256px]"
        }
      >
        <div className="">
          <div className="bg-[#ffffff] bg-opacity-20 flex justify-center items-center rounded-2xl">
            <img className="h-32 w-full rounded-t-xl object-cover" src={item.attachments[0]} />
          </div>
          <div className="p-3">
            <div className="text-base font-bold  text-center my-3">
              {item.name}
            </div>
            <div className="w-full h-px bg-white"></div>
            <div className=" text-xs text-center mt-2">
              {item.description ? item.description : "No description available"}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InvitedEventCard;
