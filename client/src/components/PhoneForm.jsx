import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import CountrySelector from "./CountrySelector";
import PhoneInput from "./PhoneInput";
import { useState } from "react";

const formSchema = z.object({
  countryCode: z.string().min(1, "Country code is required"),
  phoneNumber: z.string().min(5, "Phone number is required"),
  countryIso2: z.string().min(2, "Country code is required"),
});

const PhoneForm = ({ onSubmit, loading }) => {
  const [selectedCountry, setSelectedCountry] = useState({
    name: "United States",
    code: "+1",
    iso2: "us"
  });

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      countryCode: "+1",
      phoneNumber: "",
      countryIso2: "us"
    },
  });

  const handleCountryChange = (country) => {
    setSelectedCountry(country);
    form.setValue("countryCode", country.code);
    form.setValue("countryIso2", country.iso2);
  };

  const handleSubmit = (values) => {
    const formattedValues = {
      ...values,
      fullNumber: `${values.countryCode}${values.phoneNumber.replace(/\D/g, '')}`,
    };
    onSubmit(formattedValues);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <div className="space-y-2">
          <FormLabel className="block text-sm font-medium text-gray-700 mb-1">
            Enter phone number to check
          </FormLabel>
          
          <FormField
            control={form.control}
            name="countryCode"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <CountrySelector 
                    value={selectedCountry}
                    onChange={(country) => {
                      field.onChange(country.code);
                      handleCountryChange(country);
                    }}
                  />
                </FormControl>
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="phoneNumber"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <PhoneInput 
                    value={field.value}
                    onChange={field.onChange}
                    countryCode={selectedCountry.code}
                    error={form.formState.errors.phoneNumber?.message}
                  />
                </FormControl>
              </FormItem>
            )}
          />
        </div>

        <Button 
          type="submit" 
          className="w-full py-6 bg-gradient-to-r from-primary to-[#F27121] hover:opacity-90 transition shadow-md"
          disabled={loading}
        >
          <span>{loading ? "Checking..." : "Check Availability"}</span>
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </form>
    </Form>
  );
};

export default PhoneForm;
