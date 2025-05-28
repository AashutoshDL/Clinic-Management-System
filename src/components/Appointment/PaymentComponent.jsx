import React, { useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import {
  Elements,
  CardElement,
  useStripe,
  useElements
} from '@stripe/react-stripe-js';
import axios from 'axios';
import { baseURL } from '../service/baseURL';
import { X, CheckCircle } from 'lucide-react';

// Load Stripe publishable key
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

// Stripe card styling options
const CARD_ELEMENT_OPTIONS = {
  style: {
    base: {
      color: '#32325d',
      fontFamily: 'Arial, sans-serif',
      fontSize: '16px',
      '::placeholder': {
        color: '#aab7c4'
      },
    },
    invalid: {
      color: '#fa755a',
      iconColor: '#fa755a'
    }
  }
};

// Main form for Stripe payment
const CheckoutForm = ({ appointmentData, onPaymentSuccess, onPaymentError }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!stripe || !elements) return;

    setLoading(true);
    setError('');

    try {
      const { data } = await axios.post(`${baseURL}/payment`, {
        amount: appointmentData.amount,
        purchase_order_id: `APPT-${Date.now()}`,
        product_name: `Appointment with Dr. ${appointmentData.doctorName}`,
        customer_name: appointmentData.patientName,
        customer_email: appointmentData.patientEmail || 'test@example.com',
        customer_phone: appointmentData.patientPhone || '9800000000'
      });

      const result = await stripe.confirmCardPayment(data.clientSecret, {
        payment_method: {
          card: elements.getElement(CardElement),
          billing_details: {
            name: appointmentData.patientName
          }
        }
      });

      if (result.error) {
        setError(result.error.message);
        onPaymentError(result.error.message);
      } else if (result.paymentIntent.status === 'succeeded') {
        onPaymentSuccess(result.paymentIntent);
      }
    } catch (err) {
      const errorMessage =
        err.response?.data?.message || 'Something went wrong.';
      setError(errorMessage);
      onPaymentError(errorMessage);
    }

    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="p-3 bg-white border border-gray-300 rounded-md focus-within:ring-2 ring-blue-500">
        <CardElement options={CARD_ELEMENT_OPTIONS} />
      </div>

      {error && (
        <div className="text-red-600 text-sm flex items-center gap-2">
          <X className="w-4 h-4" />
          {error}
        </div>
      )}

      <button
        type="submit"
        disabled={!stripe || loading}
        className={`w-full py-2 px-4 text-white font-semibold rounded-md ${
          loading || !stripe ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
        }`}
      >
        {loading ? 'Processing...' : 'Pay Now'}
      </button>
    </form>
  );
};

// Modal for Appointment Payment
const AppointmentPayment = ({ appointmentData, onClose, onSuccess }) => {
  const [paymentStatus, setPaymentStatus] = useState('pending');
  const [paymentMessage, setPaymentMessage] = useState('');

  const getConsultationFee = () => {
    const specialization = appointmentData?.specialization?.toLowerCase() || '';
    if (specialization.includes('cardiologist')) return 1500;
    if (specialization.includes('dermatologist')) return 1200;
    if (specialization.includes('pediatric')) return 1000;
    if (specialization.includes('ortho')) return 1300;
    if (specialization.includes('neuro')) return 1800;
    if (specialization.includes('gynecologist')) return 1200;
    return 800;
  };

  const handlePaymentSuccess = (paymentIntent) => {
    setPaymentStatus('success');
    setPaymentMessage('Payment successful! Your appointment is confirmed.');
    onSuccess?.({
      paymentId: paymentIntent.id,
      amount: paymentIntent.amount / 100,
      status: 'paid'
    });
  };

  const handlePaymentError = (message) => {
    setPaymentStatus('error');
    setPaymentMessage(message);
  };

  const paymentData = {
    ...appointmentData,
    amount: getConsultationFee()
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-4">
      <div className="bg-white rounded-lg w-full max-w-md shadow-lg overflow-y-auto max-h-[90vh]">
        <div className="bg-blue-600 text-white p-4 rounded-t-lg flex justify-between items-center">
          <h2 className="text-lg font-bold">Complete Payment</h2>
          <button onClick={onClose}>
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6">
          {paymentStatus === 'success' ? (
            <div className="text-center">
              <CheckCircle className="text-green-500 w-12 h-12 mx-auto" />
              <p className="mt-4 text-green-700">{paymentMessage}</p>
              <button
                onClick={onClose}
                className="mt-6 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
              >
                Continue
              </button>
            </div>
          ) : (
            <>
              <h3 className="text-md font-semibold mb-3">Appointment Summary</h3>
              <div className="mb-6 text-sm bg-gray-50 p-4 rounded-md space-y-1">
                <div className="flex justify-between">
                  <span>Doctor</span>
                  <span>Dr. {appointmentData.doctorName}</span>
                </div>
                <div className="flex justify-between">
                  <span>Date</span>
                  <span>{appointmentData.date}</span>
                </div>
                <div className="flex justify-between">
                  <span>Time</span>
                  <span>{appointmentData.time}</span>
                </div>
                <div className="flex justify-between">
                  <span>Specialization</span>
                  <span>{appointmentData.specialization}</span>
                </div>
                <div className="border-t pt-2 mt-2 flex justify-between font-semibold">
                  <span>Consultation Fee</span>
                  <span>₹{getConsultationFee().toFixed(2)}</span>
                </div>
              </div>

              <h3 className="text-md font-semibold mb-3">Card Payment</h3>
              <Elements stripe={stripePromise}>
                <CheckoutForm
                  appointmentData={paymentData}
                  onPaymentSuccess={handlePaymentSuccess}
                  onPaymentError={handlePaymentError}
                />
              </Elements>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default AppointmentPayment;
