import { BADGES } from "../data/badges";
import { BadgeCategory, BadgeTier } from "../types/interfaces";

/**
 * ------------------------------------------------------------------
 * 🛠 Badge Utility Functions
 * ------------------------------------------------------------------
 */

/**
 * 1. Get the highest tier badge ID a user owns in a specific category.
 *    If none found, returns null.
 */
export function getHighestBadge(category: BadgeCategory, userBadges: string[]): string | null {
    // Filter badges in this category that the user owns
    const owned = BADGES.filter(b => b.category === category && userBadges.includes(b.id));

    if (owned.length === 0) return null;

    // Sort by tier descending
    owned.sort((a, b) => b.tier - a.tier);

    return owned[0].id;
}

/**
 * 2. Get the fallback badge ID for a category (Tier 1).
 *    Used when the user has NO badge in this category but we need to show something (e.g. for existing users).
 *    However, the rule says "fallback login_1". This implies we show it even if not owned?
 *    "Existing user = does NOT have join_1"
 *    "For EXISTING users: 1) main: highest login_X badge (fallback login_1)"
 *    This likely means if they don't have any login badge, show login_1 (locked or unlocked? usually unlocked if it's a fallback for display, but if it's 'equipped', they should probably own it.
 *    BUT, if they are an existing user, they *should* have at least login_1 if they logged in.
 *    If they really don't have it, we might return login_1 as a placeholder.
 *    Let's assume we return the ID.
 */
export function getFallbackBadge(category: BadgeCategory): string {
    return `${category}_1`;
}

/**
 * 3. Generate the 5-slot badge layout based on the rules.
 *    Returns an array of 5 badge IDs (or nulls if strictly no badge).
 *    
 *    Rules:
 *    - NEW user (has join_1): [join_1, level_1, feed_1, vote_1, comment_1]
 *      (Note: The rule says "level_1", not "highest level". But usually we want the highest.
 *       "For NEW users: ... 2) level_1".
 *       "For EXISTING users: ... 2) level: highest level_X".
 *       I will assume NEW users also want their highest if they have it, but maybe they only have level_1.
 *       Actually, if they are NEW, they likely only have tier 1.
 *       But to be safe and consistent, I will use "highest owned OR tier 1 fallback" for everyone,
 *       but the *Main Badge* differs.)
 * 
 *    - NEW User Main: join_1
 *    - EXISTING User Main: Highest Login (fallback login_1)
 * 
 *    - Slots 2-5 are always: Level, Feed, Vote, Comment (Highest owned, fallback to Tier 1)
 */
export function getTop5Badges(userBadges: string[] = []): (string | null)[] {
    const hasJoinBadge = userBadges.includes("join_1");

    // 1. Determine Main Badge (Slot 1)
    let mainBadge: string | null = null;

    if (hasJoinBadge) {
        mainBadge = "join_1";
    } else {
        // Existing user: Highest Login
        mainBadge = getHighestBadge(BadgeCategory.Login, userBadges);
        if (!mainBadge) mainBadge = getFallbackBadge(BadgeCategory.Login);
    }

    // 2. Determine Activity Badges (Slots 2-5)
    // Categories: Level, Feed, Vote, Comment
    const categories = [
        BadgeCategory.Level,
        BadgeCategory.Feed,
        BadgeCategory.Vote,
        BadgeCategory.Comment
    ];

    const slots = categories.map(cat => {
        let badge = getHighestBadge(cat, userBadges);
        if (!badge) badge = getFallbackBadge(cat);
        return badge;
    });

    // Combine: [Main, ...Slots]
    return [mainBadge, ...slots];
}
