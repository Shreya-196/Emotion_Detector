import * as React from "react";
import { Square } from "lucide-react";

interface StopRecordingButtonProps {
  onClick: () => void;
  isDisabled?: boolean;
}

const StopRecordingButton = ({ onClick, isDisabled = false }: StopRecordingButtonProps) => {
  return (
    <button
      onClick={onClick}
      disabled={isDisabled}
      className={`
        w-full py-4 px-6 rounded-xl text-white font-medium
        transition-all duration-300 flex items-center justify-center
        ${isDisabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}
        bg-red-600 hover:bg-red-700
      `}
    >
      
      🎤 Stop Recording
    </button>
  );
};

export default StopRecordingButton;
