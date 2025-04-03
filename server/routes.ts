import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import axios from "axios";
import { z } from "zod";
import twilio from "twilio";

// Twilio Lookup API root for getting phone number information
const twilioApiRoot = "https://lookups.twilio.com/v2/PhoneNumbers";

const checkPhoneSchema = z.object({
  countryCode: z.string().min(1),
  countryIso2: z.string().min(2),
  phoneNumber: z.string().min(1),
  fullNumber: z.string().min(5)
});

export async function registerRoutes(app: Express): Promise<Server> {
  // Check phone number route
  app.post("/api/check-number", async (req, res) => {
    try {
      const validatedData = checkPhoneSchema.parse(req.body);
      const { fullNumber, countryCode, countryIso2, phoneNumber } = validatedData;

      // Ensure we have TWILIO_ACCOUNT_SID and TWILIO_AUTH_TOKEN
      const accountSid = process.env.TWILIO_ACCOUNT_SID;
      const authToken = process.env.TWILIO_AUTH_TOKEN;

      if (!accountSid || !authToken) {
        return res.status(500).json({ 
          message: "Twilio credentials are not configured"
        });
      }

      // Format phone number for Twilio API
      const formattedPhoneNumber = fullNumber;

      try {
        // First get information about the phone number using Lookup API
        const twilioUrl = `${twilioApiRoot}/${formattedPhoneNumber}?Fields=line_type_intelligence`;
        const authString = Buffer.from(`${accountSid}:${authToken}`).toString('base64');
        
        const twilioResponse = await axios.get(twilioUrl, {
          headers: {
            Authorization: `Basic ${authString}`
          }
        });

        const responseData = twilioResponse.data;
        
        // Extract carrier info if available
        const carrier = responseData.carrier?.name || "Unknown";
        
        // Extract line type info
        const lineType = responseData.line_type_intelligence?.type || "Unknown";
        
        // Check if it's a mobile phone (more likely to be responsive to calls)
        const isMobile = lineType.toLowerCase() === "mobile";
        
        // Now use the Twilio Voice API to make a verification call
        try {
          console.log(`Making verification call to ${formattedPhoneNumber}`);
          
          // Initialize the Twilio client
          const twilioClient = twilio(accountSid, authToken);
          
          // Make a call to the target phone number
          // We need to make sure the call is completed before sending the response
          const call = await twilioClient.calls.create({
            to: formattedPhoneNumber,
            // This should be your verified Twilio number
            from: process.env.TWILIO_PHONE_NUMBER || '+15005550006', // Use the test number if none is provided
            // Using TwiML to immediately hang up when connected
            twiml: `<Response><Hangup/></Response>`, // Hangup as soon as connected
            // Set a short timeout - call should not ring for more than 5 seconds
            timeout: 5,
          });
          
          // Get the call SID to track status
          const callSid = call.sid;
          
          // Wait for 2 seconds to let the call initiate and then cancel
          console.log(`Waiting for call ${callSid} to initiate before canceling...`);
          await new Promise(resolve => setTimeout(resolve, 2000));
          
          // Check call status and force hang-up if needed
          try {
            // Fetch the call to get current status
            const callStatus = await twilioClient.calls(callSid).fetch();
            console.log(`Call ${callSid} current status: ${callStatus.status}`);
            
            // If call is still ringing or in-progress, cancel it
            if (['queued', 'ringing', 'in-progress'].includes(callStatus.status)) {
              console.log(`Canceling call ${callSid} with status: ${callStatus.status}`);
              await twilioClient.calls(callSid).update({status: 'completed'});
              console.log(`Forced call ${callSid} to end with status: completed`);
              
              // Log final status after cancellation
              const finalStatus = await twilioClient.calls(callSid).fetch();
              console.log(`Call ${callSid} final status after cancellation: ${finalStatus.status}`);
            } else {
              console.log(`No need to cancel call ${callSid} - status already: ${callStatus.status}`);
            }
          } catch (statusErr) {
            console.error("Error checking call status:", statusErr);
          }
          
          // If we successfully initiated a call, let's determine if the number is available
          const isAvailable = true; // If we can call it, it's available
          
          // Create a record of this check
          const newPhoneCheck = await storage.createPhoneCheck({
            phoneNumber: formattedPhoneNumber,
            countryCode,
            countryIso2,
            carrier,
            lineType,
            isAvailable,
            rawResponse: responseData
          });

          // Return the response with confirmation about the call
          return res.json({
            phoneNumber: formattedPhoneNumber,
            carrier,
            lineType,
            isAvailable,
            callMade: true,
            message: "Verification call successfully placed and automatically ended. Their phone is active - they can't claim it's off or unavailable."
          });
          
        } catch (callError: any) {
          console.error("Twilio call error:", callError);
          
          // If the call failed, the phone might be busy, disconnected or unavailable
          const isAvailable = false;
          
          // Create a record of this check anyway
          const newPhoneCheck = await storage.createPhoneCheck({
            phoneNumber: formattedPhoneNumber,
            countryCode,
            countryIso2,
            carrier,
            lineType,
            isAvailable,
            rawResponse: responseData
          });
          
          // Return response indicating call failure
          return res.json({
            phoneNumber: formattedPhoneNumber,
            carrier,
            lineType,
            isAvailable,
            callMade: false,
            message: "The call couldn't be placed. The number might be off, disconnected, or not accepting calls."
          });
        }
        
      } catch (apiError: any) {
        // Handle Twilio API errors
        console.error("Twilio API error:", apiError.response?.data || apiError.message);
        
        if (apiError.response?.status === 404) {
          return res.status(404).json({ 
            message: "Phone number not found or invalid" 
          });
        }
        
        if (apiError.response?.status === 401) {
          return res.status(500).json({ 
            message: "Authentication with phone lookup service failed" 
          });
        }
        
        return res.status(500).json({ 
          message: "Error checking phone number availability" 
        });
      }
    } catch (error: any) {
      console.error("Request validation error:", error);
      return res.status(400).json({ 
        message: error.message || "Invalid request data" 
      });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
