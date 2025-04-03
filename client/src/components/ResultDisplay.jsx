import { Copy, Heart, AlertCircle } from "lucide-react";
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
        <h3 className="font-display text-lg font-semibold mb-3">Number Information</h3>
        
        {/* Loading State */}
        {loading && (
          <div className="py-3 flex justify-center items-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        )}
        
        {/* Error State */}
        {error && !loading && (
          <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/20">
            <div className="flex items-start">
              <AlertCircle className="text-destructive mt-1 mr-3 h-5 w-5" />
              <div>
                <p className="font-medium text-destructive">Number check failed</p>
                <p className="text-sm text-gray-600 mt-1">{error}</p>
              </div>
            </div>
          </div>
        )}
        
        {/* Success State */}
        {result && !loading && !error && (
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Phone Number:</span>
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
                <span className="text-gray-600">Carrier:</span>
                <span className="font-medium">{result.carrier}</span>
              </div>
            )}
            
            {result.lineType && (
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Line Type:</span>
                <span className="font-medium">{result.lineType}</span>
              </div>
            )}
            
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Status:</span>
              <div className="flex items-center">
                <span className={`inline-block w-2 h-2 rounded-full ${result.isAvailable ? 'bg-success' : 'bg-destructive'} mr-2`}></span>
                <span className={`font-medium ${result.isAvailable ? 'text-success' : 'text-destructive'}`}>
                  {result.isAvailable ? 'Available' : 'Busy'}
                </span>
              </div>
            </div>

            <div className={`p-3 rounded-lg ${result.isAvailable ? 'bg-gradient-to-r from-primary/10 to-[#F27121]/10 border border-primary/20' : 'bg-destructive/10 border border-destructive/20'} mt-4`}>
              <div className="flex items-start">
                <Heart className={`${result.isAvailable ? 'text-primary' : 'text-destructive'} mt-1 mr-3 h-4 w-4`} />
                <p className="text-sm">
                  {result.isAvailable 
                    ? "This number is available to contact! Perfect timing to make a connection."
                    : "This number seems to be busy. Maybe try again later for a better connection."}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ResultDisplay;
