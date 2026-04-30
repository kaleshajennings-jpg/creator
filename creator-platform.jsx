import { useState } from "react";

const CREATORS = [
  {
    id: 1,
    name: "Luna Voss",
    handle: "@lunavoss",
    category: "Art & Illustration",
    avatar: "LV",
    cover: "#1a0533",
    accentColor: "#c084fc",
    bio: "Digital surrealist. Painting dreams since 2018.",
    subscribers: 4812,
    tiers: [
      { id: "fan", name: "Fan", price: 5, perks: ["Access to monthly wallpapers", "Subscriber-only posts"] },
      { id: "supporter", name: "Supporter", price: 12, perks: ["Everything in Fan", "Early access to new work", "WIP process shots"] },
      { id: "patron", name: "Patron", price: 25, perks: ["Everything in Supporter", "Monthly 1:1 feedback session", "Name in credits"] },
    ],
    posts: [
      { id: 1, title: "Dreamscape Series Vol. 3", preview: "New piece dropping this Friday — deep ocean vibes and bioluminescent creatures.", locked: false, likes: 312, type: "art" },
      { id: 2, title: "Process Video: Celestial Bloom", preview: "Full 2-hour timelapse of my latest piece, with commentary.", locked: true, likes: 489, type: "video" },
      { id: 3, title: "Patron Q&A — April Edition", preview: "Answering your questions about my workflow and upcoming series.", locked: true, likes: 201, type: "text" },
    ],
  },
  {
    id: 2,
    name: "Marcus Osei",
    handle: "@marcosei",
    category: "Music Production",
    avatar: "MO",
    cover: "#001a0f",
    accentColor: "#4ade80",
    bio: "Producer. Multi-instrumentalist. Lagos → Berlin.",
    subscribers: 2340,
    tiers: [
      { id: "listener", name: "Listener", price: 4, perks: ["Exclusive monthly track", "Behind-the-scenes snippets"] },
      { id: "studio", name: "Studio Pass", price: 15, perks: ["Everything in Listener", "Sample packs & stems", "Discord access"] },
      { id: "collab", name: "Collaborator", price: 40, perks: ["Everything in Studio Pass", "Monthly beat feedback", "Co-writing credits on one track/year"] },
    ],
    posts: [
      { id: 1, title: "New Sample Pack: Afrobeats Vol. 2", preview: "60 hand-crafted samples. Kicks, hi-hats, melodic loops.", locked: false, likes: 178, type: "music" },
      { id: 2, title: "Studio Session Breakdown", preview: "How I built that viral beat from scratch in 45 minutes.", locked: true, likes: 543, type: "video" },
    ],
  },
  {
    id: 3,
    name: "Sable Fontaine",
    handle: "@sablefontaine",
    category: "Writing & Fiction",
    avatar: "SF",
    cover: "#1a1000",
    accentColor: "#fbbf24",
    bio: "Novelist. Writing dark fantasy, one chapter at a time.",
    subscribers: 6091,
    tiers: [
      { id: "reader", name: "Reader", price: 6, perks: ["Serialized novel chapters (weekly)", "Exclusive short stories"] },
      { id: "bookclub", name: "Book Club", price: 14, perks: ["Everything in Reader", "Monthly annotated chapters", "Live reading events"] },
      { id: "co-author", name: "Co-Author", price: 30, perks: ["Everything in Book Club", "Vote on plot decisions", "Signed prints of cover art"] },
    ],
    posts: [
      { id: 1, title: "Chapter 47: The Glass Throne", preview: "Eira descends into the vault — and finds something that shouldn't exist.", locked: false, likes: 891, type: "text" },
      { id: 2, title: "Annotated Chapter: The Betrayal Arc", preview: "My notes on the symbolism and foreshadowing I hid in chapters 30–35.", locked: true, likes: 704, type: "text" },
    ],
  },
];

const typeIcons = {
  art: "🎨",
  video: "▶",
  text: "✦",
  music: "♪",
};

