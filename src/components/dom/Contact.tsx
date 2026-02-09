export function Contact() {
    return (
        <section className="section" id="contact">
            <div className="text-center px-8">
                <div className="relative inline-block mb-12">
                    <div className="absolute -inset-8 bg-gradient-to-r from-cyan-500 via-purple-500 to-orange-500 rounded-full blur-3xl opacity-30 animate-pulse"></div>
                    <h2 className="relative text-5xl md:text-7xl font-bold">JOIN THE FIELD</h2>
                </div>

                <div className="flex flex-wrap justify-center gap-8 text-sm tracking-widest uppercase">
                    {['Instagram', 'Are.na', 'Newsletter'].map((link) => (
                        <a key={link} href="#" className="group relative px-8 py-4 border border-white/20 hover:border-white/60 transition-colors overflow-hidden">
                            <span className="relative z-10 mix-blend-difference">{link}</span>
                            <div className="absolute inset-0 bg-white scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-300"></div>
                        </a>
                    ))}
                </div>
            </div>

            {/* Footer info */}
            <div className="absolute bottom-8 left-0 w-full text-center text-xs text-secondary opacity-50">
                Collective © 2026
            </div>
        </section>
    )
}
