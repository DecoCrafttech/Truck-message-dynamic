import React, { useState, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { FaLocationDot, FaTruckFast } from "react-icons/fa6";
import { SiMaterialformkdocs } from "react-icons/si";
import { GiCarWheel } from "react-icons/gi";
import { useSelector } from "react-redux";
import Cookies from "js-cookie";
import Autocomplete from "react-google-autocomplete";
import { HiOutlineOfficeBuilding } from "react-icons/hi";
import { Link, useNavigate } from "react-router-dom";
import Select from "react-dropdown-select";
import axiosInstance from "../../Services/axiosInstance";
import { RiMapPinTimeFill } from "react-icons/ri";
import { BsFilePerson } from "react-icons/bs";

const BlogGrid = () => {
  const LoginDetails = useSelector((state) => state.login);
  const navigate = useNavigate();

  const [sendModalMessageData, setSendModalMessageData] = useState({})
  const [initialLoading, setInitialLoading] = useState(false);
  const [cards, setCards] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [cardsPerPage] = useState(21); // Adjust the number of cards per page as needed
  const [filters, setFilters] = useState({
    search: "",
  });

  const truckBodyType = [
    "LCV",
    "Container",
    "Open body",
    "Tanker",
    "Trailer",
    "Tipper",
  ];
  const numOfTyres = ["4", "6", "10", "12", "14", "16", "18", "20", "22"];

  const [editingData, setEditingData] = useState({
    driver_name: "",
    vehicle_number: "",
    company_name: "",
    contact_no: "",
    truck_body_type: "",
    no_of_tyres: "",
    description: "",
  });

  const [filterModelData, SetfilterModelData] = useState({
    user_id: "",
    driver_name: "",
    vehicle_number: "",
    company_name: "",
    contact_no: "",
    from: "",
    to: "",
    truck_body_type: "",
    no_of_tyres: "",
    description: "",
    truck_name: "",
  });

  const [aadharNumber, setAadharNumber] = useState("");
  const [aadharStep, setAadharStep] = useState(1);
  const [otpNumber, setOtpNumber] = useState("");
  const [selectedContactNum, setSelectedContactNum] = useState(null);
  const [viewContactId, setviewContactId] = useState(null);

  const [submitLoadLoading, setSubmitLoadLoading] = useState(false);
  const [filterButtonLoading, setfilterButtonLoading] = useState(false);

  const [contactError, setContactError] = useState(""); // State to manage contact number validation error
  const [userStateList, setUserStateList] = useState([]);
  const [selectToLocationMultiple, setSelectToLocationMultiple] = useState([]);
  const [vehicleList, setVehicleList] = useState([]);
  const [showingFromLocation, setShowingFromLocation] = useState("");
  const [showingToLocation, setShowingToLocation] = useState("");
  const [selectedContactIndex, setSelectedContactIndex] = useState(null);


  const getVehicleList = async () => {
    const userId = Cookies.get("usrin")
      ? window.atob(Cookies.get("usrin"))
      : "";
    try {
      if (userId) {
        await axios
          .post("https://truck.truckmessage.com/get_user_vehicle_list", {
            user_id: userId,
          })
          .then((response) => {
            if (response.data.data.length > 0) {
              if (response.data.data[0].vehicle_list.length > 0) {
                const vehicleSelectBoxValue =
                  response.data.data[0].vehicle_list.map((val, ind) => {
                    return { value: ind + 1, label: val };
                  });
                setVehicleList(vehicleSelectBoxValue);
              } else {
                setVehicleList([]);
              }
            } else {
              setVehicleList([]);
            }
          })
          .catch((err) => {
            console.log(err);
          });
      }
    } catch (err) {
      console.log(err);
    }
  };

  const fetchData = async () => {
    setInitialLoading(true);
    try {
      const response = await axios.get(
        "https://truck.truckmessage.com/all_driver_details"
      );
      if (response.data.success && Array.isArray(response.data.data)) {
        const reOrder = response.data.data.sort(function (a, b) {
          if (new Date(a.updt) > new Date(b.updt)) {
            return -1;
          }
        });
        setCards(reOrder);
        setInitialLoading(false);
      } else {
        console.error("Unexpected response format:", response.data);
        setInitialLoading(false);
      }
    } catch (error) {
      console.error("There was an error fetching the data!", error);
      setInitialLoading(false);
    }
  };

  const getUserStateList = async () => {
    try {
      const userId = window.atob(Cookies.get("usrin"));
      const data = {
        user_id: userId,
      };

      const res = await axiosInstance.post("/get_user_state_list", data);

      if (res.data.error_code === 0) {
        if (res.data.data) {
          const convertToSelect = res.data.data[0].state_list.map(
            (val, ind) => {
              return { value: ind + 1, label: val };
            }
          );
          setUserStateList(convertToSelect);
        } else {
          setUserStateList([]);
        }
      } else {
        setUserStateList([]);
      }
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchData();
    getVehicleList();
    getUserStateList();
  }, []);

  const handleFilterChange = (e) => {
    setFilters({
      search: e.target.value,
    });
  };

  const filterCards = (cards) => {
    return cards.filter((card) => {
      const search = filters.search.toLowerCase();
      return (
        card.from_location.toLowerCase().includes(search) ||
        card.to_location.toLowerCase().includes(search) ||
        card.no_of_tyres.toLowerCase().includes(search) ||
        card.truck_body_type.toLowerCase().includes(search) ||
        card.truck_name.toLowerCase().includes(search) ||
        card.driver_name.toLowerCase().includes(search) ||
        card.profile_name.toLowerCase().includes(search) ||
        card.company_name.toLowerCase().includes(search)
      );
    });
  };

  const handleCopy = (contactNo, cardId,index) => {
    setSelectedContactNum(null);
    setSelectedContactIndex(null)

    setviewContactId(cardId);
    setTimeout(() => {
      setSelectedContactNum(contactNo);
      setviewContactId(null);
      setSelectedContactIndex(index)
    }, 800);
  };

  const validateContactNumber = (contact) => {
    const contactNumberPattern = /^\d{10}$/; // Simple pattern for 10-digit numbers
    return contactNumberPattern.test(contact);
  };

  const handleSubmit = async () => {
    const userId = window.atob(Cookies.get("usrin"));
    const sendVehicleNumber =
      editingData.vehicle_number.length > 0
        ? editingData.vehicle_number[0].label
        : "";

    const data = {
      ...editingData,
      from: showingFromLocation,
      to: showingToLocation,
      user_id: userId,
      truck_name: "",
      vehicle_number: sendVehicleNumber,
    };

    try {
      if (
        data.vehicle_number &&
        data.company_name &&
        data.driver_name &&
        data.contact_no &&
        data.from &&
        data.to &&
        data.truck_body_type &&
        data.no_of_tyres
      ) {
        if (!validateContactNumber(data.contact_no)) {
          setContactError("Please enter a valid 10-digit contact number.");
          return;
        }
        setSubmitLoadLoading(true);
        const res = await axios.post(
          "https://truck.truckmessage.com/driver_entry",
          data,
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        if (res.data.error_code === 0) {
          document.getElementById("closeAddModel").click();
          fetchData();
          setSubmitLoadLoading(false);

          setEditingData({
            driver_name: "",
            vehicle_number: "",
            company_name: "",
            contact_no: "",
            truck_body_type: "",
            no_of_tyres: "",
            description: "",
          });
          setShowingFromLocation("");
          setShowingToLocation("");
        } else {
          setSubmitLoadLoading(false);
          toast.error(res.data.message);
        }
      } else {
        setSubmitLoadLoading(false);
        toast.error("Some fields are missing");
      }
    } catch (err) {
      setSubmitLoadLoading(false);
      console.log(err);
    }
  };

  const filteredCards = filterCards(cards);

  // Calculate the index of the last card on the current page
  const indexOfLastCard = currentPage * cardsPerPage;
  // Calculate the index of the first card on the current page
  const indexOfFirstCard = indexOfLastCard - cardsPerPage;
  // Get the cards to be displayed on the current page
  const currentCards = filteredCards.slice(indexOfFirstCard, indexOfLastCard);

  // Calculate the total number of pages
  const totalPages = Math.ceil(filteredCards.length / cardsPerPage);

  // Handle page change
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const handleFromLocation = (selectedLocation) => {
    if (selectedLocation) {
      const cityComponent = selectedLocation.find((component) =>
        component.types.includes("locality")
      );
      const stateComponent = selectedLocation.find((component) =>
        component.types.includes("administrative_area_level_1")
      );

      if (cityComponent && stateComponent) {
        setShowingFromLocation(
          `${cityComponent.long_name}, ${stateComponent.long_name}`
        );
      }
    }
  };

  const handleToLocation = (selectedLocation) => {
    if (selectedLocation) {
      const cityComponent = selectedLocation.find((component) =>
        component.types.includes("locality")
      );
      const stateComponent = selectedLocation.find((component) =>
        component.types.includes("administrative_area_level_1")
      );

      if (cityComponent && stateComponent) {
        setShowingToLocation(
          `${cityComponent.long_name}, ${stateComponent.long_name}`
        );
      }
    }
  };

  const handleApplyFilter = async () => {
    const spreadMultipleLocation = selectToLocationMultiple.map((v) => v.label);
    const filterObj = { ...filterModelData };
    filterObj.from_location = showingFromLocation;
    filterObj.to_location = spreadMultipleLocation;
    if (
      showingFromLocation ||
      spreadMultipleLocation.length > 0 ||
      filterModelData.truck_body_type ||
      filterModelData.no_of_tyres
    ) {
      setfilterButtonLoading(true);
      try {
        const res = await axios.post(
          "https://truck.truckmessage.com/user_driver_details_filter",
          filterObj,
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        if (res.data.error_code === 0) {
          const reOrder = res.data.data.sort(function (a, b) {
            if (new Date(a.updt) > new Date(b.updt)) {
              return -1;
            }
          });
          setCards(reOrder);
          setCurrentPage(1);
          setfilterButtonLoading(false);
          document.getElementById("closeFilterBox").click();
        } else {
          setfilterButtonLoading(false);
          toast.error(res.data.message);
        }
      } catch (err) {
        setfilterButtonLoading(false);
        console.log(err);
      }
    } else {
      toast.error("nothing to filter");
    }
  };

  const handleDriverAvailablitityModelOpen = async () => {
    if (Cookies.get("otpId")) {
      setAadharStep(3);
    } else {
      setAadharStep(1);
      try {
        const encodedUserId = Cookies.get("usrin");
        if (encodedUserId) {
          const userId = window.atob(encodedUserId);

          const res = await axios.post(
            "https://truck.truckmessage.com/check_aadhar_verification",
            {
              user_id: userId,
            }
          );

          if (res.data.error_code === 0) {
            if (res.data.data.is_aadhar_verified) {
              setTimeout(() => {
                setAadharStep(4);
              }, 1500);
            } else {
              setTimeout(() => {
                setAadharStep(2);
              }, 1500);
            }
          } else {
            setAadharStep(1);
          }
        } else {
          toast.error("User ID not found in cookies");
        }
      } catch (err) {
        console.log(err);
      }
    }
  };

  const handleUpdateAadhar = (e) => {
    const aadharnum = e.target.value.replace(/[^0-9]/g, "");
    if (aadharnum.length <= 12) {
      setAadharNumber(aadharnum);
    }
  };

  const handleVerifyAadhar = async () => {
    if (aadharNumber !== "" && aadharNumber.length === 12) {
      try {
        const res = await axios.post(
          "https://truck.truckmessage.com/aadhaar_generate_otp",
          { id_number: aadharNumber }
        );
        if (res.data.error_code === 0) {
          Cookies.set("otpId", res.data.data[0].client_id, {
            secure: true,
            sameSite: "strict",
            path: "/",
          });
          setAadharStep(3);
        }
      } catch (err) {
        console.log(err);
      }
    } else {
      toast.error("invalid aadhar number");
    }
  };

  const handleUpdateOtp = (e) => {
    const otpnum = e.target.value.replace(/[^0-9]/g, "");
    if (otpnum.length <= 6) {
      setOtpNumber(otpnum);
    }
  };

  const handleVerifyOtp = async () => {
    if (otpNumber !== "" && otpNumber.length === 6) {
      try {
        const encodedUserId = Cookies.get("usrin");
        const userId = window.atob(encodedUserId);

        const data = {
          client_id: Cookies.get("otpId"),
          user_id: userId,
          otp: otpNumber,
        };
        const res = await axios.post(
          "https://truck.truckmessage.com/aadhaar_submit_otp",
          data
        );
        if (res.data.error_code === 0) {
          Cookies.remove("otpId");
          setAadharStep(4);
        }
      } catch (err) {
        console.log(err);
      }
    } else {
      toast.error("invalid otp number");
    }
  };

  const handleAddarVerifiactionStatus = () => {
    switch (aadharStep) {
      case 1:
        return (
          <div className="py-5 row align-items-center justify-content-center text-center">
            <div className="col">
              <div className="spinner-border text-success" role="status">
                <span className="sr-only">Loading...</span>
              </div>
              <p className="text-success mt-3">Verifying Aadhar</p>
            </div>
          </div>
        );

      case 2:
        return (
          <div>
            <div className="py-5 row align-items-center justify-content-center">
              <div className="col-12 col-md-9">
                <h4 className="mb-3">Verify Aadhar</h4>
                <div className="input-item input-item-name ltn__custom-icon">
                  <input
                    type="text"
                    value={aadharNumber}
                    placeholder="Enter your aadhar number"
                    onChange={handleUpdateAadhar}
                    required
                  />
                </div>
              </div>
            </div>
            <div className="modal-footer justify-content-between">
              <button
                type="button"
                className="btn btn-secondary col-12 col-md-5"
                data-bs-dismiss="modal"
              >
                Close
              </button>
              <button
                type="button"
                className="btn btn-primary col-12 col-md-5"
                onClick={handleVerifyAadhar}
              >
                verify aadhar
              </button>
            </div>
          </div>
        );

      case 3:
        return (
          <div>
            <div className="py-5 row align-items-center justify-content-center">
              <div className="col-12 col-md-6">
                <h4 className="mb-3">Verify Otp</h4>
                <div className="input-item input-item-name ltn__custom-icon">
                  <input
                    type="text"
                    value={otpNumber}
                    placeholder="Enter Otp"
                    onChange={handleUpdateOtp}
                    required
                  />
                </div>
              </div>
            </div>
            <div className="modal-footer justify-content-between">
              <button
                type="button"
                className="btn btn-secondary col-12 col-md-5"
                data-bs-dismiss="modal"
              >
                Close
              </button>
              <button
                type="button"
                className="btn btn-primary col-12 col-md-5"
                onClick={handleVerifyOtp}
              >
                verify Otp
              </button>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="ltn__appointment-inner">
            <div className="row gy-4">
              <div className="col-12 col-md-6">
                <h6>
                  Vehicle Number
                  <Link
                    to={"/my_profile"}
                    className="cursor-pointer"
                    onClick={() =>
                      document.getElementById("closeAddModel").click()
                    }
                  >
                    Add your Truck here
                  </Link>
                </h6>
                <Select
                  create={true}
                  options={vehicleList}
                  className="selectBox-innerWidth"
                  onChange={(e) =>
                    setEditingData({
                      ...editingData,
                      vehicle_number: e,
                    })
                  }
                />
              </div>

              <div className="col-12 col-md-6">
                <h6>Owner name</h6>
                <div className="input-item input-item-name">
                  <input
                    type="text"
                    className="mb-0"
                    name="driver_name"
                    placeholder="Name of the driver"
                    value={editingData.driver_name}
                    onChange={(e) =>
                      setEditingData({
                        ...editingData,
                        driver_name: e.target.value,
                      })
                    }
                    required
                  />
                </div>
              </div>

              <div className="col-12 col-md-6">
                <h6>Company Name</h6>
                <div className="input-item input-item-name">
                  <input
                    type="text"
                    className="mb-0"
                    name="company_name"
                    placeholder="Name of the company"
                    value={editingData.company_name}
                    onChange={(e) =>
                      setEditingData({
                        ...editingData,
                        company_name: e.target.value,
                      })
                    }
                    required
                  />
                </div>
              </div>

              <div className="col-12 col-md-6">
                <h6>Contact Number</h6>
                <div className="input-item input-item-email">
                  <input
                    type="tel"
                    name="contact_no"
                    className="mb-0"
                    placeholder="Type your contact number"
                    value={editingData.contact_no}
                    onChange={(e) =>
                      setEditingData({
                        ...editingData,
                        contact_no: e.target.value,
                      })
                    }
                    required
                  />
                  {contactError && (
                    <p style={{ color: "red" }}>{contactError}</p>
                  )}
                </div>
              </div>

              <div className="col-12 col-md-6">
                <h6>From</h6>
                <div className="input-item input-item-name">
                  <Autocomplete
                    name="from_location"
                    className="google-location location-input bg-transparent py-2"
                    apiKey={process.env.REACT_APP_GOOGLE_PLACES_KEY}
                    onPlaceSelected={(place) => {
                      if (place) {
                        handleFromLocation(place.address_components);
                      }
                    }}
                    value={showingFromLocation}
                    onChange={(e) => setShowingFromLocation(e.target.value)}
                  />
                </div>
              </div>

              <div className="col-12 col-md-6">
                <h6>To</h6>
                <div className="input-item input-item-name">
                  <Autocomplete
                    name="to_location"
                    className="google-location location-input bg-transparent py-2"
                    apiKey={process.env.REACT_APP_GOOGLE_PLACES_KEY}
                    onPlaceSelected={(place) => {
                      if (place) {
                        handleToLocation(place.address_components);
                      }
                    }}
                    value={showingToLocation}
                    onChange={(e) => setShowingToLocation(e.target.value)}
                  />
                </div>
              </div>

              <div className="col-12 col-md-6 m-0">
                <h6>Truck Body Type</h6>
                <button
                  type="button"
                  class="btn btn-transparent shadow-none border dropdown-toggle col-12 py-3 dropdown-arrow text-start"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  {editingData.truck_body_type === ""
                    ? "select body type"
                    : `${editingData.truck_body_type}`}
                </button>
                <ul class="dropdown-menu col-11 dropdown-ul">
                  {truckBodyType.map((bodyType) => {
                    return (
                      <li
                        onClick={() =>
                          setEditingData({
                            ...editingData,
                            truck_body_type: bodyType,
                          })
                        }
                        className="cup mt-0 py-2 dropdown-list-hover"
                      >
                        <a class="dropdown-item text-decoration-none">
                          {bodyType}
                        </a>
                      </li>
                    );
                  })}
                </ul>
              </div>

              <div className="col-12 col-md-6 m-0">
                <h6>No. of Tyres</h6>
                <button
                  type="button"
                  class="btn btn-transparent shadow-none border dropdown-toggle col-12 py-3 dropdown-arrow text-start"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  {editingData.no_of_tyres === ""
                    ? "select number of tyres"
                    : `${editingData.no_of_tyres}`}
                </button>
                <ul class="dropdown-menu col-11 dropdown-ul">
                  {numOfTyres.map((numOfTyres) => {
                    return (
                      <li
                        onClick={() =>
                          setEditingData({
                            ...editingData,
                            no_of_tyres: numOfTyres,
                          })
                        }
                        className="cup mt-0 py-2 dropdown-list-hover"
                      >
                        <a class="dropdown-item text-decoration-none">
                          {numOfTyres}
                        </a>
                      </li>
                    );
                  })}
                </ul>
              </div>

              <div className="col-12 col-md-12">
                <h6>Descriptions(Optional) </h6>
                <div className="input-item input-item-textarea ltn__custom-icon">
                  <textarea
                    name="description"
                    placeholder="Enter a text here"
                    value={editingData.description}
                    onChange={(e) =>
                      setEditingData({
                        ...editingData,
                        description: e.target.value,
                      })
                    }
                  />
                </div>
              </div>
            </div>
            <div className="modal-footer btn-wrapper text-center mt-4">
              {submitLoadLoading ? (
                <button type="button" className="btn btn-primary w-100">
                  <div class="spinner-border" role="status">
                    <span class="visually-hidden">Saving...</span>
                  </div>
                </button>
              ) : (
                <button
                  className="btn btn-primary text-uppercase"
                  type="button"
                  onClick={handleSubmit}
                >
                  Submit
                </button>
              )}
            </div>
          </div>
        );

      default:
        break;
    }
  };

  const handleMessageClick = async () => {
    const userId = Cookies.get("usrin");
    try {
      const response = await axios.post(
        "https://truck.truckmessage.com/get_user_chat_message_list", {
        user_id: window.atob(userId),
        person_id: sendModalMessageData.user_id,
        ref_flag: 'Driver',
        ref_id: sendModalMessageData.driver_id
      });

      if (response.data.error_code === 0) {
        document.getElementById('clodesendMessageModal').click();
        navigate(`/chat`);
      }
    } catch (error) {
      console.error("Error fetching messages:", error);
    }
  };

  const handleClearReset = () => {
    SetfilterModelData({
      user_id: "",
      driver_name: "",
      vehicle_number: "",
      company_name: "",
      contact_no: "",
      from: "",
      to: "",
      truck_body_type: "",
      no_of_tyres: "",
      description: "",
      truck_name: "",
    });
    setShowingFromLocation("");
    fetchData();
  };

  return (
    <div>
      <div className="ltn__product-area ltn__product-gutter mb-50 ">
        <div className="container">
          <div className="text-center ">
            <h2 className="cardmodifyhead">Driver Availability</h2>
          </div>
          <div className="row">
            <div className="col-lg-12 mb-2">
              <div className="row">
                <div className=" col-lg-8 mb-2">
                  <div className="showing-product-number text-right">
                    <span>
                      Showing {indexOfFirstCard + 1}-
                      {Math.min(indexOfLastCard, filteredCards.length)} of{" "}
                      {filteredCards.length} results
                    </span>
                  </div>
                </div>
                <div className="col-lg-4 mb-2">
                  <div>
                    {LoginDetails.isLoggedIn ? (
                      <button
                        type="button "
                        className="cardbutton truck-brand-button "
                        data-bs-toggle="modal"
                        data-bs-target="#addDriveravailability"
                        onClick={handleDriverAvailablitityModelOpen}
                      >
                        + Add Driver availability
                      </button>
                    ) : (
                      <button
                        type="button "
                        className="cardbutton truck-brand-button "
                        data-bs-toggle="modal"
                        data-bs-target="#loginModal"
                      >
                        + Add Driver availability
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <hr></hr>
            <div className="col-12">
              <div className="row">
                <div className="col-lg-8">
                  {/* Search Widget */}
                  <div className="ltn__search-widget mb-0">
                    <form action="">
                      <input
                        type="text"
                        name="search"
                        placeholder="Search by ..."
                        onChange={handleFilterChange}
                      />
                    </form>
                  </div>
                </div>

                <div className="col-6 col-lg-2 ">
                  <button
                    type="button"
                    className="btn btn-primary filterbtn"
                    data-bs-toggle="modal"
                    data-bs-target="#driverfilter"
                  >
                    Filter
                  </button>
                </div>

                <div className="col-6 col-lg-2 ">
                  <button
                    type="button"
                    className="btn btn-secondary filterbtn"
                    onClick={() => handleClearReset()}
                  >
                    Clear filter
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* modal */}
      <div
        className="modal fade"
        id="addDriveravailability"
        data-bs-backdrop="static"
        data-bs-keyboard="false"
        tabIndex="-1"
        aria-labelledby="staticBackdropLabel"
        aria-hidden="true"
      >
        <div
          className={`modal-dialog modal-dialog-centered modal-dialog-scrollable ${aadharStep === 4 ? "modal-lg" : "modal-md"
            }`}
        >
          <div className="modal-content">
            <div className="modal-header">
              <h1 className="modal-title fs-5" id="staticBackdropLabel">
                Add Driver
              </h1>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
                id="closeAddModel"
              ></button>
            </div>
            <div className="modal-body">{handleAddarVerifiactionStatus()}</div>
          </div>
        </div>
      </div>

      {/* filter modal */}
      <div
        className="modal fade"
        id="driverfilter"
        tabindex="-1"
        aria-labelledby="exampleModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-dialog-centered modal-dialog-scrollable modal-lg">
          <div className="modal-content">
            <div className="modal-header">
              <h1 className="modal-title fs-5" id="exampleModalLabel">
                Filter
              </h1>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
                id="closeFilterBox"
              ></button>
            </div>
            <div className="modal-body ps-4 pe-4 p-">
              <div className="ltn__appointment-inner pb-5">
                <div className="row pb-5">
                  <div className="col-12 col-md-6">
                    <h6>From</h6>
                    <div className="input-item input-item-name">
                      <Autocomplete
                        name="from_location"
                        className="google-location location-input bg-transparent py-2"
                        apiKey={process.env.REACT_APP_GOOGLE_PLACES_KEY}
                        onPlaceSelected={(place) => {
                          if (place) {
                            handleFromLocation(place.address_components);
                          }
                        }}
                        value={showingFromLocation}
                        onChange={(e) => setShowingFromLocation(e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="col-12 col-md-6">
                    <h6>To</h6>
                    <Select
                      multi
                      create={true}
                      options={userStateList}
                      className="selectBox-innerWidth"
                      onChange={(e) => setSelectToLocationMultiple(e)}
                    />
                  </div>

                  <div className="col-12 col-md-6 m-0">
                    <h6>Truck Body Type</h6>
                    <button
                      type="button"
                      class="btn btn-transparent shadow-none border dropdown-toggle col-12 py-3 dropdown-arrow text-start"
                      data-bs-toggle="dropdown"
                      aria-expanded="false"
                    >
                      {filterModelData.truck_body_type === ""
                        ? "select body type"
                        : `${filterModelData.truck_body_type}`}
                    </button>
                    <ul class="dropdown-menu col-11 dropdown-ul">
                      {truckBodyType.map((bodyType) => {
                        return (
                          <li
                            onClick={() =>
                              SetfilterModelData({
                                ...filterModelData,
                                truck_body_type: bodyType,
                              })
                            }
                            className="cup mt-0 py-2 dropdown-list-hover"
                          >
                            <a class="dropdown-item text-decoration-none">
                              {bodyType}
                            </a>
                          </li>
                        );
                      })}
                    </ul>
                  </div>

                  <div className="col-12 col-md-6 m-0">
                    <h6>No. of Tyres</h6>
                    <button
                      type="button"
                      class="btn btn-transparent shadow-none border dropdown-toggle col-12 py-3 dropdown-arrow text-start"
                      data-bs-toggle="dropdown"
                      aria-expanded="false"
                    >
                      {filterModelData.no_of_tyres === ""
                        ? "select number of tyres"
                        : `${filterModelData.no_of_tyres}`}
                    </button>
                    <ul class="dropdown-menu col-11 dropdown-ul">
                      {numOfTyres.map((numOfTyres) => {
                        return (
                          <li
                            onClick={() =>
                              SetfilterModelData({
                                ...filterModelData,
                                no_of_tyres: numOfTyres,
                              })
                            }
                            className="cup mt-0 py-2 dropdown-list-hover"
                          >
                            <a class="dropdown-item text-decoration-none">
                              {numOfTyres}
                            </a>
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
            <div className="modal-footer">
              {filterButtonLoading ? (
                <button type="button" className="btn btn-primary w-100">
                  <div class="spinner-border" role="status">
                    <span class="visually-hidden">filtering...</span>
                  </div>
                </button>
              ) : (
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={handleApplyFilter}
                >
                  Apply Filter
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* card */}
      <div className="container">
        <div className="row row-cols-1 row-cols-md-3 g-4 mb-60 ">
          {initialLoading ? (
            <div className="row w-100 spinner-miin-height justify-content-center align-items-center">
              <div className="col-3 text-center">
                <div class="spinner-border text-info" role="status">
                  <span class="visually-hidden">Loading...</span>
                </div>
                <p className="mt-2 text-info">Loading...</p>
              </div>
            </div>
          ) : (
            currentCards.map((card,cardIndex) => (
              <div className="col" key={card.id}>
                <div className="card h-100 shadow truckcard">
                  <div className="card-header border-0 mb-0 ">
                    <p className=".fs-6 reviewtext ">
                      {/* Generate the star ratings based on the response */}
                      {[...Array(5)].map((_, index) => (
                        <span key={index} className="float-right">
                          <i
                            className={`text-warning fa fa-star ${index < card.rating ? "" : "text-muted"
                              }`}
                          ></i>
                        </span>
                      ))}
                      <span>({card.user_review_count} 4)</span>
                      <p className="float-end mb-0 text-b">
                        {" "}
                        <strong>Posts </strong> : {card.user_post}
                      </p>
                    </p>

                    <div className="cardmodify py-1 py-3">
                      <h5 className="mb-1">{card.profile_name}</h5>
                      <div className="col-lg-12 cardicontext">
                        <label>
                          <HiOutlineOfficeBuilding className="me-2" />
                          {card.company_name}
                        </label>
                      </div>
                    </div>
                  </div>

                  <div className="card-body p-3 mt-2 mb-2">
                    <div className="row">
                      <div className="col-lg-12 cardicon">
                        <div>
                          <label>
                            <FaLocationDot className="me-2 text-danger" />
                            {card.from_location}
                          </label>
                        </div>
                      </div>
                      <div className="col-lg-12 cardicon">
                        <div>
                          <label>
                            <FaLocationDot className="me-2 text-success" />
                            {card.to_location}
                          </label>
                        </div>
                      </div>
                      <p className="datetext">
                        <strong>
                          <RiMapPinTimeFill className="me-2" />
                          Posted on :
                        </strong>{" "}
                        {card.updt ? card.updt.slice(5, 25) : ""}
                      </p>
                    </div>
                    <hr className="hr m-2" />
                    <div className="row mt-3">
                      <div className="col-lg-6 cardicontext">
                        <div>
                          <label>
                            <GiCarWheel className="me-2" />
                            {card.no_of_tyres} wheels
                          </label>
                        </div>
                      </div>
                      <div className="col-lg-6 cardicontext">
                        <label>
                          <SiMaterialformkdocs className="me-2" />
                          {card.truck_body_type}
                        </label>
                      </div>
                      {/* <div className="col-lg-6 cardicontext">
                                            <label><FaTruck className='me-2' />{card.truck_name}</label>
                                        </div> */}
                      <div className="col-lg-6 cardicontext">
                        <label>
                          <FaTruckFast className="me-2" />
                          {card.vehicle_number}
                        </label>
                      </div>
                      <div className="col-lg-6 cardicontext">
                        <label>
                          <HiOutlineOfficeBuilding className="me-2" />
                          {card.driver_name}
                        </label>
                      </div>
                    </div>
                    <div className="m-2">
                      <h5 className="card-title mt-3">Description</h5>
                      <p className="card-text paragraph">{card.description}</p>
                    </div>
                  </div>
                  <div className="card-footer mb-3">
                    <div>
                      {LoginDetails.isLoggedIn ? (
                        <div className="d-flex flex-wrap mt-3">
                          <div className="col-6">
                            {/* <button className="btn btn-success w-100" type="button"> <IoCall  className='me-3' />{card.contact_no}</button> */}
                            {viewContactId === card.id ? (
                              <button
                                className="btn btn-success w-100"
                                type="button"
                              >
                                <div
                                  className="spinner-border text-light"
                                  role="status"
                                >
                                  <span className="sr-only">Loading...</span>
                                </div>
                              </button>
                            ) : cardIndex === selectedContactIndex ? (
                              <button
                                className="btn btn-success w-100"
                                type="button"
                              >
                                {selectedContactNum}
                              </button>
                            ) : (
                              <button
                                className="btn btn-success w-100"
                                type="button"
                                onClick={() =>
                                  handleCopy(card.contact_no, card.id,cardIndex)
                                }
                              >
                                {/* <FaRegCopy className='me-2' /> */}
                                Contact
                              </button>
                            )}
                          </div>
                          <div className="col-6">
                            <button className="btn cardbutton w-100" type="button" data-bs-toggle="modal" data-bs-target="#sendMessageModal" onClick={() => setSendModalMessageData(card)}>Message</button>
                          </div>
                        </div>
                      ) : (
                        <div className="d-grid gap-2">
                          <button
                            className="btn cardbutton"
                            type="button"
                            data-bs-toggle="modal"
                            data-bs-target="#loginModal"
                          >
                            View Details
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
        <div className="pagination">
          <ul className="pagination-list">
            {Array.from({ length: totalPages }, (_, index) => (
              <li key={index + 1} className="pagination-item">
                <button
                  onClick={() => paginate(index + 1)}
                  className={
                    currentPage === index + 1
                      ? "pagination-link active"
                      : "pagination-link"
                  }
                >
                  {index + 1}
                </button>
              </li>
            ))}
          </ul>
        </div>

        {/* send message modal  */}
        <div className="modal fade" id="sendMessageModal" data-bs-backdrop="static" data-bs-keyboard="false" tabIndex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
          <div className={`modal-dialog modal-dialog-centered modal-dialog-scrollable ${aadharStep === 4 ? 'modal-lg' : 'modal-md'}`}>
            <div className="modal-content">
              <div className="modal-header bg-transparent border-0">
                <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" id="clodesendMessageModal"></button>
              </div>
              <div className="modal-body">
                <div className="text-center py-3">
                  <h5 className='mb-3 d-inline-block text-secondary'>Do you want to send message to</h5>
                  {/* <p>{sendModalMessageData ? sendModalMessageData : ''}</p> */}
                  <h5 className='mb-1'>
                    <BsFilePerson className='me-2 text-secondary' />{sendModalMessageData ? sendModalMessageData.profile_name : ''}
                  </h5>
                  <div className="col-lg-12 cardicontext">
                    <label><HiOutlineOfficeBuilding className='me-2 text-secondary' />{sendModalMessageData ? sendModalMessageData.company_name : ''}</label>
                  </div>
                </div>
              </div>
              <div className="modal-footer row border-top-0 bg-transparent">
                <div className="p-2 col">
                  <button type="button" className="btn btn-outline-primary" data-bs-dismiss="modal" aria-label="Close" id="clodesendMessageModal">Close</button>
                </div>
                <div className="p-2 col">
                  <button type="button" className="btn btn-primary" onClick={handleMessageClick}>message</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlogGrid;
