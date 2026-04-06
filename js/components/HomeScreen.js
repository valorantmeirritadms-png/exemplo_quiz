/*
  ╔══════════════════════════════════════════════════════════════════╗
  ║              js/components/HomeScreen.js                        ║
  ║                  Ecrã Inicial (Página de Boas-Vindas)           ║
  ║  ACTUALIZADO: Botão Ranking funciona, recebe onNavigate         ║
  ╚══════════════════════════════════════════════════════════════════╝
*/

const HomeScreen = ({ t, lang, onStart, onNavigate, user }) => (
    <div className="flex flex-col min-h-screen">
      <main className="flex-grow">

        {/* ═══════════════════════════════════════════════════════════
          SECÇÃO HERO
          ═══════════════════════════════════════════════════════════ */}
        <section className="relative min-h-[90vh] flex items-center overflow-hidden py-16 px-4 md:px-12">

          {/* Fundo bandeira colombiana */}
          <div className="absolute inset-0 z-0 flex flex-col opacity-[0.07] pointer-events-none">
            <div className="h-1/2" style={{ background: '#715c00' }}></div>
            <div className="h-1/4" style={{ background: '#335ab4' }}></div>
            <div className="h-1/4" style={{ background: '#c0001f' }}></div>
          </div>

          <div className="max-w-6xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-10 items-center relative z-10">

            {/* Coluna de texto */}
            <div className="lg:col-span-7 flex flex-col items-start">

              <span
                  className="anim-fade bg-tertiary-container text-on-tertiary-container px-4 py-1.5 rounded-full font-label text-xs font-bold tracking-[0.2em] uppercase mb-6 ml-2"
                  style={{ color: '#bb001e' }}
              >
                {t.tagline}
              </span>

              <h1
                  className="anim-fade-up delay-1 font-headline font-extrabold tracking-tighter leading-[0.9] mb-6"
                  style={{ fontSize: 'clamp(3.5rem,10vw,7rem)', marginLeft: '-2%' }}
              >
                {t.heroTitle1}<br />
                <span style={{ color: '#715c00', fontStyle: 'italic' }}>{t.heroTitle2}</span><br />
                <span style={{ color: '#c0001f' }}>{t.heroTitle3}</span>
              </h1>

              <p
                  className="anim-fade-up delay-2 text-on-surface-variant text-lg md:text-xl max-w-xl mb-10 font-body leading-relaxed pl-4"
                  style={{ borderLeft: '4px solid #fcd116' }}
              >
                {t.heroDesc}
              </p>

              {/* Botões */}
              <div className="anim-fade-up delay-3 flex flex-col sm:flex-row gap-3 pl-2 w-full sm:w-auto">
                <button
                    onClick={onStart}
                    className="px-8 py-4 font-headline font-bold text-lg rounded-full text-white flex items-center justify-center gap-2 btn-shadow hover:scale-105 active:scale-95 transition-all"
                    style={{ background: 'linear-gradient(135deg, #715c00, #fcd116)' }}
                >
                  {t.start}
                  <Icon name="play_arrow" />
                </button>

                <button
                    onClick={() => onNavigate('ranking')}
                    className="px-8 py-4 bg-surface-container-highest text-on-surface font-headline font-bold text-lg rounded-full hover:bg-surface-container transition-all flex items-center gap-2"
                >
                  <Icon name="leaderboard" style={{ fontSize: '20px' }} />
                  {t.ranking}
                </button>
              </div>
            </div>

            {/* Bento grid de imagens */}
            <div className="lg:col-span-5 grid grid-cols-2 gap-3 relative">

              {/* Pílula de recorde */}
              <div
                  className="absolute -top-10 -right-2 z-20 glass px-4 py-3 rounded-2xl editorial-shadow hidden md:flex items-center gap-2"
                  style={{ border: '1px solid rgba(255,255,255,0.3)' }}
              >
                <Icon name="workspace_premium" fill className="text-secondary" style={{ fontSize: '28px' }} />
                <div>
                  <p className="text-[9px] font-bold uppercase tracking-widest opacity-60 text-on-secondary-container">
                    {t.recordLabel}
                  </p>
                  <p className="text-base font-bold text-secondary">
                    {user ? `${user.name.split(' ')[0]}: ${user.xp || 0} XP` : '2,450 pts'}
                  </p>
                </div>
              </div>

              <div className="rounded-[2rem] overflow-hidden aspect-[4/5] bg-surface-container editorial-shadow">
                <img src={IMAGES.orchid} alt="Orquídea"
                     className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
                     onError={e => e.target.style.display = 'none'} />
              </div>

              <div className="mt-10 rounded-[2rem] overflow-hidden aspect-[4/5] editorial-shadow">
                <img src={IMAGES.coffee} alt="Café"
                     className="w-full h-full object-cover"
                     onError={e => e.target.style.display = 'none'} />
              </div>

              <div
                  className="col-span-2 rounded-[2rem] overflow-hidden bg-surface-container-highest editorial-shadow relative"
                  style={{ aspectRatio: '16/8' }}
              >
                <img src={IMAGES.hero} alt="Colombia"
                     className="w-full h-full object-cover opacity-80"
                     onError={e => e.target.style.display = 'none'} />
                <div className="absolute inset-0"
                     style={{ background: 'linear-gradient(to top, rgba(31,27,17,0.6), transparent)' }}></div>
                <div className="absolute bottom-5 left-5 text-white">
                  <p className="font-headline font-bold text-lg">Tradición Vallenata</p>
                  <p className="text-xs opacity-70">El corazón de nuestra cultura</p>
                </div>
              </div>
            </div>

          </div>
        </section>

        {/* ═══════════════════════════════════════════════════════════
          SECÇÃO CATEGORIAS
          ═══════════════════════════════════════════════════════════ */}
        <section className="py-20 bg-surface-container-low">
          <div className="max-w-6xl mx-auto px-4 md:px-8">

            <div className="flex justify-between items-end mb-12">
              <div>
                <h2 className="font-headline text-3xl font-bold mb-3 tracking-tight">{t.categories}</h2>
                <div className="h-1.5 w-20 rounded-full" style={{ background: '#c0001f' }}></div>
              </div>
              <button
                  onClick={onStart}
                  className="text-primary font-bold hover:underline flex items-center gap-1 text-sm"
              >
                {t.seeAll} <Icon name="arrow_forward" style={{ fontSize: '18px' }} />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                { name: t.cat1Name, desc: t.cat1Desc, count: t.cat1Count, icon: 'landscape',   color: '#715c00', bg: '#ffe17b' },
                { name: t.cat2Name, desc: t.cat2Desc, count: t.cat2Count, icon: 'music_note',  color: '#335ab4', bg: '#dae1ff', mt: true },
                { name: t.cat3Name, desc: t.cat3Desc, count: t.cat3Count, icon: 'history_edu', color: '#c0001f', bg: '#ffc8c4' },
              ].map(({ name, desc, count, icon, color, bg, mt }) => (
                  <div
                      key={name}
                      onClick={onStart}
                      className={`bg-surface-container-lowest p-7 rounded-[2rem] editorial-shadow hover:-translate-y-2 transition-all cursor-pointer group ${mt ? 'md:mt-8' : ''}`}
                  >
                    <div
                        className="w-14 h-14 rounded-2xl flex items-center justify-center mb-6 transition-colors"
                        style={{ background: bg + '33' }}
                    >
                      <Icon name={icon} style={{ color, fontSize: '28px' }} />
                    </div>
                    <h3 className="font-headline text-xl font-bold mb-3">{name}</h3>
                    <p className="text-on-surface-variant text-sm mb-5 leading-relaxed">{desc}</p>
                    <span className="text-xs font-bold tracking-widest uppercase" style={{ color }}>{count}</span>
                  </div>
              ))}
            </div>
          </div>
        </section>

      </main>

      <Footer t={t} />
      <BottomNav t={t} screen="home" onNavigate={onNavigate} />
    </div>
);
