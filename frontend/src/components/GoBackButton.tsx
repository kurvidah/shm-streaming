import { useRouter } from "react-router-dom";
import { ArrowLeft } from 'lucide-react';

const GoBackButton = () => {
  const router = useRouter();

  return (
    <button
      onClick={() => router.back()}
      className="flex items-center gap-2 text-sm text-blue-600 hover:underline"
    >
      <ArrowLeft className="w-4 h-4" />
      Go Back
    </button>
  );
};

export default GoBackButton;