export default function App() {
  const [view, setView] = useState("discover"); // discover | creator | dashboard
  const [activeCreator, setActiveCreator] = useState(null);
  const [subscriptions, setSubscriptions] = useState({}); // creatorId -> tierId
  const [subscribing, setSubscribing] = useState(null); // tierId being confirmed
  const [dashTab, setDashTab] = useState("overview");
  const [earnings] = useState({ total: 3840, thisMonth: 612, subscribers: 47 });

  const openCreator = (creator) => {
    setActiveCreator(creator);
    setView("creator");
    setSubscribing(null);
  };

  const subscribe = (creatorId, tierId) => {
    setSubscriptions((prev) => ({ ...prev, [creatorId]: tierId }));
    setSubscribing(null);
  };

  const unsubscribe = (creatorId) => {
    setSubscriptions((prev) => {
      const next = { ...prev };
      delete next[creatorId];
      return next;
    });
  };

  const currentTier = activeCreator
    ? subscriptions[activeCreator.id]
      ? activeCreator.tiers.find((t) => t.id === subscriptions[activeCreator.id])
      : null
    : null;

  const tierIndex = (tierId) => (activeCreator ? activeCreator.tiers.findIndex((t) => t.id === tierId) : -1);
  const userTierIndex = currentTier ? tierIndex(currentTier.id) : -1;
  const isPostUnlocked = (post) => {
    if (!post.locked) return true;
    if (!currentTier) return false;
    return userTierIndex >= 1;
  };

  return (
    <div style={styles.root}>
      <style>{globalCSS}</style>

      {/* NAV */}
      <nav style={styles.nav}>
        <div style={styles.navLogo} onClick={() => setView("discover")}>
          <span style={styles.logoMark}>◈</span>
          <span style={styles.logoText}>CREATRS</span>
        </div>
        <div style={styles.navLinks}>
          <button style={{ ...styles.navBtn, ...(view === "discover" ? styles.navBtnActive : {}) }} onClick={() => setView("discover")}>Discover</button>
          <button style={{ ...styles.navBtn, ...(view === "dashboard" ? styles.navBtnActive : {}) }} onClick={() => setView("dashboard")}>Creator Dashboard</button>
        </div>
        <div style={styles.navRight}>
          <div style={styles.avatarSmall}>YO</div>
        </div>
      </nav>

      {/* DISCOVER */}
      {view === "discover" && (
        <main style={styles.main}>
          <div style={styles.heroSection}>
            <p style={styles.heroEyebrow}>Support creators you love</p>
            <h1 style={styles.heroTitle}>Get closer to<br /><em>the work.</em></h1>
            <p style={styles.heroSub}>Exclusive content. Direct support. No algorithms.</p>
          </div>

          <div style={styles.sectionHeader}>
            <span style={styles.sectionLabel}>Featured Creators</span>
          </div>

          <div style={styles.creatorGrid}>
            {CREATORS.map((c) => (
              <div key={c.id} style={{ ...styles.creatorCard, "--accent": c.accentColor, "--cover": c.cover }} className="creator-card" onClick={() => openCreator(c)}>
                <div style={{ ...styles.cardCover, background: c.cover }}>
                  <div style={{ ...styles.cardCoverGlow, background: `radial-gradient(circle at 60% 40%, ${c.accentColor}44, transparent 65%)` }} />
                  <span style={styles.cardCategory}>{c.category}</span>
                </div>
                <div style={styles.cardBody}>
                  <div style={{ ...styles.cardAvatar, background: `linear-gradient(135deg, ${c.accentColor}cc, ${c.accentColor}33)`, border: `2px solid ${c.accentColor}` }}>
                    {c.avatar}
                  </div>
                  <div style={styles.cardInfo}>
                    <h3 style={styles.cardName}>{c.name}</h3>
                    <p style={styles.cardHandle}>{c.handle}</p>
                    <p style={styles.cardBio}>{c.bio}</p>
                    <div style={styles.cardMeta}>
                      <span style={{ ...styles.metaPill, color: c.accentColor }}>◈ {c.subscribers.toLocaleString()} supporters</span>
                      <span style={styles.metaPill}>from ${c.tiers[0].price}/mo</span>
                    </div>
                  </div>
                </div>
                {subscriptions[c.id] && (
                  <div style={{ ...styles.subscribedBadge, background: c.accentColor }}>Subscribed</div>
                )}
              </div>
            ))}
          </div>
        </main>
      )}

      {/* CREATOR PAGE */}
      {view === "creator" && activeCreator && (
        <main style={styles.main}>
          <button style={styles.backBtn} onClick={() => setView("discover")}>← Back</button>

          {/* Header */}
          <div style={{ ...styles.creatorHeader, background: activeCreator.cover }}>
            <div style={{ ...styles.creatorHeaderGlow, background: `radial-gradient(ellipse at 70% 50%, ${activeCreator.accentColor}55, transparent 65%)` }} />
            <div style={styles.creatorHeaderContent}>
              <div style={{ ...styles.avatarLarge, background: `linear-gradient(135deg, ${activeCreator.accentColor}cc, ${activeCreator.accentColor}22)`, border: `3px solid ${activeCreator.accentColor}` }}>
                {activeCreator.avatar}
              </div>
              <div>
                <h1 style={styles.creatorName}>{activeCreator.name}</h1>
                <p style={{ color: activeCreator.accentColor, fontFamily: "'Space Mono', monospace", fontSize: 13 }}>{activeCreator.handle} · {activeCreator.category}</p>
                <p style={{ color: "#aaa", marginTop: 6, fontSize: 14 }}>{activeCreator.bio}</p>
                <p style={{ color: "#666", fontSize: 13, marginTop: 4 }}>{activeCreator.subscribers.toLocaleString()} supporters</p>
              </div>
            </div>
          </div>

          <div style={styles.creatorLayout}>
            {/* Posts */}
            <div style={styles.postsCol}>
              <h2 style={styles.colTitle}>Posts</h2>
              {activeCreator.posts.map((post) => {
                const unlocked = isPostUnlocked(post);
                return (
                  <div key={post.id} style={{ ...styles.postCard, opacity: unlocked ? 1 : 0.85 }} className="post-card">
                    <div style={styles.postTop}>
                      <span style={{ ...styles.postType, color: activeCreator.accentColor }}>{typeIcons[post.type]} {post.type}</span>
                      {post.locked && !unlocked && <span style={styles.lockBadge}>🔒 Members only</span>}
                      {post.locked && unlocked && <span style={{ ...styles.lockBadge, background: activeCreator.accentColor + "33", color: activeCreator.accentColor }}>✓ Unlocked</span>}
                    </div>
                    <h3 style={styles.postTitle}>{post.title}</h3>
                    <p style={styles.postPreview}>{unlocked ? post.preview : post.preview.slice(0, 60) + "..."}</p>
                    {!unlocked && (
                      <button style={{ ...styles.unlockBtn, background: activeCreator.accentColor + "22", color: activeCreator.accentColor, border: `1px solid ${activeCreator.accentColor}44` }} onClick={() => setSubscribing(activeCreator.tiers[1].id)}>
                        Subscribe to read →
                      </button>
                    )}
                    <div style={styles.postFooter}>
                      <span style={styles.postLikes}>♥ {post.likes}</span>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Tiers */}
            <div style={styles.tiersCol}>
              <h2 style={styles.colTitle}>Support {activeCreator.name.split(" ")[0]}</h2>
              {currentTier && (
                <div style={{ ...styles.currentSubBanner, borderColor: activeCreator.accentColor + "66", background: activeCreator.accentColor + "11" }}>
                  <p style={{ color: activeCreator.accentColor, fontWeight: 600, fontSize: 13 }}>✓ You're subscribed: {currentTier.name}</p>
                  <button style={styles.cancelBtn} onClick={() => unsubscribe(activeCreator.id)}>Cancel</button>
                </div>
              )}
              {activeCreator.tiers.map((tier, i) => {
                const isActive = currentTier?.id === tier.id;
                const isConfirming = subscribing === tier.id;
                return (
                  <div key={tier.id} style={{ ...styles.tierCard, border: isActive ? `2px solid ${activeCreator.accentColor}` : "2px solid #222" }} className="tier-card">
                    {i === 1 && <div style={{ ...styles.popularBadge, background: activeCreator.accentColor }}>Popular</div>}
                    <div style={styles.tierTop}>
                      <span style={styles.tierName}>{tier.name}</span>
                      <span style={{ ...styles.tierPrice, color: activeCreator.accentColor }}>${tier.price}<span style={{ fontSize: 12, color: "#888" }}>/mo</span></span>
                    </div>
                    <ul style={styles.perkList}>
                      {tier.perks.map((p, j) => (
                        <li key={j} style={styles.perkItem}><span style={{ color: activeCreator.accentColor }}>◈</span> {p}</li>
                      ))}
                    </ul>
                    {isConfirming ? (
                      <div style={styles.confirmBox}>
                        <p style={{ color: "#ddd", fontSize: 13, marginBottom: 10 }}>Confirm ${tier.price}/month subscription?</p>
                        <div style={styles.confirmBtns}>
                          <button style={{ ...styles.confirmYes, background: activeCreator.accentColor }} onClick={() => subscribe(activeCreator.id, tier.id)}>Confirm</button>
                          <button style={styles.confirmNo} onClick={() => setSubscribing(null)}>Cancel</button>
                        </div>
                      </div>
                    ) : (
                      <button
                        style={{ ...styles.subscribeBtn, background: isActive ? activeCreator.accentColor + "22" : activeCreator.accentColor, color: isActive ? activeCreator.accentColor : "#000", border: isActive ? `1px solid ${activeCreator.accentColor}` : "none" }}
                        onClick={() => !isActive && setSubscribing(tier.id)}
                        disabled={isActive}
                      >
                        {isActive ? "Current Plan" : "Subscribe"}
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </main>
      )}

      {/* CREATOR DASHBOARD */}
      {view === "dashboard" && (
        <main style={styles.main}>
          <div style={styles.dashHeader}>
            <div>
              <p style={styles.heroEyebrow}>Creator Studio</p>
              <h1 style={styles.dashTitle}>Your Dashboard</h1>
            </div>
            <button style={styles.publishBtn}>+ New Post</button>
          </div>

          <div style={styles.dashTabs}>
            {["overview", "posts", "subscribers", "payouts"].map((tab) => (
              <button key={tab} style={{ ...styles.dashTab, ...(dashTab === tab ? styles.dashTabActive : {}) }} onClick={() => setDashTab(tab)}>
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>

          {dashTab === "overview" && (
            <div>
              <div style={styles.statsRow}>
                {[
                  { label: "Total Earnings", value: `$${earnings.total.toLocaleString()}`, sub: "All time", color: "#f59e0b" },
                  { label: "This Month", value: `$${earnings.thisMonth}`, sub: "Apr 2026", color: "#34d399" },
                  { label: "Subscribers", value: earnings.subscribers, sub: "Active now", color: "#a78bfa" },
                  { label: "Posts Published", value: 14, sub: "Total", color: "#60a5fa" },
                ].map((s) => (
                  <div key={s.label} style={styles.statCard}>
                    <p style={styles.statLabel}>{s.label}</p>
                    <p style={{ ...styles.statValue, color: s.color }}>{s.value}</p>
                    <p style={styles.statSub}>{s.sub}</p>
                  </div>
                ))}
              </div>
              <div style={styles.revenueChart}>
                <h3 style={styles.chartTitle}>Monthly Revenue</h3>
                <div style={styles.barChart}>
                  {[180, 240, 310, 290, 410, 380, 520, 480, 560, 490, 590, 612].map((v, i) => (
                    <div key={i} style={styles.barWrap}>
                      <div style={{ ...styles.bar, height: `${(v / 612) * 100}%`, background: `linear-gradient(to top, #f59e0b, #fbbf24)` }} />
                      <span style={styles.barLabel}>{["J","F","M","A","M","J","J","A","S","O","N","D"][i]}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {dashTab === "posts" && (
            <div style={styles.dashPostList}>
              {[
                { title: "My Creative Process in 2026", type: "text", date: "Apr 28", views: 892, locked: false },
                { title: "Exclusive Tutorial: Texturing Techniques", type: "video", date: "Apr 20", views: 1240, locked: true },
                { title: "Monthly Wallpaper Pack — April", type: "art", date: "Apr 15", views: 567, locked: true },
                { title: "Behind the Scenes: Studio Tour", type: "video", date: "Apr 5", views: 431, locked: false },
              ].map((p, i) => (
                <div key={i} style={styles.dashPost}>
                  <div style={styles.dashPostLeft}>
                    <span style={styles.dashPostType}>{typeIcons[p.type]}</span>
                    <div>
                      <p style={styles.dashPostTitle}>{p.title}</p>
                      <p style={styles.dashPostMeta}>{p.date} · {p.views} views · {p.locked ? "🔒 Members only" : "Public"}</p>
                    </div>
                  </div>
                  <button style={styles.editBtn}>Edit</button>
                </div>
              ))}
            </div>
          )}

          {dashTab === "subscribers" && (
            <div style={styles.subTable}>
              <div style={styles.subTableHeader}>
                <span>Supporter</span><span>Tier</span><span>Since</span><span>Revenue</span>
              </div>
              {[
                { name: "Pixel Witch", tier: "Patron", since: "Jan 2026", rev: "$75" },
                { name: "NightOwlArt", tier: "Supporter", since: "Feb 2026", rev: "$36" },
                { name: "silent_haze", tier: "Fan", since: "Mar 2026", rev: "$15" },
                { name: "Mireille D.", tier: "Patron", since: "Nov 2025", rev: "$150" },
                { name: "ThornBird", tier: "Supporter", since: "Apr 2026", rev: "$12" },
              ].map((s, i) => (
                <div key={i} style={styles.subRow}>
                  <span style={styles.subName}>{s.name}</span>
                  <span style={styles.subTier}>{s.tier}</span>
                  <span style={styles.subSince}>{s.since}</span>
                  <span style={styles.subRev}>{s.rev}</span>
                </div>
              ))}
            </div>
          )}

          {dashTab === "payouts" && (
            <div>
              <div style={styles.payoutCard}>
                <div>
                  <p style={styles.payoutLabel}>Available Balance</p>
                  <p style={styles.payoutAmount}>$612.00</p>
                </div>
                <button style={styles.payoutBtn}>Request Payout</button>
              </div>
              <div style={styles.payoutHistory}>
                <h3 style={styles.colTitle}>Payout History</h3>
                {[
                  { date: "Apr 1, 2026", amount: "$490.00", status: "Completed" },
                  { date: "Mar 1, 2026", amount: "$380.00", status: "Completed" },
                  { date: "Feb 1, 2026", amount: "$310.00", status: "Completed" },
                ].map((p, i) => (
                  <div key={i} style={styles.payoutRow}>
                    <span style={{ color: "#888" }}>{p.date}</span>
                    <span style={{ color: "#eee" }}>{p.amount}</span>
                    <span style={{ color: "#4ade80", fontSize: 12 }}>✓ {p.status}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </main>
      )}
    </div>
  );
}

const styles = {
  root: { minHeight: "100vh", background: "#0a0a0a", color: "#e5e5e5", fontFamily: "'DM Sans', sans-serif" },
  nav: { display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 32px", height: 60, borderBottom: "1px solid #1a1a1a", position: "sticky", top: 0, background: "#0a0a0acc", backdropFilter: "blur(12px)", zIndex: 100 },
  navLogo: { display: "flex", alignItems: "center", gap: 8, cursor: "pointer" },
  logoMark: { fontSize: 20, color: "#f59e0b" },
  logoText: { fontFamily: "'Space Mono', monospace", fontSize: 15, fontWeight: 700, letterSpacing: 4, color: "#fff" },
  navLinks: { display: "flex", gap: 4 },
  navBtn: { background: "none", border: "none", color: "#888", cursor: "pointer", padding: "6px 14px", borderRadius: 6, fontSize: 14, transition: "color 0.2s" },
  navBtnActive: { color: "#fff", background: "#1a1a1a" },
  navRight: { display: "flex", alignItems: "center" },
  avatarSmall: { width: 32, height: 32, borderRadius: "50%", background: "#f59e0b33", border: "1.5px solid #f59e0b66", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, color: "#f59e0b", fontWeight: 700, fontFamily: "'Space Mono', monospace" },
  main: { maxWidth: 1100, margin: "0 auto", padding: "40px 24px 80px" },
  heroSection: { textAlign: "center", paddingBottom: 56, paddingTop: 24 },
  heroEyebrow: { fontFamily: "'Space Mono', monospace", fontSize: 11, letterSpacing: 4, color: "#f59e0b", textTransform: "uppercase", marginBottom: 16 },
  heroTitle: { fontSize: "clamp(42px, 6vw, 72px)", fontWeight: 800, lineHeight: 1.1, margin: 0, letterSpacing: -2, color: "#fff" },
  heroSub: { color: "#666", marginTop: 16, fontSize: 16 },
  sectionHeader: { marginBottom: 24 },
  sectionLabel: { fontFamily: "'Space Mono', monospace", fontSize: 11, letterSpacing: 4, color: "#555", textTransform: "uppercase" },
  creatorGrid: { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: 20 },
  creatorCard: { borderRadius: 16, background: "#111", border: "1px solid #1e1e1e", overflow: "hidden", cursor: "pointer", transition: "transform 0.2s, border-color 0.2s", position: "relative" },
  cardCover: { height: 120, position: "relative", overflow: "hidden" },
  cardCoverGlow: { position: "absolute", inset: 0 },
  cardCategory: { position: "absolute", bottom: 10, left: 14, fontFamily: "'Space Mono', monospace", fontSize: 10, letterSpacing: 2, color: "#888", textTransform: "uppercase" },
  cardBody: { padding: "16px 20px 20px", display: "flex", gap: 14 },
  cardAvatar: { width: 52, height: 52, borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Space Mono', monospace", fontWeight: 700, fontSize: 16, flexShrink: 0 },
  cardInfo: { flex: 1 },
  cardName: { margin: 0, fontSize: 16, fontWeight: 700, color: "#fff" },
  cardHandle: { margin: "2px 0 6px", fontSize: 12, color: "#555", fontFamily: "'Space Mono', monospace" },
  cardBio: { fontSize: 13, color: "#888", margin: "0 0 10px", lineHeight: 1.5 },
  cardMeta: { display: "flex", gap: 10, flexWrap: "wrap" },
  metaPill: { fontSize: 11, color: "#555", fontFamily: "'Space Mono', monospace" },
  subscribedBadge: { position: "absolute", top: 14, right: 14, padding: "3px 10px", borderRadius: 20, fontSize: 10, fontWeight: 700, color: "#000", letterSpacing: 1 },
  backBtn: { background: "none", border: "none", color: "#888", cursor: "pointer", fontSize: 14, padding: "0 0 24px", display: "flex", alignItems: "center", gap: 6 },
  creatorHeader: { borderRadius: 16, padding: "40px 36px", marginBottom: 32, position: "relative", overflow: "hidden" },
  creatorHeaderGlow: { position: "absolute", inset: 0, pointerEvents: "none" },
  creatorHeaderContent: { position: "relative", zIndex: 1, display: "flex", gap: 24, alignItems: "flex-start" },
  avatarLarge: { width: 80, height: 80, borderRadius: 16, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Space Mono', monospace", fontWeight: 700, fontSize: 24, flexShrink: 0 },
  creatorName: { margin: 0, fontSize: 28, fontWeight: 800, color: "#fff" },
  creatorLayout: { display: "grid", gridTemplateColumns: "1fr 340px", gap: 32 },
  postsCol: {},
  tiersCol: {},
  colTitle: { fontSize: 12, fontFamily: "'Space Mono', monospace", letterSpacing: 3, textTransform: "uppercase", color: "#555", marginBottom: 16, fontWeight: 500 },
  postCard: { background: "#111", border: "1px solid #1e1e1e", borderRadius: 12, padding: "20px 22px", marginBottom: 14, transition: "border-color 0.2s" },
  postTop: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 },
  postType: { fontFamily: "'Space Mono', monospace", fontSize: 11, letterSpacing: 2, textTransform: "uppercase" },
  lockBadge: { background: "#1a1a1a", color: "#555", fontSize: 10, padding: "3px 8px", borderRadius: 4 },
  postTitle: { margin: "0 0 8px", fontSize: 17, fontWeight: 700, color: "#fff" },
  postPreview: { color: "#888", fontSize: 14, lineHeight: 1.6, margin: 0 },
  postFooter: { marginTop: 14, paddingTop: 12, borderTop: "1px solid #1a1a1a" },
  postLikes: { color: "#555", fontSize: 12 },
  unlockBtn: { marginTop: 12, padding: "8px 14px", borderRadius: 8, cursor: "pointer", fontSize: 13, fontWeight: 600 },
  currentSubBanner: { border: "1px solid", borderRadius: 10, padding: "10px 14px", marginBottom: 14, display: "flex", justifyContent: "space-between", alignItems: "center" },
  cancelBtn: { background: "none", border: "1px solid #333", color: "#666", cursor: "pointer", padding: "4px 10px", borderRadius: 6, fontSize: 12 },
  tierCard: { borderRadius: 12, padding: "20px", marginBottom: 12, background: "#111", position: "relative", overflow: "hidden", transition: "border-color 0.2s" },
  popularBadge: { position: "absolute", top: 0, right: 0, padding: "4px 12px", fontSize: 10, fontWeight: 700, color: "#000", borderBottomLeftRadius: 8, letterSpacing: 1 },
  tierTop: { display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 12 },
  tierName: { fontWeight: 700, fontSize: 15, color: "#fff" },
  tierPrice: { fontSize: 22, fontWeight: 800 },
  perkList: { listStyle: "none", padding: 0, margin: "0 0 16px" },
  perkItem: { fontSize: 13, color: "#999", marginBottom: 6, display: "flex", gap: 8 },
  subscribeBtn: { width: "100%", padding: "11px", borderRadius: 8, fontWeight: 700, fontSize: 14, cursor: "pointer", border: "none", letterSpacing: 0.5 },
  confirmBox: { background: "#1a1a1a", borderRadius: 8, padding: "14px" },
  confirmBtns: { display: "flex", gap: 8 },
  confirmYes: { flex: 1, padding: "9px", borderRadius: 7, border: "none", cursor: "pointer", fontWeight: 700, fontSize: 13, color: "#000" },
  confirmNo: { flex: 1, padding: "9px", borderRadius: 7, border: "1px solid #333", background: "none", cursor: "pointer", color: "#888", fontSize: 13 },
  dashHeader: { display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 32 },
  dashTitle: { fontSize: 36, fontWeight: 800, color: "#fff", margin: "8px 0 0", letterSpacing: -1 },
  publishBtn: { background: "#f59e0b", color: "#000", border: "none", padding: "10px 20px", borderRadius: 8, fontWeight: 700, cursor: "pointer", fontSize: 14 },
  dashTabs: { display: "flex", gap: 4, marginBottom: 32, borderBottom: "1px solid #1a1a1a", paddingBottom: 0 },
  dashTab: { background: "none", border: "none", color: "#555", cursor: "pointer", padding: "10px 18px", fontSize: 14, borderBottom: "2px solid transparent", transition: "color 0.2s" },
  dashTabActive: { color: "#f59e0b", borderBottom: "2px solid #f59e0b" },
  statsRow: { display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 16, marginBottom: 32 },
  statCard: { background: "#111", border: "1px solid #1e1e1e", borderRadius: 12, padding: "20px 22px" },
  statLabel: { fontSize: 11, color: "#555", fontFamily: "'Space Mono', monospace", letterSpacing: 2, textTransform: "uppercase", marginBottom: 8 },
  statValue: { fontSize: 30, fontWeight: 800, margin: "0 0 4px" },
  statSub: { fontSize: 12, color: "#555" },
  revenueChart: { background: "#111", border: "1px solid #1e1e1e", borderRadius: 12, padding: "24px" },
  chartTitle: { fontFamily: "'Space Mono', monospace", fontSize: 11, letterSpacing: 3, textTransform: "uppercase", color: "#555", fontWeight: 500, marginBottom: 20 },
  barChart: { display: "flex", gap: 8, alignItems: "flex-end", height: 140 },
  barWrap: { flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 6, height: "100%" },
  bar: { width: "100%", borderRadius: "3px 3px 0 0", minHeight: 4 },
  barLabel: { fontSize: 10, color: "#555", fontFamily: "'Space Mono', monospace" },
  dashPostList: {},
  dashPost: { display: "flex", justifyContent: "space-between", alignItems: "center", background: "#111", border: "1px solid #1e1e1e", borderRadius: 10, padding: "16px 20px", marginBottom: 10 },
  dashPostLeft: { display: "flex", gap: 14, alignItems: "center" },
  dashPostType: { fontSize: 20, width: 32, textAlign: "center" },
  dashPostTitle: { color: "#eee", fontWeight: 600, margin: 0, fontSize: 15 },
  dashPostMeta: { color: "#555", fontSize: 12, margin: "4px 0 0", fontFamily: "'Space Mono', monospace" },
  editBtn: { background: "none", border: "1px solid #2a2a2a", color: "#888", cursor: "pointer", padding: "6px 14px", borderRadius: 7, fontSize: 13 },
  subTable: {},
  subTableHeader: { display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: 16, padding: "10px 20px", background: "#111", borderRadius: "10px 10px 0 0", borderBottom: "1px solid #1a1a1a", fontFamily: "'Space Mono', monospace", fontSize: 10, color: "#555", letterSpacing: 2, textTransform: "uppercase" },
  subRow: { display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: 16, padding: "14px 20px", borderBottom: "1px solid #111", background: "#0d0d0d" },
  subName: { color: "#ddd", fontWeight: 500 },
  subTier: { color: "#a78bfa", fontSize: 13 },
  subSince: { color: "#555", fontSize: 13 },
  subRev: { color: "#4ade80", fontFamily: "'Space Mono', monospace", fontSize: 13 },
  payoutCard: { background: "#111", border: "1px solid #f59e0b33", borderRadius: 12, padding: "28px", display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 },
  payoutLabel: { fontFamily: "'Space Mono', monospace", fontSize: 11, letterSpacing: 3, textTransform: "uppercase", color: "#555", marginBottom: 8 },
  payoutAmount: { fontSize: 40, fontWeight: 800, color: "#f59e0b", margin: 0 },
  payoutBtn: { background: "#f59e0b", color: "#000", border: "none", padding: "12px 24px", borderRadius: 9, fontWeight: 700, cursor: "pointer", fontSize: 15 },
  payoutHistory: { background: "#111", border: "1px solid #1e1e1e", borderRadius: 12, padding: "20px 24px" },
  payoutRow: { display: "flex", justifyContent: "space-between", padding: "12px 0", borderBottom: "1px solid #161616" },
};

const globalCSS = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&family=Space+Mono:wght@400;700&display=swap');
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { background: #0a0a0a; }
  em { font-style: italic; color: #f59e0b; }
  .creator-card:hover { transform: translateY(-3px); border-color: #333 !important; }
  .post-card:hover { border-color: #2a2a2a !important; }
  .tier-card:hover { border-color: #333 !important; }
  ::-webkit-scrollbar { width: 6px; } 
  ::-webkit-scrollbar-track { background: #111; } 
  ::-webkit-scrollbar-thumb { background: #333; border-radius: 3px; }
`;
