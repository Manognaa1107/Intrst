"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { HomeIcon, UsersIcon, MessageSquareIcon, CalendarIcon, UserIcon, BellIcon, SearchIcon, CoffeeIcon, ShieldCheckIcon, LayoutDashboardIcon, XIcon } from "lucide-react";
import { useState, useEffect } from "react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useUser } from "@/context/UserContext";
import { ApprovalGuard } from "@/components/ApprovalGuard";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { LogOutIcon } from "lucide-react";

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const { name, username, aiProfile, role } = useUser();
  const [unreadCount, setUnreadCount] = useState(0);

  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<{ clubs: any[]; events: any[]; posts: any[] }>({ clubs: [], events: [], posts: [] });
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsSearchOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const handleSearch = async (query: string) => {
    setSearchQuery(query);
    if (query.trim().length < 2) {
      setSearchResults({ clubs: [], events: [], posts: [] });
      return;
    }
    setIsSearching(true);
    try {
      const { data: clubsData } = await supabase
        .from('profiles')
        .select('user_id, name, profile_image_url, role, bio')
        .eq('role', 'club')
        .ilike('name', `%${query}%`)
        .limit(5);

      const { data: eventsData } = await supabase
        .from('events')
        .select('event_id, title, location, started_at')
        .ilike('title', `%${query}%`)
        .limit(5);

      const { data: postsData } = await supabase
        .from('posts')
        .select('id, content, post_type')
        .ilike('content', `%${query}%`)
        .limit(5);

      setSearchResults({
        clubs: clubsData || [],
        events: eventsData || [],
        posts: postsData || []
      });
    } catch (e) {
      console.error("Search query failed:", e);
    } finally {
      setIsSearching(false);
    }
  };

  useEffect(() => {
    const fetchUnreadCount = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session?.user?.id) return;

        const { count, error } = await supabase
          .from('notifications')
          .select('*', { count: 'exact', head: true })
          .eq('user_id', session.user.id)
          .eq('read_status', false);

        if (!error && count !== null) {
          setUnreadCount(count);
        }
      } catch (e) {
        console.error("Error fetching notification count", e);
      }
    };

    fetchUnreadCount();

    // Subscribe to new notifications
    const channel = supabase
      .channel('schema-db-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'notifications'
        },
        () => fetchUnreadCount()
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  interface NavItem {
    name: string;
    href: string;
    icon: any;
    special?: boolean;
    roleRequired?: string[];
  }

  const navItems: NavItem[] = [
    { name: "Home", href: "/home", icon: HomeIcon },
    { name: "Communities", href: "/communities", icon: UsersIcon },
    { name: "Canteens", href: "/canteens", icon: CoffeeIcon },
    { name: "Events", href: "/events", icon: CalendarIcon },
    { name: "Profile", href: "/profile/me", icon: UserIcon },
  ].filter(item => {
    // Clubs can't see Communities/Connect
    if (role === 'club' && item.name === 'Communities') return false;
    return true;
  });

  // Add Admin item if role matches
  const isAdmin = ['super_admin', 'founder', 'moderator', 'junior_moderator'].includes(role);
  if (isAdmin) {
    navItems.push({ name: "Admin", href: "/admin", icon: ShieldCheckIcon });
  }

  return (
    <div className="min-h-screen bg-background pb-[80px] md:pb-0 md:pl-[80px] lg:pl-[240px] relative">
      {/* Background blobs (soft beige) */}
      <div className="absolute -left-40 top-0 w-[500px] h-[500px] rounded-full bg-[#e9e6df] blur-[120px] opacity-30" />
      <div className="absolute -right-40 top-0 w-[500px] h-[500px] rounded-full bg-[#e9e6df] blur-[120px] opacity-30" />
      <div className="absolute top-[35%] left-[-150px] w-[400px] h-[400px] rounded-full bg-[#f3f1eb] blur-[120px] opacity-40" />
      <div className="absolute top-[60%] right-[-150px] w-[400px] h-[400px] rounded-full bg-[#f0ede6] blur-[110px] opacity-35" />
      {/* Top Bar for Mobile */}
      <header className="fixed top-0 left-0 right-0 h-16 bg-background/80 backdrop-blur-lg border-b border-border/40 z-40 flex items-center justify-between px-4 md:hidden">
        <Link href="/home" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-brand flex items-center justify-center font-dmserif font-bold text-white tracking-widest text-xs">
            intrst
          </div>
          <span className="font-dmserif font-semibold text-lg">intrst</span>
        </Link>
        <div className="flex items-center gap-4">
          <button
            onClick={() => setIsSearchOpen(true)}
            className="text-muted-foreground hover:text-black transition-colors"
          >
            <SearchIcon className="w-6 h-6" />
          </button>
          <Link href="/notifications" className="relative text-muted-foreground hover:text-black transition-colors">
            <BellIcon className="w-6 h-6" />
            {unreadCount > 0 && (
              <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full border border-background"></span>
            )}
          </Link>
        </div>
      </header>

      {/* Side Nav for Desktop */}
      <aside className="fixed top-0 left-0 bottom-0 w-[80px] lg:w-[240px] bg-card/30 border-r border-border/40 z-40 hidden md:flex flex-col">
        <div className="h-16 flex items-center px-6 border-b border-border/40 shrink-0">
          <Link href="/home" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-brand shrink-0 flex items-center justify-center font-dmserif font-bold text-white tracking-widest text-xs">
              i
            </div>
            <span className="font-dmserif font-semibold text-xl hidden lg:block tracking-tight">intrst</span>
          </Link>
        </div>

        <nav className="flex-1 py-6 px-3 flex flex-col gap-2 overflow-y-auto hide-scrollbar">
          {navItems.map((item) => {
            const isActive = pathname.startsWith(item.href) && (item.href !== '/connect' || pathname === '/connect' || pathname.startsWith('/connect/'));
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center gap-4 px-3 py-3 rounded-xl transition-all ${isActive
                  ? 'bg-brand/5 text-accent font-medium'
                  : 'text-muted-foreground hover:text-black hover:bg-black/5'
                  } ${item.special ? 'lg:bg-brand/5 lg:border lg:border-brand/20 shadow-sm' : ''}`}
              >
                <div className={`relative flex items-center justify-center ${item.special ? 'w-10 h-10 -ml-1 rounded-full bg-brand text-white shadow-sm' : ''}`}>
                  <item.icon className={item.special ? "w-5 h-5" : "w-6 h-6"} />
                </div>
                <span className="text-base hidden lg:block">{item.name}</span>
              </Link>
            )
          })}
        </nav>

        <div className="p-4 border-t border-border/40">
          <Link href="/profile/me" className="flex items-center gap-3 w-full hover:bg-card p-2 rounded-xl transition-colors">
            {pathname.includes("/connect") ? (
              <>
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-brand/20 to-accent/20 flex items-center justify-center shrink-0 shadow-sm">
                  <svg viewBox="0 0 40 40" className="w-6 h-6 fill-black/30">
                    <polygon points="20,5 35,32 5,32" />
                  </svg>
                </div>
                <div className="hidden lg:block overflow-hidden">
                  <div className="font-medium text-sm text-[#0f0f10] truncate italic">{aiProfile?.matchCodename || "Anonymous"}</div>
                  <div className="text-[10px] text-accent font-semibold tracking-wider uppercase">Anonymous Mode</div>
                </div>
              </>
            ) : (
              <>
                <Avatar className="w-10 h-10 border border-border shrink-0">
                  <AvatarFallback className="bg-accent/10 text-accent font-bold">{name[0]}</AvatarFallback>
                </Avatar>
                <div className="hidden lg:block overflow-hidden">
                  <div className="font-medium text-sm text-[#0f0f10] truncate">{name}</div>
                  <div className="text-xs text-muted-foreground truncate">@{username || name.toLowerCase().replace(/\s+/g, '.')}</div>
                </div>
              </>
            )}
          </Link>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="w-full h-full pt-16 md:pt-0 flex flex-col min-h-[calc(100vh-80px)] md:min-h-screen">
        {/* Desktop Top Nav Search Bar */}
        <header className="hidden md:flex sticky top-0 z-30 bg-background/80 backdrop-blur-md border-b border-black/5 px-8 py-3.5 items-center justify-between">
          <div
            onClick={() => setIsSearchOpen(true)}
            className="relative w-80 cursor-pointer group"
          >
            <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400 group-hover:text-black transition-colors" />
            <div className="w-full bg-white border border-black/5 rounded-xl h-10 pl-11 pr-4 flex items-center text-sm text-neutral-400 font-normal shadow-sm hover:border-neutral-300 transition-all">
              Search clubs, events, posts...
            </div>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/notifications" className="relative text-neutral-500 hover:text-black transition-colors p-2 rounded-xl hover:bg-neutral-100">
              <BellIcon className="w-5 h-5" />
              {unreadCount > 0 && (
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border border-background"></span>
              )}
            </Link>
          </div>
        </header>
        <div className="flex-1">
          <ApprovalGuard>
            {children}
          </ApprovalGuard>
        </div>

        {/* Footer */}
        <footer className="w-full py-12 px-6 border-t border-black/5 mt-12 bg-white/40 backdrop-blur-xl">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8 text-center md:text-left">
            <div className="space-y-4">
              <div className="flex items-center gap-2 justify-center md:justify-start">
                <div className="w-8 h-8 rounded-lg bg-black flex items-center justify-center font-dmserif font-bold text-white tracking-widest text-xs shadow-sm">
                  intrst
                </div>
                <span className="font-dmserif font-bold text-xl tracking-tight text-[#0f0f10]">intrst</span>
              </div>
              <p className="text-sm text-neutral-500 max-w-xs leading-relaxed">
                The honest campus layer for GITAM students. Built for impact, run with integrity.
              </p>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-x-12 gap-y-6">
              <div className="space-y-4">
                <h4 className="text-xs font-bold uppercase tracking-widest text-neutral-400">Platform</h4>
                <ul className="space-y-2 text-sm text-neutral-500 flex flex-col items-center md:items-start font-medium underline-offset-4 decoration-accent/30">
                  <li className="hover:text-black transition-colors hover:underline"><Link href="/home">Home</Link></li>
                  <li className="hover:text-black transition-colors hover:underline"><Link href="/canteens">Canteens</Link></li>
                  <li className="hover:text-black transition-colors hover:underline"><Link href="/events">Events</Link></li>
                </ul>
              </div>
              <div className="space-y-4">
                <h4 className="text-xs font-bold uppercase tracking-widest text-neutral-400">Company</h4>
                <ul className="space-y-2 text-sm text-neutral-500 flex flex-col items-center md:items-start font-medium underline-offset-4 decoration-accent/30">
                  <li className="hover:text-black transition-colors hover:underline"><Link href="/about">About Us</Link></li>
                  <li className="hover:text-black transition-colors hover:underline group">
                    <a href="mailto:intrst2026@gmail.com" className="flex items-center gap-2 justify-center md:justify-start">
                      <span>Contact Us</span>
                    </a>
                  </li>
                </ul>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="text-xs font-bold uppercase tracking-widest text-neutral-400 md:text-right">Socials</h4>
              <div className="flex items-center gap-4">
                <a href="https://instagram.com/intrst.in" target="_blank" className="p-2.5 rounded-xl border border-black/5 hover:text-accent hover:border-accent/40 transition-all hover:bg-accent/5">
                  <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.162 6.162 6.162 6.162-2.759 6.162-6.162-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.791-4-4s1.791-4 4-4 4 1.791 4 4-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" /></svg>
                </a>
                <a href="https://github.com/Sampath04x/hmu-platform" target="_blank" className="p-2.5 rounded-xl border border-black/5 hover:text-accent hover:border-accent/40 transition-all hover:bg-accent/5">
                  <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" /></svg>
                </a>
              </div>
              <div className="text-[10px] text-neutral-400 uppercase tracking-widest font-bold md:text-right">
                © 2026 intrst.in
              </div>
            </div>
          </div>
        </footer>
      </main>


      {/* Bottom Nav for Mobile */}
      <div className="fixed bottom-0 left-0 right-0 h-[80px] bg-[#faf9f6]/95 backdrop-blur-xl border-t border-black/5 z-50 flex items-center justify-around px-2 pb-safe md:hidden">
        {navItems.map((item) => {
          const isActive = pathname.startsWith(item.href) && (item.href !== '/connect' || pathname === '/connect' || pathname.startsWith('/connect/'));

          if (item.special) {
            return (
              <Link key={item.name} href={item.href} className="flex flex-col items-center justify-center -mt-6">
                <div className={`w-14 h-14 rounded-full flex items-center justify-center shadow-sm transition-transform active:scale-95 ${isActive ? 'bg-accent' : 'bg-black'
                  }`}>
                  <item.icon className="w-6 h-6 text-white" />
                </div>
                <span className={`text-[10px] mt-1.5 font-medium ${isActive ? 'text-accent' : 'text-neutral-500'}`}>{item.name}</span>
              </Link>
            );
          }

          return (
            <Link key={item.name} href={item.href} className="flex flex-col items-center justify-center w-16 gap-1 group">
              <div className={`p-1.5 rounded-xl transition-colors ${isActive ? 'bg-black/5 text-black' : 'text-neutral-500 group-hover:text-black'}`}>
                <item.icon className="w-6 h-6" strokeWidth={isActive ? 2.5 : 2} />
              </div>
              <span className={`text-[10px] font-medium transition-colors ${isActive ? 'text-black font-semibold' : 'text-neutral-500 group-hover:text-black'}`}>{item.name}</span>
            </Link>
          )
        })}
      </div>
      {/* Search Modal Overlay */}
      {isSearchOpen && (
        <div className="fixed inset-0 z-50 bg-[#faf9f6]/95 backdrop-blur-md flex items-start justify-center pt-20 px-4 animate-in fade-in duration-200">
          <div className="w-full max-w-xl bg-white border border-black/5 rounded-2xl shadow-xl overflow-hidden flex flex-col max-h-[70vh]">
            {/* Search Input Box */}
            <div className="relative border-b border-black/5 p-4 flex items-center gap-3">
              <SearchIcon className="w-5 h-5 text-neutral-400" />
              <input
                type="text"
                placeholder="Search clubs, events, or posts..."
                value={searchQuery}
                onChange={(e) => handleSearch(e.target.value)}
                className="flex-1 bg-transparent border-none outline-none text-base text-[#0f0f10] placeholder:text-neutral-400"
                autoFocus
              />
              <button
                onClick={() => { setIsSearchOpen(false); setSearchQuery(""); setSearchResults({ clubs: [], events: [], posts: [] }); }}
                className="text-xs bg-neutral-100 hover:bg-neutral-200 text-neutral-500 font-bold px-2.5 py-1 rounded-lg transition-colors"
              >
                ESC
              </button>
            </div>

            {/* Search Results Display Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-6 hide-scrollbar">
              {isSearching ? (
                <div className="flex items-center justify-center py-10">
                  <div className="w-6 h-6 border-2 border-[#505f78] border-t-transparent rounded-full animate-spin"></div>
                </div>
              ) : searchQuery.trim().length < 2 ? (
                <div className="text-center py-10 text-neutral-400 text-xs font-medium">
                  Type at least 2 characters to search clubs, events, and posts...
                </div>
              ) : searchResults.clubs.length === 0 && searchResults.events.length === 0 && searchResults.posts.length === 0 ? (
                <div className="text-center py-10 text-neutral-400 text-xs font-medium">
                  No matching results found for &quot;{searchQuery}&quot;
                </div>
              ) : (
                <>
                  {/* Clubs Section */}
                  {searchResults.clubs.length > 0 && (
                    <div className="space-y-2.5">
                      <h4 className="text-[10px] font-bold tracking-widest text-[#855300] uppercase">Clubs</h4>
                      <div className="divide-y divide-black/5 border border-black/5 rounded-xl bg-neutral-50/50 overflow-hidden">
                        {searchResults.clubs.map((club) => (
                          <Link
                            key={club.user_id}
                            href={`/profile/${club.user_id}`}
                            onClick={() => setIsSearchOpen(false)}
                            className="flex items-center gap-3 p-3 hover:bg-white transition-colors"
                          >
                            <div className="w-8 h-8 rounded-lg bg-black text-white font-bold text-xs flex items-center justify-center shrink-0">
                              {club.name?.[0] || 'C'}
                            </div>
                            <div className="min-w-0 flex-1">
                              <div className="text-sm font-semibold text-[#0f0f10] truncate">{club.name}</div>
                              {club.bio && <div className="text-xs text-neutral-500 truncate">{club.bio}</div>}
                            </div>
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Events Section */}
                  {searchResults.events.length > 0 && (
                    <div className="space-y-2.5">
                      <h4 className="text-[10px] font-bold tracking-widest text-[#505f78] uppercase">Events</h4>
                      <div className="divide-y divide-black/5 border border-black/5 rounded-xl bg-neutral-50/50 overflow-hidden">
                        {searchResults.events.map((evt) => (
                          <Link
                            key={evt.event_id}
                            href={`/events`}
                            onClick={() => setIsSearchOpen(false)}
                            className="flex items-center justify-between p-3 hover:bg-white transition-colors"
                          >
                            <div className="min-w-0 flex-1 pr-4">
                              <div className="text-sm font-semibold text-[#0f0f10] truncate">{evt.title}</div>
                              <div className="text-xs text-neutral-500 truncate">📍 {evt.location || 'Campus'}</div>
                            </div>
                            <span className="text-[10px] text-neutral-400 font-bold uppercase shrink-0">
                              {evt.started_at ? new Date(evt.started_at).toLocaleDateString([], { month: 'short', day: 'numeric' }) : 'Upcoming'}
                            </span>
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Posts Section */}
                  {searchResults.posts.length > 0 && (
                    <div className="space-y-2.5">
                      <h4 className="text-[10px] font-bold tracking-widest text-neutral-400 uppercase">Posts</h4>
                      <div className="divide-y divide-black/5 border border-black/5 rounded-xl bg-neutral-50/50 overflow-hidden">
                        {searchResults.posts.map((post) => (
                          <Link
                            key={post.id}
                            href={`/home`}
                            onClick={() => setIsSearchOpen(false)}
                            className="block p-3 hover:bg-white transition-colors"
                          >
                            <div className="flex justify-between items-center mb-1">
                              <span className="text-[9px] font-bold text-neutral-400 uppercase">{post.post_type}</span>
                            </div>
                            <p className="text-xs text-neutral-600 line-clamp-2 leading-relaxed">{post.content}</p>
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
