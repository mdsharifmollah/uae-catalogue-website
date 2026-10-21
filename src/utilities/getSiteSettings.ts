import { getCachedGlobal } from './getGlobals'

/** Site settings with media populated (logos, OG image). Cached with tag `global_site-settings`. */
export const getSiteSettings = () => getCachedGlobal('site-settings', 1)()
