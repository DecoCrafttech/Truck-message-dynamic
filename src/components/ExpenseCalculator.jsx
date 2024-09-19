import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import toast from 'react-hot-toast';
import { BsExclamationCircle } from 'react-icons/bs';
import { FaLocationDot } from 'react-icons/fa6';
import Autocomplete from "react-google-autocomplete";

export const ExpenseCalculator = () => {
    const LoginDetails = useSelector((state) => state.login);

    const [showingFromLocation, setShowingFromLocation] = useState("");
    const [showingToLocation, setShowingToLocation] = useState("");

    const [loadTrips, setLoadTrips] = useState([]);
    const [formData, setFormData] = useState({
        user_id: '',
        load_name: ''
    });

    const [loadTripId, setLoadTripId] = useState('')

    // const pageRender = useNavigate();
    useEffect(() => {
        if (Cookies.get("usrin")) {
            fetchLoadTrips();
        } else {
            setLoadTrips([])
        }
    }, [LoginDetails.isLoggedIn]);

    useEffect(() => {
        fetchLoadTrips();
    }, []);

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

    const fetchLoadTrips = async () => {
        const encodedUserId = Cookies.get('usrin');
        if (!encodedUserId) {
            toast.error('User ID not found in cookies');
            return;
        }
        const userId = window.atob(encodedUserId);

        await axios.post('https://truck.truckmessage.com/user_load_trip_details', { user_id: userId })
            .then(response => {
                if (response.data.success) {
                    setLoadTrips(response.data.data);
                } else {
                    toast.error('Failed to fetch user load trip details');
                }
            })
            .catch(error => {
                toast.error('Error fetching user load trip details:', error);
            });
    };

    const handleDelete = async () => {
        const data = {
            load_trip_id: loadTripId
        }

        await axios.post(`https://truck.truckmessage.com/remove_load_trip_entry`, data)
            .then(response => {
                if (response.data.error_code === 0) {
                    // setLoadTrips(prevTrips => prevTrips.filter(trip => trip.id !== id));
                    fetchLoadTrips();
                    document.getElementById('closeDeletionModal').click();
                } else {
                    toast.error('Failed to delete load trip');
                }
            })
            .catch(error => {
                toast.error('Error deleting load trip:', error);
            });
    };

    const handleFormChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevData => ({
            ...prevData,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const encodedUserId = Cookies.get('usrin');
        if (!encodedUserId) {
            toast.error('User ID not found in cookies');
            return;
        }
        const userId = window.atob(encodedUserId);

        const updatedFormData = {
            ...formData,
            from_location: showingFromLocation,
            to_location: showingToLocation,
            user_id: userId
        };

        await axios.post('https://truck.truckmessage.com/load_trip_entry', updatedFormData)
            .then(response => {
                if (response.data.success) {
                    fetchLoadTrips();


                    document.getElementById('addModalExpenseCalculator').click();
                    setFormData({
                        user_id: '',
                        load_name: ''
                    });
                    setShowingFromLocation("")
                    setShowingToLocation("")
                } else {
                    toast.error('Failed to add load trip');
                }
            })
            .catch(error => {
                toast.error('Error adding load trip:', error);
            });
    };

    return (
        <section>
            <div className="ltn__page-details-area ltn__service-details-area mb-105">
                <div className="container py-5">
                    <h2 className='textheadermil'>Expense Calculator</h2>
                    <div className="col text-end mb-4">
                        {LoginDetails.isLoggedIn ? (
                            <button
                                type="button"
                                className='btn btn-md btn-danger'
                                data-bs-toggle="modal"
                                data-bs-target="#addModal"
                            >
                                Add
                            </button>

                        ) :
                            <button type="button " className='cardbutton truck-brand-button ' data-bs-toggle="modal" data-bs-target="#loginModal">Add</button>
                        }

                    </div>
                    <div className="row gy-3">
                        {loadTrips.map((trip, index) => (
                            <div className="col-12 col-md-6 col-lg-4" key={index}>
                                <div className="card w-100 shadow-sm">
                                    <div className="card-body">
                                        <h5 className="card-title cardmodify">{trip.load_name}</h5>
                                        <div className="py-2">
                                            <p className="card-text mb-1">
                                                <label><FaLocationDot className="me-2 text-danger" />{trip.from_location}</label>
                                            </p>
                                            <p className="card-text mb-1">
                                                <label><FaLocationDot className="me-2 text-success" />{trip.to_location}</label>
                                            </p>
                                            <p className="card-text mb-1">
                                                <b>Created on:</b> <span>{new Date(trip.updt).toLocaleString()}</span>
                                            </p>
                                        </div>
                                        <div className="d-flex justify-content-center mt-3 gap-2">
                                            <Link to={`/expense-details/${trip.id}`} className="btn btn-primary w-100">Full details {`>>`}</Link>
                                            <button
                                                type="button"
                                                className="btn btn-danger d-flex align-items-center"
                                                data-bs-toggle="modal"
                                                data-bs-target="#deleteLoadConfirmationModal"
                                                onClick={() => setLoadTripId(trip.id)}
                                            >
                                                <i className="fas fa-trash-alt me-2"></i>
                                                Delete
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <div class="modal fade" id="deleteLoadConfirmationModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                <div class="modal-dialog modal-dialog-centered">
                    <div class="modal-content">
                        <div class="modal-header border-0">
                            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close" id="closeDeletionModal"></button>
                        </div>
                        <div class="modal-body">
                            <div className="py-3">
                                <div className="col text-center">
                                    <BsExclamationCircle className='fs-1 text-danger' />
                                </div>
                                <p className='mt-3 text-center'>Are you sure do you want to delete this...</p>
                            </div>
                        </div>
                        <div class="modal-footer border-0 row">
                            <div className="col-6 m-0">
                                <button type="button" class="btn btn-outline-secondary pe-3 w-100" data-bs-dismiss="modal">No</button>
                            </div>
                            <div className="col-6 m-0">
                                <button type="button" class="btn btn-outline-primary w-100" onClick={handleDelete}>Yes</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Modal */}
            <div className="modal fade" id="addModal" tabIndex="-1" role="dialog" aria-labelledby="addModalLabel" aria-hidden="true">
                <div className="modal-dialog modal-dialog-centered" role="document">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title" id="addModalLabel">Add Expenses Details</h5>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" id="addModalExpenseCalculator"></button>
                        </div>
                        <div className="modal-body">
                            <form onSubmit={handleSubmit}>
                                <div className="form-group">
                                    <label htmlFor="loadName">Load Name</label>
                                    <input
                                        type="text"
                                        className="form-control mb-0"
                                        id="loadName"
                                        name="load_name"
                                        value={formData.load_name}
                                        onChange={(e) => setFormData({ ...formData, load_name: e.target.value })}
                                        required
                                    />
                                </div>


                                <div className="col-12 p-0">
                                    <h6>From Location</h6>
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

                                <div className="col-12 p-0">
                                    <h6>To Location</h6>
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
                                <button type="submit" className="btn btn-primary">Add Load Trip</button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};
