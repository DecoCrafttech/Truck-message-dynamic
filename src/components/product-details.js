import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import axios from 'axios';
import toast from 'react-hot-toast';
import Slider from 'react-slick';

const Product_Details = () => {
    const navigate = useNavigate();

    const [Images, setImages] = useState([]);
    const [currentImage, setCurrentImage] = useState("")
    const [isOpen, setIsOpen] = useState(false);
    const [selectedContactNum, setSelectedContactNum] = useState(null)
    const [selectedContactNumLoading, setSelectedContactNumLoading] = useState(false)


    const pageRender = useNavigate();

    const [data, setData] = useState({
        brand: "",
        price:"",
        buy_sell_id: "",
        contact_no: "",
        description: "",
        images: [],
        kms_driven: "",
        location: "",
        model: "",
        owner_name: "",
        truck_image2: "",
        truck_image3: "",
        upload_image_name: "",
        vehicle_number: ""
    });

    const settings = {
        customPaging: function (i) {
            return (
                <a className='p-1 row justify-content-center align-items-center'>
                    <img src={Images[i]} />
                </a>
            );
        },
        dots: true,
        dotsClass: "slick-dots slick-thumb",
        infinite: true,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
        responsive: [
            {
                breakpoint: 1024,
                settings: {
                    slidesToShow: 1,
                    slidesToScroll: 1,
                    infinite: false,
                    dots: true
                }
            },
            {
                breakpoint: 600,
                settings: {
                    slidesToShow: 1,
                    slidesToScroll: 1
                }
            }
        ],
        // className: "center",
        // centerPadding: "60px",
        swipeToSlide: true,
    };

    const fetchDetails = async () => {
        const getViewDetailsId = Cookies.get("buyAndSellViewDetailsId");
        setImages([]);

        if (getViewDetailsId) {
            try {
                const data = {
                    buy_sell_id: window.atob(getViewDetailsId)
                };
                const res = await axios.post('https://truck.truckmessage.com/buy_sell_id_details', data, {
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });

                if (res.data.error_code === 0) {
                    if (res.data.data.length > 0) {
                        setData(...res.data.data);
                        setImages(res.data.data[0].images) 
                    }
                } else {
                    toast.error(res.data.message);
                }
            } catch (err) {
                console.log(err);
            }
        } else {
            toast.error("Something went wrong");
        }
    };


    useEffect(() => {
        fetchDetails()
    }, []);

    const handleOpenLightBox = (index) => {
        setCurrentImage(Images[index])
        setIsOpen(true)
    }

    const handleMessageClick = (card) => {
        console.log(card, "card")
        navigate(`/chat?person_id=${card.user_id}`);
    };


    const handleCopy = (contactNo) => {
        setSelectedContactNum(null)
        setSelectedContactNumLoading(true)

        // setviewContactId(cardId)
        setTimeout(() => {
            setSelectedContactNum(contactNo)
            setSelectedContactNumLoading(false)
        }, 800)
    };

    return <div className="ltn__shop-details-area pb-10">
        <div className="container">
            <div className="row">
                <div className='my-4'>
                    <button type='button' className='btn btn-primary col-12 col-md-4 col-lg-2 col-xl-1' onClick={() => pageRender('/blog-left-sidebar')}>Back</button>
                </div>
                <div className="col-lg-12 col-md-12">
                    <div className="ltn__shop-details-inner ltn__page-details-inner mb-60">
                        <h4 className="title-2">Images</h4>
                        <div className="ltn__property-details-gallery mb-30">
                            <div className="row">
                                <div className="slider-container text-center mb-5">
                                    {
                                        Images.length > 1 ?
                                            <Slider {...settings}>
                                                {Images.map((image, index) => {
                                                    return (
                                                        <div className="col-12 d-inline-flex justify-content-center" key={index}>
                                                            <img src={image} onClick={() => handleOpenLightBox(index)} height={"400px"} className='col-12 col-md-6 col-lg-9' />
                                                        </div>
                                                    )
                                                })}
                                            </Slider>
                                            :
                                            <div className="col-12 d-inline-flex justify-content-center">
                                                <img src={Images[0]} height={"400px"} className='col-12 col-md-6 col-lg-9' />
                                            </div>
                                    }

                                </div>
                            </div>
                        </div>

                        <div className='col-12'>
                            <div className='row'>
                                <div className='col-12 col-md-8'>
                                    <h1 className='mt-0 ms-0'>{data.brand}</h1>
                                    <div className="product-ratting">
                                        <ul className="list-inline">
                                            <li className="list-inline-item"><i className="fas fa-star" aria-label="star" /></li>
                                            <li className="list-inline-item"><i className="fas fa-star" aria-label="star" /></li>
                                            <li className="list-inline-item"><i className="fas fa-star" aria-label="star" /></li>
                                            <li className="list-inline-item"><i className="fas fa-star-half-alt" aria-label="half-star" /></li>
                                            <li className="list-inline-item"><i className="far fa-star" aria-label="star-outline" /></li>
                                            <li className="list-inline-item review-total">  (1 Reviews)</li>
                                        </ul>
                                    </div>
                                    <div className="ltn__blog-meta">
                                        <ul className="list-inline">
                                            <li className="list-inline-item ltn__blog-date mt-3">
                                                <i className="far fa-calendar-alt" /> {data.updt ? data.updt.slice(5, 25): ''}
                                            </li> 
                                        </ul>
                                        <label className='mt-3 d-block'>
                                            {/* <span className="ltn__secondary-color"><i className="flaticon-pin" /></span> {data} */}
                                        </label>
                                    </div>
                                </div>

                                <div className='col-4 col-md-4 w-100 '>
                                    <div className='d-flex justify-content-center align-items-center gap-2 col-12 p-0'>
                                        <div className='col-6 p-0'>
                                            {
                                                selectedContactNum ?
                                                    <button
                                                        className="btn btn-success w-100"
                                                        type="button">
                                                        {selectedContactNum}
                                                    </button>
                                                    :
                                                    selectedContactNumLoading ?
                                                        <button
                                                            className="btn btn-success w-100"
                                                            type="button">
                                                            <div className="spinner-border text-light" role="status">
                                                                <span className="sr-only">Loading...</span>
                                                            </div>
                                                        </button>
                                                        :
                                                        <button
                                                            className="btn btn-success w-100"
                                                            type="button"
                                                            onClick={() => handleCopy(data.contact_no)}>
                                                            {selectedContactNum ? selectedContactNum : "Contact"}
                                                        </button>
                                            }
                                        </div>
                                        <button type="button" className="btn btn-danger p-2 " onClick={() => handleMessageClick(data)}>Message</button>
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>

                <div className="clearfix mb-30">
					<table className="table table-bordered">
						<tbody>
							<tr>
								<th>Brand</th>
								<td>{data.brand}</td>
							</tr>
							<tr>
								<th>Owner Name</th>
								<td>{data.owner_name}</td>
							</tr>
							<tr>
								<th>Model</th>
								<td>{data.model}</td>
							</tr>
							<tr>
								<th>Vehicle Number</th>
								<td>{data.vehicle_number}</td>
							</tr>
							<tr>
								<th>KMs Driven</th>
								<td>{data.kms_driven}</td>
							</tr>
							<tr>
								<th>Price</th>
								<td>₹ {data.price}</td>
							</tr>
							<tr>
								<th>No. of Tyres</th>
								<td>{data.no_of_tyres}</td>
							</tr>
							<tr>
								<th>Tonnage</th>
								<td>{data.tonnage}</td>
							</tr>
							<tr>
								<th>Truck Body Type</th>
								<td>{data.truck_body_type}</td>
							</tr>
                            <tr>
								<th>Location</th>
								<td>{data.location}</td>
							</tr>
							<tr>
								<th>Last Updated</th>
								<td>{data.updt ? data.updt.slice(5, 25): ''}</td>
							</tr>
						</tbody>
					</table>
				</div>
                <h4 className="title-2">Description</h4>
                <p>{data.description}</p>

                {/* <h4 className="title-2">Location</h4>
				<div className="property-details-google-map mb-60">
					<iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d9334.271551495209!2d-73.97198251485975!3d40.668170674982946!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c25b0456b5a2e7%3A0x68bdf865dda0b669!2sBrooklyn%20Botanic%20Garden%20Shop!5e0!3m2!1sen!2sbd!4v1590597267201!5m2!1sen!2sbd" width="100%" height="100%" frameBorder={0} allowFullScreen aria-hidden="false" tabIndex={0} />
				</div>  */}
            </div>
        </div>
    </div>
}

export default Product_Details

