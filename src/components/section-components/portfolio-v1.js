import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { FaWeightHanging, FaTruck, FaLocationDot } from "react-icons/fa6";
import { HiOutlineOfficeBuilding } from "react-icons/hi";
import { SiMaterialformkdocs } from "react-icons/si";
import { GiCarWheel } from "react-icons/gi";
import { useSelector } from 'react-redux';
import Cookies from 'js-cookie';
import Autocomplete from "react-google-autocomplete";
import { useNavigate } from 'react-router-dom';


const PortfolioV1 = () => {
    let publicUrl = process.env.PUBLIC_URL + '/'

    const LoginDetails = useSelector((state) => state.login);
    const navigate = useNavigate();

    const [cards, setCards] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [showingFromLocation, setShowingFromLocation] = useState("");
    const [showingToLocation, setShowingToLocation] = useState("");

    const [cardsPerPage] = useState(21); // Adjust the number of cards per page as needed
    const truckBodyType = ["LCV", "Open body vehicle", "Tanker", "Trailer", "Tipper", "Container"];
    const numOfTyres = [4, 6, 10, 12, 14, 16, 18, 20, 22];
    const [initialLoading, setInitialLoading] = useState(false);


    const [filters, setFilters] = useState({
        search: '',
    });

    const [filterModelData, SetfilterModelData] = useState({
        company_name: "",
        user_id: "",
        from_location: "",
        to_location: "",
        truck_body_type: "",
        no_of_tyres: "",
        material: "",
        tone: ""
    })

    const [editingData, setEditingData] = useState({
        company_name: '',
        contact_no: '',
        material: '',
        tone: '',
        truck_body_type: '',
        no_of_tyres: '',
        description: ''
    })

    const [contactError, setContactError] = useState(''); // State to manage contact number validation error

    const [aadharNumber, setAadharNumber] = useState("")
    const [aadharStep, setAadharStep] = useState(1);
    const [otpNumber, setOtpNumber] = useState("");
    const [selectedContactNum, setSelectedContactNum] = useState(null)

    const fetchData = async () => {
        setInitialLoading(true)
        window.scrollTo(0, 0)
        try {
            await axios.get('https://truck.truckmessage.com/all_load_details')
                .then(response => {
                    if (response.data.success && Array.isArray(response.data.data)) {
                        const reOrder = response.data.data.sort(function (a, b) {
                            if (new Date(a.updt) > new Date(b.updt)) {
                                return -1
                            }
                        })

                        setCards(reOrder)
                        setInitialLoading(false)
                    } else {
                        console.error('Unexpected response format:', response.data);
                        setInitialLoading(false)
                    }
                    
                })
                .catch(error => {
                    console.error('There was an error fetching the data!', error);
                    setInitialLoading(false)
                });
        }
        catch (err) {
            console.log(err)
            setInitialLoading(false)
        }
    }

    useEffect(() => {
        fetchData()
    }, []);

    const handleFilterChange = (e) => {
        setFilters({
            search: e.target.value,
        });
    };

    const handleCopy = (contactNo, cardId) => {
        // navigator.clipboard.writeText(contactNo)
        //     .then(() => {
        //         toast.success('Contact number copied!'); // Optional, show a success message
        //     })
        //     .catch(() => {
        //         toast.error('Failed to copy contact number.');
        //     });
        setSelectedContactNum(null)

        setviewContactId(cardId)
        setTimeout(() => {
            setSelectedContactNum(contactNo)
            setviewContactId(null)
        }, 800)
    };

    const filterCards = (cards) => {
        return cards.filter(card => {
            const search = filters.search.toLowerCase();
            return (
                card.company_name.toLowerCase().includes(search) ||
                card.from_location.toLowerCase().includes(search) ||
                card.to_location.toLowerCase().includes(search) ||
                card.tone.toString().includes(search) ||
                card.material.toLowerCase().includes(search) ||
                card.no_of_tyres.toString().includes(search) ||
                card.truck_body_type.toLowerCase().includes(search) ||
                card.profile_name.toLowerCase().includes(search)
            );
        });
    };

    const validateContactNumber = (contact) => {
        const contactNumberPattern = /^\d{10}$/; // Simple pattern for 10-digit numbers
        return contactNumberPattern.test(contact);
    };

    const handleSubmit = async () => {
        try {
            const userId = window.atob(Cookies.get("usrin"));
            const data = {
                company_name: editingData.company_name,
                contact_no: editingData.contact_no,
                from: showingFromLocation,
                to: showingToLocation,
                material: editingData.material,
                tone: editingData.tone,
                truck_body_type: editingData.truck_body_type,
                no_of_tyres: editingData.no_of_tyres,
                description: editingData.description,
                user_id: userId
            };
            if (data.company_name && data.contact_no && data.from && data.to && data.material && data.tone && data.truck_body_type && data.no_of_tyres) {
                if (!validateContactNumber(editingData.contact_no)) {
                    setContactError('Please enter a valid 10-digit contact number.');
                    return;
                }

                await axios.post('https://truck.truckmessage.com/load_details', data, {
                    headers: {
                        'Content-Type': 'application/json'
                    }

                })
                    .then(response => {
                        toast.success('Load posted successfully!');
                        document.getElementById("clodeBuySellModel").click()
                        fetchData()
                        setEditingData({
                            company_name: '',
                            contact_no: '',
                            material: '',
                            tone: '',
                            truck_body_type: '',
                            no_of_tyres: '',
                            description: ''
                        })
                        setShowingFromLocation("")
                        setShowingToLocation("")
                    })
                    .catch(error => {
                        toast.error('Failed to submit the form.');
                        console.error('There was an error!', error);
                    });
            } else {
                toast.error('Some fields are missing');
            }
        } catch (err) {
            console.log(err)
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



    const [editCompanyFromLocation, setEditCompanyFromLocation] = useState({
        city: "",
        state: "",
    });
    const [editCompanyToLocation, setEditCompanyToLocation] = useState({
        city: "",
        state: "",
    });

    const [viewContactId, setviewContactId] = useState(null)

    const handleFromLocation = (selectedLocation) => {
        if (selectedLocation) {
            const cityComponent = selectedLocation.find(component => component.types.includes('locality'));
            const stateComponent = selectedLocation.find(component => component.types.includes('administrative_area_level_1'));

            if (cityComponent && stateComponent) {
                setEditCompanyFromLocation({
                    city: cityComponent.long_name,
                    state: stateComponent.long_name,
                });
                setShowingFromLocation(`${cityComponent.long_name}, ${stateComponent.long_name}`);
            }
        }
    };

    const handleToLocation = (selectedLocation) => {
        if (selectedLocation) {
            const cityComponent = selectedLocation.find(component => component.types.includes('locality'));
            const stateComponent = selectedLocation.find(component => component.types.includes('administrative_area_level_1'));

            if (cityComponent && stateComponent) {
                setEditCompanyToLocation({
                    city: cityComponent.long_name,
                    state: stateComponent.long_name,
                });
                setShowingToLocation(`${cityComponent.long_name}, ${stateComponent.long_name}`);
            }
        }
    };

    const handleApplyFilter = async () => {
        const filterObj = { ...filterModelData }
        filterObj.from_location = showingFromLocation
        filterObj.to_location = showingToLocation

        try {
            const res = await axios.post("https://truck.truckmessage.com/user_load_details_filter", filterObj, {
                headers: {
                    'Content-Type': 'application/json'
                }
            })

            if (res.data.error_code === 0) {
                const reOrder = res.data.data.sort(function (a, b) {
                    if (new Date(a.updt) > new Date(b.updt)) {
                        return -1
                    }
                })
                setCards(reOrder)

                toast.success(res.data.message)
                document.getElementById("closeFilterBox").click()
            } else {
                toast.error(res.data.message)
            }
        }
        catch (err) {
            console.log(err)
        }
    }

    const handleloadAvailabilityModelOpen = async () => {
        if (Cookies.get("otpId")) {
            setAadharStep(3)
        } else {
            setAadharStep(1)
            try {
                const encodedUserId = Cookies.get("usrin");
                if (encodedUserId) {
                    const userId = window.atob(encodedUserId);

                    const res = await axios.post('https://truck.truckmessage.com/check_aadhar_verification', {
                        user_id: userId,
                    })

                    if (res.data.error_code === 0) {
                        if (res.data.data.is_aadhar_verified) {
                            setTimeout(() => {
                                setAadharStep(4)
                            }, 1500)
                        } else {
                            setTimeout(() => {
                                setAadharStep(2)
                            }, 1500)
                        }
                    } else {
                        setAadharStep(1)
                    }
                }
                else {
                    toast.error("User ID not found in cookies");
                }
            } catch (err) {
                console.log(err)
            }
        }
    }

    const handleUpdateAadhar = e => {
        const aadharnum = e.target.value.replace(/[^0-9]/g, '')
        if (aadharnum.length <= 12) {
            setAadharNumber(aadharnum)
        }
    }

    const handleVerifyAadhar = async () => {
        if (aadharNumber !== '' && aadharNumber.length === 12) {
            try {
                const res = await axios.post("https://truck.truckmessage.com/aadhaar_generate_otp", { id_number: aadharNumber })
                if (res.data.error_code === 0) {
                    Cookies.set("otpId", res.data.data[0].client_id, {
                        secure: true,
                        sameSite: 'strict',
                        path: '/'
                    })
                    setAadharStep(3)
                }
            }
            catch (err) {
                console.log(err)
            }
        }
        else {
            toast.error("invalid aadhar number")
        }
    }

    const handleUpdateOtp = e => {
        const otpnum = e.target.value.replace(/[^0-9]/g, '')
        if (otpnum.length <= 6) {
            setOtpNumber(otpnum)
        }
    }

    const handleVerifyOtp = async () => {
        if (otpNumber !== '' && otpNumber.length === 6) {
            try {
                const encodedUserId = Cookies.get("usrin");
                const userId = window.atob(encodedUserId);

                const data = {
                    client_id: Cookies.get('otpId'),
                    user_id: userId,
                    otp: otpNumber
                }
                const res = await axios.post("https://truck.truckmessage.com/aadhaar_submit_otp", data)
                if (res.data.error_code === 0) {
                    Cookies.remove("otpId")
                    setAadharStep(4)
                }
            }
            catch (err) {
                console.log(err)
            }
        }
        else {
            toast.error("invalid otp number")
        }
    }

    const handleAddarVerifiactionStatus = () => {
        switch (aadharStep) {
            case 1:
                return <div className="py-5 row align-items-center justify-content-center text-center">
                    <div className="col">
                        <div className="spinner-border text-success" role="status">
                            <span className="sr-only">Loading...</span>
                        </div>
                        <p className="text-success mt-3">Verifying Aadhar</p>
                    </div>
                </div>

            case 2:
                return <div>
                    <div className="py-5 row align-items-center justify-content-center">
                        <div className="col-12 col-md-9">
                            <h4 className='mb-3'>Verify Aadhar</h4>
                            <div className="input-item input-item-name ltn__custom-icon">
                                <input type="text" value={aadharNumber} placeholder="Enter your aadhar number" onChange={handleUpdateAadhar} required />
                            </div>
                        </div>
                    </div>
                    <div className="modal-footer justify-content-between">
                        <button type="button" className="btn btn-secondary col-12 col-md-5" data-bs-dismiss="modal">Close</button>
                        <button type="button" className="btn btn-primary col-12 col-md-5" onClick={handleVerifyAadhar}>verify aadhar</button>
                    </div>
                </div>

            case 3:
                return <div>
                    <div className="py-5 row align-items-center justify-content-center">
                        <div className="col-12 col-md-6">
                            <h4 className='mb-3'>Verify Otp</h4>
                            <div className="input-item input-item-name ltn__custom-icon">
                                <input type="text" value={otpNumber} placeholder="Enter Otp" onChange={handleUpdateOtp} required />
                            </div>
                        </div>
                    </div>
                    <div className="modal-footer justify-content-between">
                        <button type="button" className="btn btn-secondary col-12 col-md-5" data-bs-dismiss="modal">Close</button>
                        <button type="button" className="btn btn-primary col-12 col-md-5" onClick={handleVerifyOtp}>verify Otp</button>
                    </div>
                </div>

            case 4:
                return <div className="ltn__appointment-inner">
                    <div className="row gy-4">
                        <div className="col-12 col-md-6">
                            <h6>Company Name</h6>
                            <div className="input-item input-item-name">
                                <input
                                    type="text"
                                    className="mb-0"
                                    name="company_name"
                                    placeholder="Name of the Company"
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
                                <Autocomplete name="from_location"
                                    className="google-location location-input bg-transparent py-2 mb-0"
                                    apiKey={process.env.REACT_APP_GOOGLE_PLACES_KEY}
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
                                <Autocomplete name="to_location"
                                    className="google-location location-input bg-transparent py-2 mb-0"
                                    apiKey={process.env.REACT_APP_GOOGLE_PLACES_KEY}
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
                            <h6>Material</h6>
                            <div className="input-item">
                                <input
                                    type="text"
                                    name="material"
                                    className="mb-0"
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
                                {contactError && (
                                    <p style={{ color: "red" }}>{contactError}</p>
                                )}
                            </div>
                        </div>

                        <div className="col-12 col-md-6">
                            <h6>Ton</h6>
                            <div className="input-item">
                                <input
                                    type="text"
                                    name="tone"
                                    className="mb-0"
                                    placeholder="Example: 2 tons"
                                    value={editingData.tone}
                                    onChange={(e) =>
                                        setEditingData({
                                            ...editingData,
                                            tone: e.target.value,
                                        })
                                    }
                                    required
                                />
                                {contactError && (
                                    <p style={{ color: "red" }}>{contactError}</p>
                                )}
                            </div>
                        </div>

                        <div className="col-12 col-md-6 mt-3">
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

                        <div className="col-12 col-md-6 m-0 mt-3">
                            <h6>No. of Tyres</h6>
                            <button type="button" class="btn btn-transparent shadow-none border dropdown-toggle col-12 py-3 dropdown-arrow text-start" data-bs-toggle="dropdown" aria-expanded="false">
                                {editingData.no_of_tyres === '' ? 'select number of tyres' : `${editingData.no_of_tyres}`}
                            </button>
                            <ul class="dropdown-menu col-11 dropdown-ul">
                                {
                                    numOfTyres.map((numOfTyresVal) => {
                                        return <li onClick={() => setEditingData({
                                            ...editingData, no_of_tyres: numOfTyresVal,
                                        })} className="cup mt-0 py-2 dropdown-list-hover"><a class="dropdown-item text-decoration-none">{numOfTyresVal}</a></li>
                                    })
                                }
                            </ul >
                        </div>

                        <div className="col-12">
                            <h6>Descriptions </h6>
                            <div className="input-item input-item-textarea">
                                <textarea name="description" placeholder="Enter a text here" onChange={(e) => setEditingData({
                                    ...editingData, description: e.target.value,
                                })} />
                            </div>
                        </div>
                    </div>
                    <div className="modal-footer btn-wrapper text-center mt-4">
                        <button className="btn btn-primary theme-btn-1 text-uppercase" type="button" onClick={handleSubmit}>Submit</button>
                    </div>
                </div>

            default:
                break;
        }
    }

    const handleMessageClick = (card) => {
        navigate(`/chat?person_id=${card.user_id}`);
    };

    return (
        <div>
            <div className="ltn__product-area ltn__product-gutter mb-50 ">
                <div className="container">
                    <div className='text-center ' ><h2 className='cardmodifyhead'>Load Availability</h2></div>
                    <div className="row">
                        <div className="col-lg-12 mb-2">
                            <div className='row'>
                                <div className=" col-lg-8 mb-2">
                                    <div className="showing-product-number text-right">
                                        <span>Showing {indexOfFirstCard + 1}-{Math.min(indexOfLastCard, filteredCards.length)} of {filteredCards.length} results</span>
                                    </div>
                                </div>
                                <div className='col-lg-4 mb-2' >
                                    <div >
                                        {/* <Link to="/add-listing"> + Add Load availability</Link> */}
                                        {LoginDetails.isLoggedIn ? (
                                            <button type="button " className='cardbutton truck-brand-button ' data-bs-toggle="modal" data-bs-target="#addloadavailability" onClick={handleloadAvailabilityModelOpen}>+ Add Load availability</button>

                                        ) :
                                            <button type="button " className='cardbutton truck-brand-button ' data-bs-toggle="modal" data-bs-target="#loginModal">+ Add Load availability</button>
                                        }
                                    </div>
                                </div>
                            </div>

                        </div>
                        <hr></hr>
                        <div className='col-12'>
                            <div className='row'>
                                <div className="col-lg-8">
                                    {/* Search Widget */}
                                    <div className="ltn__search-widget mb-0">
                                        <form action="">
                                            <input type="text" name="search" placeholder="Search by ..." onChange={handleFilterChange} />
                                        </form>
                                    </div>
                                </div>
                                <div className="col-6 col-lg-2 ">
                                    <button type="button" className="btn btn-primary filterbtn" data-bs-toggle="modal" data-bs-target="#loadfilter" >Filter</button>
                                </div>

                                <div className="col-6 col-lg-2 ">
                                    <button type="button" className="btn btn-secondary filterbtn" onClick={() => fetchData()}>Clear filter</button>
                                </div>

                            </div>

                        </div>

                    </div>
                </div>
            </div>

            {/* modal */}
            <div className="modal fade" id="addloadavailability" data-bs-backdrop="static" data-bs-keyboard="false" tabIndex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
                <div className={`modal-dialog modal-dialog-centered modal-dialog-scrollable ${aadharStep === 4 ? 'modal-lg' : 'modal-md'}`}>
                    <div className="modal-content">
                        <div className="modal-header">
                            <h1 className="modal-title fs-5" id="staticBackdropLabel">Add Load</h1>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" id="clodeBuySellModel"></button>
                        </div>
                        <div className="modal-body">
                            {handleAddarVerifiactionStatus()}
                        </div>
                    </div>
                </div>
            </div>

            {/* filter modal */}
            <div className="modal fade" id="loadfilter" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                <div className="modal-dialog modal-dialog-centered modal-dialog-scrollable modal-lg">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h1 className="modal-title fs-5" id="exampleModalLabel">Filter</h1>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" id="closeFilterBox"></button>
                        </div>
                        <div className="modal-body ps-4 pe-4 p-">
                            <div className="ltn__appointment-inner ">
                                <div className="row gy-4">
                                    <div className="col-12 col-md-6">
                                        <h6>From</h6>
                                        <div className="input-item input-item-name">
                                            <Autocomplete name="from_location"
                                                className="google-location location-input bg-transparent py-2 mb-0"
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
                                                className="google-location location-input bg-transparent py-2 mb-0"
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

                                    <div className="col-12 col-md-6">
                                        <h6>Truck Body Type</h6>
                                        <button type="button" class="btn btn-transparent shadow-none border dropdown-toggle col-12 py-3 dropdown-arrow text-start" data-bs-toggle="dropdown" aria-expanded="false">
                                            {filterModelData.truck_body_type === '' ? 'select body type' : `${filterModelData.truck_body_type}`}
                                        </button>
                                        <ul class="dropdown-menu col-11 dropdown-ul">
                                            {
                                                truckBodyType.map((bodyType) => {
                                                    return <li onClick={() => SetfilterModelData({
                                                        ...filterModelData, truck_body_type: bodyType,
                                                    })} className="cup mt-0 py-2 dropdown-list-hover"><a class="dropdown-item text-decoration-none">{bodyType}</a></li>
                                                })
                                            }
                                        </ul >
                                    </div>

                                    <div className="col-12 col-md-6">
                                        <h6>No. of Tyres</h6>
                                        <button type="button" class="btn btn-transparent shadow-none border dropdown-toggle col-12 py-3 dropdown-arrow text-start" data-bs-toggle="dropdown" aria-expanded="false">
                                            {filterModelData.no_of_tyres === '' ? 'select number of tyres' : `${filterModelData.no_of_tyres}`}
                                        </button>
                                        <ul class="dropdown-menu col-11 dropdown-ul">
                                            {
                                                numOfTyres.map((numOfTyresVal) => {
                                                    return <li onClick={() => SetfilterModelData({
                                                        ...filterModelData, no_of_tyres: numOfTyresVal,
                                                    })} className="cup mt-0 py-2 dropdown-list-hover"><a class="dropdown-item text-decoration-none">{numOfTyresVal}</a></li>
                                                })
                                            }
                                        </ul >
                                    </div>

                                    <div className="col-12 col-md-6">
                                        <h6>Material</h6>
                                        <div className="input-item input-item-name ltn__custom-icon">
                                            <input type="text" name="material" placeholder="What type of material" onChange={(e) => SetfilterModelData({ ...filterModelData, material: e.target.value })} />
                                        </div>
                                    </div>
                                    <div className="col-12 col-md-6">
                                        <h6>Ton</h6>
                                        <div className="input-item input-item-name ltn__custom-icon">
                                            <input type="text" name="tone" placeholder="Example: 2 tones" onChange={(e) => SetfilterModelData({ ...filterModelData, tone: e.target.value })} />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-primary" onClick={handleApplyFilter}>Apply Filter</button>
                        </div>
                    </div>
                </div>
            </div>



            {/* card  */}
            <div className='container h-100'>
                {
                    initialLoading ?
                        <div className="row w-100 spinner-miin-height justify-content-center align-items-center">
                            <div className="col-3 text-center">
                                <div class="spinner-border text-info" role="status">
                                    <span class="visually-hidden">Loading...</span>
                                </div>
                                <p className="mt-2 text-info">Loading...</p>
                            </div>
                        </div>
                        :
                        currentCards.length > 0 ?
                            <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-5 mb-60 ">
                                {currentCards.map(card => (
                                    <div className="col " key={card.id}>
                                        <div className="card h-100 shadow truckcard">
                                            <div className='card-header border-0 mb-0 '>
                                                <p className='.fs-6 reviewtext '>
                                                    {/* Generate the star ratings based on the response */}
                                                    {[...Array(5)].map((_, index) => (
                                                        <span key={index} className="float-right">
                                                            <i className={`text-warning fa fa-star ${index < card.rating ? '' : 'text-muted'}`}></i>
                                                        </span>
                                                    ))}
                                                    <span>({card.user_review_count} )</span>
                                                    <p className="float-end mb-0 text-b"> <strong>Posts </strong> : {card.user_post}</p>

                                                </p>

                                                <div className="cardmodify py-1 py-3">
                                                    <h5 className='mb-1'>{card.profile_name}</h5>
                                                    <div className="col-lg-12 cardicontext">
                                                        <label><HiOutlineOfficeBuilding className='me-2' />{card.company_name}</label>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="card-body p-3 mt-2 mb-2">
                                                <div className='row'>
                                                    <div className="col-lg-12 cardicon">
                                                        <div>
                                                            <label><FaLocationDot className="me-2 text-danger" />{card.from_location}</label>
                                                        </div>
                                                    </div>
                                                    <div className="col-lg-12 cardicon">
                                                        <div><label><FaLocationDot className='me-2 text-success' />{card.to_location}</label></div>
                                                    </div>
                                                </div>
                                                <hr className="hr m-2" />
                                                <div className='row mt-3'>
                                                    <div className="col-lg-6 cardicontext">
                                                        <div>
                                                            <label><FaWeightHanging className='me-2' />{card.tone} ton</label>
                                                        </div>
                                                    </div>
                                                    <div className="col-lg-6 cardicontext">
                                                        <div><label><SiMaterialformkdocs className='me-2' />{card.material}</label></div>
                                                    </div>
                                                    <div className="col-lg-6 cardicontext">
                                                        <label><GiCarWheel className='me-2' />{card.no_of_tyres} wheels</label>
                                                    </div>
                                                    <div className="col-lg-6 cardicontext">
                                                        <label><FaTruck className='me-2' />{card.truck_body_type}</label>
                                                    </div>

                                                </div>
                                                <div className='m-2'>
                                                    <h5 className="card-title mt-3">Description</h5>
                                                    <p className="card-text paragraph">{card.description}</p>
                                                </div>
                                            </div>
                                            <div className="card-footer mb-3">
                                                <div>
                                                    {LoginDetails.isLoggedIn ? (
                                                        <div className="d-flex flex-wrap mt-3">
                                                            {/* <div className='col-6'>
                                                    <a href={`tel:${card.contact_no}`} className="btn btn-success  w-100" type="button"> <IoCall className='me-3' />Call</a>
                                                </div> */}
                                                            <div className='col-6'>
                                                                {/* <button className="btn btn-success w-100" type="button"> <IoCall  className='me-3' />{card.contact_no}</button> */}
                                                                {
                                                                    viewContactId === card.id ?
                                                                        <button
                                                                            className="btn btn-success w-100"
                                                                            type="button">
                                                                            <div className="spinner-border text-light" role="status">
                                                                                <span className="sr-only">Loading...</span>
                                                                            </div>
                                                                        </button>
                                                                        :

                                                                        selectedContactNum && card.contact_no === selectedContactNum ?
                                                                            <button
                                                                                className="btn btn-success w-100"
                                                                                type="button">
                                                                                {selectedContactNum}
                                                                            </button>
                                                                            :
                                                                            <button
                                                                                className="btn btn-success w-100"
                                                                                type="button"
                                                                                onClick={() => handleCopy(card.contact_no, card.id)}>
                                                                                {/* <FaRegCopy className='me-2' /> */}
                                                                                Contact
                                                                            </button>
                                                                }
                                                            </div>
                                                            <div className='col-6'>
                                                                <button className="btn cardbutton w-100" type="button" onClick={() => handleMessageClick(card)}>Message</button>
                                                            </div>
                                                        </div>
                                                    ) :
                                                        <div className="d-grid gap-2">
                                                            <button className="btn cardbutton" type="button" data-bs-toggle="modal" data-bs-target="#loginModal">View Details</button>
                                                        </div>
                                                    }
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            :
                            <div className='row justify-content-center align-items-center emptyCardHeight'>
                                <div className='col text-center'>
                                    <img src={publicUrl + "assets/img/Folder_empty.png"} width={100} height={100} />
                                    <p>No Data Available</p>

                                    {LoginDetails.isLoggedIn ?
                                        <button type="button" className='btn btn-primary col-12 col-md-6 col-lg-4 col-xl-3' data-bs-toggle="modal" data-bs-target="#addloadavailability" onClick={handleloadAvailabilityModelOpen}>Click here to Add Load</button>
                                        :
                                        <button type="button " className='btn btn-primary col-12 col-md-6 col-lg-4 col-xl-3' data-bs-toggle="modal" data-bs-target="#loginModal">Click here to Add Load</button>
                                    }

                                </div>
                            </div>
                }

                <div className='pagination'>
                    <ul className='pagination-list'>
                        {Array.from({ length: totalPages }, (_, index) => (
                            <li key={index + 1} className='pagination-item'>
                                <button
                                    onClick={() => paginate(index + 1)}
                                    className={currentPage === index + 1 ? 'pagination-link active' : 'pagination-link'}
                                >
                                    {index + 1}
                                </button>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    );
}

export default PortfolioV1;