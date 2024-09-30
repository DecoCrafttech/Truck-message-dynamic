import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

const Page_header = () => {
	const location = useLocation();
	const [breadCumsArr, setBreadCumsArr] = useState([]);

	const publicUrl = process.env.PUBLIC_URL + '/'

	useEffect(() => {
		const breadcumsarray = location.pathname.split('/');
		const filterEmptyString = breadcumsarray.filter((v) => v !== '')

		console.log(filterEmptyString)
		setBreadCumsArr(filterEmptyString)
	}, [location.pathname])

	return (
		<>
			{breadCumsArr.length > 0 ?
				<div className={"pt-3 pb-4 text-left bg-overlay-white-30 bg-image "} data-bs-bg={publicUrl + "assets/img/bg/14.jpg"}>
					<div className="container">
						<div className="row">
							<div className="col-lg-12">
								<div className="ltn__breadcrumb-inner">
									<div className="ltn__breadcrumb-list">
										<ul>
											<li><Link to="/"><span className="ltn__secondary-color"><i className="fas fa-home" /></span> Home</Link></li>
											{
												breadCumsArr.map((breadCum,breadCumIndex)=>(
													<li key={breadCumIndex}>
														<Link to={breadCum} className={breadCumsArr.length == breadCumIndex+1 ? 'pe-none text-secondary text-decoration-none' :''}>{breadCum}</Link>
													</li>
												))
											}
										</ul>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div >
				:
				null
			}
		</>
	)
}


export default Page_header