import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import parse from 'html-react-parser';

class Social extends Component {

    render() {

        let publicUrl = process.env.PUBLIC_URL+'/'

    return <div className="ltn__social-media">
			<ul>
				<li><a href="https://www.facebook.com/profile.php?id=61560910419014" title="Facebook"><i className="fab fa-facebook-f" /></a></li>
				<li><a href="https://www.instagram.com/truckmessage/" title="Instagram"><i className="fab fa-instagram" /></a></li>
				<li><a href="https://www.youtube.com/channel/UCxiLb3v7KyY6zunGOOth99Q" title="Youtube"><i className="fab fa-youtube" /></a></li>
			</ul>
		</div>
        }
}

export default Social