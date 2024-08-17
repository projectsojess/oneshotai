import { logger } from "@/logger/logger";
import axios from "axios";
import qs from 'querystring'
import crypto from 'crypto';
import crc32 from 'buffer-crc32';
import fs from 'fs/promises';
import fetch from 'node-fetch';

const clientId = process.env.PAYPAL_CLIENT_ID;
const clientSecret = process.env.PAYPAL_SECRET;

const CACHE_DIR = process.env.CACHE_DIR || '.';
const WEBHOOK_ID = process.env.WEBHOOK_ID || '<from when the listener URL was subscribed>';

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

  async function downloadAndCache(url) {
    const filePath = `${CACHE_DIR}/paypal-cert-${WEBHOOK_ID}`;
  
    // Check if cached file exists
    try {
      const cachedData = await fs.readFile(filePath, 'utf-8');
      if (cachedData) {
        return cachedData;
      }
    } catch (error) {
      const response = await fetch(url);
      const data = await response.text();
      
      try {
        await fs.writeFile(filePath, data);
      } catch (writeError) {
      }
  
      return data;
  
    }

  }

  export async function verifySignature(event, headers) {
    const transmissionId = headers.get('paypal-transmission-id');
    const timeStamp = headers.get('paypal-transmission-time');
    const crc = parseInt("0x" + crc32(event).toString('hex')); // hex crc32 of raw event data, parsed to decimal form
  
    const message = `${transmissionId}|${timeStamp}|${WEBHOOK_ID}|${crc}`;
    const certPem = await downloadAndCache(headers.get('paypal-cert-url'));
  
    // Create buffer from base64-encoded signature
    const signatureBuffer = Buffer.from(headers.get('paypal-transmission-sig'), 'base64');
  
    // Create a verification object
    const verifier = crypto.createVerify('SHA256');
  
    // Add the original message to the verifier
    verifier.update(message);
  
    return verifier.verify(certPem, signatureBuffer);
  }