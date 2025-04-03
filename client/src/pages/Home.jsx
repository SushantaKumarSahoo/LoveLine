import Header from "@/components/Header";
import PhoneForm from "@/components/PhoneForm";
import ResultDisplay from "@/components/ResultDisplay";
import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Shield, AlertTriangle } from "lucide-react";

const Home = () => {
  const [phoneResult, setPhoneResult] = useState(null);
  const [error, setError] = useState(null);
  const { toast } = useToast();

  const checkNumberMutation = useMutation({
    mutationFn: async (data) => {
      const response = await apiRequest("POST", "/api/check-number", data);
      return response.json();
    },
    onSuccess: (data) => {
      setPhoneResult(data);
      setError(null);
    },
    onError: (error) => {
      setError(error.message);
      toast({
        variant: "destructive",
        title: "Error checking number",
        description: error.message,
      });
    },
  });

  const handleCheckNumber = (formData) => {
    checkNumberMutation.mutate(formData);
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-md">
      <div className="bg-white rounded-xl shadow-lg overflow-hidden gradient-border">
        <Header />
        
        <div className="p-6">
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-2">Suspicious About Your Partner?</h2>
            <p className="text-gray-600 text-sm">
              Enter their phone number below to check if it's really "busy" or if they might be avoiding your calls.
              Our advanced verification technology can help uncover the truth behind unanswered calls.
            </p>
            
            <div className="flex items-center mt-4 p-3 bg-amber-50 border border-amber-200 rounded-lg">
              <AlertTriangle className="text-amber-500 h-5 w-5 mr-2 flex-shrink-0" />
              <p className="text-xs text-amber-700">
                This tool is for informational purposes only. A busy phone status doesn't necessarily indicate cheating.
                Please use this information responsibly.
              </p>
            </div>
          </div>
          
          <PhoneForm onSubmit={handleCheckNumber} loading={checkNumberMutation.isPending} />
          
          {(phoneResult || checkNumberMutation.isPending || error) && (
            <ResultDisplay 
              result={phoneResult} 
              loading={checkNumberMutation.isPending} 
              error={error} 
            />
          )}
          
          <div className="mt-6 bg-gray-50 p-4 rounded-lg border border-gray-200">
            <div className="flex items-start">
              <Shield className="text-primary h-5 w-5 mt-1 mr-3 flex-shrink-0" />
              <div>
                <h3 className="font-medium text-gray-800 text-sm">How We Protect Your Privacy</h3>
                <p className="text-xs text-gray-600 mt-1">
                  Your search is completely private. We never store relationship information or notify the person whose number you're checking.
                  Uses secure Twilio verification technology.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="text-center mt-6 text-gray-500 text-sm">
        <p>© {new Date().getFullYear()} Love Line - Uncover the truth in your relationship</p>
      </div>
    </div>
  );
};

export default Home;
