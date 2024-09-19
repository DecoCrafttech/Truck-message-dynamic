import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaWeightHanging, FaTruck, FaLocationDot } from "react-icons/fa6";
import { SiMaterialformkdocs } from "react-icons/si";
import { GiCarWheel } from "react-icons/gi";
import { Link, useNavigate } from 'react-router-dom'; // Assuming you are using react-router for navigation

function Truck_availability() {
    const navigate =useNavigate();
    const [cards, setCards] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [cardsPerPage] = useState(9); // Adjust the number of cards per page as needed
    const [isSignedIn, setIsSignedIn] = useState(false); // State for user sign-in status
    const [showLoginPopup, setShowLoginPopup] = useState(false); // State to manage login popup visibility
    const [filters, setFilters] = useState({
        search: '',
    });

    useEffect(() => {
        axios.get('https://truck.truckmessage.com/all_load_details')
            .then(response => {
                if (response.data.success && Array.isArray(response.data.data)) {
                    setCards(response.data.data);
                } else {
                    console.error('Unexpected response format:', response.data);
                }
            })
            .catch(error => {
                console.error('There was an error fetching the data!', error);
            });
    }, []);

    const handleFilterChange = (e) => {
        setFilters({
            search: e.target.value,
        });
    };

    const filterCards = (cards) => {
        return cards.filter(card => {
            const search = filters.search.toLowerCase();
            return (
                card.from_location.toLowerCase().includes(search) ||
                card.to_location.toLowerCase().includes(search) ||
                card.tone.toString().includes(search) ||
                card.material.toLowerCase().includes(search) ||
                card.no_of_tyres.toString().includes(search) ||
                card.truck_body_type.toLowerCase().includes(search)
            );
        });
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

    // Handle "View Details" button click
    const handleViewDetails = () => {
        setIsSignedIn(true);
        // if (isSignedIn) {
        //     // Logic to show call and message buttons
        // } else {
        //     setShowLoginPopup(false); // Show login popup if not signed in
        // }
    };


    const handleMessageClick = (card) => {
        navigate(`/chat?person_id=${card.user_id}`);
    };

    return (
        <div>
            <div className="ltn__product-area ltn__product-gutter mb-50 mt-60">
                <div className="container">
                    <div className="row">
                        <div className="col-lg-12">
                            <div className="ltn__shop-options">
                                <ul>
                                    
                                    <li>
                                        <div className="showing-product-number text-right">
                                            <span>Showing {indexOfFirstCard + 1}-{Math.min(indexOfLastCard, filteredCards.length)} of {filteredCards.length} results</span>
                                        </div>
                                    </li>
                                    <div className="header-top-btn">
                                        <Link to="/add-listing"> + Add Truck availability</Link>
                                    </div>
                                </ul>
                            </div>
                        </div>
                        <div className="col-lg-12">
                            {/* Search Widget */}
                            <div className="ltn__search-widget mb-0">
                                <form action="#">
                                    <input type="text" name="search" placeholder="Search by" onChange={handleFilterChange} />
                                    
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className='container'>
                <div className="row row-cols-1 row-cols-md-3 g-4 mb-60 ">
                    {currentCards.map(card => (
                        <div className="col" key={card.id}>
                            <div className="card h-100 shadow truckcard">
                                <div className='card-header mt-2 border-0 mb-2'>
                                    <h5 className="card-title cardmodify">{card.company_name}</h5>
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
                                        <div className="col-lg-6 cardicon">
                                            <div>
                                                <label><FaWeightHanging className='me-2' />{card.tone} ton</label>
                                            </div>
                                        </div>
                                        <div className="col-lg-6 cardicon">
                                            <div><label><SiMaterialformkdocs className='me-2' />{card.material}</label></div>
                                        </div>
                                        <div className="col-lg-6 cardicon">
                                            <label><GiCarWheel className='me-2' />{card.no_of_tyres} wheels</label>
                                        </div>
                                        <div className="col-lg-6 cardicon">
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
                                        {isSignedIn ? (
                                            <div className="d-flex gap-2 justify-content-between mt-3">
                                                <button className="btn cardbutton" type="button">Call</button>
                                                <button className="btn cardbutton" type="button" onClick={() => handleMessageClick(card)}>Message</button>
                                            </div>
                                        ) :
                                        <div className="d-grid gap-2">
                                            <button className="btn cardbutton" type="button" onClick={handleViewDetails}>View Details</button>
                                        </div>
                                        }
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
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

export default Truck_availability;


// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import { FaWeightHanging, FaTruck, FaLocationDot } from "react-icons/fa6";
// import { SiMaterialformkdocs } from "react-icons/si";
// import { GiCarWheel } from "react-icons/gi";
// import { Link } from 'react-router-dom'; // Assuming you are using react-router for navigation

// function Truck_availability() {
//     const [cards, setCards] = useState([]);
//     const [currentPage, setCurrentPage] = useState(1);
//     const [cardsPerPage] = useState(9); // Adjust the number of cards per page as needed
//     const [sortCriteria, setSortCriteria] = useState('default');
//     const [isSignedIn, setIsSignedIn] = useState(false); // State for user sign-in status
//     const [showLoginPopup, setShowLoginPopup] = useState(false); // State to manage login popup visibility

//     useEffect(() => {
//         axios.get('https://truck.truckmessage.com/all_load_details')
//             .then(response => {
//                 if (response.data.success && Array.isArray(response.data.data)) {
//                     setCards(response.data.data);
//                 } else {
//                     console.error('Unexpected response format:', response.data);
//                 }
//             })
//             .catch(error => {
//                 console.error('There was an error fetching the data!', error);
//             });
//     }, []);

//     const handleSortChange = (e) => {
//         setSortCriteria(e.target.value);
//     };

//     const sortCards = (cards) => {
//         switch (sortCriteria) {
//             case 'tons':
//                 return [...cards].sort((a, b) => a.tone - b.tone);
//             case 'wheels':
//                 return [...cards].sort((a, b) => a.no_of_tyres - b.no_of_tyres);
//             case 'truck_body_type':
//                 return [...cards].sort((a, b) => a.truck_body_type.localeCompare(b.truck_body_type));
//             case 'material':
//                 return [...cards].sort((a, b) => a.material.localeCompare(b.material));
//             case 'from_to':
//                 return [...cards].sort((a, b) => a.from_location.localeCompare(b.from_location) || a.to_location.localeCompare(b.to_location));
//             default:
//                 return cards;
//         }
//     };

//     // Calculate the index of the last card on the current page
//     const indexOfLastCard = currentPage * cardsPerPage;
//     // Calculate the index of the first card on the current page
//     const indexOfFirstCard = indexOfLastCard - cardsPerPage;
//     // Get the cards to be displayed on the current page
//     const currentCards = sortCards(cards).slice(indexOfFirstCard, indexOfLastCard);

//     // Calculate the total number of pages
//     const totalPages = Math.ceil(cards.length / cardsPerPage);

//     // Handle page change
//     const paginate = (pageNumber) => setCurrentPage(pageNumber);

//     // Handle "View Details" button click
//     const handleViewDetails = () => {
//         setIsSignedIn(true);
//         // if (isSignedIn) {
//         //     // Logic to show call and message buttons
//         // } else {
//         //     setShowLoginPopup(false); // Show login popup if not signed in
//         // }
//     };

//     // Handle login (dummy implementation for demonstration)
//     const handleLogin = () => {
//         setIsSignedIn(true);
//         setShowLoginPopup(false);
//     };

//     return (
//         <div>
//             <div className="ltn__product-area ltn__product-gutter mb-100">
//                 <div className="container">
//                     <div className="row">
//                         <div className="col-lg-12">
//                             <div className="ltn__shop-options">
//                                 <ul>
//                                     {/* <li>
//                                         <div className="ltn__grid-list-tab-menu ">
//                                             <div className="nav">
//                                                 <a className="active show" data-bs-toggle="tab" href="#liton_product_grid"><i className="fas fa-th-large" /></a>
//                                                 <a data-bs-toggle="tab" href="#liton_product_list"><i className="fas fa-list" /></a>
//                                             </div>
//                                         </div>
//                                     </li> */}
//                                     <li>
//                                         <div className="short-by text-center">
//                                             <select className="nice-select" onChange={handleSortChange}>
//                                                 <option value="default">Default sorting</option>
//                                                 <option value="tons">Sort by tons</option>
//                                                 <option value="wheels">Sort by wheels</option>
//                                                 <option value="truck_body_type">Sort by truck body type</option>
//                                                 <option value="material">Sort by material</option>
//                                                 <option value="from_to">Sort by from & to locations</option>
//                                             </select>
//                                         </div>
//                                     </li>
//                                     <li>
//                                         <div className="showing-product-number text-right">
//                                             <span>Showing {indexOfFirstCard + 1}-{Math.min(indexOfLastCard, cards.length)} of {cards.length} results</span>
//                                         </div>
//                                     </li>
//                                     <div className="header-top-btn">
//                                         <Link to="/add-listing">+ Add Truck</Link>
//                                     </div>
//                                 </ul>
//                             </div>
//                         </div>
//                         <div className="col-lg-12">
//                             {/* Search Widget */}
//                             <div className="ltn__search-widget mb-30">
//                                 <form action="#">
//                                     <input type="text" name="search" placeholder="Search your keyword..." />
//                                     <button style={{ borderRadius: '10px', width: '60px' }} type="submit"><i className="fas fa-search" /></button>
//                                 </form>
//                             </div>
//                         </div>
//                     </div>
//                 </div>
//             </div>
//             <div className='container'>
//                 <div className="row row-cols-1 row-cols-md-3 g-4">
//                     {currentCards.map(card => (
//                         <div className="col" key={card.id}>
//                             <div className="card h-100 shadow truckcard">
//                                 <div className='card-header mt-2 border-0 mb-2'>
//                                     <h5 className="card-title cardmodify">{card.company_name}</h5>
//                                 </div>
//                                 <div className="card-body p-3 mt-2 mb-2">
//                                     <div className='row'>
//                                         <div className="col-lg-12 cardicon">
//                                             <div>
//                                                 <label><FaLocationDot className='me-2' />{card.from_location}</label>
//                                             </div>
//                                         </div>
//                                         <div className="col-lg-12 cardicon">
//                                             <div><label><FaLocationDot className='me-2' />{card.to_location}</label></div>
//                                         </div>
//                                     </div>
//                                     <hr className="hr m-2" />
//                                     <div className='row mt-3'>
//                                         <div className="col-lg-6 cardicon">
//                                             <div>
//                                                 <label><FaWeightHanging className='me-2' />{card.tone} ton</label>
//                                             </div>
//                                         </div>
//                                         <div className="col-lg-6 cardicon">
//                                             <div><label><SiMaterialformkdocs className='me-2' />{card.material}</label></div>
//                                         </div>
//                                         <div className="col-lg-6 cardicon">
//                                             <label><GiCarWheel className='me-2' />{card.no_of_tyres} wheels</label>
//                                         </div>
//                                         <div className="col-lg-6 cardicon">
//                                             <label><FaTruck className='me-2' />{card.truck_body_type}</label>
//                                         </div>
//                                     </div>
//                                     <div className='m-2'>
//                                         <h5 className="card-title mt-3">{card.company_name}</h5>
//                                         <p className="card-text paragraph">{card.description}</p>
//                                     </div>
//                                 </div>
//                                 <div className="card-footer mb-3">
//                                     <div>
                                       
//                                         {isSignedIn ? (
//                                             <div className="d-flex gap-2 justify-content-between mt-3">
//                                                 <button className="btn cardbutton" type="button">Call</button>
//                                                 <button className="btn cardbutton" type="button">Message</button>
//                                             </div>
//                                         ) :
//                                         <div className="d-grid gap-2">
//                                         <button className="btn cardbutton" type="button" onClick={handleViewDetails}>View Details</button>
//                                     </div>
//                                         }
//                                     </div>
//                                 </div>
//                             </div>
//                         </div>
//                     ))}
//                 </div>
//                 <div className='pagination'>
//                     <ul className='pagination-list'>
//                          {Array.from({ length: totalPages }, (_, index) => (
//                             <li key={index + 1} className='pagination-item'>
//                                 <button
//                                     onClick={() => paginate(index + 1)}
//                                     className={currentPage === index + 1 ? 'pagination-link active' : 'pagination-link'}
//                                 >
//                                     {index + 1}
//                                 </button>
//                             </li>
//                         ))}
//                     </ul>
//                 </div>
//             </div>
//         </div>
//     );
// }

// export default Truck_availability;

