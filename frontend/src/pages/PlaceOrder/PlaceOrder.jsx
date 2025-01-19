import React, { useContext, useState } from 'react';
import './PlaceOrder.css';
import { StoreContext } from '../../context/StoreContext';
import axios from 'axios';

const PlaceOrder = () => {
  const { getTotalCartAmount, token, food_list, cartItems, url } = useContext(StoreContext);

  const [data, setData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    street: "",
    city: "",
    state: "",
    zipcode: "",
    country: "",
    phone: ""
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const onChangeHandler = (event) => {
    const { name, value } = event.target;
    setData(prevData => ({ ...prevData, [name]: value }));
  };

  const validateForm = () => {
    // Simple validation to check if all fields are filled
    return Object.values(data).every(field => field.trim() !== "");
  };

  const placeOrder = async (event) => {
    event.preventDefault();
    if (!validateForm()) {
      setError("Please fill in all fields.");
      return;
    }

    setLoading(true);
    setError(null); // Reset error state

    let orderItems = food_list
      .filter(item => cartItems[item._id] > 0)
      .map(item => ({ ...item, quantity: cartItems[item._id] }));

    let orderData = {
      address: data,
      items: orderItems,
      amount: getTotalCartAmount() + 2,
    };

    try {
      // Place the order in your database
      const response = await axios.post(`${url}/api/order/place`, orderData, { headers: { token } });

      if (response.data.success) {
        // Redirect to the specified Stripe Checkout link
        window.location.replace("https://buy.stripe.com/test_5kA9ANdNS8d9d32dQQ");
      } else {
        setError("Error placing the order. Please try again.");
      }
    } catch (err) {
      console.error(err);
      setError("An error occurred while placing the order. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={placeOrder} className='place-order'>
      <div className='place-order-left'>
        <p className="title">Delivery Information</p>
        <div className="multi-fields">
          <input required name='firstName' onChange={onChangeHandler} value={data.firstName} type="text" placeholder='First Name' />
          <input required name='lastName' onChange={onChangeHandler} value={data.lastName} type="text" placeholder='Last Name' />
        </div>
        <input required name='email' onChange={onChangeHandler} value={data.email} type="email" placeholder='Email address' />
        <input required name='street' onChange={onChangeHandler} value={data.street} type="text" placeholder='H.no, Street, Nearest location' />
        <div className="multi-fields">
          <input required name='city' onChange={onChangeHandler} value={data.city} type="text" placeholder='City' />
          <input required name='state' onChange={onChangeHandler} value={data.state} type="text" placeholder='State' />
        </div>
        <div className="multi-fields">
          <input required name='zipcode' onChange={onChangeHandler} value={data.zipcode} type="text" placeholder='Zip Code' />
          <input required name='country' onChange={onChangeHandler} value={data.country} type="text" placeholder='Country' />
        </div>
        <input required name='phone' onChange={onChangeHandler} value={data.phone} type="text" placeholder='Phone' />
      </div>

      <div className='place-order-right'>
        <div className="cart-total">
          <h2>Cart Total</h2>
          <div>
            <div className="cart-total-details">
              <p>Subtotal</p>
              <p>{getTotalCartAmount()} TND</p>
            </div>
            <hr />
            <div className="cart-total-details">
              <p>Delivery fee</p>
              <p>{getTotalCartAmount() === 0 ? 0 : 2} TND</p>
            </div>
            <hr />
            <div className="cart-total-details">
              <b>Total</b>
              <b>{getTotalCartAmount() === 0 ? 0 : getTotalCartAmount() + 2} TND</b>
            </div>
          </div>
          <button type='submit' disabled={loading}>
            {loading ? 'Processing...' : 'PROCEED TO CHECKOUT'}
          </button>
          {error && <p className="error-message">{error}</p>}
        </div>
      </div>
    </form>
  );
};

export default PlaceOrder;