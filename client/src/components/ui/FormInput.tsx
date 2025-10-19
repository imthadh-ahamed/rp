import Label from './Label';

interface FormInputProps {
  id: string;
  name: string;
  type: 'text' | 'email' | 'password';
  label: string;
  placeholder: string;
  required?: boolean;
  autoComplete?: string;
}

export default function FormInput({
  id,
  name,
  type,
  label,
  placeholder,
  required = false,
  autoComplete
}: FormInputProps) {
  return (
    <div>
      <Label htmlFor={id} required={required}>
        {label}
      </Label>
      <input
        type={type}
        id={id}
        name={name}
        required={required}
        autoComplete={autoComplete}
        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent outline-none transition"
        placeholder={placeholder}
      />
    </div>
  );
}
