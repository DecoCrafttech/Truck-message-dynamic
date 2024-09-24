import React, { useState, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { FaWeightHanging, FaTruck, FaLocationDot } from "react-icons/fa6";
import { SiMaterialformkdocs } from "react-icons/si";
import { GiCarWheel } from "react-icons/gi";
import { CiStar } from "react-icons/ci";
import Cookies from "js-cookie";
import { NavLink, useNavigate } from "react-router-dom";
import Autocomplete from "react-google-autocomplete";
import { FaStar, FaUserAlt } from "react-icons/fa";
import { FaTruckFast } from "react-icons/fa6";
import { BsFillCalendar2DateFill } from "react-icons/bs";
import { RiPinDistanceFill } from "react-icons/ri";
import shortid from "https://cdn.skypack.dev/shortid@2.2.16";
import { useSelector } from "react-redux";

const WishList = () => {
  let publicUrl = process.env.PUBLIC_URL + "/";
  const LoginDetails = useSelector((state) => state.login);
  const pageRender = useNavigate();

  const [initialLoading, setInitialLoading] = useState(false);
  const [data, setData] = useState([]);
  const [gettingDetails, setGettingDetails] = useState(false);
  const [feedbackRating, setRating] = useState('');
  const [feedbackHover, setHover] = useState('');
  const [yearData, setYearData] = useState([]);
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
  const truckBodyType = ["LCV", "Bus", "Open body vehicle", "Tanker", "Trailer", "Tipper"];
  const numOfTyres = [4,
    6,
    10,
    12,
    14,
    16,
    18,
    20,
    22]

  const [contactError, setContactError] = useState("");
  const [editingData, setEditingData] = useState({
    company_name: "",
    contact_no: "",
    description: "",
    material: "",
    no_of_tyres: "",
    tone: "",
    truck_body_type: "",
  });
  const [driverDetailsEditingData, setDriverDetailsEditingData] = useState({
    driver_name: "",
    vehicle_number: "",
    company_name: "",
    contact_no: "",
    truck_body_type: "",
    no_of_tyres: "",
    description: ''
  });
  const [showingFromLocation, setShowingFromLocation] = useState("");
  const [showingToLocation, setShowingToLocation] = useState("");
  const [showingBuyAndSellLocation, setShowingBuyAndSellLocation] = useState("");
  const [deletingData, setDeletingData] = useState({});
  const [feedbackRadio, setFeedbackRadio] = useState("YES");
  const [feedback, setfeedback] = useState({
    feedbackCnt: "",
    mobNum: "",
  });


  useEffect(() => {
    if (!Cookies.get("usrin")) {
      pageRender("/");
    }
  }, [LoginDetails.isLoggedIn]);

  useEffect(() => {
    const getYear = new Date().getFullYear()
    var l = []
    for (var i = 1980; i <= getYear; i++) {
      l[l.length] = i
    }
    setYearData(l)
  }, [])

  useEffect(() => {
    initialRenderOne()
  }, []);

  const initialRenderOne = () => {
    const getPath = window.location.pathname;
    switch (getPath) {
      case "/wishlist/load":
        initialRender("user_load_details");
        break;
      case "/wishlist/truck":
        initialRender("user_truck_details");
        break;
      case "/wishlist/driver":
        initialRender("user_driver_details");
        break;
      case "/wishlist/buy_sell":
        initialRender("user_buy_sell_details");
        break;
      default:
        break;
    }
  }

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

  const initialRender = async (newPath) => {
    const getUser = Cookies.get("usrin");
    setGettingDetails(true);
    if (getUser) {
      const data = {
        user_id: window.atob(getUser),
      };
      try {
        axios
          .post(`https://truck.truckmessage.com/${newPath}`, data, {
            headers: {
              "Content-Type": "application/json",
            },
          })
          .then((response) => {
            if (response.data.success && Array.isArray(response.data.data)) {
              setData(response.data.data);
              setGettingDetails(false);
            } else {
              console.error("Unexpected response format:", response.data);
              setGettingDetails(false);
            }
          })
          .catch((error) => {
            console.error("There was an error fetching the data!", error);
            setGettingDetails(false);
          });
      } catch (err) {
        toast.error(err);
      }
    } else {
      toast.error("plaese login to get data");
    }
  };

  const handleChooseUpdate = async () => {
    const getPath = window.location.pathname;
    switch (getPath) {
      case "/wishlist/load":
        var userId = window.atob(Cookies.get("usrin"));
        const load_details = {
          ...editingData,
          from: showingFromLocation,
          to: showingToLocation,
          load_id: JSON.stringify(editingData.load_id),
          user_id: userId,
        };
        handleUpdate("load_details", load_details);
        break;
      case "/wishlist/truck":
        var userId = window.atob(Cookies.get("usrin"));
        const truck_entry = {
          ...editingData,
          from: showingFromLocation,
          to: showingToLocation,
          truck_id: JSON.stringify(editingData.truck_id),
          user_id: userId,
        };
        handleUpdate("truck_entry", truck_entry);
        break;
      case "/wishlist/driver":
        var userId = window.atob(Cookies.get("usrin"));
        const driver_entry = {
          driver_name: driverDetailsEditingData.driver_name,
          vehicle_number: driverDetailsEditingData.vehicle_number,
          company_name: driverDetailsEditingData.company_name,
          contact_no: driverDetailsEditingData.contact_no,
          truck_body_type: driverDetailsEditingData.truck_body_type,
          no_of_tyres: driverDetailsEditingData.no_of_tyres,
          description: driverDetailsEditingData.description,
          from: showingFromLocation,
          truck_name: '',
          to: showingToLocation,
          driver_id: JSON.stringify(editingData.driver_id),
          user_id: userId,
        };
        handleUpdate("driver_entry", driver_entry);
        break;
      case "/wishlist/buy_sell":
        var userId = window.atob(Cookies.get("usrin"));
        const truck_buy_sell = {
          ...editingData,
          from: showingFromLocation,
          to: showingToLocation,
          buy_sell_id: JSON.stringify(editingData.buy_sell_id),
          user_id: userId,
        };
        handleUpdate("truck_buy_sell", truck_buy_sell);
        break;
      default:
        break;
    }
  };

  const closeModal = () => {
    initialRenderOne()
    const getPath = window.location.pathname;
    switch (getPath) {
      case "/wishlist/load":
        return document.getElementById("closeModelOne").click();
      case "/wishlist/truck":
        return document.getElementById("closeModelTwo").click();
      case "/wishlist/driver":
        return document.getElementById("closeModelThree").click();
      case "/wishlist/buy_sell":
        return document.getElementById("closeModelOne").click();
      default:
        break;
    }
  };

  const handleUpdate = async (updationPath, updationData) => {
    console.log(updationData)
    try {
      const res = await axios.post(
        `https://truck.truckmessage.com/${updationPath}`,
        updationData,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      console.log(res, "res")
      if (res.data.error_code === 0) {
        // initialRenderOne()
        toast.success(res.data.message);

        closeModal();
      } else {
        toast.error(res.data.message);
      }
    } catch (error) {
      console.log("There was an error!", error);
    }
  };

  const handleChooseDelete = (deletionId) => {
    const getPath = window.location.pathname;
    switch (getPath) {
      case "/wishlist/load":
        const remove_load_details = {
          load_id: JSON.stringify(deletionId.load_id),
        };

        hanldeDelete("remove_load_details", remove_load_details);
        break;
      case "/wishlist/truck":
        const remove_truck_entry = {
          truck_id: JSON.stringify(deletionId.truck_id),
        };
        hanldeDelete("remove_truck_entry", remove_truck_entry);
        break;
      case "/wishlist/driver":
        const remove_driver_entry = {
          driver_id: JSON.stringify(deletionId.driver_id),
        };
        hanldeDelete("remove_driver_entry", remove_driver_entry);
        break;
      case "/wishlist/buy_sell":
        const remove_truck_buy_sell = {
          buy_sell_id: JSON.stringify(deletionId.buy_sell_id),
        };
        hanldeDelete("remove_truck_buy_sell", remove_truck_buy_sell);
        break;
      default:
        break;
    }
  };

  const hanldeDelete = async (deletionPath, deletionData) => {
    try {
      const res = await axios.post(
        `https://truck.truckmessage.com/${deletionPath}`,
        deletionData,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      if (res.data.error_code === 0) {
        toast.success(res.data.message);
        initialRenderOne()

        document.getElementById("deleteCloseModel").click();
      } else {
        toast.error(res.data.message);
      }
    } catch (error) {
      toast.error("Failed to delete.");
      console.error("There was an error!", error);
    }
  };

  const handleSubmitFeedback = async () => {
    try {
      const getPath = window.location.pathname;
      if (getPath === "/wishlist/load") {
        var data = {
          user_id: window.atob(Cookies.get("usrin")),
          ref_id: JSON.stringify(deletingData.load_id),
          via_app: feedbackRadio,
          ref_name: "load",
        };
      } else if (getPath === "/wishlist/truck") {
        var data = {
          user_id: window.atob(Cookies.get("usrin")),
          ref_id: JSON.stringify(deletingData.truck_id),
          via_app: feedbackRadio,
          ref_name: "truck",
        };
      } else if (getPath === "/wishlist/driver") {
        var data = {
          user_id: window.atob(Cookies.get("usrin")),
          ref_id: JSON.stringify(deletingData.driver_id),
          via_app: feedbackRadio,
          ref_name: "driver",
        };
      } else {
        var data = {
          user_id: window.atob(Cookies.get("usrin")),
          ref_id: JSON.stringify(deletingData.buy_sell_id),
          via_app: feedbackRadio,
          ref_name: "buy and sell",
        };
      }

      if (feedbackRadio === "NO") {
        const object = { ...data };

        object.feedback = feedback.feedbackCnt;

        if (feedback.feedbackCnt !== "") {
          const res = await axios.post(
            "https://truck.truckmessage.com/user_feedback",
            object
          );
          if (res.data.error_code === 0) {
            handleChooseDelete(deletingData);
          } else {
            toast.error(res.data.message);
          }
        } else {
          toast.error("Feedback required");
        }
      } else {
        const object = { ...data };
        object.mobile_no = feedback.mobNum;
        object.ratings = feedbackRating;

        if (feedback.mobNum !== "" && feedback.mobNum.length === 10) {
          if (feedbackRating) {
            const res = await axios.post(
              "https://truck.truckmessage.com/user_feedback",
              object
            );
            if (res.data.error_code === 0) {
              handleChooseDelete(deletingData);
            } else {
              toast.error(res.data.message);
            }
          } else {
            toast.error("ratings required");
          }
        } else if (feedback.mobNum === "") {
          toast.error("Mobile number required");
        } else {
          toast.error("Invalid mobile number");
        }
      }
    } catch (err) {
      console.log(err);
    }
  };

  const handleEdit = (editObject) => {
    console.log(editObject)

    if (editObject.from_location) {
      setShowingFromLocation(editObject.from_location);
    }
    if (editObject.to_location) {
      setShowingToLocation(editObject.to_location);
    }
    if (editObject.location) {
      setShowingBuyAndSellLocation(editObject.location);
    }
    setEditingData(editObject);
    // SetSelectedFile()

    // for (var i = 0; i < editObject.images.length; i++) {
    //   fetch(editObject.images[i])
    //     .then((res) => res.blob())
    //     .then(blob => {
    //       const imgfile = new File([blob])
    //       selectedfile[selectedfile.length] = imgfile
    //       SetSelectedFile(selectedfile)
    //     })
    // }


    setDriverDetailsEditingData(editObject)
  };

  //Image upload and delete functions
  const [selectedfile, SetSelectedFile] = useState([]);
  const [multipleImages, setMultipleImages] = useState([]);

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
      setMultipleImages([...multipleImages, ...e.target.files]);
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

    const formData = new FormData();

    formData.append("user_id", userId);
    formData.append("brand", edit.brand);
    formData.append("buy_sell_id", edit.buy_sell_id);
    formData.append("contact_no", edit.contact_no);
    formData.append("description", edit.description);
    formData.append("id", edit.id);
    formData.append("kms_driven", edit.kms_driven);
    formData.append("location", edit.location);
    formData.append("model", edit.model);
    formData.append("owner_name", edit.owner_name);
    formData.append("price", edit.price);
    formData.append("vehicle_number", edit.vehicle_number);
    formData.append("truck_body_type", edit.truck_body_type);
    formData.append("no_of_tyres", edit.no_of_tyres);


    if (multipleImages.length > 0) {
      for (let i = 0; i < multipleImages.length; i++) {
        formData.append(`truck_image${i + 1}`, multipleImages[i]);
      }
    } else {
      for (let i = 0; i < editingData.images.length; i++) {
        formData.append(`truck_image${i + 1}`, editingData.images[i]);
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
        initialRender("user_buy_sell_details");
      } else {
        toast.error(res.data.message);
      }
    } catch (err) {
      console.log(err);
    }
  };

  const renderLoadCard = () => {
    return !gettingDetails ? (
      data.length > 0 ? (
        data.map((item) => (
          <div className="col-12 col-md-6 col-lg-4 mb-4" key={item.id}>
            <div className="card h-100 shadow truckcard">
              <div className="card-header mt-2 border-0 mb-2">
                <h5 className="card-title cardmodify">{item.company_name}</h5>
              </div>
              <div className="card-body p-3 mt-2 mb-2">
                <div className="row">
                  <div className="col-lg-12 cardicon">
                    <div>
                      <label>
                        <FaLocationDot className="me-2 text-danger" />
                        {item.from_location}
                      </label>
                    </div>
                  </div>
                  <div className="col-lg-12 cardicon">
                    <div>
                      <label>
                        <FaLocationDot className="me-2 text-success" />
                        {item.to_location}
                      </label>
                    </div>
                  </div>
                </div>
                <hr className="hr m-2" />
                <div className="row">
                  <div className="col-lg-6 cardicon">
                    <div>
                      <label>
                        <FaWeightHanging className="me-2" />
                        {item.tone} ton
                      </label>
                    </div>
                  </div>
                  <div className="col-lg-6 cardicon">
                    <div>
                      <label>
                        <SiMaterialformkdocs className="me-2" />
                        {item.material}
                      </label>
                    </div>
                  </div>
                </div>
                <div className="row">
                  <div className="col-lg-6 cardicon">
                    <label>
                      <GiCarWheel className="me-2" />
                      {item.no_of_tyres} wheels
                    </label>
                  </div>
                  <div className="col-lg-6 cardicon">
                    <label>
                      <FaTruck className="me-2" />
                      {item.truck_body_type}
                    </label>
                  </div>
                  <div className="col-lg-6 cardicon">
                    <label>
                      <FaTruck className="me-2" />
                      {item.contact_no}
                    </label>
                  </div>
                </div>
                <div className="m-2">
                  <h5 className="card-title mt-3">Description</h5>
                  <p className="card-text paragraph">{item.description}</p>
                </div>
              </div>
              <div className="card-footer mb-3">
                <div>
                  <div className="d-flex gap-2 justify-content-between mt-3">
                    <button
                      className="btn btn-success"
                      type="button"
                      data-bs-toggle="modal"
                      data-bs-target="#exampleModal"
                      onClick={() => handleEdit(item)}
                    >
                      Edit
                    </button>
                    <button
                      className="btn cardbutton"
                      type="button"
                      data-bs-toggle="modal"
                      data-bs-target="#handleDeleteModel"
                      onClick={() => {
                        setDeletingData(item);
                        setRating(0);
                        setHover(0);
                        setfeedback({
                          feedbackCnt: "",
                          mobNum: "",
                        });
                      }}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))
      ) : (
        <div className="card vh-100 m-2">
          <div className="card-body h-25 row align-items-center justify-content-center w-100">
            <div className="col-4 text-center">
              <img
                src={publicUrl + "assets/img/2953962.jpg"}
                height={"250px"}
                alt="no data image"
                className="w-100"
              />
            </div>
          </div>
        </div>
      )
    )
      :
      <div className="row w-100 justify-content-center align-items-center spinner-miin-height">
        <div className="col-3 text-center">
          <div class="spinner-border text-info" role="status">
            <span class="visually-hidden">Loading...</span>
          </div>
          <p className="mt-2 text-info">Loading...</p>
        </div>
      </div>;
  };

  const renderTruckCard = () => {
    return !gettingDetails ? (
      data.length > 0 ? (
        data.map((item) => (
          <div className="col-12 col-md-6 col-lg-4 mb-4" key={item.id}>
            <div className="card h-100 shadow truckcard">
              <div className="card-header mt-2 border-0 mb-2">
                <h5 className="card-title cardmodify">{item.company_name}</h5>
              </div>
              <div className="card-body p-3 mt-2 mb-2">
                <div className="row">
                  <div className="col-lg-12 cardicon">
                    <div>
                      <label>
                        <FaLocationDot className="me-2 text-danger" />
                        {item.from_location}
                      </label>
                    </div>
                  </div>
                  <div className="col-lg-12 cardicon">
                    <div>
                      <label>
                        <FaLocationDot className="me-2 text-success" />
                        {item.to_location}
                      </label>
                    </div>
                  </div>
                </div>
                <hr className="hr m-2" />
                <div className="row">
                  <div className="col-lg-6 cardicon">
                    <div>
                      <label>
                        <FaWeightHanging className="me-2" />
                        {item.tone} ton
                      </label>
                    </div>
                  </div>
                  {/* <div className="col-lg-6 cardicon">
                    <div>
                      <label>
                        <SiMaterialformkdocs className="me-2" />
                        {item.material}
                      </label>
                    </div>
                  </div> */}

                  <div className="col-lg-6 cardicon">
                    <label>
                      <GiCarWheel className="me-2" />
                      {item.no_of_tyres} wheels
                    </label>
                  </div>
                  <div className="col-lg-6 cardicon">
                    <label>
                      <FaTruck className="me-2" />
                      {item.truck_body_type}
                    </label>
                  </div>
                  <div className="col-lg-6 cardicon">
                    <label>
                      <FaTruck className="me-2" />
                      {item.contact_no}
                    </label>
                  </div>
                </div>
                <div className="row px-2">
                  <div className="col-6">
                    <h5 className="card-title mt-3">Truck name</h5>
                    <p className="card-text paragraph">{item.truck_brand_name}</p>
                  </div>
                  <div className="col-6">
                    <h5 className="card-title mt-3">vehicle number</h5>
                    <p className="card-text paragraph">{item.vehicle_number}</p>
                  </div>
                </div>
                <div className="m-2">
                  <h5 className="card-title mt-3">Description</h5>
                  <p className="card-text paragraph">{item.description}</p>
                </div>
              </div>
              <div className="card-footer mb-3">
                <div>
                  <div className="d-flex gap-2 justify-content-between mt-3">
                    <button
                      className="btn btn-success"
                      type="button"
                      data-bs-toggle="modal"
                      data-bs-target="#exampleModaltwo"
                      onClick={() => handleEdit(item)}
                    >
                      Edit
                    </button>
                    <button
                      className="btn cardbutton"
                      type="button"
                      data-bs-toggle="modal"
                      data-bs-target="#handleDeleteModel"
                      onClick={() => {
                        setDeletingData(item);
                        setfeedback({
                          feedbackCnt: "",
                          mobNum: "",
                        });
                        setRating(0)
                        setHover(0)
                      }}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))
      ) : (
        <div className="card vh-100 m-2">
          <div className="card-body h-25 row align-items-center justify-content-center w-100">
            <div className="col-4 text-center">
              <img
                src={publicUrl + "assets/img/2953962.jpg"}
                height={"250px"}
                alt="no data image"
                className="w-100"
              />
            </div>
          </div>
        </div>
      )
    )
      :
      <div className="row w-100 justify-content-center align-items-center spinner-miin-height">
        <div className="col-3 text-center">
          <div class="spinner-border text-info" role="status">
            <span class="visually-hidden">Loading...</span>
          </div>
          <p className="mt-2 text-info">Loading...</p>
        </div>
      </div>;
  };

  const renderDriverCard = () => {
    return !gettingDetails ? (
      data.length > 0 ? (
        data.map((item) => (
          <div className="col-12 col-md-6 col-lg-4 mb-4" key={item.id}>
            <div className="card h-100 shadow truckcard">
              <div className="card-header mt-2 border-0 mb-2">
                <h5 className="card-title cardmodify">{item.company_name}</h5>
              </div>
              <div className="card-body p-3 mt-2 mb-2">
                <div className="row">
                  <div className="col-lg-12 cardicon">
                    <div>
                      <label>
                        <FaLocationDot className="me-2 text-danger" />
                        {item.from_location}
                      </label>
                    </div>
                  </div>
                  <div className="col-lg-12 cardicon">
                    <div>
                      <label>
                        <FaLocationDot className="me-2 text-success" />
                        {item.to_location}
                      </label>
                    </div>
                  </div>
                </div>

                <hr className="hr m-2" />
                <div className="row">
                  <div className="col-lg-6 cardicon">
                    <label>
                      <GiCarWheel className="me-2" />
                      {item.no_of_tyres} wheels
                    </label>
                  </div>
                  <div className="col-lg-6 cardicon">
                    <label>
                      <FaTruck className="me-2" />
                      {item.truck_body_type}
                    </label>
                  </div>
                  <div className="col-lg-6 cardicon">
                    <label>
                      <FaTruck className="me-2" />
                      {item.contact_no}
                    </label>
                  </div>
                </div>
                <div className="row px-2">
                  <div className="col-6">
                    <h5 className="card-title mt-3">Driver name</h5>
                    <p className="card-text paragraph">{item.driver_name}</p>
                  </div>
                  <div className="col-6">
                    <h5 className="card-title mt-3">Truck name</h5>
                    <p className="card-text paragraph">{item.truck_name}</p>
                  </div>
                  <div className="col-6">
                    <h5 className="card-title mt-3">vehicle number</h5>
                    <p className="card-text paragraph">{item.vehicle_number}</p>
                  </div>
                </div>
                <div className="m-2">
                  <h5 className="card-title mt-3">Description</h5>
                  <p className="card-text paragraph">{item.description}</p>
                </div>
              </div>
              <div className="card-footer mb-3">
                <div>
                  <div className="d-flex gap-2 justify-content-between mt-3">
                    <button
                      className="btn btn-success"
                      type="button"
                      data-bs-toggle="modal"
                      data-bs-target="#exampleModalthree"
                      onClick={() => handleEdit(item)}
                    >
                      Edit
                    </button>
                    <button
                      className="btn cardbutton"
                      type="button"
                      data-bs-toggle="modal"
                      data-bs-target="#handleDeleteModel"
                      onClick={() => {
                        setDeletingData(item);
                        setfeedback({
                          feedbackCnt: "",
                          mobNum: "",
                        });
                        setRating(0)
                        setHover(0)
                      }}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))
      ) : (
        <div className="card vh-100 m-2">
          <div className="card-body h-25 row align-items-center justify-content-center w-100">
            <div className="col-4 text-center">
              <img
                src={publicUrl + "assets/img/2953962.jpg"}
                height={"250px"}
                alt="no data image"
                className="w-100"
              />
            </div>
          </div>
        </div>
      )
    )
      :
      <div className="row w-100 justify-content-center align-items-center spinner-miin-height">
        <div className="col-3 text-center">
          <div class="spinner-border text-info" role="status">
            <span class="visually-hidden">Loading...</span>
          </div>
          <p className="mt-2 text-info">Loading...</p>
        </div>
      </div>;
  };

  const renderBuyandSell = () => {
    return (
      <div className="container mb-3">
        <div className="row row-cols-1 row-cols-md-3 g-4">
          {!gettingDetails ? (
            data.length > 0 ? (
              data.map((card) => (
                <div className="col" key={card.buy_sell_id}>
                  <div className="card card h-100 shadow truckcard">
                    <span className="object-fit-fill rounded justify-content-center d-flex">
                      <img
                        className="m-3 rounded-3 justify-content-center d-flex"
                        src={
                          card.images !== undefined
                            ? card.images.length > 0
                              ? card.images[0]
                              : ""
                            : ""
                        }
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
                          <div className="col-8 col-md-8 text-start ps-0">
                            <h5 className="card-title text-wrap">
                              {card.brand} {card.model}
                            </h5>
                          </div>
                          <div className="col-4 col-md-4 text-end .fs-6 pe-0">
                            <p className=".fs-6 reviewtext">
                              (12)
                              <span className="float-right">
                                <i className="text-warning fa fa-star"></i>
                              </span>
                              <span className="float-right">
                                <i className="text-warning fa fa-star"></i>
                              </span>
                              <span className="float-right">
                                <i className="text-warning fa fa-star"></i>
                              </span>
                              <span className="float-right">
                                <i className="text-warning fa fa-star"></i>
                              </span>
                              <span className="float-right">
                                <i className="text-warning fa fa-star"></i>
                              </span>
                            </p>
                          </div>
                        </div>
                      </div>
                      <div>
                        <label>
                          <FaLocationDot className="me-2 text-danger" />
                          {card.location}
                        </label>
                      </div>
                      <div>
                        <div className="row">
                          <div className="col-6 col-md-6">
                            <FaUserAlt className="me-2" />
                            {card.owner_name}
                          </div>
                          <div className="col-6 col-md-6">
                            <FaTruckFast className="me-2" />
                            {card.vehicle_number}
                          </div>
                          <div className="col-6 col-md-6">
                            <BsFillCalendar2DateFill className="me-2" />
                            {card.model}
                          </div>
                          <div className="col-6 col-md-6">
                            <RiPinDistanceFill className="me-2" />
                            {card.kms_driven} kms
                          </div>
                        </div>
                      </div>

                      <div className="d-flex gap-2 justify-content-between mt-3">
                        <button
                          type="button"
                          className="btn btn-danger"
                          data-bs-toggle="modal"
                          data-bs-target="#buyAndSellModal"
                          onClick={() => {
                            handleEdit(card);
                            SetSelectedFile([]);
                          }}
                        >
                          Edit
                        </button>
                        <button
                          className="btn cardbutton"
                          type="button"
                          data-bs-toggle="modal"
                          data-bs-target="#handleDeleteModel"
                          onClick={() => {
                            setDeletingData(card);
                            setfeedback({
                              feedbackCnt: "",
                              mobNum: "",
                            });
                            setRating(0)
                            setHover(0)
                          }}
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="card vh-100 m-2 w-100">
                <div className="card-body h-25 row align-items-center justify-content-center w-100">
                  <div className="col-4 text-center">
                    <img
                      src={publicUrl + "assets/img/2953962.jpg"}
                      height={"250px"}
                      alt="no data image"
                      className="w-100"
                    />
                  </div>
                </div>
              </div>
            )
          )
            :
            <div className="row w-100 justify-content-center align-items-center spinner-miin-height">
              <div className="col-3 text-center">
                <div class="spinner-border text-info" role="status">
                  <span class="visually-hidden">Loading...</span>
                </div>
                <p className="mt-2 text-info">Loading...</p>
              </div>
            </div>}
        </div>
      </div>
    );
  };

  const renderTabContent = () => {
    const getPath = window.location.pathname;
    switch (getPath) {
      case "/wishlist/load":
        return <div className="row">{renderLoadCard()}</div>;
      case "/wishlist/truck":
        return <div className="row">{renderTruckCard()}</div>;
      case "/wishlist/driver":
        return <div className="row">{renderDriverCard()}</div>;
      case "/wishlist/buy_sell":
        return <div className="row">{renderBuyandSell()}</div>;
      default:
        return null;
    }
  }

  const getWhishlistData = (tabEndpoint) => {
    setData([]);
    setGettingDetails(true);
    const getUser = Cookies.get("usrin");
    if (getUser) {
      const data = {
        user_id: window.atob(getUser),
      };
      try {
        axios
          .post(`https://truck.truckmessage.com/${tabEndpoint}`, data)
          .then((response) => {
            if (response.data.success && Array.isArray(response.data.data)) {
              setData(response.data.data);
              setGettingDetails(false);
            } else {
              console.error("Unexpected response format:", response.data);
              setGettingDetails(false);
            }
          })
          .catch((error) => {
            console.error("There was an error fetching the data!", error);
            setGettingDetails(false);
          });
      } catch (err) {
        toast.error(err);
      }
    } else {
      toast.error("plaese login to get data");
    }
  };

  return (
    <div className="container">
      <ul className="nav nav-tabs">
        <li className="nav-item">
          <NavLink
            to="/wishlist/load"
            className={"nav-link"}
            onClick={() => getWhishlistData("user_load_details")}
          >
            Load availability post
          </NavLink>
        </li>
        <li className="nav-item">
          <NavLink
            to="/wishlist/truck"
            className={"nav-link"}
            onClick={() => getWhishlistData("user_truck_details")}
          >
            Truck availability post
          </NavLink>
        </li>
        <li className="nav-item">
          <NavLink
            to="/wishlist/driver"
            className={"nav-link"}
            onClick={() => getWhishlistData("user_driver_details")}
          >
            Driver availability post
          </NavLink>
        </li>
        <li className="nav-item">
          <NavLink
            to="/wishlist/buy_sell"
            className={"nav-link"}
            onClick={() => getWhishlistData("user_buy_sell_details")}
          >
            Buy & Sell Post
          </NavLink>
        </li>
      </ul>
      <div className="tab-content mt-3">{renderTabContent()}</div>

      {/* Modal 01 */}
      <div
        className="modal fade"
        id="exampleModal"
        tabindex="-1"
        aria-labelledby="exampleModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-dialog-centered modal-dialog-scrollable modal-lg">
          <div className="modal-content">
            <div className="modal-header">
              <h1 className="modal-title fs-5" id="exampleModalLabel">
                Edit
              </h1>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
                id="closeModelOne"
              ></button>
            </div>
            <div className="modal-body">
              <div className="ltn__appointment-inner">
                <div className="row">
                  <div className="col-12 col-md-6">
                    <h6>Company Name</h6>
                    <div className="input-item input-item-name">
                      <input
                        type="text"
                        name="company_name"
                        placeholder="Name of the Owner"
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
                </div>
                <div className="row">
                  <div className="col-12 col-md-6">
                    <h6>From</h6>
                    <div className="input-item input-item-name">
                      <Autocomplete
                        name="from_location"
                        className="google-location location-input bg-transparent py-2"
                        apiKey="AIzaSyA09V2FtRwNpWu7Xh8hc7nf-HOqO7rbFqw"
                        onPlaceSelected={(place) => {
                          if (place) {
                            handleFromLocation(place.address_components);
                          }
                        }}
                        required
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
                        apiKey="AIzaSyA09V2FtRwNpWu7Xh8hc7nf-HOqO7rbFqw"
                        onPlaceSelected={(place) => {
                          if (place) {
                            handleToLocation(place.address_components);
                          }
                        }}
                        required
                        value={showingToLocation}
                        onChange={(e) => setShowingToLocation(e.target.value)}
                      />
                    </div>
                  </div>
                </div>
                <div className="row">
                  <div className="col-12 col-md-6">
                    <h6>Material</h6>
                    <div className="input-item input-item-name">
                      <input
                        type="text"
                        name="material"
                        placeholder="What type of material"
                        value={editingData.material}
                        onChange={(e) =>
                          setEditingData({
                            ...editingData,
                            material: e.target.value,
                          })
                        }
                        required
                      />
                    </div>
                  </div>
                  <div className="col-12 col-md-6">
                    <h6>Ton</h6>
                    <div className="input-item input-item-name">
                      <input
                        type="text"
                        name="tone"
                        placeholder="Example: 2 tones"
                        value={editingData.tone}
                        onChange={(e) =>
                          setEditingData({
                            ...editingData,
                            tone: e.target.value,
                          })
                        }
                        required
                      />
                    </div>
                  </div>
                  <div className="col-12 col-md-6">
                    <h6>Truck Body Type</h6>

                    <button type="button" class="btn btn-transparent dropdown-toggle col-12 py-3 dropdown-arrow shadow-none border rounded text-start p-3" data-bs-toggle="dropdown" aria-expanded="false">
                      {editingData.truck_body_type === '' ? 'select truck body type' : `${editingData.truck_body_type} `}
                    </button>
                    <ul class="dropdown-menu  cup shadow-0 col-11 dropdown-ul">
                      <li onClick={() => setEditingData({ ...editingData, truck_body_type: 'open_body' })} className="cup mt-0 py-2 dropdown-list-hover"><a class="dropdown-item text-decoration-none">open_body</a></li>
                      <li onClick={() => setEditingData({ ...editingData, truck_body_type: 'Container' })} className="cup mt-0 py-2 dropdown-list-hover"><a class="dropdown-item text-decoration-none">Container</a></li>
                      <li onClick={() => setEditingData({ ...editingData, truck_body_type: 'trailer' })} className="cup mt-0 py-2 dropdown-list-hover"><a class="dropdown-item text-decoration-none">trailer</a></li>
                      <li onClick={() => setEditingData({ ...editingData, truck_body_type: 'tanker' })} className="cup mt-0 py-2 dropdown-list-hover"><a class="dropdown-item text-decoration-none">tanker</a></li>
                    </ul>
                  </div>

                  <div className="col-12 col-md-6 p-0 m-0">
                    <h6>No. of Tyres</h6>
                    <button type="button" class="btn btn-transparent dropdown-toggle col-12 py-3 dropdown-arrow shadow-none border rounded text-start p-3" data-bs-toggle="dropdown" aria-expanded="false">
                      {editingData.no_of_tyres === '' ? 'select no of tyres' : `${editingData.no_of_tyres} `}
                    </button>
                    <ul class="dropdown-menu  cup shadow-0 col-11 dropdown-ul">
                      <li onClick={() => setEditingData({ ...editingData, no_of_tyres: 4 })} className="cup mt-0 py-2 dropdown-list-hover"><a class="dropdown-item text-decoration-none">4</a></li>
                      <li onClick={() => setEditingData({ ...editingData, no_of_tyres: 6 })} className="cup mt-0 py-2 dropdown-list-hover"><a class="dropdown-item text-decoration-none">6</a></li>
                      <li onClick={() => setEditingData({ ...editingData, no_of_tyres: 10 })} className="cup mt-0 py-2 dropdown-list-hover"><a class="dropdown-item text-decoration-none">10</a></li>
                      <li onClick={() => setEditingData({ ...editingData, no_of_tyres: 12 })} className="cup mt-0 py-2 dropdown-list-hover"><a class="dropdown-item text-decoration-none">12</a></li>
                      <li onClick={() => setEditingData({ ...editingData, no_of_tyres: 14 })} className="cup mt-0 py-2 dropdown-list-hover"><a class="dropdown-item text-decoration-none">14</a></li>
                      <li onClick={() => setEditingData({ ...editingData, no_of_tyres: 16 })} className="cup mt-0 py-2 dropdown-list-hover"><a class="dropdown-item text-decoration-none">16</a></li>
                      <li onClick={() => setEditingData({ ...editingData, no_of_tyres: 18 })} className="cup mt-0 py-2 dropdown-list-hover"><a class="dropdown-item text-decoration-none">18</a></li>
                      <li onClick={() => setEditingData({ ...editingData, no_of_tyres: 20 })} className="cup mt-0 py-2 dropdown-list-hover"><a class="dropdown-item text-decoration-none">20</a></li>
                      <li onClick={() => setEditingData({ ...editingData, no_of_tyres: 22 })} className="cup mt-0 py-2 dropdown-list-hover"><a class="dropdown-item text-decoration-none">22</a></li>

                    </ul>
                  </div>
                  <div className="col-12 mt-3">
                    <h6>Descriptions </h6>
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
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary col-12 col-md-3"
                data-bs-dismiss="modal"
              >
                Close
              </button>
              <button
                type="button"
                className="btn btn-primary col-12 col-md-3"
                onClick={handleChooseUpdate}
              >
                Save changes
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Modal 02 */}
      <div
        className="modal fade"
        id="exampleModaltwo"
        tabindex="-1"
        aria-labelledby="exampleModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-dialog-centered modal-dialog-scrollable modal-lg">
          <div className="modal-content">
            <div className="modal-header">
              <h1 className="modal-title fs-5" id="exampleModalLabel">
                Edit Truck              </h1>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
                id="closeModelTwo"
              ></button>
            </div>

            <div className="modal-body">
              <div className="ltn__appointment-inner">
                <div className="row">

                  <div className="col-12 col-md-6">
                    <h6>Vehicle Number</h6>
                    <div className="input-item input-item-email">
                      <input
                        type="tel"
                        name="contact_no"
                        placeholder="Type your contact number"
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
                    <h6>Owner Name</h6>
                    <div className="input-item input-item-name">
                      <input
                        type="text"
                        name="company_name"
                        placeholder="Name of the Owner"
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
                    <h6>Name of the transport</h6>
                    <div className="input-item input-item-name ">
                      <input type="text" name="name_of_the_transport" placeholder="Enter name of the transport"
                        value={editingData.name_of_the_transport}
                        onChange={(e) =>
                          setEditingData({
                            ...editingData,
                            name_of_the_transport: e.target.value,
                          })
                        }
                        required />
                    </div>
                  </div>

                  <div className="col-12 col-md-6">
                    <h6>Ton</h6>
                    <div className="input-item input-item-name ">
                      <input type="number" name="tone" placeholder="Example: 2 tons"
                        value={editingData.tone}
                        onChange={(e) =>
                          setEditingData({
                            ...editingData,
                            tone: e.target.value,
                          })
                        }
                        required />
                    </div>
                  </div>

                  <div className="col-12 col-md-6">
                    <h6>Truck name</h6>
                    <button type="button" class="btn btn-transparent dropdown-toggle col-12 py-3 dropdown-arrow shadow-none border rounded text-start p-3" data-bs-toggle="dropdown" aria-expanded="false">
                      {editingData.truck_brand_name === '' ? 'select truck' : `${editingData.truck_brand_name} `}
                    </button>
                    <ul class="dropdown-menu  cup shadow-0 col-11 dropdown-ul">
                      <li onClick={() => setEditingData({ ...editingData, truck_brand_name: 'ashok_leyland' })} className="cup mt-0 py-2 dropdown-list-hover"><a class="dropdown-item text-decoration-none">Ashok_leyland</a></li>
                      <li onClick={() => setEditingData({ ...editingData, truck_brand_name: 'tata' })} className="cup mt-0 py-2 dropdown-list-hover"><a class="dropdown-item text-decoration-none">Tata</a></li>
                      <li onClick={() => setEditingData({ ...editingData, truck_brand_name: 'mahindra' })} className="cup mt-0 py-2 dropdown-list-hover"><a class="dropdown-item text-decoration-none">Mahindra</a></li>
                      <li onClick={() => setEditingData({ ...editingData, truck_brand_name: 'eicher' })} className="cup mt-0 py-2 dropdown-list-hover"><a class="dropdown-item text-decoration-none">Eicher</a></li>
                      <li onClick={() => setEditingData({ ...editingData, truck_brand_name: 'daimler_india' })} className="cup mt-0 py-2 dropdown-list-hover"><a class="dropdown-item text-decoration-none">Daimler_india</a></li>
                      <li onClick={() => setEditingData({ ...editingData, truck_brand_name: 'bharat_benz' })} className="cup mt-0 py-2 dropdown-list-hover"><a class="dropdown-item text-decoration-none">Bharat_benz</a></li>
                      <li onClick={() => setEditingData({ ...editingData, truck_brand_name: 'maruthi_suzuki' })} className="cup mt-0 py-2 dropdown-list-hover"><a class="dropdown-item text-decoration-none">Maruthi_suzuki</a></li>
                      <li onClick={() => setEditingData({ ...editingData, truck_brand_name: 'sml_isuzu' })} className="cup mt-0 py-2 dropdown-list-hover"><a class="dropdown-item text-decoration-none">Sml_isuzu</a></li >
                      <li onClick={() => setEditingData({ ...editingData, truck_brand_name: 'force' })} className="cup mt-0 py-2 dropdown-list-hover"><a class="dropdown-item text-decoration-none">Force</a></li >
                      <li onClick={() => setEditingData({ ...editingData, truck_brand_name: 'amw' })} className="cup mt-0 py-2 dropdown-list-hover"><a class="dropdown-item text-decoration-none">Amw</a></li >
                      <li onClick={() => setEditingData({ ...editingData, truck_brand_name: 'man' })} className="cup mt-0 py-2 dropdown-list-hover"><a class="dropdown-item text-decoration-none">Man</a></li >
                      <li onClick={() => setEditingData({ ...editingData, truck_brand_name: 'scania' })} className="cup mt-0 py-2 dropdown-list-hover"><a class="dropdown-item text-decoration-none">Scania</a></li >
                      <li onClick={() => setEditingData({ ...editingData, truck_brand_name: 'volvo' })} className="cup mt-0 py-2 dropdown-list-hover"><a class="dropdown-item text-decoration-none">Volvo</a></li >
                      <li onClick={() => setEditingData({ ...editingData, truck_brand_name: 'others' })} className="cup mt-0 py-2 dropdown-list-hover"><a class="dropdown-item text-decoration-none">Others</a></li >
                    </ul >
                  </div>

                  <div className="col-12 col-md-6">
                    <h6>From</h6>
                    <div className="input-item input-item-name">
                      <Autocomplete
                        name="from_location"
                        className="google-location location-input bg-transparent py-2"
                        apiKey="AIzaSyA09V2FtRwNpWu7Xh8hc7nf-HOqO7rbFqw"
                        onPlaceSelected={(place) => {
                          if (place) {
                            handleFromLocation(place.address_components);
                          }
                        }}
                        required
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
                        apiKey="AIzaSyA09V2FtRwNpWu7Xh8hc7nf-HOqO7rbFqw"
                        onPlaceSelected={(place) => {
                          if (place) {
                            handleToLocation(place.address_components);
                          }
                        }}
                        required
                        value={showingToLocation}
                        onChange={(e) => setShowingToLocation(e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="col-12 col-md-6">
                    <h6>Truck Body Type</h6>

                    <button type="button" class="btn btn-transparent dropdown-toggle col-12 py-3 dropdown-arrow shadow-none border rounded text-start p-3" data-bs-toggle="dropdown" aria-expanded="false">
                      {editingData.truck_body_type === '' ? 'select truck body type' : `${editingData.truck_body_type} `}
                    </button>
                    <ul class="dropdown-menu  cup shadow-0 col-11 dropdown-ul">
                      <li onClick={() => setEditingData({ ...editingData, truck_body_type: 'open_body' })} className="cup mt-0 py-2 dropdown-list-hover"><a class="dropdown-item text-decoration-none">open_body</a></li>
                      <li onClick={() => setEditingData({ ...editingData, truck_body_type: 'Container' })} className="cup mt-0 py-2 dropdown-list-hover"><a class="dropdown-item text-decoration-none">Container</a></li>
                      <li onClick={() => setEditingData({ ...editingData, truck_body_type: 'lcv' })} className="cup mt-0 py-2 dropdown-list-hover"><a class="dropdown-item text-decoration-none">lcv</a></li>
                      <li onClick={() => setEditingData({ ...editingData, truck_body_type: 'tipper' })} className="cup mt-0 py-2 dropdown-list-hover"><a class="dropdown-item text-decoration-none">tipper</a></li>
                      <li onClick={() => setEditingData({ ...editingData, truck_body_type: 'trailer' })} className="cup mt-0 py-2 dropdown-list-hover"><a class="dropdown-item text-decoration-none">trailer</a></li>
                      <li onClick={() => setEditingData({ ...editingData, truck_body_type: 'tanker' })} className="cup mt-0 py-2 dropdown-list-hover"><a class="dropdown-item text-decoration-none">tanker</a></li>
                    </ul>
                  </div>

                  <div className="col-12 col-md-6 p-0 m-0">
                    <h6>No. of Tyres</h6>
                    <button type="button" class="btn btn-transparent dropdown-toggle col-12 py-3 dropdown-arrow shadow-none border rounded text-start p-3" data-bs-toggle="dropdown" aria-expanded="false">
                      {editingData.no_of_tyres === '' ? 'select no of tyres' : `${editingData.no_of_tyres} `}
                    </button>
                    <ul class="dropdown-menu  cup shadow-0 col-11 dropdown-ul">
                      <li onClick={() => setEditingData({ ...editingData, no_of_tyres: 4 })} className="cup mt-0 py-2 dropdown-list-hover"><a class="dropdown-item text-decoration-none">4</a></li>
                      <li onClick={() => setEditingData({ ...editingData, no_of_tyres: 6 })} className="cup mt-0 py-2 dropdown-list-hover"><a class="dropdown-item text-decoration-none">6</a></li>
                      <li onClick={() => setEditingData({ ...editingData, no_of_tyres: 10 })} className="cup mt-0 py-2 dropdown-list-hover"><a class="dropdown-item text-decoration-none">10</a></li>
                      <li onClick={() => setEditingData({ ...editingData, no_of_tyres: 12 })} className="cup mt-0 py-2 dropdown-list-hover"><a class="dropdown-item text-decoration-none">12</a></li>
                      <li onClick={() => setEditingData({ ...editingData, no_of_tyres: 14 })} className="cup mt-0 py-2 dropdown-list-hover"><a class="dropdown-item text-decoration-none">14</a></li>
                      <li onClick={() => setEditingData({ ...editingData, no_of_tyres: 16 })} className="cup mt-0 py-2 dropdown-list-hover"><a class="dropdown-item text-decoration-none">16</a></li>
                      <li onClick={() => setEditingData({ ...editingData, no_of_tyres: 18 })} className="cup mt-0 py-2 dropdown-list-hover"><a class="dropdown-item text-decoration-none">18</a></li>
                      <li onClick={() => setEditingData({ ...editingData, no_of_tyres: 20 })} className="cup mt-0 py-2 dropdown-list-hover"><a class="dropdown-item text-decoration-none">20</a></li>
                      <li onClick={() => setEditingData({ ...editingData, no_of_tyres: 22 })} className="cup mt-0 py-2 dropdown-list-hover"><a class="dropdown-item text-decoration-none">22</a></li>

                    </ul>
                  </div>

                  <div className="col-12 mt-3">
                    <h6>Descriptions </h6>
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
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary col-12 col-md-3"
                data-bs-dismiss="modal"
              >
                Close
              </button>
              <button
                type="button"
                className="btn btn-primary col-12 col-md-3"
                onClick={handleChooseUpdate}
              >
                Save changes
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Modal 03 */}
      <div
        className="modal fade"
        id="exampleModalthree"
        tabindex="-1"
        aria-labelledby="exampleModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-dialog-centered modal-dialog-scrollable modal-lg">
          <div className="modal-content">
            <div className="modal-header">
              <h1 className="modal-title fs-5" id="exampleModalLabel">
                Edit
              </h1>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
                id="closeModelThree"
              ></button>
            </div>
            <div className="modal-body">
              <div className="ltn__appointment-inner">
                <div className="row gy-4">
                  <div className="col-12 col-md-6">
                    <h6>Vehicle Number</h6>
                    <div className="input-item input-item-email">
                      <input
                        type="tel"
                        name="contact_no"
                        className="mb-0"
                        placeholder="Type your Vehicle Number"
                        value={driverDetailsEditingData.vehicle_number}
                        onChange={(e) =>
                          setDriverDetailsEditingData({
                            ...driverDetailsEditingData,
                            vehicle_number: e.target.value,
                          })
                        }
                        required
                      />
                    </div>
                  </div>

                  <div className="col-12 col-md-6">
                    <h6>Driver Name</h6>
                    <div className="input-item input-item-name">
                      <input
                        type="text"
                        className="mb-0"
                        name="driver_name"
                        placeholder="Name of the driver"
                        value={driverDetailsEditingData.driver_name}
                        onChange={(e) =>
                          setDriverDetailsEditingData({
                            ...driverDetailsEditingData,
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
                        value={driverDetailsEditingData.company_name}
                        onChange={(e) =>
                          setDriverDetailsEditingData({
                            ...driverDetailsEditingData,
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
                        value={driverDetailsEditingData.contact_no}
                        onChange={(e) =>
                          setDriverDetailsEditingData({
                            ...driverDetailsEditingData,
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
                      <Autocomplete name="from_location"
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
                      <Autocomplete name="to_location"
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
                    <button type="button" class="btn btn-transparent shadow-none border dropdown-toggle col-12 py-3 dropdown-arrow text-start" data-bs-toggle="dropdown" aria-expanded="false">
                      {driverDetailsEditingData.truck_body_type === '' ? 'select body type' : `${driverDetailsEditingData.truck_body_type}`}
                    </button>
                    <ul class="dropdown-menu col-11 dropdown-ul">
                      {
                        truckBodyType.map((bodyType) => {
                          return <li onClick={() => setDriverDetailsEditingData({
                            ...driverDetailsEditingData, truck_body_type: bodyType,
                          })} className="cup mt-0 py-2 dropdown-list-hover"><a class="dropdown-item text-decoration-none">{bodyType}</a></li>
                        })
                      }
                    </ul >
                  </div>

                  <div className="col-12 col-md-6 m-0">
                    <h6>No. of Tyres</h6>
                    <button type="button" class="btn btn-transparent shadow-none border dropdown-toggle col-12 py-3 dropdown-arrow text-start" data-bs-toggle="dropdown" aria-expanded="false">
                      {driverDetailsEditingData.no_of_tyres === '' ? 'select number of tyres' : `${driverDetailsEditingData.no_of_tyres}`}
                    </button>
                    <ul class="dropdown-menu col-11 dropdown-ul">
                      {
                        numOfTyres.map((numOfTyres) => {
                          return <li onClick={() => setDriverDetailsEditingData({
                            ...driverDetailsEditingData, no_of_tyres: numOfTyres,
                          })} className="cup mt-0 py-2 dropdown-list-hover"><a class="dropdown-item text-decoration-none">{numOfTyres}</a></li>
                        })
                      }
                    </ul >
                  </div>

                  <div className="col-12 col-md-12">
                    <h6>Descriptions </h6>
                    <div className="input-item input-item-textarea ltn__custom-icon">
                      <textarea name="description" placeholder="Enter a text here" value={driverDetailsEditingData.description} onChange={(e) => setDriverDetailsEditingData({
                        ...driverDetailsEditingData, description: e.target.value
                      })} />
                    </div>
                  </div>
                </div>
                <div className="modal-footer btn-wrapper text-center mt-4">
                  <button className="btn btn-primary text-uppercase" type="button" onClick={handleChooseUpdate}>Submit</button>
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary col-12 col-md-3"
                data-bs-dismiss="modal"
              >
                Close
              </button>
              <button
                type="button"
                className="btn btn-primary col-12 col-md-3"
                onClick={handleChooseUpdate}
              >
                Save changes
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* modal 4 */}
      <div
        className="modal fade"
        id="buyAndSellModal"
        data-bs-backdrop="static"
        data-bs-keyboard="false"
        tabIndex="-1"
        aria-labelledby="staticBackdropLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-dialog-centered modal-dialog-scrollable modal-lg">
          <div className="modal-content">
            <div className="modal-header">
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
                id="clodeBuySellModel"
              ></button>
            </div>
            <div className="modal-body">
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
                      {editingData.brand === '' ? 'select model' : `${editingData.brand}`}
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
                        className="w-100 py-3"
                        placeholder="Type Kms driven"
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
                        className="w-100 py-3"
                        placeholder="Enter your Price here..."
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

                  <div className="col-12 col-md-6 m-0">
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

                  <div className="col-12 col-md-6 m-0">
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
                        value={showingBuyAndSellLocation}
                        onChange={(e) =>
                          setShowingBuyAndSellLocation(e.target.value)
                        }
                      />
                    </div>
                  </div>

                  <div className="col-12 col-md-6">
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

                  <div className="col-12 col-md-6 ">
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
                    <h6>Descriptions </h6>
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
                  <button
                    type="button"
                    className="btn btn-secondary col-12 col-md-3"
                    data-bs-dismiss="modal"
                  >
                    Close
                  </button>
                  <button
                    type="button"
                    className="btn btn-primary col-12 col-md-3"
                    onClick={handleBuyAndSellUpdate}
                  >
                    Save changes
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* delete model  */}
      <div
        className="modal fade"
        id="handleDeleteModel"
        data-bs-backdrop="static"
        data-bs-keyboard="false"
        tabindex="-1"
        aria-labelledby="staticBackdropLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="staticBackdropLabel">
                Delete
              </h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                id="deleteCloseModel"
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body">
              <p></p>
              <div className="row">
                <div className="col-7">
                  <p>Did you get leads using this platform</p>
                </div>
                <div className="col-5 row">
                  <div className="form-check col-6">
                    <input
                      className="form-check-input"
                      type="radio"
                      name="flexRadioDefault"
                      value="YES"
                      id="radioYes"
                      onChange={(e) => setFeedbackRadio(e.target.value)}
                      checked={feedbackRadio === "YES"}
                    />
                    <label className="form-check-label" htmlFor="radioYes">
                      Yes
                    </label>
                  </div>
                  <div className="form-check col-6">
                    <input
                      className="form-check-input"
                      type="radio"
                      name="flexRadioDefault"
                      value="NO"
                      id="radioNo"
                      onChange={(e) => setFeedbackRadio(e.target.value)}
                      checked={feedbackRadio === "NO"}
                    />
                    <label className="form-check-label" htmlFor="radioNo">
                      No
                    </label>
                  </div>
                </div>
                {feedbackRadio === "NO" ? (
                  <div className="col-12">
                    <div className="mb-3">
                      <label
                        htmlFor="feedbackModelTextarea"
                        className="form-label"
                      >
                        Feedback
                      </label>
                      <textarea
                        className="form-control"
                        id="feedbackModelTextarea"
                        rows="6"
                        value={feedback.feedbackCnt}
                        onChange={(e) =>
                          setfeedback({
                            ...feedback,
                            feedbackCnt: e.target.value,
                          })
                        }
                      ></textarea>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="mb-4">
                      <label
                        htmlFor="feedbackModelMobilenumber"
                        className="form-label"
                      >
                        Phone number
                      </label>
                      <input
                        type="number"
                        className="form-control m-0"
                        id="feedbackModelMobilenumber"
                        placeholder="Enter your mobile number"
                        value={feedback.mobNum}
                        onChange={(e) =>
                          setfeedback({ ...feedback, mobNum: e.target.value })
                        }
                      />
                    </div>

                    <div className="mb-3 row align-items-center">
                      <div className="col-2">
                        <h6 className="mb-0">Ratings</h6>
                      </div>
                      <div className="col-10 row p-0">
                        {[...Array(5)].map((star, i) => {
                          const ratingsValue = i + 1;
                          return (
                            <label className="ratingLabel">
                              <input type="radio" name="rating" className="ratingInput" value={ratingsValue} onClick={() => setRating(ratingsValue)} />
                              <FaStar
                                className="star"
                                color={ratingsValue <= (feedbackHover || feedbackRating) ? "#ffc107" : "#e4e5e9"}
                                size={25}
                                onMouseEnter={() => setHover(ratingsValue)}
                                onMouseLeave={() => setHover(0)}
                              />
                            </label>
                          )
                        })
                        }

                      </div>
                    </div>
                  </>
                )}
              </div>


            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary col-12 col-md-3"
                data-bs-dismiss="modal"
              >
                Close
              </button>
              <button
                type="button"
                className="btn btn-primary col-12 col-md-3"
                onClick={handleSubmitFeedback}
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      </div>
    </div >
  );
};

export default WishList;
