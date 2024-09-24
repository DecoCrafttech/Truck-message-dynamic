import React, { useEffect, useState } from 'react';
import { TbCircleFilled } from "react-icons/tb";
import { MdDeleteOutline } from "react-icons/md";
import { FaRegCalendarAlt } from "react-icons/fa";
import { GrMapLocation, GrLocation } from "react-icons/gr";
import { IoCallOutline } from "react-icons/io5";
import { FaUsersGear } from "react-icons/fa6";
import axios from 'axios';
import Cookies from 'js-cookie';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import Select from 'react-dropdown-select';
import { statesData } from '../../cityAndState';

const MyAccount = () => {
  const [profileData, setProfileData] = useState(null);
  const [category, setCategory] = useState('')
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [vehicleData, setVehicleData] = useState([]);
  const [newVehicleNumber, setNewVehicleNumber] = useState('');
  const [selectedVehicleDetails, setSelectedVehicleDetails] = useState({});
  const [vehicleToDelete, setVehicleToDelete] = useState(null);
  const [editProfile, setEditProfile] = useState({});
  const [image, setImage] = useState("");
  const [updateImage, setUpdateImage] = useState("");
  const [pageRefresh, setPageRefresh] = useState(false);
  const [deletionOperatingStates, setDeletionOperatingStates] = useState([]);


  const [operatingStates, setOperatingStates] = useState([])
  const [operatingStatesDupli, setOperatingStatesDupli] = useState([])
  const [operatingStatesUi, setOperatingStatesUi] = useState([])

  const [operatingStateString, setoperatingStateString] = useState('')
  const [operatingStateStringdupli, setoperatingStateStringdupli] = useState('')
  const [checked, setChecked] = useState(false)
  const [stateCitySelectedData, setstateCitySelectedData] = useState([])

  const LoginDetails = useSelector((state) => state.login);
  const pageRender = useNavigate();

  useEffect(() => {
    if (!Cookies.get("usrin")) {
      pageRender('/');
    }
  }, [LoginDetails.isLoggedIn]);

  useEffect(() => {
    fetchUserProfile();
    window.scrollTo(0, 0)
  }, [pageRefresh]);

  useEffect(() => {
    if (operatingStateStringdupli !== '') {
      operatingStates[operatingStates.length] = operatingStateStringdupli
      setOperatingStates(operatingStates)
      setoperatingStateString("")
      setoperatingStateStringdupli("")
    }
  }, [operatingStateStringdupli])

  const handleGetOperatingStates = async () => {
    try {
      const data = {
        user_id: Cookies.get("usrin") ? window.atob(Cookies.get("usrin")) : ''
      }

      const res = await axios.post("https://truck.truckmessage.com/get_user_state_list", data)
      if (res.data.error_code === 0) {
        if (res.data.data[0].state_list.length > 0) {
          if (res.data.data[0].state_list[0] === "All state and cities" && res.data.data[0].state_list.length === 1) {
            setChecked(true)
          } else {
            setChecked(false)
          }
        }
        const updateOperatingStatesUi = statesData.filter((v) => res.data.data[0].state_list.includes(v.label))
        setOperatingStatesUi(res.data.data[0].state_list)
        setOperatingStates(updateOperatingStatesUi)
        setOperatingStatesDupli(updateOperatingStatesUi)
      }
    } catch (err) {
      console.log(err)
    }
  }

  const handleFromLocation = (selectedLocation) => {
    if (selectedLocation) {
      const cityComponent = selectedLocation.find(component => component.types.includes('locality'));
      const stateComponent = selectedLocation.find(component => component.types.includes('administrative_area_level_1'));

      if (cityComponent && stateComponent) {
        setoperatingStateStringdupli(`${cityComponent.long_name}, ${stateComponent.long_name}`)
        setoperatingStateString(`${cityComponent.long_name}, ${stateComponent.long_name}`)
      }
    }
  };



  const handleDeleteOperatingState = async (deletingValue) => {
    const encodedUserId = Cookies.get("usrin");
    if (encodedUserId) {
      const userId = window.atob(encodedUserId);
      const spreadOperatingstatesForDelete = operatingStatesDupli.map((v) => v.label)

      const data = {
        user_id: userId,
        state_name: [...spreadOperatingstatesForDelete]
      }

      try {
        const res = await axios.post("https://truck.truckmessage.com/remove_user_state_list", data);

        if (res.data.error_code === 0) {
          handleGetOperatingStates()

          document.getElementById("closeOperatingStatesModel").click()
        }
      } catch (err) {
        console.log(err)
      }
    }

  }



  const handleCheckbox = async (e) => {
    setChecked(e.target.checked)

    if (operatingStates.length > 0) {
      const encodedUserId = Cookies.get("usrin");
      if (encodedUserId) {
        const userId = window.atob(encodedUserId);

        const removedata = {
          user_id: userId,
          state_name: operatingStates
        }

        const res = await axios.post("https://truck.truckmessage.com/remove_user_state_list", removedata);

        if (res.data.error_code === 0) {
          setOperatingStates([])
        }
      }
    }
  }

  const fetchUserProfile = async () => {
    handleGetOperatingStates()
    try {
      const encodedUserId = Cookies.get("usrin");
      if (encodedUserId) {
        const userId = window.atob(encodedUserId);

        await axios.post('https://truck.truckmessage.com/get_user_profile', {
          user_id: userId,
        })
          .then(response => {
            console.log(response.data);
            setProfileData(response.data.data);
            setVehicleData(response.data.data[0].vehicle_data)
            setEditProfile(response.data.data[1])
            setCategory(response.data.data[1].category)
            setLoading(false);
          })
          .catch(error => {
            setError(error);
            setLoading(false);
          });
      } else {
        setError("User ID not found in cookies");
        setLoading(false);
      }
    } catch (err) {
      console.log(err)
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error fetching data: {error.message}</p>;
  if (!profileData || profileData.length < 2) return <p>No data available.</p>;

  const userProfile = profileData[1];

  const handleAddVehicle = () => {
    const encodedUserId = Cookies.get("usrin");

    if (vehicleData.length <= 10) {
      if (encodedUserId) {
        const userId = window.atob(encodedUserId);

        axios.post('https://truck.truckmessage.com/add_user_vehicle_details', {
          user_id: userId,
          vehicle_no: newVehicleNumber,
        })
          .then(response => {
            if (response.data.success) {
              setNewVehicleNumber('');
              fetchUserProfile();
              document.getElementById('closeModalButton').click();
              toast.success('Vehicle added successfully!');
            } else {
              toast.error('Failed to add vehicle');
            }
          })
          .catch(error => {
            toast.error('Error adding vehicle: ' + error.message);
          });
      } else {
        toast.error('User ID not found in cookies.');
      }
    } else {
      toast.error("You can't add more than 10 vehicles.");
    }
  };

  const handleDeleteVehicle = () => {
    if (!vehicleToDelete) return;

    const encodedUserId = Cookies.get("usrin");
    if (encodedUserId) {
      const userId = window.atob(encodedUserId);

      axios.post('https://truck.truckmessage.com/remove_user_vehicle_details', {
        user_id: userId,
        vehicle_no: vehicleToDelete,
      })
        .then(response => {
          if (response.data.success) {
            setVehicleToDelete(null);
            fetchUserProfile();
            document.getElementById('closeDeleteModalButton').click();
          } else {
            toast.error('Failed to delete vehicle');
          }
        })
        .catch(error => {
          toast.error('Error deleting vehicle:', error);
        });
    }
  };

  const handleViewDetails = (vehicleNumber) => {
    axios.post('https://truck.truckmessage.com/get_vehicle_details', {
      vehicle_no: vehicleNumber,
    })
      .then(response => {
        if (response.data.success) {
          setSelectedVehicleDetails(response.data.data[0]);
        } else {
          toast.error('Failed to fetch vehicle details');
        }
      })
      .catch(error => {
        toast.error('Error fetching vehicle details:', error);
      });
  };

  const handleUpdatePhoto = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (["image/png", "image/jpeg", "image/jpg", "image/heic"].includes(file.type)) {
        setUpdateImage(file);
      } else {
        toast.error("Unsupported file format. Please upload .jpeg, .jpg, .png, .JPEG, .JPG, .PNG, .HEIC files only.");
      }
    }
  };

  const handleUploadProfileImage = async () => {
    try {
      const encodedUserId = Cookies.get("usrin");
      const userId = window.atob(encodedUserId);

      let formData = new FormData();
      formData.append("user_id", userId);
      formData.append("profile_image", updateImage);
      const res = await axios.post("https://truck.truckmessage.com/update_profile_image", formData, {
        headers: {
          "Content-Type": "multipart/form-data"
        }
      });

      if (res.data.error_code === 0) {
        toast.success(res.data.message)
        fetchUserProfile()
      } else {
        toast.error(res.data.message)
      }
    } catch (err) {
      console.log(err)
    }
  }

  const handleSaveChanges = async () => {
    try {
      const encodedUserId = Cookies.get("usrin");
      if (encodedUserId) {
        const userId = window.atob(encodedUserId);

        const data = {
          user_id: userId,
          first_name: editProfile.name,
          date_of_birth: editProfile.date_of_birth,
          category: category,
          phone_number: editProfile.phone_number,
          operating_city: operatingStates,
          state: operatingStates
        }

        const res = await axios.post("https://truck.truckmessage.com/update_profile", data);

        if (res.data.error_code === 0) {
          document.getElementById('editProfileCloseIcon').click();
          setUpdateImage("");
          fetchUserProfile()
          setPageRefresh(!pageRefresh);
        } else {
          toast.error(res.data.message);
        }
      }
    } catch (err) {
      toast.error(err.message);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB');
  };

  const downloadCSV = () => {
    const csvContent = Object.keys(selectedVehicleDetails).map(key => {
      const value = selectedVehicleDetails[key] !== null ?
        (typeof selectedVehicleDetails[key] === 'object' && selectedVehicleDetails[key] !== null ?
          JSON.stringify(selectedVehicleDetails[key]) : selectedVehicleDetails[key])
        : 'N/A';
      return `${key},${value}`;
    }).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'vehicle_details.csv';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };


  const handleUpdateOperatingStates = async () => {
    const encodedUserId = Cookies.get("usrin");
    const spreadOperatingstates = operatingStates.map((v) => v.label)
    const originalStates = statesData.map((v) => v.label)

    const updateStates = checked ? originalStates : spreadOperatingstates

    if (updateStates.length > 0) {
      try {
        if (encodedUserId) {
          const userId = window.atob(encodedUserId);

          const data = {
            user_id: userId,
            state_name: updateStates
          }

          await handleDeleteOperatingState()

          const res = await axios.post("https://truck.truckmessage.com/user_state_entry", data);

          if (res.data.error_code === 0) {
            handleGetOperatingStates()

            toast.success(res.data.message)
          } else {
            toast.error(res.data.message)
          }
        }
      }
      catch (err) {
        console.log(err)
      }
    } else {
      toast.error("Operating states should not be empty")
    }
  }

  return (
    <div className="liton__wishlist-area mt-5 pb-70">
      <div className="container">
        <div className="row">
          <div className="col-lg-12 ">
            <div className="ltn__product-tab-area">
              <div className="container">
                <div className="row">

                  <div className='col-12 col-md-6 col-xl-4'>
                    <div className="ltn-author-introducing clearfix mb-3 w-100 text-center">
                      <img src={userProfile.profile_image_name || ''} width={180} height={180} className="rounded-circle" alt="Profile" />
                    </div>
                  </div>

                  <div className='col-12 col-md-6 col-xl-4'>
                    <div className="ltn-author-introducing clearfix mb-3 ps-5 ">
                      <div className="author-info ">
                        <h2>{userProfile.name || 'No Name'}</h2>
                        <div className="footer-address">
                          <ul>
                            <li>
                              <div className="footer-address-icon"></div>
                              <div>
                                <p><FaRegCalendarAlt className="me-3" /> {userProfile.date_of_birth ? new Date(userProfile.date_of_birth).toLocaleDateString() : 'Not Available'}</p>
                              </div>
                            </li>
                            <li>
                              <div className="footer-address-icon"></div>
                              <div className="footer-address-info">
                                <p><IoCallOutline className='me-3' /> <a href={`tel:+${userProfile.phone_number}`}>{userProfile.phone_number || 'Not Available'}</a></p>
                              </div>
                            </li>
                            <li>
                              <div className="footer-address-icon"></div>
                              <div className="footer-address-info">
                                <p><FaUsersGear className='me-3' /> {userProfile.category || 'Not Available'}</p>
                              </div>
                            </li>
                          </ul>
                        </div>
                      </div>

                      <button type="button" className="btn btn-primary mt-3" data-bs-toggle="modal" data-bs-target="#editProfileModal">
                        Edit Profile
                      </button>
                    </div>
                  </div>

                  <div className=' col-12 col-md-12 col-xl-4 d-inline-flex'>
                    <div className="ltn-author-introducing clearfix mb-3 px-3 w-100">
                      <div className='row align-items-center'>
                        <div className="col-10">
                          <div className="footer-address-icon"></div>
                          <div className="footer-address-info text-break">
                            <p> <GrMapLocation className='me-3' />{operatingStatesUi.length ? operatingStatesUi.join(',') : 'Operating states'}</p>
                          </div>
                        </div>

                        <div className="col-2 text-center">
                          <button type="button" className="btn btn-sm text-decoration-underline" data-bs-toggle="modal" data-bs-target="#operatingStatesModel">
                            Edit
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>


                  <div className="mb-3 col-lg-12">
                    <button type="button" className="btn btn-danger text-uppercase" data-bs-toggle="modal" data-bs-target="#vehicleNumber">Add My Truck</button>
                  </div>

                  <div className="container">
                    <div className="row">
                      {vehicleData.map((vehicle, index) => (
                        <div className="col-lg-4 mt-4 mb-4" key={index}>
                          <div className="widget">
                            <div className="d-flex justify-content-between align-items-start align-items-center mb-0">
                              <h4 className="ltn__widget-title ltn__widget-title-border-2">{vehicle.rc_number}</h4>
                              <span className="align-items-start">
                                <button className="btn fs-4 p-0" onClick={() => setVehicleToDelete(vehicle.rc_number)} data-bs-toggle="modal" data-bs-target="#deleteVehicleModal">
                                  <MdDeleteOutline />
                                </button>
                              </span>
                            </div>
                            <div className="ltn__social-media-2">
                              <ul className="list-group">
                                <li className="list-group-item d-flex justify-content-between align-items-start align-items-center mt-0 p-2">
                                  <div className="me-auto ms-2">
                                    <div className="fw-bold">Fitness UpTo</div>
                                    <span className="vehicletext">{formatDate(vehicle.fit_up_to)}</span>
                                  </div>
                                  <div className="d-flex">
                                    <TbCircleFilled className="me-2 text-warning fs-4" />
                                  </div>
                                </li>
                                <li className="list-group-item d-flex justify-content-between align-items-start align-items-center mt-0 p-2">
                                  <div className="me-auto ms-2">
                                    <div className="fw-bold">Insurance</div>
                                    <span className="vehicletext">{formatDate(vehicle.insurance_upto)}</span>
                                  </div>
                                  <div className="d-flex">
                                    <TbCircleFilled className="me-2 text-success fs-4" />
                                  </div>
                                </li>
                                <li className="list-group-item d-flex justify-content-between align-items-start align-items-center mt-0 p-2">
                                  <div className="me-auto ms-2">
                                    <div className="fw-bold">Pollution Certificate</div>
                                    <span className="vehicletext">{formatDate(vehicle.pucc_upto)}</span>
                                  </div>
                                  <div className="d-flex">
                                    <TbCircleFilled className="me-2 text-danger fs-4" />
                                  </div>
                                </li>
                                <li className="list-group-item d-flex justify-content-between align-items-start align-items-center mt-0 p-2">
                                  <div className="me-auto ms-2">
                                    <div className="fw-bold">Road Tax</div>
                                    <span className="vehicletext">{formatDate(vehicle.tax_upto)}</span>
                                  </div>
                                  <div className="d-flex">
                                    <TbCircleFilled className="me-2 text-success fs-4" />
                                  </div>
                                </li>
                                <li className="list-group-item d-flex justify-content-between align-items-start align-items-center mt-0 p-2">
                                  <div className="me-auto ms-2">
                                    <div className="fw-bold">RC Status</div>
                                    <span className="vehicletext">{vehicle.rc_status}</span>
                                  </div>
                                  <div className="d-flex">
                                    <TbCircleFilled className="me-2 text-success fs-4" />
                                  </div>
                                </li>
                              </ul>
                            </div>
                            {/* <button className="btn btn-primary text-uppercase mt-3 mb-3" onClick={() => handleViewDetails(vehicle.rc_number)} data-bs-toggle="modal" data-bs-target="#vehicleDetails">
                              View Details
                            </button> */}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>


                  {/* Add Vehicle Modal */}
                  <div className="modal fade" id="vehicleNumber" tabIndex="-1" aria-labelledby="vehicleNumberLabel" aria-hidden="true">
                    <div className="modal-dialog modal-dialog-centered ">
                      <div className="modal-content">
                        <div className="modal-header">
                          <h5 className="modal-title" id="vehicleNumberLabel">Add Vehicle</h5>
                          <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div className="modal-body">
                          <div className="mb-3">
                            <label htmlFor="vehicleNumberInput" className="form-label">Vehicle Number</label>
                            <input type="text" className="form-control" id="vehicleNumberInput" value={newVehicleNumber} onChange={(e) => setNewVehicleNumber(e.target.value)} />
                          </div>
                        </div>
                        <div className="modal-footer">
                          <button type="button" className="btn btn-primary" onClick={handleAddVehicle}>Add Vehicle</button>
                          <button type="button" className="btn btn-secondary" data-bs-dismiss="modal" id="closeModalButton">Close</button>

                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Delete Vehicle Confirmation Modal */}
                  <div className="modal fade" id="deleteVehicleModal" tabIndex="-1" aria-labelledby="deleteVehicleModalLabel" aria-hidden="true">
                    <div className="modal-dialog">
                      <div className="modal-content">
                        <div className="modal-header">
                          <h5 className="modal-title" id="deleteVehicleModalLabel">Delete Vehicle</h5>
                          <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div className="modal-body">
                          Are you sure you want to delete the vehicle {vehicleToDelete}?
                        </div>
                        <div className="modal-footer">
                          <button type="button" className="btn btn-secondary" data-bs-dismiss="modal" id="closeDeleteModalButton">Cancel</button>
                          <button type="button" className="btn btn-danger" onClick={handleDeleteVehicle}>Delete</button>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Vehicle Details Modal */}

                  <div className="modal fade" id="vehicleDetails" tabIndex="-1" aria-labelledby="vehicleDetailsLabel" aria-hidden="true">
                    <div className="modal-dialog modal-dialog-scrollable modal-lg">
                      <div className="modal-content">
                        <div className="modal-header">
                          <h5 className="modal-title" id="vehicleDetailsLabel">Vehicle Details</h5>
                          <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div className="modal-body">
                          <table className="table">
                            <tbody>
                              {Object.keys(selectedVehicleDetails).map(key => (
                                <tr key={key}>
                                  <td style={{ fontWeight: 'bold', width: '30%' }}>{key.replace(/_/g, ' ')}</td>
                                  <td>{selectedVehicleDetails[key] !== null ?
                                    (typeof selectedVehicleDetails[key] === 'object' && selectedVehicleDetails[key] !== null ?
                                      JSON.stringify(selectedVehicleDetails[key]) : selectedVehicleDetails[key])
                                    : 'N/A'}
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                        <div className="modal-footer">
                          <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                          <button type="button" className="btn btn-primary" onClick={downloadCSV}>Download CSV</button>
                        </div>
                      </div>
                    </div>
                  </div>


                  {/* Edit Profile Modal */}
                  <div className="modal fade" id="editProfileModal" tabIndex="-1" aria-labelledby="editProfileModalLabel" aria-hidden="true">
                    <div className="modal-dialog modal-dialog-centered modal-dialog-scrollable modal-lg">
                      <div className="modal-content ">
                        <div className="modal-header">
                          <h5 className="modal-title fs-5" id="editProfileModalLabel">Edit Profile</h5>
                          <button type="button" id='editProfileCloseIcon' className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div className="modal-body ">
                          <div className="row px-4">
                            <div className='h-100 w-100 row align-items-center'>
                              <div className='col-3 mb-4 border border-1 p-2 rounded-3 text-center'>
                                <img
                                  id="profilePic"
                                  src={updateImage === "" ? editProfile.profile_image_name : URL.createObjectURL(updateImage)}
                                />
                              </div>

                              <div className='col-5'>
                                <input type='file' id='updateImage' className='w-100' onChange={(e) => handleUpdatePhoto(e)} />
                              </div>
                              <div className='col-4'>
                                <button type='button' className='btn btn-primary' onClick={handleUploadProfileImage}>Upload Image</button>
                              </div>
                            </div>
                            <div className="col-12 col-md-6 ">
                              <label htmlFor="editFirstName" className="form-label">First Name</label>
                              <input type="text" className="form-control" id="editFirstName" value={editProfile.name} onChange={(e) => setEditProfile({ ...editProfile, name: e.target.value })} />
                            </div>

                            <div className="col-12 col-md-6">
                              <label htmlFor="editDateOfBirth" className="form-label  border-0 shadow-none">Date of Birth</label>
                              <input type="date" className="form-control" id="editDateOfBirth" value={editProfile.date_of_birth} onChange={(e) => setEditProfile({ ...editProfile, date_of_birth: e.target.value })} />
                            </div>
                            <div className="col-12 col-md-6">
                              <label htmlFor="editPhoneNumber" className="form-label">Phone Number</label>
                              <input type="tel" className="form-control" id="editPhoneNumber" value={editProfile.phone_number} onChange={(e) => setEditProfile({ ...editProfile, phone_number: e.target.value })} />
                            </div>
                            <div className=" col-12 col-md-6 mt-2">
                              <h6>Category</h6>
                              <button type="button" class="btn btn-transparent dropdown-toggle col-12 py-3 dropdown-arrow text-start" data-bs-toggle="dropdown" aria-expanded="false">
                                {category === '' ? 'select Category' : category}
                              </button>
                              <ul class="dropdown-menu col-11">
                                <li onClick={() => setCategory('Lorry Owner')} className="cup mt-0 py-2 dropdown-list-hover"><a class="dropdown-item text-decoration-none">Lorry Owner</a></li>
                                <li onClick={() => setCategory('Logistics')} className="cup mt-0 py-2 dropdown-list-hover"><a class="dropdown-item text-decoration-none">Logistics</a></li>
                                <li onClick={() => setCategory('Lorry Contractors')} className="cup mt-0 py-2 dropdown-list-hover"><a class="dropdown-item text-decoration-none">Lorry Contractors</a></li>
                                <li onClick={() => setCategory('Load Booking Agent')} className="cup mt-0 py-2 dropdown-list-hover"><a class="dropdown-item text-decoration-none">Load Booking Agent</a></li>
                                <li onClick={() => setCategory('Driver')} className="cup mt-0 py-2 dropdown-list-hover"><a class="dropdown-item text-decoration-none">Driver</a></li>
                                <li onClick={() => setCategory('Lorry Buy & Sell Dealer/Owner')} className="cup mt-0 py-2 dropdown-list-hover"><a class="dropdown-item text-decoration-none">Lorry Buy & Sell Dealer/Owner</a></li>
                              </ul >

                              {/* <label htmlFor="editCategory" className="form-label">Category</label>
                              <input type="text" className="form-control" id="editCategory" value={editProfile.category} onChange={(e) => setEditProfile({ ...editProfile, category: e.target.value })} /> */}
                            </div>
                          </div>
                          <hr />
                          <div className="d-flex flex-column flex-md-row gap-2 justify-content-md-between">
                            <button type="button" className="btn btn-primary p-2 col-12 col-md-6" onClick={handleSaveChanges}>
                              Save Changes
                            </button>
                            <button type="button" className="btn btn-secondary  mb-md-0 p-2 col-12 col-md-6" data-bs-dismiss="modal" id="closeEditProfileModalButton" onClick={() => { setUpdateImage("") }}>
                              Close
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Edit operating states  */}
                  <div className="modal fade" id="operatingStatesModel" tabIndex="-1" aria-labelledby="operatingStatesModelLabel" aria-hidden="true">
                    <div className="modal-dialog modal-centered modal-lg">
                      <div className="modal-content">
                        <div className="modal-header">
                          <h5 className="modal-title" id="operatingStatesModelLabel">Operating states and cities Details</h5>
                          <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" id="closeOperatingStatesModel"></button>
                        </div>
                        <div className="modal-body row justify-content-center py-5">
                          <div className="col-12 col-md-9 col-lg-9">
                            <div className="form-group mb-3">
                              <label>Operating State and City</label>
                              {/* <Autocomplete name="from_location"
                                className="google-location location-input bg-transparent mb-1"
                                apiKey={process.env.REACT_APP_GOOGLE_PLACES_KEY}
                                onPlaceSelected={(place) => {
                                  if (place) {
                                    handleFromLocation(place.address_components);
                                  }
                                }}
                                required
                                options={{
                                  componentRestrictions: { country: "in" },
                                }}
                                value={operatingStateString}
                                onChange={(e) => setoperatingStateString(e.target.value)}
                                disabled={checked}
                              /> */}

                              <Select multi options={statesData} onChange={(values) => setOperatingStates(values)} values={[...operatingStates]} disabled={checked} />

                              {/* <div className='row g-2 mb-3'>
                                {!checked ?
                                  operatingStates.map((v, i) => {
                                    return <div className='col-6 '>
                                      <div className='p-2 border rounded-2 col-12 d-flex flex-wrap'>
                                        <div className="col-9 p-0">
                                          <p className='m-0 text-break'>{v}</p>
                                        </div>
                                        <div className="col-3">
                                          <MdDelete className='cursor-pointer text-danger' onClick={() => handleDeleteOperatingState(v)} />
                                        </div>
                                      </div>
                                    </div>
                                  })
                                  :
                                  null}
                              </div> */}
                              <div className="form-check w-100 mt-3">
                                <input className="form-check-input" type="checkbox" id="profileAllStatesandCities" onChange={handleCheckbox} checked={checked} />
                                <label className="form-check-label ps-2" for="profileAllStatesandCities">
                                  All states and cities
                                </label>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="modal-footer row">
                          <div className="col m-0">
                            <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                          </div>
                          <div className="col m-0">
                            <button type="button" className="btn btn-primary" onClick={handleUpdateOperatingStates}>Save</button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyAccount;


