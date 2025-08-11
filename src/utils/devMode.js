import { useLocation, useNavigate } from 'react-router-dom';
import { useCallback, useMemo } from 'react';

/**
 * Utility functions for handling developer mode
 */

/**
 * Check if developer mode is enabled via URL parameter
 * @param {string} search - URL search params (from useLocation().search)
 * @returns {boolean} - Whether dev mode is active
 */
export const isDevMode = (search = '') => {
    const urlParams = new URLSearchParams(search);
    return urlParams.get('dev') === 'true';
};

/**
 * Get URL search params with dev mode preserved
 * @param {string} currentSearch - Current URL search params
 * @returns {string} - Search params string with dev mode preserved
 */
export const getDevModeParams = (currentSearch = '') => {
    const urlParams = new URLSearchParams(currentSearch);
    if (isDevMode(currentSearch)) {
        urlParams.set('dev', 'true');
    }
    const paramString = urlParams.toString();
    return paramString ? `?${paramString}` : '';
};

/**
 * Navigate while preserving dev mode parameter
 * @param {function} navigate - React Router navigate function
 * @param {string} currentSearch - Current URL search params
 * @returns {function} - Navigation function that preserves dev mode
 */
export const useDevModeNavigate = () => {
    const navigate = useNavigate();
    const location = useLocation();
    
    return useCallback((to, options = {}) => {
        if (typeof to === 'string') {
            // If it's a string path, append dev mode params
            const devParams = getDevModeParams(location.search);
            const separator = to.includes('?') ? '&' : '?';
            const fullPath = devParams ? `${to}${separator}${devParams.slice(1)}` : to;
            navigate(fullPath, options);
        } else if (typeof to === 'object') {
            // If it's an object, merge search params
            const currentParams = new URLSearchParams(location.search);
            const newParams = new URLSearchParams(to.search || '');
            
            // Preserve dev mode
            if (currentParams.get('dev') === 'true') {
                newParams.set('dev', 'true');
            }
            
            navigate({
                ...to,
                search: newParams.toString()
            }, options);
        } else {
            // Fallback for other cases (like navigate(-1))
            navigate(to, options);
        }
    }, [navigate, location.search]);
};

/**
 * Hook to get current dev mode status
 * @returns {boolean} - Whether dev mode is currently active
 */
export const useIsDevMode = () => {
    const location = useLocation();
    return useMemo(() => isDevMode(location.search), [location.search]);
};

/**
 * Add dev mode parameter to a URL if currently in dev mode
 * @param {string} url - The URL to modify
 * @param {boolean} currentDevMode - Whether dev mode is currently active
 * @returns {string} - URL with dev mode parameter if applicable
 */
export const addDevModeToUrl = (url, currentDevMode) => {
    if (!currentDevMode) return url;
    
    const separator = url.includes('?') ? '&' : '?';
    return `${url}${separator}dev=true`;
};