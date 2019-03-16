import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import configureStore from './store/configureStore';
import './index.css';
import App from './views/App';
import {BrowserRouter} from 'react-router-dom'

ReactDOM.render(
    <Provider store={configureStore}>
        <BrowserRouter>
            <App />
        </BrowserRouter>
    </Provider>,
    document.getElementById('root'));