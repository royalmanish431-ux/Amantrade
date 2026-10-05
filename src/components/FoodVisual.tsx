import React from 'react';

interface FoodVisualProps {
  foodType: string;
  className?: string;
  altText?: string;
}

export const FoodVisual: React.FC<FoodVisualProps> = ({ foodType, className = '' }) => {
  switch (foodType) {
    case 'kheer':
      return (
        <div className={`relative w-full h-full overflow-hidden bg-gradient-to-br from-amber-950 via-amber-900 to-stone-900 flex items-center justify-center ${className}`}>
          {/* Earthen Handi Outer Rim */}
          <div className="relative w-[84%] h-[84%] rounded-full bg-gradient-to-b from-[#8d4925] via-[#6e3518] to-[#45200e] p-[7px] shadow-2xl flex items-center justify-center">
            {/* Clay Bowl Inner Shadow */}
            <div className="relative w-full h-full rounded-full bg-[#fbf6ea] shadow-[inset_0_4px_16px_rgba(0,0,0,0.5)] overflow-hidden flex items-center justify-center">
              {/* Creamy Kheer Base Texture */}
              <div className="absolute inset-0 bg-gradient-to-tr from-[#fbf3db] via-[#fffbf0] to-[#f5ebd0]" />
              <div className="absolute inset-0 opacity-40 bg-[radial-gradient(#e6d3a3_1px,transparent_1px)] [background-size:8px_8px]" />

              {/* Saffron Strands & Swirls */}
              <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100" fill="none">
                <path d="M30 45 Q42 38 52 48 T70 42" stroke="#ea580c" strokeWidth="0.8" strokeLinecap="round" opacity="0.8" />
                <path d="M25 60 Q38 68 55 58 T78 65" stroke="#f59e0b" strokeWidth="0.7" strokeLinecap="round" opacity="0.8" />
                <path d="M45 25 Q55 35 48 50" stroke="#d97706" strokeWidth="0.8" strokeLinecap="round" opacity="0.75" />
                
                {/* Almond Slivers */}
                <ellipse cx="48" cy="40" rx="9" ry="4.5" transform="rotate(-30 48 40)" fill="#d4976a" stroke="#8a532b" strokeWidth="0.6" />
                <ellipse cx="48" cy="40" rx="7.5" ry="3.2" transform="rotate(-30 48 40)" fill="#f7e6c4" />

                <ellipse cx="62" cy="52" rx="8" ry="4" transform="rotate(45 62 52)" fill="#d4976a" stroke="#8a532b" strokeWidth="0.6" />
                <ellipse cx="62" cy="52" rx="6.5" ry="2.8" transform="rotate(45 62 52)" fill="#f7e6c4" />

                <ellipse cx="38" cy="58" rx="8.5" ry="4" transform="rotate(15 38 58)" fill="#d4976a" stroke="#8a532b" strokeWidth="0.6" />
                <ellipse cx="38" cy="58" rx="7" ry="3" transform="rotate(15 38 58)" fill="#f7e6c4" />

                {/* Pistachio Slivers (Green) */}
                <ellipse cx="34" cy="38" rx="4" ry="2" transform="rotate(-40 34 38)" fill="#65a30d" />
                <ellipse cx="58" cy="34" rx="4.5" ry="2.2" transform="rotate(25 58 34)" fill="#4d7c0f" />
                <ellipse cx="68" cy="45" rx="3.5" ry="1.8" transform="rotate(-60 68 45)" fill="#65a30d" />
                <ellipse cx="42" cy="70" rx="4" ry="2" transform="rotate(75 42 70)" fill="#84cc16" />
                <ellipse cx="54" cy="66" rx="3.5" ry="1.8" transform="rotate(-20 54 66)" fill="#65a30d" />

                {/* Dried Cranberries / Rose Petals (Deep ruby red) */}
                <ellipse cx="40" cy="48" rx="5" ry="3.5" transform="rotate(35 40 48)" fill="#881337" opacity="0.95" />
                <ellipse cx="49" cy="55" rx="5.5" ry="4" transform="rotate(-25 49 55)" fill="#9f1239" opacity="0.95" />
                <ellipse cx="55" cy="44" rx="4.5" ry="3.2" transform="rotate(10 55 44)" fill="#be123c" opacity="0.95" />
                <ellipse cx="64" cy="62" rx="4" ry="2.8" transform="rotate(-50 64 62)" fill="#9f1239" opacity="0.9" />
              </svg>
            </div>
          </div>
        </div>
      );

    case 'gulab_jamun':
      return (
        <div className={`relative w-full h-full overflow-hidden bg-gradient-to-br from-stone-900 via-amber-950 to-stone-800 flex items-center justify-center ${className}`}>
          {/* Ceramic Serving Bowl */}
          <div className="relative w-[84%] h-[84%] rounded-full bg-gradient-to-b from-[#5c4a3b] via-[#3a2d23] to-[#251b14] p-2 shadow-2xl flex items-center justify-center">
            {/* Glossy Cardamom Syrup */}
            <div className="relative w-full h-full rounded-full bg-gradient-to-tr from-[#92400e] via-[#b45309] to-[#78350f] shadow-[inset_0_4px_14px_rgba(0,0,0,0.6)] overflow-hidden flex items-center justify-center">
              <svg className="w-full h-full" viewBox="0 0 100 100">
                <defs>
                  <radialGradient id="gj-grad-1" cx="35%" cy="35%" r="65%">
                    <stop offset="0%" stopColor="#c26325" />
                    <stop offset="45%" stopColor="#7c2d12" />
                    <stop offset="100%" stopColor="#3d1308" />
                  </radialGradient>
                  <radialGradient id="gj-grad-2" cx="30%" cy="30%" r="70%">
                    <stop offset="0%" stopColor="#b45309" />
                    <stop offset="50%" stopColor="#692209" />
                    <stop offset="100%" stopColor="#300d05" />
                  </radialGradient>
                </defs>

                {/* Syrup ripples */}
                <ellipse cx="50" cy="50" rx="42" ry="42" fill="#78350f" opacity="0.4" />
                
                {/* Jamun 1 (Center Left) */}
                <circle cx="36" cy="48" r="14.5" fill="url(#gj-grad-1)" filter="drop-shadow(0 4px 6px rgba(0,0,0,0.5))" />
                {/* Syrup Glaze highlight */}
                <ellipse cx="32" cy="42" rx="4.5" ry="2.5" transform="rotate(-30 32 42)" fill="#fed7aa" opacity="0.45" />

                {/* Jamun 2 (Center Right) */}
                <circle cx="62" cy="44" r="15" fill="url(#gj-grad-2)" filter="drop-shadow(0 4px 6px rgba(0,0,0,0.5))" />
                <ellipse cx="58" cy="38" rx="5" ry="2.8" transform="rotate(-25 58 38)" fill="#fed7aa" opacity="0.45" />

                {/* Jamun 3 (Bottom Center) */}
                <circle cx="48" cy="66" r="13.5" fill="url(#gj-grad-1)" filter="drop-shadow(0 4px 6px rgba(0,0,0,0.6))" />
                <ellipse cx="44" cy="61" rx="4" ry="2" transform="rotate(-20 44 61)" fill="#fed7aa" opacity="0.4" />

                {/* Jamun 4 (Top Center) */}
                <circle cx="50" cy="28" r="11" fill="url(#gj-grad-2)" opacity="0.9" />

                {/* Pistachio Garnish on top */}
                <ellipse cx="36" cy="44" rx="2" ry="1" fill="#84cc16" />
                <ellipse cx="62" cy="40" rx="2.5" ry="1.2" fill="#84cc16" />
                <ellipse cx="48" cy="62" rx="2" ry="1" fill="#84cc16" />
                <ellipse cx="50" cy="27" rx="1.8" ry="0.9" fill="#84cc16" />
                <circle cx="56" cy="50" r="1" fill="#fde047" opacity="0.9" />
              </svg>
            </div>
          </div>
        </div>
      );

    case 'malai_roll':
      return (
        <div className={`relative w-full h-full overflow-hidden bg-gradient-to-br from-amber-100 via-yellow-50 to-stone-100 flex items-center justify-center ${className}`}>
          <svg className="w-[85%] h-[85%]" viewBox="0 0 100 100">
            {/* Serving Plate */}
            <circle cx="50" cy="50" r="45" fill="#fef3c7" stroke="#d97706" strokeWidth="2" opacity="0.4" />
            <circle cx="50" cy="50" r="39" fill="#fffbeb" />

            {/* Rabdi Base puddle */}
            <ellipse cx="50" cy="52" rx="34" ry="26" fill="#fde68a" opacity="0.75" />

            {/* Malai Roll 1 */}
            <rect x="25" y="32" width="50" height="15" rx="7.5" fill="#fef9c3" stroke="#fef08a" strokeWidth="1" filter="drop-shadow(0 2px 4px rgba(0,0,0,0.15))" />
            <path d="M26 39 Q50 42 74 39" stroke="#f59e0b" strokeWidth="1.2" strokeDasharray="3 2" />

            {/* Malai Roll 2 */}
            <rect x="23" y="52" width="54" height="15" rx="7.5" fill="#fef9c3" stroke="#fef08a" strokeWidth="1" filter="drop-shadow(0 2px 4px rgba(0,0,0,0.15))" />
            <path d="M24 59 Q50 62 76 59" stroke="#f59e0b" strokeWidth="1.2" strokeDasharray="3 2" />

            {/* Saffron and Pistachio Topping */}
            <ellipse cx="40" cy="38" rx="2.5" ry="1.2" fill="#65a30d" />
            <ellipse cx="58" cy="38" rx="2.5" ry="1.2" fill="#dc2626" />
            <ellipse cx="36" cy="58" rx="2.5" ry="1.2" fill="#dc2626" />
            <ellipse cx="54" cy="58" rx="2.5" ry="1.2" fill="#65a30d" />
            <ellipse cx="68" cy="58" rx="2.5" ry="1.2" fill="#b45309" />
          </svg>
        </div>
      );

    case 'rasgulla':
      return (
        <div className={`relative w-full h-full overflow-hidden bg-gradient-to-br from-amber-50 via-stone-100 to-sky-50 flex items-center justify-center ${className}`}>
          {/* Porcelain / Glass Dessert Bowl */}
          <div className="relative w-[88%] h-[88%] rounded-full bg-gradient-to-b from-stone-200 via-stone-100 to-stone-300 p-2 shadow-xl flex items-center justify-center">
            {/* Clear Rose Cardamom Sugar Syrup */}
            <div className="relative w-full h-full rounded-full bg-gradient-to-tr from-sky-100/80 via-amber-50/90 to-white shadow-[inset_0_3px_10px_rgba(0,0,0,0.15)] overflow-hidden flex items-center justify-center">
              <svg className="w-full h-full" viewBox="0 0 100 100">
                <defs>
                  <radialGradient id="rasgulla-shade-1" cx="35%" cy="35%" r="65%">
                    <stop offset="0%" stopColor="#ffffff" />
                    <stop offset="65%" stopColor="#f8fafc" />
                    <stop offset="90%" stopColor="#e2e8f0" />
                    <stop offset="100%" stopColor="#cbd5e1" />
                  </radialGradient>
                  <radialGradient id="rasgulla-shade-2" cx="30%" cy="30%" r="70%">
                    <stop offset="0%" stopColor="#ffffff" />
                    <stop offset="60%" stopColor="#fdfbf7" />
                    <stop offset="88%" stopColor="#e7e5e4" />
                    <stop offset="100%" stopColor="#d6d3d1" />
                  </radialGradient>
                </defs>

                {/* Syrup reflections */}
                <ellipse cx="50" cy="50" rx="42" ry="42" fill="#f0f9ff" opacity="0.6" />
                <path d="M25 45 Q50 38 75 48" stroke="#bae6fd" strokeWidth="1" fill="none" opacity="0.5" />
                <path d="M28 58 Q50 64 72 56" stroke="#fde68a" strokeWidth="1" fill="none" opacity="0.4" />

                {/* Rasgulla 1 (Top Left) */}
                <circle cx="36" cy="42" r="14.5" fill="url(#rasgulla-shade-1)" filter="drop-shadow(0 3px 6px rgba(0,0,0,0.12))" />
                <ellipse cx="32" cy="37" rx="4" ry="2" transform="rotate(-30 32 37)" fill="#ffffff" opacity="0.8" />

                {/* Rasgulla 2 (Top Right) */}
                <circle cx="63" cy="40" r="15" fill="url(#rasgulla-shade-2)" filter="drop-shadow(0 3px 6px rgba(0,0,0,0.12))" />
                <ellipse cx="59" cy="35" rx="4.5" ry="2" transform="rotate(-20 59 35)" fill="#ffffff" opacity="0.8" />

                {/* Rasgulla 3 (Bottom Center) */}
                <circle cx="49" cy="64" r="15.5" fill="url(#rasgulla-shade-1)" filter="drop-shadow(0 4px 7px rgba(0,0,0,0.14))" />
                <ellipse cx="44" cy="59" rx="4.5" ry="2" transform="rotate(-25 44 59)" fill="#ffffff" opacity="0.8" />

                {/* Saffron Strands on top of Rasgullas */}
                <path d="M34 40 Q38 36 41 42" stroke="#ea580c" strokeWidth="0.8" strokeLinecap="round" fill="none" />
                <path d="M60 38 Q65 42 68 36" stroke="#ea580c" strokeWidth="0.8" strokeLinecap="round" fill="none" />
                <path d="M46 62 Q51 66 54 60" stroke="#f59e0b" strokeWidth="0.8" strokeLinecap="round" fill="none" />

                {/* Bright Green Pistachio Slivers */}
                <ellipse cx="36" cy="41" rx="2.5" ry="1.2" transform="rotate(35 36 41)" fill="#65a30d" />
                <ellipse cx="64" cy="39" rx="2.5" ry="1.2" transform="rotate(-40 64 39)" fill="#4d7c0f" />
                <ellipse cx="49" cy="63" rx="2.8" ry="1.2" transform="rotate(15 49 63)" fill="#65a30d" />
                <ellipse cx="43" cy="48" rx="2.2" ry="1" transform="rotate(-60 43 48)" fill="#84cc16" />
                <ellipse cx="57" cy="50" rx="2" ry="0.9" transform="rotate(25 57 50)" fill="#65a30d" />
              </svg>
            </div>
          </div>
        </div>
      );

    case 'kaju_katli':
      return (
        <div className={`relative w-full h-full overflow-hidden bg-gradient-to-br from-stone-200 via-amber-50 to-stone-300 flex items-center justify-center ${className}`}>
          <svg className="w-[85%] h-[85%]" viewBox="0 0 100 100">
            <circle cx="50" cy="50" r="44" fill="#f5f5f4" stroke="#d6d3d1" strokeWidth="1" />
            {/* Diamond cuts with Silver Vark foil */}
            <polygon points="50,22 66,38 50,54 34,38" fill="#f5f5f4" stroke="#e7e5e4" strokeWidth="1" filter="drop-shadow(0 2px 4px rgba(0,0,0,0.08))" />
            <polygon points="50,22 66,38 50,54 34,38" fill="url(#silver-foil)" opacity="0.3" />

            <polygon points="68,40 84,56 68,72 52,56" fill="#f5f5f4" stroke="#e7e5e4" strokeWidth="1" filter="drop-shadow(0 2px 4px rgba(0,0,0,0.08))" />
            <polygon points="32,40 48,56 32,72 16,56" fill="#f5f5f4" stroke="#e7e5e4" strokeWidth="1" filter="drop-shadow(0 2px 4px rgba(0,0,0,0.08))" />
            <polygon points="50,56 66,72 50,88 34,72" fill="#f5f5f4" stroke="#e7e5e4" strokeWidth="1" filter="drop-shadow(0 2px 4px rgba(0,0,0,0.08))" />

            {/* Silver Vark foil shimmer */}
            <path d="M42 32 L46 36 L43 40" stroke="#a8a29e" strokeWidth="0.8" opacity="0.7" />
            <path d="M60 48 L64 52" stroke="#a8a29e" strokeWidth="0.8" opacity="0.7" />
            <path d="M26 48 L30 52" stroke="#a8a29e" strokeWidth="0.8" opacity="0.7" />
          </svg>
        </div>
      );

    case 'jalebi':
      return (
        <div className={`relative w-full h-full overflow-hidden bg-gradient-to-br from-orange-100 via-amber-100 to-yellow-50 flex items-center justify-center ${className}`}>
          <svg className="w-[85%] h-[85%]" viewBox="0 0 100 100">
            <circle cx="50" cy="50" r="44" fill="#fffbeb" stroke="#fcd34d" strokeWidth="1" />
            {/* Chilled Rabdi Base */}
            <circle cx="50" cy="50" r="38" fill="#fef08a" opacity="0.6" />
            
            {/* Golden Orange Jalebi Spirals */}
            <g stroke="#ea580c" strokeWidth="4.5" strokeLinecap="round" fill="none" opacity="0.95" filter="drop-shadow(0 2px 4px rgba(0,0,0,0.15))">
              <path d="M50 50 m -18 0 a 18 18 0 1 0 36 0 a 18 18 0 1 0 -36 0" />
              <path d="M50 50 m -10 0 a 10 10 0 1 1 20 0 a 10 10 0 1 1 -20 0" />
              <path d="M42 35 C48 30, 60 30, 64 42 C68 54, 56 64, 45 60 C35 55, 36 42, 48 42" stroke="#f97316" strokeWidth="4" />
            </g>

            {/* Pistachio & Rose Petal Specks */}
            <circle cx="48" cy="46" r="1.5" fill="#65a30d" />
            <circle cx="56" cy="38" r="1.5" fill="#dc2626" />
            <circle cx="42" cy="58" r="1.5" fill="#65a30d" />
          </svg>
        </div>
      );

    case 'samosa':
      return (
        <div className={`relative w-full h-full overflow-hidden bg-gradient-to-br from-amber-100 via-yellow-50 to-orange-100 flex items-center justify-center ${className}`}>
          <svg className="w-[85%] h-[85%]" viewBox="0 0 100 100">
            {/* Plate */}
            <circle cx="50" cy="50" r="45" fill="#fff" stroke="#f3f4f6" strokeWidth="2" />

            {/* Chutneys Swirls */}
            <path d="M22 65 Q30 75 42 70" stroke="#16a34a" strokeWidth="4" strokeLinecap="round" fill="none" opacity="0.7" />
            <path d="M60 70 Q72 75 80 65" stroke="#991b1b" strokeWidth="4" strokeLinecap="round" fill="none" opacity="0.7" />

            {/* Samosa 1 */}
            <polygon points="35,32 18,66 52,66" fill="#d97706" stroke="#b45309" strokeWidth="1.5" filter="drop-shadow(0 3px 5px rgba(0,0,0,0.2))" />
            {/* Crisp fold texture */}
            <line x1="35" y1="32" x2="35" y2="66" stroke="#b45309" strokeWidth="1" strokeDasharray="2 2" />

            {/* Samosa 2 */}
            <polygon points="65,30 46,65 82,65" fill="#f59e0b" stroke="#b45309" strokeWidth="1.5" filter="drop-shadow(0 4px 6px rgba(0,0,0,0.22))" />
            <line x1="65" y1="30" x2="64" y2="65" stroke="#b45309" strokeWidth="1" strokeDasharray="2 2" />

            {/* Green chilli */}
            <path d="M48 68 Q54 75 46 80" stroke="#15803d" strokeWidth="3" strokeLinecap="round" fill="none" />
          </svg>
        </div>
      );

    case 'chaat':
      return (
        <div className={`relative w-full h-full overflow-hidden bg-gradient-to-br from-red-100 via-amber-50 to-emerald-50 flex items-center justify-center ${className}`}>
          <svg className="w-[85%] h-[85%]" viewBox="0 0 100 100">
            {/* Donut / Bowl */}
            <circle cx="50" cy="50" r="44" fill="#fbfaf8" stroke="#e5e5e5" strokeWidth="1.5" />
            {/* Papdi discs */}
            <circle cx="34" cy="42" r="10" fill="#fcd34d" stroke="#d97706" strokeWidth="1" />
            <circle cx="62" cy="40" r="10" fill="#fcd34d" stroke="#d97706" strokeWidth="1" />
            <circle cx="50" cy="60" r="11" fill="#fcd34d" stroke="#d97706" strokeWidth="1" />

            {/* Thick Whiter Sweet Curd Swirl */}
            <path d="M28 48 Q50 35 72 46 Q60 68 35 60 Z" fill="#ffffff" opacity="0.9" filter="drop-shadow(0 2px 4px rgba(0,0,0,0.08))" />

            {/* Green mint chutney drops */}
            <circle cx="38" cy="46" r="3.5" fill="#16a34a" />
            <circle cx="62" cy="54" r="3" fill="#16a34a" />

            {/* Red tamarind saunth drizzle */}
            <path d="M30 42 Q50 48 70 44" stroke="#991b1b" strokeWidth="2.5" strokeLinecap="round" fill="none" />

            {/* Pomegranate rubies */}
            <circle cx="48" cy="46" r="2.2" fill="#be123c" />
            <circle cx="54" cy="52" r="2" fill="#be123c" />
            <circle cx="44" cy="54" r="1.8" fill="#be123c" />
            <circle cx="58" cy="44" r="2" fill="#be123c" />

            {/* Yellow Sev noodles */}
            <path d="M36 50 L42 56 M46 42 L52 48 M54 58 L60 62" stroke="#eab308" strokeWidth="1.2" strokeLinecap="round" />
          </svg>
        </div>
      );

    case 'chowmein':
      return (
        <div className={`relative w-full h-full overflow-hidden bg-gradient-to-br from-amber-950 via-stone-900 to-black flex items-center justify-center ${className}`}>
          {/* Black Wok / Bowl */}
          <div className="relative w-[85%] h-[85%] rounded-full bg-stone-900 border-2 border-stone-800 shadow-2xl flex items-center justify-center p-2">
            <svg className="w-full h-full" viewBox="0 0 100 100">
              {/* Noodles Wok Base */}
              <circle cx="50" cy="50" r="38" fill="#78350f" opacity="0.25" />
              {/* Noodles strands */}
              <g stroke="#d97706" strokeWidth="2.5" fill="none" strokeLinecap="round" opacity="0.9">
                <path d="M25 45 Q35 30 50 48 T75 45" />
                <path d="M30 55 Q48 68 62 50 T78 60" />
                <path d="M35 38 Q52 42 58 60 T70 38" />
                <path d="M28 50 Q45 35 55 55 T72 52" stroke="#b45309" />
              </g>

              {/* Veggies: Green capsicum, carrot, spring onion */}
              <rect x="36" y="42" width="10" height="2.5" rx="1" fill="#15803d" transform="rotate(30 41 43)" />
              <rect x="52" y="36" width="12" height="2.5" rx="1" fill="#ea580c" transform="rotate(-20 58 37)" />
              <rect x="44" y="55" width="10" height="2.5" rx="1" fill="#15803d" transform="rotate(45 49 56)" />
              <rect x="60" y="50" width="10" height="2.5" rx="1" fill="#ea580c" transform="rotate(15 65 51)" />
              <circle cx="50" cy="46" r="1.5" fill="#f8fafc" />
              <circle cx="38" cy="58" r="1.5" fill="#f8fafc" />
            </svg>
          </div>
        </div>
      );

    case 'momos':
      return (
        <div className={`relative w-full h-full overflow-hidden bg-gradient-to-br from-stone-100 via-stone-50 to-red-50 flex items-center justify-center ${className}`}>
          <svg className="w-[85%] h-[85%]" viewBox="0 0 100 100">
            {/* Bamboo Steamer plate */}
            <circle cx="50" cy="50" r="44" fill="#f5ebe0" stroke="#d5bdaf" strokeWidth="2" />

            {/* Red fiery chili chutney bowl */}
            <circle cx="50" cy="50" r="12" fill="#dc2626" stroke="#b91c1c" strokeWidth="1" filter="drop-shadow(0 2px 3px rgba(0,0,0,0.15))" />

            {/* Momo 1 (Top) */}
            <ellipse cx="50" cy="24" rx="11" ry="8" fill="#f8fafc" stroke="#e2e8f0" strokeWidth="1" />
            <path d="M43 23 Q50 20 57 23" stroke="#cbd5e1" strokeWidth="1" fill="none" />

            {/* Momo 2 (Left) */}
            <ellipse cx="25" cy="46" rx="9" ry="11" fill="#f8fafc" stroke="#e2e8f0" strokeWidth="1" />
            
            {/* Momo 3 (Right) */}
            <ellipse cx="75" cy="46" rx="9" ry="11" fill="#f8fafc" stroke="#e2e8f0" strokeWidth="1" />

            {/* Momo 4 (Bottom Left) */}
            <ellipse cx="34" cy="70" rx="10" ry="9" fill="#f8fafc" stroke="#e2e8f0" strokeWidth="1" />

            {/* Momo 5 (Bottom Right) */}
            <ellipse cx="66" cy="70" rx="10" ry="9" fill="#f8fafc" stroke="#e2e8f0" strokeWidth="1" />
          </svg>
        </div>
      );

    case 'pizza':
      return (
        <div className={`relative w-full h-full overflow-hidden bg-gradient-to-br from-amber-100 via-orange-50 to-red-50 flex items-center justify-center ${className}`}>
          <svg className="w-[85%] h-[85%]" viewBox="0 0 100 100">
            {/* Pizza Crust */}
            <circle cx="50" cy="50" r="42" fill="#d97706" />
            {/* Tomato Sauce */}
            <circle cx="50" cy="50" r="38" fill="#dc2626" />
            {/* Golden Mozzarella Cheese Melt */}
            <circle cx="50" cy="50" r="35" fill="#fde047" opacity="0.95" />

            {/* Paneer Tikka cubes */}
            <rect x="36" y="34" width="7" height="7" rx="1" fill="#fed7aa" stroke="#ea580c" strokeWidth="0.8" />
            <rect x="58" y="38" width="7" height="7" rx="1" fill="#fed7aa" stroke="#ea580c" strokeWidth="0.8" />
            <rect x="44" y="56" width="7" height="7" rx="1" fill="#fed7aa" stroke="#ea580c" strokeWidth="0.8" />

            {/* Green Capsicum Rings */}
            <circle cx="48" cy="40" r="4" fill="none" stroke="#15803d" strokeWidth="1.8" />
            <circle cx="34" cy="54" r="3.5" fill="none" stroke="#15803d" strokeWidth="1.8" />
            <circle cx="62" cy="54" r="3.5" fill="none" stroke="#15803d" strokeWidth="1.8" />

            {/* Red Tomato / Paprika bits */}
            <circle cx="42" cy="48" r="2" fill="#b91c1c" />
            <circle cx="56" cy="48" r="2" fill="#b91c1c" />
            <circle cx="50" cy="62" r="2" fill="#b91c1c" />
          </svg>
        </div>
      );

    case 'burger':
      return (
        <div className={`relative w-full h-full overflow-hidden bg-gradient-to-br from-amber-100 via-stone-50 to-yellow-50 flex items-center justify-center ${className}`}>
          <svg className="w-[85%] h-[85%]" viewBox="0 0 100 100">
            {/* Bottom Bun */}
            <path d="M24 74 Q50 82 76 74 L74 68 Q50 72 26 68 Z" fill="#d97706" />
            {/* Patty */}
            <rect x="22" y="60" width="56" height="8" rx="4" fill="#78350f" />
            {/* Cheese Slice */}
            <polygon points="22,59 78,59 74,65 50,68 26,65" fill="#facc15" />
            {/* Green Lettuce */}
            <path d="M20 54 Q30 50 40 54 Q50 50 60 54 Q70 50 80 54" stroke="#16a34a" strokeWidth="3" strokeLinecap="round" fill="none" />
            {/* Tomato slice */}
            <rect x="26" y="47" width="48" height="5" rx="2.5" fill="#dc2626" />
            {/* Top Bun */}
            <path d="M22 47 Q50 20 78 47 Z" fill="#d97706" />
            {/* Sesame Seeds */}
            <ellipse cx="40" cy="35" rx="1.5" ry="0.8" fill="#fef08a" />
            <ellipse cx="50" cy="32" rx="1.5" ry="0.8" fill="#fef08a" />
            <ellipse cx="60" cy="36" rx="1.5" ry="0.8" fill="#fef08a" />
            <ellipse cx="46" cy="40" rx="1.5" ry="0.8" fill="#fef08a" />
          </svg>
        </div>
      );

    case 'lassi':
      return (
        <div className={`relative w-full h-full overflow-hidden bg-gradient-to-br from-amber-100 via-yellow-50 to-stone-100 flex items-center justify-center ${className}`}>
          <svg className="w-[80%] h-[85%]" viewBox="0 0 100 100">
            {/* Terracotta Earthen Kulhad Glass */}
            <path d="M30 35 L36 85 Q50 88 64 85 L70 35 Z" fill="#9a3412" stroke="#7c2d12" strokeWidth="1.5" filter="drop-shadow(0 4px 6px rgba(0,0,0,0.2))" />
            {/* Thick White Lassi Foam */}
            <ellipse cx="50" cy="35" rx="20" ry="7" fill="#fffbeb" />
            {/* Thick Creamy Malai Dollop */}
            <ellipse cx="50" cy="33" rx="14" ry="5" fill="#fef08a" />
            {/* Pistachio & saffron garnish */}
            <circle cx="48" cy="32" r="1.5" fill="#15803d" />
            <circle cx="53" cy="34" r="1.5" fill="#dc2626" />
            <path d="M44 32 Q50 35 56 31" stroke="#ea580c" strokeWidth="0.8" fill="none" />
          </svg>
        </div>
      );

    case 'colddrink':
      return (
        <div className={`relative w-full h-full overflow-hidden bg-gradient-to-br from-cyan-950 via-stone-900 to-amber-950 flex items-center justify-center ${className}`}>
          <svg className="w-[85%] h-[85%]" viewBox="0 0 100 100">
            <defs>
              <linearGradient id="cola-grad" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#78350f" stopOpacity="0.9" />
                <stop offset="35%" stopColor="#451a03" />
                <stop offset="100%" stopColor="#1c0a00" />
              </linearGradient>
              <linearGradient id="glass-glare" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#ffffff" stopOpacity="0.4" />
                <stop offset="25%" stopColor="#ffffff" stopOpacity="0.05" />
                <stop offset="100%" stopColor="#ffffff" stopOpacity="0.2" />
              </linearGradient>
            </defs>

            {/* Glowing background halo */}
            <circle cx="50" cy="50" r="42" fill="#d97706" opacity="0.15" filter="blur(4px)" />

            {/* Chilled Beverage Glass Body */}
            <path d="M30 22 L36 84 Q50 88 64 84 L70 22 Z" fill="url(#cola-grad)" filter="drop-shadow(0 4px 8px rgba(0,0,0,0.4))" />

            {/* Glass Rim */}
            <ellipse cx="50" cy="22" rx="20" ry="4" fill="#a5f3fc" opacity="0.5" stroke="#ffffff" strokeWidth="0.8" />

            {/* Ice Cubes floating inside */}
            <rect x="38" y="28" width="13" height="13" rx="2.5" fill="#e0f2fe" opacity="0.65" stroke="#ffffff" strokeWidth="0.8" transform="rotate(-12 44 34)" />
            <rect x="51" y="32" width="12" height="12" rx="2.5" fill="#e0f2fe" opacity="0.6" stroke="#ffffff" strokeWidth="0.8" transform="rotate(20 57 38)" />
            <rect x="42" y="46" width="14" height="14" rx="3" fill="#bae6fd" opacity="0.5" stroke="#ffffff" strokeWidth="0.6" transform="rotate(8 49 53)" />

            {/* Carbonation Bubbles rising */}
            <circle cx="44" cy="68" r="1.5" fill="#fef08a" opacity="0.8" />
            <circle cx="56" cy="62" r="1.2" fill="#fef08a" opacity="0.8" />
            <circle cx="48" cy="74" r="1" fill="#fef08a" opacity="0.8" />
            <circle cx="52" cy="56" r="1.8" fill="#ffffff" opacity="0.7" />
            <circle cx="39" cy="42" r="1.2" fill="#ffffff" opacity="0.7" />
            <circle cx="60" cy="48" r="1.4" fill="#ffffff" opacity="0.7" />

            {/* Red & White Drinking Straw */}
            <path d="M56 10 L50 48" stroke="#ef4444" strokeWidth="4.5" strokeLinecap="round" />
            <path d="M55.5 12 L54.5 16 M54 22 L53 26 M52.5 32 L51.5 36" stroke="#ffffff" strokeWidth="4.2" />

            {/* Fresh Lemon / Lime Slice on Glass Rim */}
            <circle cx="32" cy="20" r="9" fill="#facc15" stroke="#ca8a04" strokeWidth="1" />
            <circle cx="32" cy="20" r="7" fill="#fef08a" />
            <path d="M32 13 L32 27 M25 20 L39 20 M27 15 L37 25 M27 25 L37 15" stroke="#ca8a04" strokeWidth="0.8" opacity="0.8" />

            {/* Glass Surface Reflection Glare */}
            <path d="M33 26 L38 82 L42 82 L37 26 Z" fill="url(#glass-glare)" opacity="0.6" />

            {/* Chilled Condensation Water Droplets */}
            <circle cx="63" cy="44" r="1" fill="#ffffff" opacity="0.85" />
            <circle cx="64" cy="58" r="1.2" fill="#ffffff" opacity="0.85" />
            <circle cx="62" cy="70" r="0.9" fill="#ffffff" opacity="0.8" />
            <circle cx="36" cy="62" r="1.1" fill="#ffffff" opacity="0.8" />
          </svg>
        </div>
      );

    case 'chocolate':
      return (
        <div className={`relative w-full h-full overflow-hidden bg-gradient-to-br from-[#1e0a3c] via-[#2e1065] to-[#4c1d95] flex items-center justify-center ${className}`}>
          <svg className="w-[88%] h-[88%]" viewBox="0 0 100 100">
            <defs>
              <linearGradient id="cadbury-purple" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#4c1d95" />
                <stop offset="40%" stopColor="#2e1065" />
                <stop offset="100%" stopColor="#1e0a38" />
              </linearGradient>
              <linearGradient id="chocolate-chunk" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#78350f" />
                <stop offset="45%" stopColor="#58240c" />
                <stop offset="100%" stopColor="#381404" />
              </linearGradient>
              <linearGradient id="gold-foil" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#fef08a" />
                <stop offset="50%" stopColor="#eab308" />
                <stop offset="100%" stopColor="#ca8a04" />
              </linearGradient>
            </defs>

            {/* Glowing Golden Aura */}
            <ellipse cx="50" cy="50" rx="42" ry="38" fill="#facc15" opacity="0.12" filter="blur(6px)" />

            {/* Cadbury Purple Chocolate Bar Wrapper (Slanted) */}
            <g transform="rotate(-8 50 50)">
              {/* Back Gold Foil Liner Peeking Out */}
              <rect x="22" y="24" width="56" height="54" rx="4" fill="url(#gold-foil)" stroke="#ca8a04" strokeWidth="0.8" filter="drop-shadow(0 4px 10px rgba(0,0,0,0.35))" />

              {/* Iconic Royal Purple Cadbury Packaging */}
              <rect x="24" y="38" width="52" height="42" rx="3.5" fill="url(#cadbury-purple)" stroke="#6b21a8" strokeWidth="0.8" />

              {/* Gold decorative ribbons / lines on wrapper */}
              <line x1="24" y1="46" x2="76" y2="46" stroke="url(#gold-foil)" strokeWidth="1" opacity="0.8" />
              <line x1="24" y1="49" x2="76" y2="49" stroke="url(#gold-foil)" strokeWidth="0.5" opacity="0.6" />

              {/* "Dairy Milk" script simulation & milk glasses swirl */}
              <text x="50" y="60" textAnchor="middle" fill="#ffffff" fontSize="6.5" fontWeight="900" fontFamily="sans-serif" letterSpacing="0.3">
                Dairy Milk
              </text>
              <text x="50" y="68" textAnchor="middle" fill="#fef08a" fontSize="4.2" fontWeight="700" fontFamily="sans-serif" letterSpacing="0.5">
                CHOCOLATE
              </text>

              {/* Two flowing milk glasses icon in white/gold */}
              <ellipse cx="44" cy="74" rx="2" ry="1" fill="#ffffff" opacity="0.9" />
              <ellipse cx="56" cy="74" rx="2" ry="1" fill="#ffffff" opacity="0.9" />
              <path d="M44 74 Q50 78 56 74" stroke="#ffffff" strokeWidth="0.8" fill="none" opacity="0.8" />

              {/* Exposed Delicious Milk Chocolate Slabs / Chunks */}
              <g transform="translate(0, -6)">
                {/* Chunk 1 (Top Left) */}
                <rect x="27" y="22" width="21" height="18" rx="2" fill="url(#chocolate-chunk)" stroke="#2b0e04" strokeWidth="0.6" filter="drop-shadow(0 2px 4px rgba(0,0,0,0.3))" />
                <rect x="29" y="24" width="17" height="14" rx="1.5" fill="none" stroke="#92400e" strokeWidth="0.8" opacity="0.7" />
                <ellipse cx="37" cy="30" rx="3" ry="1.5" fill="#9a3412" opacity="0.4" />

                {/* Chunk 2 (Top Right) */}
                <rect x="51" y="22" width="21" height="18" rx="2" fill="url(#chocolate-chunk)" stroke="#2b0e04" strokeWidth="0.6" filter="drop-shadow(0 2px 4px rgba(0,0,0,0.3))" />
                <rect x="53" y="24" width="17" height="14" rx="1.5" fill="none" stroke="#92400e" strokeWidth="0.8" opacity="0.7" />
                <ellipse cx="61" cy="30" rx="3" ry="1.5" fill="#9a3412" opacity="0.4" />
              </g>

              {/* Shiny Gold Foil Creases */}
              <path d="M25 34 L32 38 L25 42" fill="url(#gold-foil)" opacity="0.9" />
              <path d="M75 32 L68 38 L75 42" fill="url(#gold-foil)" opacity="0.9" />
            </g>
          </svg>
        </div>
      );

    case 'pastry':
    default:
      return (
        <div className={`relative w-full h-full overflow-hidden bg-gradient-to-br from-amber-50 via-rose-50 to-stone-100 flex items-center justify-center ${className}`}>
          <svg className="w-[85%] h-[85%]" viewBox="0 0 100 100">
            <circle cx="50" cy="50" r="42" fill="#fff" stroke="#e5e5e5" strokeWidth="1.5" />
            {/* Pastry Wedge */}
            <polygon points="50,25 24,75 76,75" fill="#78350f" filter="drop-shadow(0 3px 5px rgba(0,0,0,0.15))" />
            <polygon points="50,25 28,75 72,75" fill="#fbcfe8" opacity="0.4" />
            {/* Cream top swirl */}
            <circle cx="50" cy="34" r="6" fill="#ffffff" />
            {/* Cherry on top */}
            <circle cx="50" cy="32" r="4" fill="#be123c" />
          </svg>
        </div>
      );
  }
};
