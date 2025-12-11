import { useEffect, useState } from "react";
import { useUser } from "./useUser";

export const useUserLoader = () => {
  const { loading, checked, user } = useUser();
  const [showLoader, setShowLoader] = useState(true);
  const [minDurationPassed, setMinDurationPassed] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setMinDurationPassed(true), 500);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!loading && checked && minDurationPassed) {
      setShowLoader(false);
    }
  }, [loading, checked, minDurationPassed]);

  return {
    user,
    loading,
    checked,
    showLoader,
  };
};
