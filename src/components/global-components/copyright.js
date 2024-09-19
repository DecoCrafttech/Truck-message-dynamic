import React, { Component } from 'react';
import { Link } from 'react-router-dom';

class CopyRight extends Component {

	render() {

		let publicUrl = process.env.PUBLIC_URL + '/'

		return (
			<div className="ltn__copyright-area ltn__copyright-2 section-bg-7  plr--5">
				<div className="container ltn__border-top-2">
					<div className="row">
						<div className="col-md-6 col-12">
							<div className="ltn__copyright-design clearfix">
								<p>TruckMessage @ All Rights Reserved <span className="current-year" /></p>
							</div>
						</div>
						<div className="col-md-6 col-12 align-self-center">
							<div className="ltn__copyright-menu text-end">
								<p><link></link>Design and Developed by &nbsp;
								<a className='footercls' href="http://decocrafttech.com" target='_blank'>Deco Craft Tech</a>
								
                        </p>
							</div>
						</div>
					</div>
				</div>
			</div>
		)
	}
}


export default CopyRight