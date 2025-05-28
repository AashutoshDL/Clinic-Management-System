import axios from 'axios';

paymentData = {
    "return_url": "http://localhost:5173/payment/successful",
    "amount": 12000,
    "purchase_order_id": "ORDER-123456",
    "product_name": "IPHONE 16 PRO",
    "customer_name": "John Doe",
    "customer_email": "john.doe@example.com",
    "customer_phone": "9812345678"
}

// Function to initiate payment
export const initiatePayment = async (paymentData) => {
    try {
        // Fetch the token from the environment variables
        const token = process.env.payment_token;  // Replace with your environment variable

        // Check if the token is available
        if (!token) {
            throw new Error("API token is missing from environment variables.");
        }

        // Define the API endpoint
        const url = 'https://pay.periwin.com/api/payment/process/initiate/';

        // Set up the authorization header with the token
        const config = {
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
            }
        };

        // Make the POST request with the payment data
        const response = await axios.post(url, paymentData, config);

        // Return the response from the API
        return response.data;
    } catch (error) {
        // Handle any errors and log them
        console.error('Error initiating payment:', error.message);
        throw new Error(error.message);
    }
};
