import { KT_CacheStore, KT_LazyCache } from "./cache";
import { KT_FilterChainFactory } from "./FilterChainFactory";
import { KT_ProjectPath } from "./path";
import { KT_StringUtils } from "./stringUtils";

class __KT_Core {
    private name = "KT_Core";
    private version = "1.0.0";
    stringUtils = KT_StringUtils;
    projectPath = KT_ProjectPath;
    filterChainFactory = KT_FilterChainFactory;
    cacheStore = KT_CacheStore;
    lazyCache = KT_LazyCache;

    init() {
        return this.name;
    }
}

export const KT_Core = new __KT_Core();
