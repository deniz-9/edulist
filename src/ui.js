import React from "react";
export const Input = ({
  label,
  name,
  type = "text",
  value,
  onChange,
  placeholder,
  error,
  maxLength,
  min,
  max,
  step,
  className = "",
  ...props
}) => {
  const inputClasses = `w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
    error ? "border-red-500" : "border-gray-300"
  } ${className}`;

  return (
    <div>
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {label}
        </label>
      )}
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        maxLength={maxLength}
        min={min}
        max={max}
        step={step}
        className={inputClasses}
        {...props}
      />
      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
    </div>
  );
};

export const Button = ({
  children,
  type = "button",
  variant = "primary",
  onClick,
  className = "",
  ...props
}) => {
  const variantClasses = {
    primary:
      "w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition duration-200 font-medium",
    danger: "text-red-600 hover:text-red-800 font-medium",
    secondary: "text-blue-600 hover:text-blue-800 font-medium",
  };

  const buttonClasses = `${variantClasses[variant]} ${className}`;

  return (
    <button type={type} onClick={onClick} className={buttonClasses} {...props}>
      {children}
    </button>
  );
};

export const Message = ({ message, type = "auto", getMessageClass }) => {
  if (!message) return null;

  let messageClass;
  if (type === "auto" && getMessageClass) {
    messageClass = getMessageClass(message);
  } else {
    messageClass =
      type === "success"
        ? "bg-green-100 text-green-700"
        : "bg-red-100 text-red-700";
  }

  return <div className={`p-3 rounded-md ${messageClass}`}>{message}</div>;
};
