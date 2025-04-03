import { Heart } from "lucide-react";

const Header = () => {
  return (
    <div className="bg-gradient-to-r from-primary to-[#F27121] p-6 text-white text-center relative overflow-hidden heart-bg">
      <div className="absolute top-4 right-4 heart-pulse">
        <Heart className="text-white opacity-70 text-xl" />
      </div>
      <h1 className="font-display text-3xl mb-2 font-bold">Love Line</h1>
      <p className="text-white/90 font-body">Connect with confidence</p>
    </div>
  );
};

export default Header;
