import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './Orders.css'; // Import your CSS file

const Orders = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const url = "http://localhost:4000"; // Ensure this matches your backend server

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const response = await axios.get(`${url}/api/order/all`);
                if (response.data.success) {
                    setOrders(response.data.orders);
                } else {
                    setError('Failed to fetch orders');
                }
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchOrders();
    }, [url]);

    if (loading) return <p>Loading...</p>;
    if (error) return <p>{error}</p>;

    return (
        <div className="orders-container">
            <h2>All Orders</h2>
            <table className="orders-table">
                <thead>
                    <tr>
                        <th>Order ID</th>
                        <th>User ID</th>
                        <th>Items</th>
                        <th>Total Amount</th>
                        <th>Payment Status</th>
                        <th>Address</th>
                        <th>Status</th>
                        <th>Date</th>
                    </tr>
                </thead>
                <tbody>
                    {Array.isArray(orders) && orders.length > 0 ? (
                        orders.map(order => (
                            <tr key={order._id}>
                                <td>{order._id}</td>
                                <td>{order.userId}</td>
                                <td>
                                    {order.items.map((item, index) => (
                                        <div key={index}>{item.name} (x{item.quantity})</div>
                                    ))}
                                </td>
                                <td>{order.amount} TND</td>
                                <td>
                                    {order.payment ? (
                                        <span className="status-paid">Paid</span>
                                    ) : (
                                        <span className="status-pending">Pending</span>
                                    )}
                                </td>
                                <td>
                                    {`${order.address.street}, ${order.address.city}, ${order.address.state}, ${order.address.zipcode}, ${order.address.country}`}
                                </td>
                                <td>{order.status}</td>
                                <td>{new Date(order.date).toLocaleString()}</td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="8">No orders found</td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default Orders;