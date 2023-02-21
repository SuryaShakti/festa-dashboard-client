import { Dialog, Transition } from "@headlessui/react";
import axios from "axios";
import React from "react";
import { useState } from "react";
import { useEffect } from "react";
import { Fragment } from "react";
import Spinner from "../Spinner";
import Slider from "rc-slider";
import "rc-slider/assets/index.css";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const BudgetDialog = ({ budgetOpen, setBudgetOpen, eventId, subevents }) => {
  const [budget, setBudget] = useState({});
  const [totalAmount, setTotalAmount] = useState();
  const [subEventBudget, setSubEventBudget] = useState([]);
  const [fetchLoading, setFecthLoading] = useState(true);
  const [totalBudgetLoading, setTotalBudgetLoading] = useState(false);


  const fetchBudget = async () => {
    const token = localStorage.getItem("token");

    setFecthLoading(true);
    var config = {
      method: "get",
      maxBodyLength: Infinity,
      url: `https://api.test.festabash.com/v1/event-management/event-budget?event=${eventId}`,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    await axios(config)
      .then(function (response) {
        console.log(response.data.data[0]);
        setBudget(response.data.data[0]);
        setTotalAmount(response.data.data[0].amount);
        setSubEventBudget([...response.data.data[0].subEventBudgets]);
        setFecthLoading(false);
      })
      .catch(function (error) {
        console.log(error);
        setFecthLoading(false);
      });
  };

  useEffect(() => {
    console.log(eventId);
    fetchBudget();
  }, []);


  const modifyTotalAmount = async () => {
    const token = localStorage.getItem("token");
    if (totalAmount > 0) {
      setTotalBudgetLoading(true);
      var data = JSON.stringify({
        amount: totalAmount,
        subEventBudgets: subEventBudget.map((item) => {
          return {
            subBudgetId: item._id,
            amount: item.amount,
          };
        }),
      });

      var config = {
        method: "patch",
        maxBodyLength: Infinity,
        url: `https://api.test.festabash.com/v1/event-management/event-budget/${budget._id}?event=${eventId}`,
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        data: data,
      };

      await axios(config)
        .then(function (response) {
          console.log(response.data);
          setBudgetOpen(false);
          setTotalBudgetLoading(false);
        })
        .catch(function (error) {
          console.log(error);
          setTotalBudgetLoading(false);
        });
    } else {
      toast.error("Total amount can't be 0", {
        position: "bottom-right",
      });
    }
  };

  const saveHandler = async () => {
    modifyTotalAmount();
  };

  const handleBudgetChange = (event) => {
    const newTotalBudget = parseInt(event.target.value);
    setTotalAmount(newTotalBudget);
    // Distribute the total budget equally among sub events
    // const defaultBudget = newTotalBudget / subEventBudget.length;
    // setSubEventBudget(subEventBudget.map(() => defaultBudget));
    const _subEvents = subEventBudget;
    console.log(
      _subEvents.map(
        (item) => (item.amount = newTotalBudget / subEventBudget.length)
      )
    );
    console.log(subEventBudget);
  };

  const handleEventBudgetChange = (index, value) => {
    // console.log(index, value);
    const remainingBudget = totalAmount - value;
    console.log(remainingBudget);
    const subEventBudgetCopy = [...subEventBudget];
    subEventBudgetCopy[index].amount = value;

    const numRemaining = subEventBudgetCopy.filter(
      (subEvent, i) => i !== index
    ).length;
    const remainingValue = remainingBudget / numRemaining;
    subEventBudgetCopy.forEach((subEvent, i) => {
      if (i !== index) {
        subEvent.amount = remainingValue;
      }
    });

    setSubEventBudget(subEventBudgetCopy);
  };

  return (
    <div>
      <Transition appear show={budgetOpen} as={Fragment}>
        <Dialog
          as="div"
          className="relative z-10"
          onClose={() => setBudgetOpen(false)}
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
                <Dialog.Panel className="w-full max-w-xl transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                  <Dialog.Title
                    as="h3"
                    className="text-lg font-medium leading-6 text-gray-900"
                  >
                    Budget
                  </Dialog.Title>
                  {fetchLoading ? (
                    <div className="my-5 flex justify-center items-center">
                      <Spinner />
                    </div>
                  ) : (
                    <div className="mt-5">
                      <div>
                        <div>
                          <div className="text-gray-700 text-base font-medium mb-1">
                            Total Budget
                          </div>
                          <input
                            type="number"
                            className="w-full py-2 border rounded-lg px-4 border-gray-400"
                            value={totalAmount}
                            onChange={handleBudgetChange}
                            placeholder={"Enter the budget of your event"}
                          />
                        </div>
                      </div>
                    </div>
                  )}
                  <div className="my-5">
                    {subEventBudget &&
                      totalAmount > 0 &&
                      subEventBudget.map((event, index) => (
                        <div
                          className="bg-gray-100 my-3 p-3 rounded-xl"
                          key={index}
                        >
                          <div className="w-full mb-4 flex justify-start items-center space-x-3">
                            <div>
                              <img
                                src={event.subEvent.attachments[0]}
                                className="h-28"
                              />
                            </div>
                            <div className="block">
                              <label className="block text-gray-500 text-xl font-bold">
                                {event?.subEvent?.name}
                              </label>
                              <label className="text-gray-500">
                                Rs. {event?.amount}
                              </label>
                            </div>
                          </div>
                          <Slider
                            value={event.amount}
                            min={0}
                            max={totalAmount}
                            step={1}
                            className="rc-slider"
                            onChange={(value) =>
                              handleEventBudgetChange(index, value)
                            }
                          />
                          {/* <div>Budget: {event.amount}</div> */}
                          <div className="my-2 mt-6">
                            <button className="w-full shadow-lg font-semibold text-gray-700 py-2 bg-white rounded-xl">
                              Assign Budget
                            </button>
                          </div>
                        </div>
                      ))}
                  </div>

                  <div className="mt-4 flex justify-center">
                    <button
                      type="button"
                      className="inline-flex shadow-lg w-full mx-auto justify-center rounded-md border border-transparent bg-blue-100 px-4 py-2 text-sm font-medium text-blue-900 hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                      onClick={() => {
                        saveHandler();
                      }}
                    >
                      {totalBudgetLoading ? (
                        <div className="flex w-max mx-auto justify-between items-center space-x-2">
                          <Spinner />
                          <div>Save</div>
                        </div>
                      ) : (
                        "Save"
                      )}
                    </button>
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

export default BudgetDialog;
