import { useEffect, useCallback, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { setLoading, setStats, setError } from '../store/slices/siteStatsSlice';
import { getSiteStats } from '../services/operations/siteStatsAPI';

/**
 * Custom hook to fetch and cache site statistics via Redux store.
 * Returns { stats, loading, error, refetch } where stats has formatted helpers.
 */
const useSiteStats = () => {
  const dispatch = useDispatch();
  const { stats, loading, error } = useSelector((state) => state.siteStats);
  const hasFetchedRef = useRef(false);

  const fetchStats = useCallback(async () => {
    dispatch(setLoading());
    try {
      const response = await getSiteStats();
      if (response.success) {
        dispatch(setStats(response.data));
      }
    } catch (err) {
      dispatch(setError(err.message || 'Failed to fetch stats'));
    }
  }, [dispatch]);

  useEffect(() => {
    // Only fetch if not already in store and haven't tried yet
    if (!stats && !hasFetchedRef.current) {
      hasFetchedRef.current = true;
      fetchStats();
    }
  }, [stats, fetchStats]);

  // Helper: get formatted stat string like "450+"
  const getStatValue = (key) => {
    if (!stats || !stats[key]) return '';
    return `${stats[key].value}${stats[key].suffix}`;
  };

  // Helper: get just the number
  const getStatNumber = (key) => {
    if (!stats || !stats[key]) return 0;
    return stats[key].value;
  };

  // Helper: get label
  const getStatLabel = (key) => {
    if (!stats || !stats[key]) return '';
    return stats[key].label;
  };

  return {
    stats,
    loading,
    error,
    refetch: fetchStats,
    getStatValue,
    getStatNumber,
    getStatLabel,
  };
};

export default useSiteStats;
