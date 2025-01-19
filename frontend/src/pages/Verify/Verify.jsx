import React, { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import axios from 'axios';

const Verify = () => {
    const [searchParams] = useSearchParams();
    const success = searchParams.get("success");
    const orderId = searchParams.get("orderId");
    const navigate = useNavigate();

    const verifyPayment = async () => {
        try {
            const response = await axios.post('/api/order/verify', { success, orderId });
            if (response.data.success) {
                // Redirect to the menu page after successful payment
                navigate("/menu"); // Adjust the path to your menu route
            } else {
                navigate("/"); // Redirect to home or show an error
            }
        } catch (error) {
            console.error("Error verifying payment:", error);
            navigate("/"); // Redirect to home or show an error
        }
    };

    useEffect(() => {
        verifyPayment();
    }, []);

    return (
        <div className='verify'>
            <div className="spinner"></div>
        </div>
    );
};

export default Verify;