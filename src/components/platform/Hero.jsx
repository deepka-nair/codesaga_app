import React from 'react';
// Original vector character. Shared palette follows the selected CodeSaga profile.
export default function Hero({accent='#13b6be',hair='#203858',portrait=false}) {
 return <svg viewBox="0 0 100 150" role="img" aria-label="CodeSaga explorer" className={portrait?'hero-portrait':''}>
 <defs><linearGradient id="coat" x2="1" y2="1"><stop stopColor="#fff"/><stop offset="1" stopColor="#b8d8e9"/></linearGradient></defs>
 <ellipse cx="51" cy="143" rx="30" ry="5" fill="#164f68" opacity=".18"/>
 <path d="M31 94L33 131 25 139Q23 146 42 143L49 107 55 135Q54 146 74 143L66 130 66 93" fill="#233c59" stroke="#123046" strokeWidth="3"/>
 <path d="M31 64Q17 68 16 108L28 112 36 84 32 119 49 115 51 80 57 117 77 118 69 81 81 101 89 95Q80 63 66 63" fill="url(#coat)" stroke="#244560" strokeWidth="3"/>
 <path d="M37 64L50 78 65 64 61 101 42 101" fill="#173b54"/><path d="M48 76L52 76 56 102 47 102" fill={accent}/>
 <path d="M20 105L16 116Q18 125 26 118L29 110M81 96L88 94 94 107Q92 115 85 108" fill="#ffcfb0" stroke="#244560" strokeWidth="2"/>
 <path d="M29 26Q28 3 57 8 83 10 77 43L73 61 66 67 38 62 27 48" fill={hair} stroke="#19334d" strokeWidth="3"/>
 <path d="M31 33Q27 63 51 72 77 64 74 33L55 23" fill="#ffdabf" stroke="#244560" strokeWidth="2"/>
 <path d="M26 42L22 23 34 25 36 10 46 17 59 4 65 16 80 14 76 30 83 39 65 31 67 43 52 30 48 40 38 31 32 48" fill={hair} stroke="#19334d" strokeWidth="2"/>
 <path d="M35 47Q41 42 47 47M56 47Q63 42 69 46" fill="none" stroke="#243653" strokeWidth="2"/>
 <ellipse cx="42" cy="51" rx="4" ry="6" fill="#1994ba"/><ellipse cx="62" cy="51" rx="4" ry="6" fill="#1994ba"/><circle cx="43" cy="49" r="1.5" fill="white"/><circle cx="63" cy="49" r="1.5" fill="white"/>
 <path d="M48 62Q53 65 58 61" fill="none" stroke="#bb736a" strokeWidth="2"/><path d="M24 38L26 54 32 53 31 37" fill={accent} stroke="#23435a" strokeWidth="2"/>
 <path d="M30 77L37 80 34 91 27 87M66 78L73 81 71 91 64 88" fill={accent}/><path d="M32 136L42 136M59 136L72 138" stroke={accent} strokeWidth="4"/>
 </svg>;
}
