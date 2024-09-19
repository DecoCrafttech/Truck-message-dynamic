import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import Sidebar from './sidebar';
class BlogList extends Component {
	render() {
		let publicUrl = process.env.PUBLIC_URL + '/'
		return (
			<div className="ltn__blog-area mb-120">
				<div className="container">
					<div className='mt-5'>
						<div className="ltn__drop-menu ltn__currency-menu ltn__language-menu">
							<ul>
								<li className="dropdown-toggle cursorPointer"><span className="active-currency">English</span>
									<ul>
										<li className='cursorPointer'>English</li>
										<li className='cursorPointer'>Tamil</li>
										<li className='cursorPointer'>Hindi</li>
									</ul>
								</li>
							</ul>
						</div>

					</div>
					<div className="row">
						<div className="col-lg-6">
							<div className="ltn__blog-list-wrap">
								{/* Blog Item */}
								<div className="ltn__blog-item ltn__blog-item-5 go-top">
									<div className="ltn__blog-img">
										<span className='object-fit-fill rounded justify-content-center d-flex'>
											<img
												className="m-3 rounded-3 justify-content-center d-flex"
												src={publicUrl + "assets/img/blog/blog-details/12.jpg"}
												alt="truck message Logo - All in one truck solutions"
												style={{ width: '600px', height: '280px', objectFit: 'cover' }}
											/>
										</span>
									</div>
									<div className="ltn__blog-brief">
										<div className="ltn__blog-meta">
											<ul>
												<li className="ltn__blog-category">
													<Link to="/blog-grid">Business</Link>
												</li>
											</ul>
										</div>
										<h3 className="ltn__blog-title"><Link to="/blog-details">Lorem ipsum dolor sit amet, consecte
											cing elit, sed do eiusmod tempor.</Link></h3>
										<div className="ltn__blog-meta">
											<ul>
												<li>
													<Link to="/blog-details"><i className="far fa-eye" />232 Views</Link>
												</li>
												<li>
													<Link to="/blog-details"><i className="far fa-comments" />35 Comments</Link>
												</li>
												<li className="ltn__blog-date">
													<i className="far fa-calendar-alt" />June 22, 2020
												</li>
											</ul>
										</div>
										<p>Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint</p>
										<div className="ltn__blog-meta-btn">
											<div className="ltn__blog-meta">
												<ul>
													<li className="ltn__blog-author">
														<Link to="/blog-grid"><img src={publicUrl + "assets/img/blog/blog-details/12.jpg"} alt="#" />By: Ethan</Link>
													</li>
												</ul>
											</div>
											<div className="ltn__blog-btn">
												<Link to="/blog-details"><i className="fas fa-arrow-right" />Read more</Link>
											</div>
										</div>
									</div>
								</div>
							</div>
						</div>
						<div className="col-lg-6">
							<div className="ltn__blog-list-wrap">
								{/* Blog Item */}
								<div className="ltn__blog-item ltn__blog-item-5 go-top">
								<div className="ltn__blog-img">
										<span className='object-fit-fill rounded justify-content-center d-flex'>
											<img
												className="m-3 rounded-3 justify-content-center d-flex"
												src={publicUrl + "assets/img/blog/blog-details/12.jpg"}
												alt="truck message Logo - All in one truck solutions"
												style={{ width: '800px', height: '280px', objectFit: 'fill' }}
											/>
										</span>
									</div>
									<div className="ltn__blog-brief">
										<div className="ltn__blog-meta">
											<ul>
												<li className="ltn__blog-category">
													<Link to="/blog-grid">Business</Link>
												</li>
											</ul>
										</div>
										<h3 className="ltn__blog-title"><Link to="/blog-details">Lorem ipsum dolor sit amet, consecte
											cing elit, sed do eiusmod tempor.</Link></h3>
										<div className="ltn__blog-meta">
											<ul>
												<li>
													<Link to="/blog-details"><i className="far fa-eye" />232 Views</Link>
												</li>
												<li>
													<Link to="/blog-details"><i className="far fa-comments" />35 Comments</Link>
												</li>
												<li className="ltn__blog-date">
													<i className="far fa-calendar-alt" />June 22, 2020
												</li>
											</ul>
										</div>
										<p>Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint</p>
										<div className="ltn__blog-meta-btn">
											<div className="ltn__blog-meta">
												<ul>
													<li className="ltn__blog-author">
														<Link to="/blog-grid"><img src={publicUrl + "assets/img/blog/blog-details/12.jpg"} alt="#" />By: Ethan</Link>
													</li>
												</ul>
											</div>
											<div className="ltn__blog-btn">
												<Link to="/blog-details"><i className="fas fa-arrow-right" />Read more</Link>
											</div>
										</div>
									</div>
								</div>
							</div>
						</div>
						{/* <Sidebar /> */}
					</div>
				</div>
			</div>
		)
	}
}

export default BlogList;
