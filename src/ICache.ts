export interface ICache {
    /**
     * set cache k-v without expiry asynchronously
     * @param key cache key
     * @param value cache value
     */
    set(key: string, value: any): Promise<void>;

    /**
     * set cache k-v with expiry asynchronously
     * @param key cache key
     * @param value cache value
     * @param expiresAt the date epoch at which the cache will expire
     */
    set(key: string, value: any, expiresAt: Date): Promise<void>;

    /**
     * get cached k-v by key asynchronously
     * @param key cache key
     * @returns cache value
     */
    get(key: string): Promise<any>;

    /**
     * get cached k-v by key asynchronously
     * @param key cache key
     * @param removeAfter indicates whether to remove the cache after get the value
     * @returns cache value
     */
    get(key: string, removeAfter: boolean): Promise<any>;

    /**
     * remove the cache by key asynchronously
     * @param key cache key
     */
    remove(key: string): Promise<void>;
}