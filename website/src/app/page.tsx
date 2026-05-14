export default function Home() {
  return (
    <div className="min-h-screen bg-[#0A0A0B] text-zinc-300 font-sans selection:bg-emerald-500/30 overflow-x-hidden relative">
      {/* Background Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[400px] bg-emerald-500/10 blur-[120px] rounded-full pointer-events-none -z-10"></div>
      
      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-4 backdrop-blur-md border-b border-white/5 bg-[#0A0A0B]/80">
        <div className="flex items-center gap-2 font-bold text-white text-xl tracking-tight">
          <span className="text-emerald-500 text-2xl">🔌</span> portFile
        </div>
        <div className="hidden md:flex items-center gap-8 text-sm font-mono text-zinc-500">
          <a href="#problem" className="hover:text-emerald-400 transition-colors">/00 problem</a>
          <a href="#commands" className="hover:text-emerald-400 transition-colors">/01 commands</a>
          <a href="#how" className="hover:text-emerald-400 transition-colors">/02 how it works</a>
        </div>
        <div className="flex items-center gap-4">
          <a href="https://github.com/akt9802/portFile" target="_blank" rel="noreferrer" className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white border border-white/10 rounded-full hover:bg-white/5 transition">
             GitHub
          </a>
        </div>
      </nav>

      <main className="pt-32 pb-24 px-6 max-w-7xl mx-auto">
        <section className="grid lg:grid-cols-2 gap-16 items-center min-h-[70vh]">
          <div className="flex flex-col gap-8">
            <h4 className="text-emerald-500 font-mono text-sm tracking-widest uppercase">/00 LOCAL-FIRST PORT REGISTRY</h4>
            <h1 className="text-6xl md:text-8xl font-medium tracking-tighter text-white leading-[1.05]">
              Stop guessing who owns <span className="italic text-emerald-500 font-light">port 3000</span>.
            </h1>
            <p className="text-xl text-zinc-400 max-w-lg leading-relaxed">
              Detect backend conflicts before they break things. A decentralized <code className="bg-white/10 px-1 py-0.5 rounded">.nvmrc</code> for your project ports.
            </p>
            <div className="flex items-center gap-4 mt-4">
              <code className="px-6 py-4 rounded-xl bg-white/5 border border-white/10 font-mono text-emerald-400 text-sm shadow-xl">
                 npm install -g portfile 
              </code>
            </div>
          </div>

          <div className="relative rounded-xl border border-white/10 bg-[#121212] shadow-2xl overflow-hidden aspect-[4/3] flex flex-col">
            <div className="flex items-center gap-2 px-4 py-3 border-b border-white/5 bg-[#0D0D0D]">
              <div className="w-3 h-3 rounded-full bg-red-500/80"></div>
              <div className="w-3 h-3 rounded-full bg-yellow-500/80"></div>
              <div className="w-3 h-3 rounded-full bg-green-500/80"></div>
              <div className="mx-auto font-mono text-xs text-zinc-500">~ portfile check</div>
            </div>
            <div className="p-6 font-mono text-sm text-zinc-300 flex-1 overflow-y-auto">
              <div className="text-zinc-500 mb-4"># Check local port assignments and real-time live usage</div>
              <div className="text-emerald-400 mb-1">$ portfile check</div>
              <div className="text-zinc-400 mb-6">Checking ports for <span className="text-cyan-400">ecommerce-app</span> (~/projects/ecommerce)...</div>
              
              <div className="grid grid-cols-4 gap-4 text-[10px] sm:text-xs font-bold text-zinc-500 mb-2 border-b border-white/5 pb-2">
                <div>PORT</div>
                <div className="col-span-2">DESCRIPTION</div>
                <div>STATUS</div>
              </div>
              <div className="grid grid-cols-4 gap-4 text-xs sm:text-sm mb-3">
                <div className="text-green-400">3000</div>
                <div className="col-span-2 text-zinc-300">Next.js dev server</div>
                <div><span className="bg-emerald-500 text-black px-2 py-0.5 rounded font-bold text-[10px]"> LIVE </span></div>
              </div>
              <div className="grid grid-cols-4 gap-4 text-xs sm:text-sm mb-3">
                <div className="text-green-400">5432</div>
                <div className="col-span-2 text-zinc-300">PostgreSQL</div>
                <div><span className="bg-emerald-500 text-black px-2 py-0.5 rounded font-bold text-[10px]"> LIVE </span></div>
              </div>
              <div className="grid grid-cols-4 gap-4 text-xs sm:text-sm mb-3">
                <div className="text-yellow-400">8080</div>
                <div className="col-span-2 text-zinc-500">Go Microservice</div>
                <div className="text-zinc-600">idle</div>
              </div>
            </div>
          </div>
        </section>

        <section id="how" className="mt-32">
           <div className="border-t border-white/10 pt-16 grid md:grid-cols-3 gap-12">
             <div className="flex flex-col gap-4">
                <h3 className="text-2xl text-white font-medium">Global Registry</h3>
                <p className="text-zinc-400 text-sm leading-relaxed">Runs entirely locally. <code className="text-emerald-400 bg-emerald-400/10 px-1 py-0.5 rounded">portfile register</code> tracks your bound ports to ensure you never have a collision when booting an app blindly.</p>
             </div>
             <div className="flex flex-col gap-4">
                <h3 className="text-2xl text-white font-medium">Live Scanners</h3>
                <p className="text-zinc-400 text-sm leading-relaxed">It doesn't just read JSON—it pings the socket. See exactly what is running in the background without manually parsing messy <code className="text-emerald-400 bg-emerald-400/10 px-1 py-0.5 rounded">lsof -i</code> output.</p>
             </div>
             <div className="flex flex-col gap-4">
                <h3 className="text-2xl text-white font-medium">Project .portfile</h3>
                <p className="text-zinc-400 text-sm leading-relaxed">Lock in your dependencies. Commit a <code className="text-emerald-400 bg-emerald-400/10 px-1 py-0.5 rounded">.portfile</code> to Git so your whole team gets the bindings populated upon running <code className="text-emerald-400 bg-emerald-400/10 px-1 py-0.5 rounded">init</code>.</p>
             </div>
           </div>
        </section>

        <section id="commands" className="mt-32 border-t border-white/10 pt-16">
          <div className="flex flex-col gap-4 mb-12">
            <h4 className="text-emerald-500 font-mono text-sm tracking-widest uppercase">/01 COMMAND REFERENCE</h4>
            <h2 className="text-4xl text-white font-medium">Everything at your fingertips.</h2>
            <p className="text-zinc-400 text-lg max-w-2xl">Portfile ships with a suite of commands designed to keep your local environment clean and conflict-free.</p>
          </div>
          <div className="grid md:grid-cols-2 gap-x-6 gap-y-6">
            {[
              { cmd: "init", desc: "Interactive wizard to create a .portfile config for your project and automatically map your ports." },
              { cmd: "check", desc: "Pre-flight scan. Verifies if your declared ports are currently LIVE or in conflict with another repo." },
              { cmd: "list", desc: "Displays a clean terminal table of every port registered across all projects on your entire machine." },
              { cmd: "register <port>", desc: "Manually bind a port to the current project directory in the global SQLite database." },
              { cmd: "release <port>", desc: "Free up a specific port or use --all to release all ports associated with the active project." },
              { cmd: "scan --range", desc: "Pings a network range (e.g. 3000-4000) to uncover untracked background processes." },
              { cmd: "doctor", desc: "System cleanup. Scans your registry for 'stale' entries left behind by deleted project folders." },
              { cmd: "status", desc: "View a quick, real-time dashboard tracking your current project's port health." }
            ].map(c => (
              <div key={c.cmd} className="flex flex-col p-6 rounded-xl border border-white/5 bg-white/[0.02] hover:border-emerald-500/30 hover:bg-emerald-500/[0.02] transition-colors">
                <code className="text-emerald-400 font-mono text-sm mb-3 font-semibold">portfile {c.cmd}</code>
                <p className="text-zinc-400 text-sm leading-relaxed">{c.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* CTA Section */}
        <section className="mt-40 mb-20">
          <div className="relative rounded-3xl overflow-hidden border border-white/10 bg-[#121212] px-8 py-16 text-center shadow-2xl">
            <div className="absolute inset-0 bg-gradient-to-b from-emerald-500/10 to-transparent opacity-50 pointer-events-none"></div>
            <h2 className="text-3xl md:text-5xl font-medium text-white mb-6 relative z-10">Ready to tame your ports?</h2>
            <p className="text-zinc-400 max-w-xl mx-auto mb-8 relative z-10">Start managing your team's local development environment today. No more "port is already in use" errors.</p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 relative z-10">
              <code className="px-6 py-3 rounded-xl bg-black border border-white/10 font-mono text-emerald-400 text-sm shadow-xl flex items-center gap-3">
                 $ npm install -g portfile 
                 <svg className="w-4 h-4 text-zinc-500 cursor-pointer hover:text-white transition" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>
              </code>
              <a href="https://github.com/akt9802/portFile" target="_blank" rel="noreferrer" className="px-6 py-3 rounded-xl bg-white text-black font-medium hover:bg-zinc-200 transition">
                View on GitHub
              </a>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-white/5 bg-[#0A0A0B] py-12 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2 font-bold text-white text-lg tracking-tight opacity-50 hover:opacity-100 transition">
            <span className="text-emerald-500 text-xl">🔌</span> portFile
          </div>
          <p className="text-zinc-500 text-sm">
            Built for developers tired of EADDRINUSE. Open source under the MIT License.
          </p>
          <div className="flex gap-4 text-sm font-mono text-zinc-500">
            <a href="https://github.com/akt9802/portFile" className="hover:text-emerald-400 transition-colors">github</a>
            <a href="https://npmjs.com/package/portfile" className="hover:text-emerald-400 transition-colors">npm</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
