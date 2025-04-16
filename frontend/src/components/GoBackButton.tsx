import { ArrowLeft } from 'lucide-react';

type GoBackButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement>;

const GoBackButton: React.FC<GoBackButtonProps> = ({ className, ...props }) => {
  return (
    <button
      type="button"
      className={`inline-flex items-center px-2 py-2 rounded-full bg-gray-700 hover:bg-gray-600 text-white transition-colors ${className}`}
      {...props}
    >
      <ArrowLeft className="w-4 h-4" />
    </button>
  );
};

export default GoBackButton;
