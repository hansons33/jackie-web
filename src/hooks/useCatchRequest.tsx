import { useEffect, useMemo, useState } from 'react';
import { eRequest, requestConfig } from 'service/index';
import { useStore } from '../store/store';
function useCatchRequest(config: requestConfig) {
    const [cachedData, setCachedData] = useState<any>(undefined);
    const getCachedRequests = useStore(state => state.getCachedRequests);
    const setCachedRequests = useStore(state => state.setCachedRequests);
    const cacheKey = { url: config.url, ...config.params, ...config.data };
    const cacheData = getCachedRequests(cacheKey);
    useEffect(() => {
        if (cacheData) {
            setCachedData(cacheData);
        } else {
            eRequest(config).then(res => {
                setCachedData(res);
                setCachedRequests(cacheKey, res, config.staleTime || 1000000);
            });
        }
    }, []);

    return useMemo(() => {
        if (cachedData) return cachedData;
    }, [cachedData]);
}
export default useCatchRequest;
