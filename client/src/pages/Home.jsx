import Header from "@/components/Header";
import PhoneForm from "@/components/PhoneForm";
import ResultDisplay from "@/components/ResultDisplay";
import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

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
          <PhoneForm onSubmit={handleCheckNumber} loading={checkNumberMutation.isPending} />
          
          {(phoneResult || checkNumberMutation.isPending || error) && (
            <ResultDisplay 
              result={phoneResult} 
              loading={checkNumberMutation.isPending} 
              error={error} 
            />
          )}
          
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-500">Uses Twilio API to verify phone number availability</p>
          </div>
        </div>
      </div>
      
      <div className="text-center mt-6 text-gray-500 text-sm">
        <p>© {new Date().getFullYear()} Love Line - Connect with confidence</p>
      </div>
    </div>
  );
};

export default Home;
