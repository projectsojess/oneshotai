import { logger } from "@/logger/logger";
import axios from "axios";
import qs from 'querystring'
const clientId = process.env.PAYPAL_CLIENT_ID;
const clientSecret = process.env.PAYPAL_SECRET;

const data = qs.stringify({
  'grant_type': 'client_credentials'
});

export const getPayPalAccessToken = async () => {
  try {
    const response = await axios.post('https://api-m.sandbox.paypal.com/v1/oauth2/token', data, {
      headers: { 
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      auth: {
        username: clientId,
        password: clientSecret
      }
    });

    return response.data.access_token;
  } catch (error) {
    logger.error('Error getting PayPal access token:');
    throw error;
  }
};


export const getSubscription = async (subscriptionId, accessToken) => {
    try {
      const response = await axios.get(`https://api-m.sandbox.paypal.com/v1/billing/subscriptions/${subscriptionId}`, {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      });
  
      return response.data;
    } catch (error) {
      logger.error('Error fetching subscription:');
      throw error;
    }
  };