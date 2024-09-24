import React, { useState, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { FaUserAlt } from "react-icons/fa";
import { FaIndianRupeeSign, FaTruckFast } from "react-icons/fa6";
import { BsFillCalendar2DateFill } from "react-icons/bs";
import { RiMapPinTimeFill, RiPinDistanceFill } from "react-icons/ri";
import { FaLocationDot } from "react-icons/fa6";
import { Link } from "react-router-dom";
import Cookies from "js-cookie";
import { useSelector } from "react-redux";
import Autocomplete from "react-google-autocomplete";
import shortid from "https://cdn.skypack.dev/shortid@2.2.16";
import Select from "react-dropdown-select";

const BlogList = () => {
  const LoginDetails = useSelector((state) => state.login);

  const [yearData, setYearData] = useState([]);
  const truckBodyType = ["LCV", "Container", "Open body vehicle", "Tanker", "Trailer", "Tipper", "Bus "];
  const tonnage = [
    { value: 1, label: '1 Ton - 2.5 Ton' },
    { value: 2, label: '2.5 Ton - 5 Ton' },
    { value: 3, label: '5 Ton - 10 Ton' },
    { value: 4, label: '10 Ton - 20 Ton' },
    { value: 5, label: '20 Ton - 40 Ton' },
    { value: 6, label: 'Above 40 Ton' }
  ];

  const truckBrand = [
    "Ashok Leyland",
    "Tata",
    "Mahindra",
    "Eicher",
    "Daimler India",
    "Bharat Benz",
    "Maruthi Suzuki",
    "SML Lsuzu",
    "Force",
    "AMW",
    "Man",
    "Scania",
    "Volvo",
    "Others",
  ]
  const numOfTyres = [4,
    6,
    10,
    12,
    14,
    16,
    18,
    20,
    22
  ]
  const filterKilometers = [
    '(0 - 10,000)',
    '(10,001 - 30,000)',
    '(30,001 - 50,000)',
    '(50,001 - 70,000)',
    '(70,001 - 100,000)',
    '(100,001 - 150,000)',
    '(150,001 - 200,000)',
    '(200,001 - 300,000)',
    '(300,001 - 500,000)',
    '(500,001 - 700,000)',
    '(700,001 - 1,000,000)',
    '(1,000,001 - 1,500,000)',
    '(1,500,001 - 2,000,000)',
    '(2,000,001+ kms)'
  ]
  const filterPrice = [
    '(0 - 5,00,000)',
    '(5,00,001 - 10,00,000)',
    '(10,00,001 - 20,00,000)',
    '(20,00,001 - 30,00,000)',
    '(30,00,001 - 40,00,000)',
    '(40,00,001 - 50,00,000)',
    '(50,00,001 - 60,00,000)',
    '(60,00,001 - 70,00,000)',
    '(70,00,001 - 80,00,000)',
    '(80,00,001 - 90,00,000)',
    '(90,00,001 and above)'
  ]

  useEffect(() => {
    const getYear = new Date().getFullYear()
    var l = []
    for (var i = 1980; i <= getYear; i++) {
      l[l.length] = i
    }
    setYearData(l)
  }, [])


  const [cards, setCards] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [cardsPerPage] = useState(21);
  const [filters, setFilters] = useState({
    search: "",
  });

  const [filterModelData, SetfilterModelData] = useState({
    user_id: "",
    brand: "",
    contact_no: "",
    kms_driven: "",
    model: "",
    owner_name: "",
    vehicle_number: "",
    location: "",
    truck_body_type: '',
    no_of_tyres: '',
    price: '',
    tonnage: []
  });

  const [showingBuyAndSellLocation, setShowingBuyAndSellLocation] = useState("");

  const [contactError, setContactError] = useState(""); // State to manage contact number validation error
  const [selectedfile, SetSelectedFile] = useState([]);
  const [multipleImages, setMultipleImages] = useState([]);
  const [filterLoading, setFilterLoading] = useState(false);
  const [createVehicleLoading, setCreateVehicleLoading] = useState(false);
  const [verifyOtpLoading, setverifyOtpLoading] = useState(false);
  const [verifyAadharLoading, setVerifyAadharLoading] = useState(false);
  const [clearFilterLoading, setclearFilterLoading] = useState(false);

  const [aadharNumber, setAadharNumber] = useState("");
  const [aadharStep, setAadharStep] = useState(1);
  const [otpNumber, setOtpNumber] = useState("");

  const [showingFromLocation, setShowingFromLocation] = useState("");
  const [showingToLocation, setShowingToLocation] = useState("");
  const [isDataFiltered, setIsDataFiltered] = useState(false);
  const [selectBoxtonnage, setSelectBoxTonnage] = useState([])

  const handleLocation = (selectedLocation) => {
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
    setFilterLoading(true);
    const filterObj = { ...filterModelData };
    filterObj.location = showingFromLocation;
    if (filterModelData.kms_driven) {
      filterObj.kms_driven = `${filterObj.kms_driven} kms`;
    }

    if (filterModelData.price) {
      filterObj.price = `${filterObj.price} lakhs`;
    }

    if (filterModelData.model) {
      filterObj.model = [filterObj.model.toString()];
    }

    if (filterModelData.brand) {
      filterObj.brand = [filterObj.brand];
    }

    setIsDataFiltered(true);

    try {
      const res = await axios.post(
        "https://truck.truckmessage.com/user_buy_sell_filter",
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
            return -1
          }
        })
        setCards(reOrder)
        setCurrentPage(1)

        toast.success(res.data.message);
        document.getElementById("closeFilterBox").click();
      } else {
        toast.error(res.data.message);
      }
      setFilterLoading(false);
    } catch (err) {
      console.log(err);
    }
  };

  const handleClearFilter = () => {
    setclearFilterLoading(true)
    initialRender();
    setSelectBoxTonnage([])
  }

  const filterCards = (cards) => {
    return cards.filter((card) => {
      const search = filters.search.toLowerCase();
      return (
        card.location.toLowerCase().includes(search) ||
        card.model.toString().includes(search) ||
        card.owner_name.toLowerCase().includes(search) ||
        card.no_of_tyres.toLowerCase().includes(search) ||
        card.vehicle_number.toLowerCase().includes(search) ||
        card.owner_name.toLowerCase().includes(search) ||
        card.profile_name.toLowerCase().includes(search) ||
        card.brand.toLowerCase().includes(search) ||
        card.tonnage.toLowerCase().includes(search) ||
        card.truck_body_type.toLowerCase().includes(search) ||
        card.kms_driven.toString().includes(search)
      );
    });
  };

  const filteredCards = filterCards(cards);

  const indexOfLastCard = currentPage * cardsPerPage;
  const indexOfFirstCard = indexOfLastCard - cardsPerPage;
  const currentCards = filteredCards.slice(indexOfFirstCard, indexOfLastCard);
  const totalPages = Math.ceil(filteredCards.length / cardsPerPage);
  const [initialLoading, setInitialLoading] = useState(false);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const [editingData, setEditingData] = useState({
    company_name: "",
    contact_no: "",
    description: "",
    material: "",
    no_of_tyres: "",
    tone: "",
    truck_body_type: "",
    model: "",
    brand: '',
    tonnage: ""
  });

  useEffect(() => {
    initialRender();
  }, []);

  const initialRender = async () => {
    setInitialLoading(true)
    try {
      await axios
        .get("https://truck.truckmessage.com/all_buy_sell_details")
        .then((response) => {
          if (response.data.success && Array.isArray(response.data.data)) {
            const reOrder = response.data.data.sort(function (a, b) {
              if (new Date(a.updt) > new Date(b.updt)) {
                return -1
              }
            })
            setCards(reOrder)
          } else {
            console.error("Unexpected response format:", response.data);
          }
          setInitialLoading(false)
          setIsDataFiltered(false);
          setFilterLoading(false);
          setclearFilterLoading(false);
          SetfilterModelData({
            user_id: "",
            brand: "",
            contact_no: "",
            kms_driven: "",
            model: "",
            owner_name: "",
            vehicle_number: "",
            location: "",
            truck_body_type: '',
            no_of_tyres: '',
            price: '',
            tonnage: []
          })
        })
        .catch((error) => {
          setInitialLoading(false)
          console.error("There was an error fetching the data!", error);
        });
    } catch (err) {
      console.log(err);
    }
  };

  const handleFilterChange = (e) => {
    setFilters({
      search: e.target.value,
    });
  };

  const handleBuyAndSellLocation = (selectedLocation) => {
    if (selectedLocation) {
      const cityComponent = selectedLocation.find((component) =>
        component.types.includes("locality")
      );
      const stateComponent = selectedLocation.find((component) =>
        component.types.includes("administrative_area_level_1")
      );

      if (cityComponent && stateComponent) {
        setShowingBuyAndSellLocation(
          `${cityComponent.long_name}, ${stateComponent.long_name}`
        );
      }
    }
  };

  const handleSaveBusAndSellId = (buyAndSellDetails) => {
    Cookies.set("buyAndSellViewDetailsId", window.btoa(buyAndSellDetails.buy_sell_id));
  };

  //Image upload and delete functions
  const filesizes = (bytes, decimals = 2) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i];
  };
  const InputChange = (e) => {
    if (e.target.files.length > 0) {
      setMultipleImages(e.target.files);
    }

    // --For Multiple File Input
    let images = [];
    for (let i = 0; i < e.target.files.length; i++) {
      images.push(e.target.files[i]);
      let reader = new FileReader();
      let file = e.target.files[i];
      reader.onloadend = () => {
        SetSelectedFile((preValue) => {
          return [
            ...preValue,
            {
              id: shortid.generate(),
              filename: e.target.files[i].name,
              filetype: e.target.files[i].type,
              fileimage: reader.result,
              datetime:
                e.target.files[i].lastModifiedDate.toLocaleString("en-IN"),
              filesize: filesizes(e.target.files[i].size),
            },
          ];
        });
      };
      if (e.target.files[i]) {
        reader.readAsDataURL(file);
      }
    }
  };
  const DeleteSelectFile = (id) => {
    const result = selectedfile.filter((data) => data.id !== id);
    SetSelectedFile(result);

    const overallFile = result.map((data) => data.filename);
    var newImages = [];
    for (let i = 0; i < multipleImages.length; i++) {
      if (overallFile.includes(multipleImages[i].name)) {
        newImages[newImages.length] = multipleImages[i];
      }
    }
    setMultipleImages(newImages);
  };
  //

  const handleBuyAndSellUpdate = async () => {
    const userId = window.atob(Cookies.get("usrin"));
    const edit = { ...editingData };
    edit.images = multipleImages;

    const formData = new FormData();
    formData.append("user_id", userId);
    formData.append("brand", edit.brand);
    formData.append("contact_no", edit.contact_no);
    formData.append("description", edit.description);
    formData.append("price", edit.price);
    formData.append("kms_driven", edit.kms_driven);
    formData.append("location", showingBuyAndSellLocation);
    formData.append("model", edit.model);
    formData.append("owner_name", edit.owner_name);
    formData.append("vehicle_number", edit.vehicle_number);
    formData.append("truck_body_type", editingData.truck_body_type)
    formData.append("no_of_tyres", editingData.no_of_tyres)
    formData.append("tonnage", editingData.tonnage!=='' ? `${editingData.tonnage} Ton ` : '')


    if (editingData.tonnage.length > 0 && editingData.no_of_tyres && editingData.truck_body_type && edit.vehicle_number && edit.owner_name && edit.brand && edit.contact_no && edit.price && edit.kms_driven && showingBuyAndSellLocation && edit.model) {
      if (multipleImages.length > 0) {
        setCreateVehicleLoading(true);

        if (edit.images.length > 0) {
          for (let i = 0; i < edit.images.length; i++) {
            formData.append(`truck_image${i + 1}`, edit.images[i]);
          }
        }

        try {
          const res = await axios.post(
            "https://truck.truckmessage.com/truck_buy_sell",
            formData,
            {
              headers: {
                "Content-Type": "multipart/form-data",
              },
            }
          );

          if (res.data.error_code === 0) {
            document.getElementById("clodeBuySellModel").click();
            toast.success(res.data.message);
            initialRender();
          } else {
            toast.error(res.data.message);
          }
          setCreateVehicleLoading(false);
        } catch (err) {
          console.log(err);
        }
      } else {
        toast.error("Image required");
      }
    } else {
      toast.error("Some fields are empty");
    }
  };

  const handleBuyAndSellModelOpen = async () => {
    setverifyOtpLoading(false);
    setCreateVehicleLoading(false);
    setVerifyAadharLoading(false);

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
          toast.error("User ID not found");
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
      setVerifyAadharLoading(true);
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
        setVerifyAadharLoading(false);
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
    setverifyOtpLoading(true);
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
          toast.success(res.data.message);
        } else {
          console.log(res);
          toast.error(res.data.message);
        }
        setverifyOtpLoading(false);
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

            <div className="modal-footer">
              <div className="col-12 col-md-6 m-0">
                <button
                  type="button"
                  className="btn btn-secondary w-100"
                  data-bs-dismiss="modal"
                >
                  Close
                </button>
              </div>
              <div className="col-12 col-md-6 m-0">
                {verifyAadharLoading ? (
                  <button type="button" className="btn btn-primary w-100">
                    <div class="spinner-border" role="status">
                      <span class="visually-hidden">verifying...</span>
                    </div>
                  </button>
                ) : (
                  <button
                    type="button"
                    className="btn btn-primary w-100"
                    onClick={handleVerifyAadhar}
                  >
                    verify aadhar
                  </button>
                )}
              </div>
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

            <div className="modal-footer">
              <div className="col-12 col-md-6 m-0">
                <button
                  type="button"
                  className="btn btn-secondary w-100"
                  data-bs-dismiss="modal"
                >
                  Close
                </button>
              </div>
              <div className="col-12 col-md-6 m-0">
                {verifyOtpLoading ? (
                  <button type="button" className="btn btn-primary w-100">
                    <div class="spinner-border" role="status">
                      <span class="visually-hidden">verifying...</span>
                    </div>
                  </button>
                ) : (
                  <button
                    type="button"
                    className="btn btn-primary w-100"
                    onClick={handleVerifyOtp}
                  >
                    verify Otp
                  </button>
                )}
              </div>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="ltn__appointment-inner">
            <div className="row gy-4">

              <div className="col-12 col-md-6">
                <h6>Model Year</h6>
                <button type="button" class="btn btn-transparent shadow-none border dropdown-toggle col-12 py-3 dropdown-arrow text-start" data-bs-toggle="dropdown" aria-expanded="false">
                  {editingData.model === '' ? 'select model' : `${editingData.model}`}
                </button>
                <ul class="dropdown-menu col-11 dropdown-ul">
                  {
                    yearData.map((yearVal) => {
                      return <li onClick={() => setEditingData({
                        ...editingData, model: yearVal,
                      })} className="cup mt-0 py-2 dropdown-list-hover"><a class="dropdown-item text-decoration-none">{yearVal}</a></li>
                    })
                  }
                </ul >
              </div>

              <div className="col-12 col-md-6">
                <h6>Brand</h6>
                <button type="button" class="btn btn-transparent shadow-none border dropdown-toggle col-12 py-3 dropdown-arrow text-start" data-bs-toggle="dropdown" aria-expanded="false">
                  {editingData.brand === '' ? 'select Brand name' : `${editingData.brand}`}
                </button>
                <ul class="dropdown-menu col-11 dropdown-ul">
                  {
                    truckBrand.map((brandVal) => {
                      return <li onClick={() => setEditingData({
                        ...editingData, brand: brandVal,
                      })} className="cup mt-0 py-2 dropdown-list-hover"><a class="dropdown-item text-decoration-none">{brandVal}</a></li>
                    })
                  }
                </ul >
              </div>

              <div className="col-12 col-md-6">
                <h6>Owner Name</h6>
                <div className="input-item input-item-name">
                  <input
                    type="text"
                    className="mb-0"
                    name="owner_name"
                    placeholder="Name of the Owner"
                    value={editingData.owner_name}
                    onChange={(e) =>
                      setEditingData({
                        ...editingData,
                        owner_name: e.target.value,
                      })
                    }
                    required
                  />
                </div>
              </div>

              <div className="col-12 col-md-6">
                <h6>Vehicle Number</h6>
                <div className="input-item input-item-email">
                  <input
                    type="tel"
                    name="contact_no"
                    className="mb-0"
                    placeholder="Type your Vehicle Number"
                    value={editingData.vehicle_number}
                    onChange={(e) =>
                      setEditingData({
                        ...editingData,
                        vehicle_number: e.target.value,
                      })
                    }
                    required
                  />
                </div>
              </div>

              <div className="col-12 col-md-6">
                <h6>Kilometers driven</h6>
                <div className="tel-item">
                  <input
                    type="number"
                    name="kms driven"
                    className="w-100 py-3 mt-2 m-0"
                    placeholder="Type Kms driven"
                    min={1}
                    value={editingData.kms_driven}
                    onChange={(e) =>
                      setEditingData({
                        ...editingData,
                        kms_driven: e.target.value,
                      })
                    }
                    required
                  />
                </div>
              </div>

              <div className="col-12 col-md-6">
                <h6>Price</h6>
                <div className="tel-item">
                  <input
                    type="number"
                    name="kms driven"
                    className="w-100 py-3 mt-2 m-0"
                    placeholder="Enter your Price here..."
                    min={1}
                    value={editingData.price}
                    onChange={(e) =>
                      setEditingData({
                        ...editingData,
                        price: e.target.value,
                      })
                    }
                    required
                  />
                </div>
              </div>

              <div className="col-12 col-md-6 mt-3">
                <h6>Tonnage</h6>
                <div className="tel-item">
                  <input
                    type="number"
                    name="Tonnage"
                    className="w-100 py-3 mt-2 m-0"
                    placeholder="Enter your ton..."
                    min={1}
                    value={editingData.tonnage}
                    onChange={(e) =>
                      setEditingData({
                        ...editingData,
                        tonnage: e.target.value
                      })
                    }
                    required
                  />
                </div>
              </div>

              <div className="col-12 col-md-6 mt-4">
                <h6>Contact Number</h6>
                <div className="input-item input-item-email">
                  <input
                    type="tel"
                    name="contact_no"
                    className="m-0"
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

              <div className="col-12 col-md-6 mt-4">
                <h6>Location</h6>
                <div className="input-item input-item-name">
                  <Autocomplete
                    name="from_location"
                    className="google-location location-input bg-transparent py-2 m-0"
                    apiKey={process.env.REACT_APP_GOOGLE_PLACES_KEY}
                    onPlaceSelected={(place) => {
                      if (place) {
                        handleBuyAndSellLocation(place.address_components);
                      }
                    }}
                    required
                  />
                </div>
              </div>

              <div className="col-12 col-md-6 mt-4">
                <h6>Truck Body Type</h6>
                <button type="button" class="btn btn-transparent shadow-none border dropdown-toggle col-12 py-3 dropdown-arrow text-start" data-bs-toggle="dropdown" aria-expanded="false">
                  {editingData.truck_body_type === '' ? 'select body type' : `${editingData.truck_body_type}`}
                </button>
                <ul class="dropdown-menu col-11 dropdown-ul">
                  {
                    truckBodyType.map((bodyType) => {
                      return <li onClick={() => setEditingData({
                        ...editingData, truck_body_type: bodyType,
                      })} className="cup mt-0 py-2 dropdown-list-hover"><a class="dropdown-item text-decoration-none">{bodyType}</a></li>
                    })
                  }
                </ul >
              </div>

              <div className="col-12 col-md-6 mt-4">
                <h6>No. of Tyres</h6>
                <button type="button" class="btn btn-transparent shadow-none border dropdown-toggle col-12 py-3 dropdown-arrow text-start" data-bs-toggle="dropdown" aria-expanded="false">
                  {editingData.no_of_tyres === '' ? 'select number of tyres' : `${editingData.no_of_tyres}`}
                </button>
                <ul class="dropdown-menu col-11 dropdown-ul">
                  {
                    numOfTyres.map((numOfTyres) => {
                      return <li onClick={() => setEditingData({
                        ...editingData, no_of_tyres: numOfTyres,
                      })} className="cup mt-0 py-2 dropdown-list-hover"><a class="dropdown-item text-decoration-none">{numOfTyres}</a></li>
                    })
                  }
                </ul >
              </div>
            </div>

            <div className="mt-4">
              <label for="formFileMultiple" className="form-label">
                Multiple files input example
              </label>
              <input
                type="file"
                id="fileupload"
                className="file-upload-input form-control"
                onChange={InputChange}
                multiple
                required
              />
            </div>

            <div className="mt-4">
              {selectedfile.map((data, index) => {
                const {
                  id,
                  filename,
                  filetype,
                  fileimage,
                  datetime,
                  filesize,
                } = data;
                return (
                  <div className="file-atc-box" key={id}>
                    {filename.match(/.(jpg|jpeg|png|gif|svg)$/i) ? (
                      <div className="file-image">
                        {" "}
                        <img src={fileimage} alt="" />
                      </div>
                    ) : (
                      <div className="file-image">
                        <i className="far fa-file-alt"></i>
                      </div>
                    )}
                    <div className="file-detail row">
                      <h6>{filename}</h6>
                      <div className="col-9">
                        <p>
                          <span>Size : {filesize}</span>,
                          <span className="ps-1 ml-2">
                            Modified Time : {datetime}
                          </span>
                        </p>
                      </div>
                      <div className="file-actions col-3">
                        <button
                          type="button"
                          className="file-action-btn"
                          onClick={() => DeleteSelectFile(id)}
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="row">
              <div className="col-12">
                <h6>Descriptions(Optional) </h6>
                <div className="input-item input-item-textarea">
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
                    required
                  />
                </div>
              </div>
            </div>

            <div className="modal-footer">
              <div className="col-12 col-md-6 m-0">
                <button
                  type="button"
                  className="btn btn-secondary"
                  data-bs-dismiss="modal"
                >
                  Close
                </button>
              </div>
              <div className="col-12 col-md-6 m-0">
                {createVehicleLoading ? (
                  <button type="button" className="btn btn-primary w-100">
                    <div class="spinner-border" role="status">
                      <span class="visually-hidden">Saving...</span>
                    </div>
                  </button>
                ) : (
                  <button
                    type="button"
                    className="btn btn-primary w-100"
                    onClick={handleBuyAndSellUpdate}
                  >
                    Create
                  </button>
                )}
              </div>
            </div>
          </div>
        );

      default:
        break;
    }
  };

  const handleApplyFilterTonnage = e => {
    setSelectBoxTonnage(e)
    var edittTon = e.map((v) => v.label)

    SetfilterModelData({ ...filterModelData, tonnage: edittTon })
  }

  return (
    <div>
      <div className="modal fade" id="buySellfilter" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true" >
        <div className="modal-dialog modal-dialog-centered modal-dialog-scrollable modal-lg">
          <div className="modal-content">
            <div className="modal-header">
              <h1 className="modal-title fs-5" id="exampleModalLabel">
                Add Post
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
              <div className="ltn__appointment-inner ">
                <div className="d-flex flex-wrap flex-column gap-4">
                  <div className="col-12 p-0">
                    <h6>Model Year</h6>
                    <button type="button" class="btn btn-transparent shadow-none border dropdown-toggle col-12 py-3 dropdown-arrow text-start" data-bs-toggle="dropdown" aria-expanded="false">
                      {filterModelData.model === '' ? 'select model' : `${filterModelData.model}`}
                    </button>
                    <ul class="dropdown-menu col-12 dropdown-ul">
                      {
                        yearData.map((yearVal) => {
                          return <li onClick={() => SetfilterModelData({
                            ...filterModelData, model: yearVal,
                          })} className="cup mt-0 py-2 dropdown-list-hover"><a class="dropdown-item text-decoration-none">{yearVal}</a></li>
                        })
                      }
                    </ul >
                  </div>

                  <div className="col-12 p-0">
                    <h6>Brand</h6>
                    <button type="button" class="btn btn-transparent shadow-none border dropdown-toggle col-12 py-3 dropdown-arrow text-start" data-bs-toggle="dropdown" aria-expanded="false">
                      {filterModelData.brand === '' ? 'select model' : `${filterModelData.brand}`}
                    </button>
                    <ul class="dropdown-menu col-12 dropdown-ul">
                      {
                        truckBrand.map((brandVal) => {
                          return <li onClick={() => SetfilterModelData({
                            ...filterModelData, brand: brandVal,
                          })} className="cup mt-0 py-2 dropdown-list-hover"><a class="dropdown-item text-decoration-none">{brandVal}</a></li>
                        })
                      }
                    </ul >
                  </div>

                  <div className="col-12 p-0">
                    <h6>Location</h6>
                    <div className="input-item input-item-name">
                      <Autocomplete
                        name="to_location"
                        className="w-100 bg-transparent mb-0 "
                        apiKey={process.env.REACT_APP_GOOGLE_PLACES_KEY}
                        onPlaceSelected={(place) => {
                          if (place) {
                            handleLocation(place.address_components);
                          }
                        }}
                        value={showingToLocation}
                        onChange={(e) => setShowingToLocation(e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="col-12 px-0">
                    <h6>Tonnage</h6>
                    <Select multi options={tonnage} values={selectBoxtonnage} onChange={handleApplyFilterTonnage} />
                  </div>

                  <div className="col-12 px-0">
                    <h6>Kilometers driven</h6>

                    <button type="button" class="btn btn-transparent shadow-none border dropdown-toggle col-12 py-3 dropdown-arrow text-start" data-bs-toggle="dropdown" aria-expanded="false">
                      {filterModelData.kms_driven === '' ? 'select kilometers' : `${filterModelData.kms_driven} kms`}
                    </button>
                    <ul class="dropdown-menu col-12 dropdown-ul">
                      {
                        filterKilometers.map((kms, ind) => {
                          return <li onClick={() => SetfilterModelData({
                            ...filterModelData, kms_driven: kms
                          })} className="cup mt-0 py-2 dropdown-list-hover"><a class="dropdown-item text-decoration-none">{kms} kms</a></li>
                        })
                      }
                    </ul >


                    <div className="col-12 mt-3 p-0">
                      <h6>Price</h6>
                      <button type="button" class="btn btn-transparent shadow-none border dropdown-toggle col-12 py-3 dropdown-arrow text-start" data-bs-toggle="dropdown" aria-expanded="false">
                        {filterModelData.price === '' ? 'select price' : `${filterModelData.price} lakhs`}
                      </button>
                      <ul class="dropdown-menu col-12 dropdown-ul">
                        {
                          filterPrice.map((fltrPrice, ind) => {
                            return <li onClick={() => SetfilterModelData({
                              ...filterModelData, price: fltrPrice
                            })} className="cup mt-0 py-2 dropdown-list-hover"><a class="dropdown-item text-decoration-none">{fltrPrice} lakhs</a></li>
                          })
                        }
                      </ul >
                    </div>
                  </div >

                  <div className="col-12 px-0">
                    <h6>Truck Body Type</h6>
                    <button type="button" class="btn btn-transparent shadow-none border dropdown-toggle col-12 py-3 dropdown-arrow text-start" data-bs-toggle="dropdown" aria-expanded="false">
                      {filterModelData.truck_body_type === '' ? 'select body type' : `${filterModelData.truck_body_type}`}
                    </button>
                    <ul class="dropdown-menu col-12 dropdown-ul">
                      {
                        truckBodyType.map((bodyType) => {
                          return <li onClick={() => SetfilterModelData({
                            ...filterModelData, truck_body_type: bodyType,
                          })} className="cup mt-0 py-2 dropdown-list-hover"><a class="dropdown-item text-decoration-none">{bodyType}</a></li>
                        })
                      }
                    </ul >
                  </div>

                  <div className="col-12 px-0">
                    <h6>No. of Tyres</h6>
                    <button type="button" class="btn btn-transparent shadow-none border dropdown-toggle col-12 py-3 dropdown-arrow text-start" data-bs-toggle="dropdown" aria-expanded="false">
                      {filterModelData.no_of_tyres === '' ? 'select number of tyres' : `${filterModelData.no_of_tyres}`}
                    </button>
                    <ul class="dropdown-menu col-12 dropdown-ul">
                      {
                        numOfTyres.map((numOfTyres) => {
                          return <li onClick={() => SetfilterModelData({
                            ...filterModelData, no_of_tyres: numOfTyres,
                          })} className="cup mt-0 py-2 dropdown-list-hover"><a class="dropdown-item text-decoration-none">{numOfTyres}</a></li>
                        })
                      }
                    </ul >
                  </div>
                </div>
              </div>
            </div>

            <div className="modal-footer">
              {filterLoading ? (
                <button type="button" className="btn btn-primary w-100">
                  <div class="spinner-border" role="status">
                    <span class="visually-hidden">Loading...</span>
                  </div>
                </button>
              ) : (
                <button
                  type="button"
                  className="btn btn-primary w-100"
                  onClick={handleApplyFilter}>
                  Apply Filter
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* modal */}
      <div className="modal fade" id="addloadavailability" data-bs-backdrop="static" data-bs-keyboard="false" tabIndex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true" >
        <div className={`modal-dialog modal-dialog-centered modal-dialog-scrollable ${aadharStep === 4 ? "modal-lg" : "modal-md"}`}>
          <div className="modal-content">
            <div className="modal-header">
              <h1 className="modal-title fs-5" id="staticBackdropLabel">
                Add vehicle
              </h1>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
                id="clodeBuySellModel"
              ></button>
            </div>
            <div className="modal-body">{handleAddarVerifiactionStatus()}</div>
          </div>
        </div>
      </div>

      <div className="container-fluid px-lg-5 blog-list-filter-min-height">
        <div className="row filter-min-height pb-5">

          <div className="filter-column-width border rounded d-none d-lg-flex flex-wrap flex-column gap-4 pt-4 bg-light">
            <div className="col-12 d-flex flex-wrap p-0">
              <div className="col-6 p-0">
                {clearFilterLoading ? (
                  <button type="button" className="btn btn-primary w-100">
                    <div class="spinner-border" role="status">
                      <span class="visually-hidden">Loading...</span>
                    </div>
                  </button>
                ) : (
                  <button
                    type="button"
                    className="btn border w-100"
                    onClick={handleClearFilter}
                  >
                    Clear Filter
                  </button>
                )}
              </div>

              <div className="col-6 p-0 ps-1">
                {filterLoading ? (
                  <button type="button" className="btn btn-danger w-100">
                    <div class="spinner-border" role="status">
                      <span class="visually-hidden">Loading...</span>
                    </div>
                  </button>
                ) : (
                  <button
                    type="button"
                    className="btn btn-primary w-100"
                    onClick={handleApplyFilter}
                  >
                    Apply Filter
                  </button>
                )}
              </div>
            </div>

            <div className="col-12 p-0">
              <h6>Model Year</h6>
              <button type="button" class="btn btn-transparent shadow-none border dropdown-toggle col-12 py-2 dropdown-arrow text-start" data-bs-toggle="dropdown" aria-expanded="false">
                {filterModelData.model === '' ? 'select model' : `${filterModelData.model}`}
              </button>
              <ul class="dropdown-menu col-12 dropdown-ul">
                {
                  yearData.map((yearVal) => {
                    return <li onClick={() => SetfilterModelData({
                      ...filterModelData, model: yearVal,
                    })} className="cup mt-0 py-2 dropdown-list-hover"><a class="dropdown-item text-decoration-none">{yearVal}</a></li>
                  })
                }
              </ul >
            </div>

            <div className="col-12 p-0">
              <h6>Brand</h6>
              <button type="button" class="btn btn-transparent shadow-none border dropdown-toggle col-12 py-2 dropdown-arrow text-start" data-bs-toggle="dropdown" aria-expanded="false">
                {filterModelData.brand === '' ? 'select model' : `${filterModelData.brand}`}
              </button>
              <ul class="dropdown-menu col-12 dropdown-ul">
                {
                  truckBrand.map((brandVal) => {
                    return <li onClick={() => SetfilterModelData({
                      ...filterModelData, brand: brandVal,
                    })} className="cup mt-0 py-2 dropdown-list-hover"><a class="dropdown-item text-decoration-none">{brandVal}</a></li>
                  })
                }
              </ul >
            </div>

            <div className="col-12 p-0">
              <h6>Location</h6>
              <div className="input-item input-item-name">
                <Autocomplete
                  name="to_location"
                  className="w-100 bg-transparent mb-0 "
                  apiKey={process.env.REACT_APP_GOOGLE_PLACES_KEY}
                  onPlaceSelected={(place) => {
                    if (place) {
                      handleLocation(place.address_components);
                    }
                  }}
                  value={showingToLocation}
                  onChange={(e) => setShowingToLocation(e.target.value)}
                />
              </div>
            </div>

            <div className="col-12 px-0">
              <h6>Tonnage</h6>
              <Select multi options={tonnage} values={selectBoxtonnage} onChange={handleApplyFilterTonnage} />
            </div>

            <div className="col-12 px-0">
              <h6>Kilometers driven</h6>

              <button type="button" class="btn btn-transparent dropdown-toggle col-12 py-3 border shadow-none  dropdown-arrow text-start" data-bs-toggle="dropdown" aria-expanded="false">
                {filterModelData.kms_driven === '' ? 'select kilometers' : `${filterModelData.kms_driven} kms`}
              </button>
              <ul class="dropdown-menu col-12 dropdown-ul">
                {
                  filterKilometers.map((kms, ind) => {
                    return <li onClick={() => SetfilterModelData({
                      ...filterModelData, kms_driven: kms
                    })} className="cup mt-0 py-2 dropdown-list-hover"><a class="dropdown-item text-decoration-none">{kms} kms</a></li>
                  })
                }
              </ul >


              <div className="col-12 mt-3 p-0">
                <h6>Price</h6>
                <button type="button" class="btn btn-transparent dropdown-toggle col-12 py-3 border shadow-none dropdown-arrow text-start" data-bs-toggle="dropdown" aria-expanded="false">
                  {filterModelData.price === '' ? 'select price' : `${filterModelData.price} lakhs`}
                </button>
                <ul class="dropdown-menu col-12 dropdown-ul">
                  {
                    filterPrice.map((fltrPrice, ind) => {
                      return <li onClick={() => SetfilterModelData({
                        ...filterModelData, price: fltrPrice
                      })} className="cup mt-0 py-2 dropdown-list-hover"><a class="dropdown-item text-decoration-none">{fltrPrice} lakhs</a></li>
                    })
                  }
                </ul >
              </div>
            </div >

            <div className="col-12 px-0">
              <h6>Truck Body Type</h6>
              <button type="button" class="btn btn-transparent shadow-none border dropdown-toggle col-12 py-3 dropdown-arrow text-start" data-bs-toggle="dropdown" aria-expanded="false">
                {filterModelData.truck_body_type === '' ? 'select body type' : `${filterModelData.truck_body_type}`}
              </button>
              <ul class="dropdown-menu col-12 dropdown-ul">
                {
                  truckBodyType.map((bodyType) => {
                    return <li onClick={() => SetfilterModelData({
                      ...filterModelData, truck_body_type: bodyType,
                    })} className="cup mt-0 py-2 dropdown-list-hover"><a class="dropdown-item text-decoration-none">{bodyType}</a></li>
                  })
                }
              </ul >
            </div>

            <div className="col-12 px-0">
              <h6>No. of Tyres</h6>
              <button type="button" class="btn btn-transparent shadow-none border dropdown-toggle col-12 py-3 dropdown-arrow text-start" data-bs-toggle="dropdown" aria-expanded="false">
                {filterModelData.no_of_tyres === '' ? 'select number of tyres' : `${filterModelData.no_of_tyres}`}
              </button>
              <ul class="dropdown-menu col-12 dropdown-ul">
                {
                  numOfTyres.map((numOfTyres) => {
                    return <li onClick={() => SetfilterModelData({
                      ...filterModelData, no_of_tyres: numOfTyres,
                    })} className="cup mt-0 py-2 dropdown-list-hover"><a class="dropdown-item text-decoration-none">{numOfTyres}</a></li>
                  })
                }
              </ul >
            </div>
          </div >

          <div className="col h-100 overflow-auto webkitScroll-buy-sell pt-3">
            <div className="ltn__product-area ltn__product-gutter">
              <div className="container-fluid">
                <div className="row border-bottom">
                  <div className="col-lg-12 mb-2">
                    <div className='text-center'><h2 className='cardmodifyhead'>Buy and Sell</h2></div>

                    <div className="ltn__shop-options">
                      <ul>
                        <li>
                          <div className="showing-product-number text-right">
                            <span>
                              Showing {indexOfFirstCard + 1}-
                              {Math.min(indexOfLastCard, filteredCards.length)} of{" "}
                              {filteredCards.length} results
                            </span>
                          </div>
                        </li>
                        <div className="header-top-btn">
                          {LoginDetails.isLoggedIn ? (
                            <button
                              type="button "
                              className="cardbutton truck-brand-button "
                              data-bs-toggle="modal"
                              data-bs-target="#addloadavailability"
                              onClick={handleBuyAndSellModelOpen}
                            >
                              {" "}
                              + Add vehicle post
                            </button>
                          ) : (
                            <button
                              type="button "
                              className="cardbutton truck-brand-button "
                              data-bs-toggle="modal"
                              data-bs-target="#loginModal"
                            >
                              {" "}
                              + Add vehicle post
                            </button>
                          )}
                        </div>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="row">
              <div className="col-12 col-lg-12">
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
              <div className="col-lg-4 d-flex flex-wrap d-lg-none">
                <div className="col-12 col-sm-8">
                  {/* Filter */}
                  <button
                    type="button"
                    className="filterbtn col-12"
                    data-bs-toggle="modal"
                    data-bs-target="#buySellfilter"
                  >
                    Filter
                  </button>
                </div>
                <div className="col-12 col-sm-4 mt-2 mt-sm-0">
                  {clearFilterLoading ? (
                    <button type="button" className="btn-primary w-100">
                      <div class="spinner-border" role="status">
                        <span class="visually-hidden">Loading...</span>
                      </div>
                    </button>
                  ) : (
                    <button
                      type="button"
                      className={`w-100 col-12 ${isDataFiltered ? "filterbtn" : " btn-secondary pe-none"}`}
                      onClick={handleClearFilter}
                    >
                      Clear Filter
                    </button>
                  )}
                </div>
              </div>
            </div>

            <div className="d-flex flex-wrap pt-3 pb-5 w-100 h-100">
              {filterLoading ? (
                <div className="row w-100 h-100 justify-content-center align-items-center">
                  <div className="col-3 text-center">
                    <div class="spinner-border text-info" role="status">
                      <span class="visually-hidden">Loading...</span>
                    </div>
                    <p className="mt-2 text-info">Loading...</p>
                  </div>
                </div>
              ) :
                initialLoading ?
                  <div className="row w-100 h-100 justify-content-center align-items-center">
                    <div className="col-3 text-center">
                      <div class="spinner-border text-info" role="status">
                        <span class="visually-hidden">Loading...</span>
                      </div>
                      <p className="mt-2 text-info">Loading...</p>
                    </div>
                  </div>
                  :
                  currentCards.length ? (
                    currentCards.map((card) => (
                      <div
                        className="col-12 col-sm-6 col-xxl-4 p-2"
                        key={card.buy_sell_id}
                      >
                        <div className="card card h-100 shadow truckcard">
                          <span className="object-fit-fill rounded justify-content-center d-flex">
                            <img
                              className="m-3 rounded-3 justify-content-center d-flex"
                              src={card.images.length > 0 ? card.images[0] : ""}
                              alt="truck message Logo - All in one truck solutions"
                              style={{
                                width: "390px",
                                height: "290px",
                                objectFit: "cover",
                              }}
                            />
                          </span>
                          <div className="card-body">
                            <div className="col-12 col-md-12 mb-2 text-wrap">
                              <div className="row">
                                <div className="col-12 col-md-12 text-start ps-0">
                                  <p className=".fs-6 mb-0 reviewtext ">
                                    {/* Generate the star ratings based on the response */}
                                    {[...Array(5)].map((_, index) => (
                                      <span key={index} className="float-right">
                                        <i
                                          className={`text-warning fa fa-star ${index < card.rating ? "" : "text-muted"
                                            }`}
                                        ></i>
                                      </span>
                                    ))}
                                    <span>({card.user_review_count})</span>
                                    <p className="float-end mb-0 text-b">
                                      {" "}
                                      <strong>Posts </strong> ({card.user_post})
                                    </p>
                                  </p>
                                  <h5 className="card-title mt-2 text-wrap">
                                    {card.brand}
                                  </h5>
                                </div>
                              </div>
                            </div>
                            <div>
                              <label>
                                <FaLocationDot className="me-2 text-danger cardicontext" />
                                {card.location}
                              </label>
                            </div>
                            <p className='datetext mb-3'><strong><RiMapPinTimeFill className='me-2' />Posted on :</strong> {card.updt ? card.updt.slice(5, 25): ''}</p>
                            <div>
                              <div className="row">
                                <div className="col-6 col-md-6 cardicontext">
                                  <FaUserAlt className="me-2 cardicontext" />
                                  {card.owner_name}
                                </div>
                                <div className="col-6 col-md-6 cardicontext">
                                  <FaTruckFast className="me-2" />
                                  {card.vehicle_number}
                                </div>
                                <div className="col-6 col-md-6 cardicontext">
                                  <BsFillCalendar2DateFill className="me-2" />
                                  {card.model}
                                </div>
                                <div className="col-6 col-md-6 cardicontext">
                                  <RiPinDistanceFill className="me-2" />
                                  {card.kms_driven} kms
                                </div>

                                <div className="col-12 text-center mt-4 mb-2">
                                  <div className="col card-title fs-5 me-4">
                                    <FaIndianRupeeSign className="me-2" />
                                    {card.price}
                                  </div>
                                </div>
                              </div>
                            </div>
                            <hr />
                            <div className="d-flex gap-2">
                              <Link
                                to="/product-details"
                                className="apara"
                                onClick={() => handleSaveBusAndSellId(card)}
                              >
                                view details {" "}
                              </Link>{" "}
                              <link></link>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="row w-100 h-100 justify-content-center align-items-center">
                      <div className="col-3 text-center">
                        <p>No data found</p>
                      </div>
                    </div>
                  )}
            </div>
          </div>
        </div >

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
      </div >
    </div >
  );
};

export default BlogList;
