import { useState, useEffect } from "react";

type QueryFunction<T> = (page: number) => Promise<T[]>;

type QueryResult<T> = {
  data: T[];
  isLoading: boolean;
  error: Error | null;
  hasMore: boolean;
  fetchData: () => Promise<void>;
};

const useInfiniteQuery = <T>(
  queryFunction: QueryFunction<T>
): QueryResult<T> => {
  const [data, setData] = useState<T[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const newData = await queryFunction(page);

      if (newData.length === 0) {
        setHasMore(false);
      } else {
        setData([...data, ...newData]);
        setPage(page + 30);
      }
      setError(null);
    } catch (error) {
      setError(error as Error);
    } finally {
      setIsLoading(false);
    }
  };
  useEffect(() => {
    if (hasMore) {
      fetchData();
    }
  }, []);

  return { data, isLoading, error, hasMore, fetchData };
};

export default useInfiniteQuery;
