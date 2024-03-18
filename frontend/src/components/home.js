import {useEffect, useState} from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { Button } from 'react-bootstrap';
import "./home.css";

export const Home = () => {
    const [message, setMessage] = useState('');

    useEffect(() => {
        if(localStorage.getItem('access_token') === null){
            window.location.href = '/login'  
        }
        else{
            (async () => {
            try {
                const {data} = await axios.get('http://localhost:8000/home/', {
                headers: {
                  'Content-Type': 'application/json',
                }
              });

              setMessage(data.message);
            } catch (e) {
                console.log('not auth')
            }
        })()};
    }, []);



    return (
        <div className="form-signin mt-5 text-center">
            <h1>Welcome to RECIP-EZ</h1>
            <div className="btn-wrapper">
                <div className="btn-container-left">
                    <img src="https://images.pexels.com/photos/691114/pexels-photo-691114.jpeg?auto=compress&cs=tinysrgb&w=800" alt="Pexels Image"></img>
                    <p>Don’t want to go out? Delivery is too expensive? 
                        Click on RECIPE SEARCH if you want to generate a recipe from
                        the ingredients in your fridge!</p>
                    <Link to="/recipe-search" className="btn btn-primary">RECIPE SEARCH</Link>
                </div>
                <div className="btn-container-right">
                    <img src="https://images.pexels.com/photos/264636/pexels-photo-264636.jpeg?auto=compress&cs=tinysrgb&w=800" alt="Pexels Image"></img>
                    <p>Craving a meal but don’t know what ingredients you need to cook it? Click on GROCERY LIST 
                        if you want to generate a grocery list for a recipe!</p>
                    <Link to="/grocery-search" className="btn btn-primary">GROCERY LIST</Link>
                </div>
            </div>
        </div>

    
        
    );
}