import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import axios from "axios";
import { z } from "zod";

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
        // Make request to Twilio API
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
        
        // Determine availability (mobile phones are more likely to be available for texting)
        const isMobile = lineType.toLowerCase() === "mobile";
        const isAvailable = isMobile;

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

        // Return the response
        return res.json({
          phoneNumber: formattedPhoneNumber,
          carrier,
          lineType,
          isAvailable,
          message: isAvailable 
            ? "This number is available to contact!" 
            : "This number might be busy."
        });
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
