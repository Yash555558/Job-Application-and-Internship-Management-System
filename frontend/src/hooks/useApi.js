import { useState } from 'react';
import toast from 'react-hot-toast';

const useApi = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const execute = async (apiCall, successMessage = null) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await apiCall();
      
      if (successMessage) {
        toast.success(successMessage);
      }
      
      return { success: true, data: response.data };
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'An error occurred';
      setError(errorMessage);
      toast.error(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  return { loading, error, execute };
};

export default useApi;