import { useState, useEffect } from "react";

function useFetch(fetcher) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let ignore = false;

    fetcher()
      .then((result) => {
        if (ignore) {
          return;
        }
        setData(Array.isArray(result) ? result : []);
        setLoading(false);
      })
      .catch(() => {
        if (ignore) {
          return;
        }
        setError("Could not load the menu. Please try again.");
        setLoading(false);
      });

    return () => {
      ignore = true;
    };
  }, [fetcher]);

  return { data, loading, error };
}

export default useFetch;
