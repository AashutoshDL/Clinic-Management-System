import { useField } from 'formik';


//creating dynamic form fields
export const TextInput = ({ label, ...props }) => {
    const [field, meta] = useField(props);
    return (
      <div className="mb-4">
        <label htmlFor={props.id || props.name} className="block text-sm font-medium text-gray-700 mb-1">
          {label}
        </label>
        <input
          className={`w-full p-2 border ${meta.touched && meta.error ? 'border-red-500' : 'border-gray-300'} rounded focus:outline-none focus:ring-2 focus:ring-blue-500`}
          {...field}
          {...props}
        />
        {meta.touched && meta.error ? (
          <div className="text-red-500 text-xs mt-1">{meta.error}</div>
        ) : null}
      </div>
    );
  };
  
  export const PasswordInput = ({ label, ...props }) => {
    const [field, meta] = useField(props);
    return (
      <div className="mb-4">
        <label htmlFor={props.id || props.name} className="block text-sm font-medium text-gray-700 mb-1">
          {label}
        </label>
        <input
          className={`w-full p-2 border ${meta.touched && meta.error ? 'border-red-500' : 'border-gray-300'} rounded focus:outline-none focus:ring-2 focus:ring-blue-500`}
          {...field}
          {...props}
        />
        {meta.touched && meta.error ? (
          <div className="text-red-500 text-xs mt-1">{meta.error}</div>
        ) : null}
      </div>
    );
  };
  
  export const Checkbox = ({ children, ...props }) => {
    const [field, meta] = useField({ ...props, type: 'checkbox' });
    return (
      <div className="mb-4 flex items-center">
        <input
          type="checkbox"
          {...field}
          {...props}
          className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
        />
        <label htmlFor={props.id || props.name} className="ml-2 block text-sm text-gray-700">
          {children}
        </label>
        {meta.touched && meta.error ? (
          <div className="text-red-500 text-xs mt-1">{meta.error}</div>
        ) : null}
      </div>
    );
  };

  export const MySelect = ({ label, ...props }) => {
    const [field, meta] = useField(props);
    return (
      <div>
        <label htmlFor={props.id || props.name}>{label}</label>
        <select {...field} {...props} />
        {meta.touched && meta.error ? (
          <div className="error">{meta.error}</div>
        ) : null}
      </div>
    );
  };