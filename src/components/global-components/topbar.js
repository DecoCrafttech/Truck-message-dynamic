import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import Social from '../section-components/social';

class TopBar extends Component {

	render() {
		let publicUrl = process.env.PUBLIC_URL + '/'
		return (
			<div>
				<div className="ltn__header-top-area section-bg-6">
					<div className="container">
						<div className="row">
							<div className="col-md-7">
								<div className="ltn__top-bar-menu">
									<ul>
										<li><a href="mailto:info@webmail.com?Subject=Flower%20greetings%20to%20you"><i className="icon-mail" /> info@webmail.com</a></li>
										<li><a href="locations.html"><i className="icon-placeholder" /> 15/A, Nest Tower, NYC</a></li>
									</ul>
								</div>
							</div>
							<div className="col-md-5">
								<div className="top-bar-right text-end">
									<div className="ltn__top-bar-menu">
										<ul>
											<li>
												{/* ltn__language-menu */}
												<div className="ltn__drop-menu ltn__currency-menu ltn__language-menu">
													<ul>
														<li><a href="#" className="dropdown-toggle"><span className="active-currency">English</span></a>
															<ul>
																<li><a href="#">English</a></li>
																<li><a href="#">Tamil</a></li>
																<li><a href="#">Hindi</a></li>
															</ul>
														</li>
													</ul>
												</div>
											</li>
										</ul>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		)
	}
}


export default TopBar