export const Button = ({ children, onClick, className = "", variant = "primary" }) => {
    const baseStyle = "px-4 py-2 rounded-lg font-semibold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2";
    const variants = {
        primary: "bg-blue-600 hover:bg-blue-700 text-white focus:ring-blue-500 shadow-md hover:shadow-lg transform hover:-translate-y-0.5",
        secondary: "bg-gray-200 hover:bg-gray-300 text-gray-800 focus:ring-gray-500",
        danger: "bg-red-500 hover:bg-red-600 text-white focus:ring-red-500 shadow-md hover:shadow-lg transform hover:-translate-y-0.5",
        success: "bg-green-500 hover:bg-green-600 text-white focus:ring-green-500 shadow-md hover:shadow-lg transform hover:-translate-y-0.5",
    };

    return (
        <button onClick={onClick} className={`${baseStyle} ${variants[variant]} ${className}`}>
            {children}
        </button>
    );
};

export const Input = ({ value, onChange, placeholder, className = "" }) => (
    <input
        type="text"
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={`w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200 ${className}`}
    />
);
