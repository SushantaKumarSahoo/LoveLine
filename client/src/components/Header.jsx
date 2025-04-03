import { HeartCrack, AlertCircle } from "lucide-react";

const Header = () => {
  return (
    <div className="bg-gradient-to-r from-primary to-[#F27121] p-6 text-white text-center relative overflow-hidden heart-bg">
      <div className="absolute top-4 left-4 heart-pulse">
        <HeartCrack className="text-white opacity-70 text-xl" />
      </div>
      <div className="absolute top-4 right-4 heart-pulse">
        <AlertCircle className="text-white opacity-70 text-xl" />
      </div>
      <h1 className="font-display text-3xl mb-2 font-bold">Love Line</h1>
      <p className="text-white/90 font-body">Uncover the truth</p>
      <p className="text-white/70 text-sm mt-1">Is your partner's phone really busy?</p>
    </div>
  );
};

export default Header;
