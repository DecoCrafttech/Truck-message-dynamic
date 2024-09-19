import React from 'react';
import ReactDOM from 'react-dom';
import {Provider} from 'react-redux';
import App from './App';
import Store from './Storage/Store';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "bootstrap/dist/css/bootstrap.min.css"
import "./components/section-components/SignInPage.css"
const Root = () =>{
    return(
        <Provider store={Store}>
            <App/>
        </Provider>
    )
}

export default Root;

ReactDOM.render(<Root />, document.getElementById('quarter'));
