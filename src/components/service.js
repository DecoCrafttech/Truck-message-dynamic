import React, { Component } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { GiMineTruck } from "react-icons/gi";
import { FaTruckLoading } from "react-icons/fa";
import { PiFireTruckFill } from "react-icons/pi";
import { MdPersonalInjury } from "react-icons/md";
import { FaHandHoldingDollar } from "react-icons/fa6";
import { BsFuelPumpDiesel } from "react-icons/bs";
import { FaToriiGate } from "react-icons/fa6";
import { PiSpeedometerFill } from "react-icons/pi";
import { BsShieldShaded } from "react-icons/bs";
import { GiSpeedometer } from "react-icons/gi";


const Service_V1 = () => {
    const pageRender = useNavigate()

	let publicUrl = process.env.PUBLIC_URL + '/'

	return <div className="ltn__service-area section-bg-1 pt-115 pb-70 go-top">
		<div className="container">
			<div className="row">
				<div className="col-lg-12">
					<div className="section-title-area ltn__section-title-2--- text-center">
						<h6 className="section-subtitle section-subtitle-2 ltn__secondary-color">Our Comprehensive Services</h6>
						<h1 className="section-title">Tailored Solutions for All Your Trucking Needs</h1>
					</div>
				</div>
			</div>
			<div className="row  ">

				<div className="col-lg-4 col-sm-6 col-12" onClick={() => pageRender("/load-availability")}>
					<div className="ltn__feature-item ltn__feature-item-6 text-center bg-white  box-shadow-1">
						<div className="ltn__feature-icon">
							<span><FaTruckLoading /></span>
						</div>
						<div className="ltn__feature-info">
							<h3 className='apara'>Load Availability </h3>
							<p>Maximize Your Truck's Productivity with every days loads</p>
						</div>
					</div>
				</div>

				<div className="col-lg-4 col-sm-6 col-12" onClick={() => pageRender("/blog-details")}>
					<div className="ltn__feature-item ltn__feature-item-6 text-center bg-white  box-shadow-1">
						<div className="ltn__feature-icon">
							<span><PiFireTruckFill /></span>
						</div>
						<div className="ltn__feature-info">
							<h3 className='apara'>Truck Availability </h3>
							<p>Reliable Trucks for All Your Hauling Needs on time</p>
						</div>
					</div>
				</div>

				<div className="col-lg-4 col-sm-6 col-12" onClick={() => pageRender("/blog-grid")}>
					<div className="ltn__feature-item ltn__feature-item-6 text-center bg-white  box-shadow-1">
						<div className="ltn__feature-icon">
							<span><MdPersonalInjury /></span>
						</div>
						<div className="ltn__feature-info">
							<h3 className='apara'>Driver Needs </h3>
							<p>Effortlessly Connecting You with Skilled Truck Drivers</p>
						</div>
					</div>
				</div>

				<div className="col-lg-4 col-sm-6 col-12" onClick={() => pageRender("/blog-left-sidebar")}>
					<div className="ltn__feature-item ltn__feature-item-6 text-center bg-white  box-shadow-1">
						<div className="ltn__feature-icon">
							<span><GiMineTruck /></span>
						</div>
						<div className="ltn__feature-info">
							<h3 className='apara'>Buy & sell</h3>
							<p>Quality Pre-Owned Trucks at Competitive Prices</p>
						</div>
					</div>
				</div>



				<div className="col-lg-4 col-sm-6 col-12" onClick={() => pageRender("/toll-calculator")}>
					<div className="ltn__feature-item ltn__feature-item-6 text-center bg-white  box-shadow-1">
						<div className="ltn__feature-icon">
							<span><FaToriiGate /></span>
						</div>
						<div className="ltn__feature-info">
							<h3 className='apara'>Toll Calculator</h3>
							<p>Plan Your Routes with Confidence and Precision</p>
						</div>
					</div>
				</div>
				<div className="col-lg-4 col-sm-6 col-12" onClick={() => pageRender("/team-details")}>
					<div className="ltn__feature-item ltn__feature-item-6 text-center bg-white  box-shadow-1">
						<div className="ltn__feature-icon">
							<span><PiSpeedometerFill /></span>
						</div>
						<div className="ltn__feature-info">
							<h3 className='apara'>Mileage Calculator</h3>
							<p>Track Optimize & Calculate Your Fuel Efficiency</p>
						</div>
					</div>
				</div>
				{/* <div className="col-lg-4 col-sm-6 col-12">
						<div className="ltn__feature-item ltn__feature-item-6 text-center bg-white  box-shadow-1">
							<div className="ltn__feature-icon">
								<span><BsFuelPumpDiesel /></span>
							</div>
							<div className="ltn__feature-info">
								<h3><Link to="/fuelprice" className='apara'>Fuel Price</Link></h3>
								<p>Track and Optimize Your Fuel Costs Daily without missing</p>
							</div>
						</div>
					</div> */}


				<div className="col-lg-4 col-sm-6 col-12" onClick={() => pageRender("/expense-calculator")}>
					<div className="ltn__feature-item ltn__feature-item-6 text-center bg-white  box-shadow-1">
						<div className="ltn__feature-icon">
							<span><FaHandHoldingDollar /></span>
						</div>
						<div className="ltn__feature-info">
							<h3 className='apara'>Expense Calculator</h3>
							<p>Manage & Calculate Your Realtime Trucking Costs</p>
						</div>
					</div>
				</div>

				<div className="col-lg-4 col-sm-6 col-12" onClick={() => pageRender("/coming-soon")} >
					<div className="ltn__feature-item ltn__feature-item-6 text-center bg-white  box-shadow-1">
						<div className="ltn__feature-icon">
							<span><GiSpeedometer /></span>
						</div>
						<div className="ltn__feature-info ">
							<h3 className='apara'>Fast Tag </h3>
							<p>Convenient and Hassle-Free Toll Payments</p>
						</div>
					</div>
				</div>

				<div className="col-lg-4 col-sm-6 col-12"  onClick={() => pageRender("/coming-soon")}>
					<div className="ltn__feature-item ltn__feature-item-6 text-center bg-white  box-shadow-1">
						<div className="ltn__feature-icon">
							<span><BsShieldShaded /></span>
						</div>
						<div className="ltn__feature-info">
							<h3 className='apara'>Insurance</h3>
							<p>Protect Your Assets with Our Coverage Plans</p>
						</div>
					</div>
				</div>




			</div>
		</div>
	</div>
}

export default Service_V1

