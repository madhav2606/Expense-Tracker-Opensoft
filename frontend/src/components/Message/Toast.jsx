import React, { useState, useEffect } from 'react';
import { X, CheckCircle, XCircle } from 'lucide-react';

const Toast = ({ message, type = 'success', duration = 3000, onClose }) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      onClose?.();
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  if (!isVisible) return null;

  return (
    <div className={`
      fixed top-4 right-4 max-w-md p-4 rounded-lg shadow-lg
      flex items-center gap-3 animate-slide-in-right
      ${type === 'success' ? 'bg-green-100 text-green-800 border border-green-200' : 
        'bg-red-100 text-red-800 border border-red-200'}
    `}>
      {type === 'success' ? (
        <CheckCircle className="w-5 h-5 text-green-600" />
      ) : (
        <XCircle className="w-5 h-5 text-red-600" />
      )}
      
      <p className="flex-1 text-sm font-medium">{message}</p>
      
      <button
        onClick={() => {
          setIsVisible(false);
          onClose?.();
        }}
        className="p-1 rounded-full hover:bg-black/5 transition-colors"
      >
        <X className="w-4 h-4" />
        <span className="sr-only">Close</span>
      </button>
    </div>
  );
};

export default Toast

// Example usage component
// const Toastmsg = () => {
  // const [toasts, setToasts] = useState([]);

  // const showToast = (message, type) => {
  //   const id = Date.now();
  //   setToasts(prev => [...prev, { id, message, type }]);
  // };

  // const removeToast = (id) => {
  //   setToasts(prev => prev.filter(toast => toast.id !== id));
  // };

//   return (
//     <div className="p-4">
//       <div className="flex gap-4">
//         <button
//           onClick={() => showToast("Operation completed successfully!", "success")}
//           className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
//         >
//           Show Success Toast
//         </button>
        
//         <button
//           onClick={() => showToast("An error occurred. Please try again.", "error")}
//           className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
//         >
//           Show Error Toast
//         </button>
//       </div>

//       <div className="fixed top-4 right-4 space-y-4">
        // {toasts.map(toast => (
        //   <Toast
        //     key={toast.id}
        //     message={toast.message}
        //     type={toast.type}
        //     onClose={() => removeToast(toast.id)}
        //   />
        // ))}
//       </div>
//     </div>
//   );
// };

// export default Toastmsg;
