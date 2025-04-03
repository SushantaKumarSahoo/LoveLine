import { Copy, HeartCrack, AlertCircle, ThumbsUp, AlertTriangle, Smartphone, Wifi, Phone } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const ResultDisplay = ({ result, loading, error }) => {
  const { toast } = useToast();

  const copyNumber = () => {
    if (!result) return;
    
    navigator.clipboard.writeText(result.phoneNumber)
      .then(() => {
        toast({
          title: "Copied to clipboard",
          description: "Phone number has been copied!",
        });
      })
      .catch(() => {
        toast({
          variant: "destructive",
          title: "Failed to copy",
          description: "Could not copy number to clipboard",
        });
      });
  };

  return (
    <div className="mt-8">
      <div className="p-5 rounded-lg border border-gray-200 bg-gray-50">
        <h3 className="font-display text-lg font-semibold mb-3">Relationship Investigation Results</h3>
        
        {/* Loading State */}
        {loading && (
          <div className="py-6 flex flex-col justify-center items-center">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary mb-4"></div>
            <p className="font-medium text-gray-800 mb-1">Making Verification Call...</p>
            <p className="text-sm text-gray-600 max-w-sm text-center">
              We're calling the number right now. The call will verify if their phone is active and online, exposing any lies about it being "off" or "unavailable".
            </p>
            <div className="mt-3 p-2 rounded-md bg-blue-50 border border-blue-100 text-xs text-blue-700 max-w-sm text-center">
              Don't worry - the call will automatically end after 1 second. They'll see a missed call but won't have time to answer. Results will appear here soon.
            </div>
          </div>
        )}
        
        {/* Error State */}
        {error && !loading && (
          <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/20">
            <div className="flex items-start">
              <AlertCircle className="text-destructive mt-1 mr-3 h-5 w-5" />
              <div>
                <p className="font-medium text-destructive">Investigation failed</p>
                <p className="text-sm text-gray-600 mt-1">{error}</p>
              </div>
            </div>
          </div>
        )}
        
        {/* Success State */}
        {result && !loading && !error && (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-600 flex items-center">
                <Smartphone className="h-4 w-4 mr-1" />
                <span>Phone Number:</span>
              </span>
              <div className="flex items-center">
                <span className="font-medium">{result.phoneNumber}</span>
                <button 
                  className="ml-2 text-primary hover:text-primary/80" 
                  onClick={copyNumber}
                >
                  <Copy className="h-4 w-4" />
                </button>
              </div>
            </div>
            
            {result.carrier && (
              <div className="flex justify-between items-center">
                <span className="text-gray-600 flex items-center">
                  <Wifi className="h-4 w-4 mr-1" />
                  <span>Network Provider:</span>
                </span>
                <span className="font-medium">{result.carrier}</span>
              </div>
            )}
            
            {result.lineType && (
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Device Type:</span>
                <span className="font-medium capitalize">{result.lineType}</span>
              </div>
            )}
            
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Phone Status:</span>
              <div className="flex items-center">
                <span className={`inline-block w-2 h-2 rounded-full ${result.isAvailable ? 'bg-success' : 'bg-destructive'} mr-2`}></span>
                <span className={`font-medium ${result.isAvailable ? 'text-success' : 'text-destructive'}`}>
                  {result.isAvailable ? 'Available' : 'Busy/Unavailable'}
                </span>
              </div>
            </div>

            <div className={`p-4 rounded-lg ${result.isAvailable ? 'bg-green-50 border border-green-200' : 'bg-destructive/10 border border-destructive/20'} mt-2`}>
              <div className="flex items-start">
                {result.isAvailable ? (
                  <ThumbsUp className="text-green-600 mt-1 mr-3 h-5 w-5" />
                ) : (
                  <HeartCrack className="text-destructive mt-1 mr-3 h-5 w-5" />
                )}
                <div>
                  <h4 className="font-medium text-gray-900 mb-1">
                    {result.isAvailable 
                      ? "TRUTH REVEALED: Phone Is Active!" 
                      : "Suspicious Activity Possible"}
                  </h4>
                  
                  {/* Show verification call results */}
                  {result.callMade !== undefined && (
                    <div className={`mb-3 p-2 rounded ${result.callMade ? 'bg-blue-100' : 'bg-amber-100'}`}>
                      <div className="flex items-center">
                        <Phone className={`${result.callMade ? 'text-blue-600' : 'text-amber-600'} h-4 w-4 mr-2`} />
                        <p className="text-sm font-medium">
                          {result.callMade 
                            ? "Verification Call Successfully Placed" 
                            : "Verification Call Failed"}
                        </p>
                      </div>
                    </div>
                  )}
                  
                  <p className="text-sm">
                    {result.isAvailable 
                      ? "Our verification call reached this phone! This proves the phone is active and accessible, contradicting any claims that it's turned off or unavailable."
                      : "This phone appears to be busy or unavailable. This could be a sign that they're on another call, have blocked your number, or have their phone off intentionally."}
                  </p>
                  
                  {result.message && result.message !== "This number is available to contact!" && result.message !== "This number might be busy." && (
                    <div className="mt-2 p-2 bg-gray-100 rounded-md">
                      <p className="text-sm font-medium text-gray-800">{result.message}</p>
                    </div>
                  )}
                  
                  {!result.isAvailable && (
                    <div className="mt-3 flex items-start">
                      <AlertTriangle className="text-amber-500 h-4 w-4 mt-0.5 mr-2 flex-shrink-0" />
                      <p className="text-xs text-amber-700">
                        Remember that there could be legitimate reasons for this status. We recommend having an open, honest conversation with your partner.
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ResultDisplay;
