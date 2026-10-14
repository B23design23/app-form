// Logo Skillo en SVG inline : "skill" (contours Urbanist ExtraBold vectorisés, indépendants du
// chargement de la police) + un "o" dessiné comme anneau de progression à 75 %.
// Géométrie en unités de la police (unitsPerEm 2000, ligne de base y=1900) : hauteur des
// minuscules 1000 = diamètre de l'anneau, épaisseur 276 = fût du "l".
const CHEMIN_SKILL =
  'M411.2 1918.2Q334.3 1911.9 263.1 1885.6Q191.8 1859.3 136.4 1813.8Q80.9 1768.4 50 1704L282.3 1604.4Q293.2 1619.6 315.1 1638.5Q336.9 1657.4 368.7 1671.4Q400.4 1685.4 441.8 1685.4Q473.1 1685.4 501.9 1677.7Q530.7 1670 548.9 1652.5Q567.1 1635 567.1 1606.1Q567.1 1574 544.2 1556.9Q521.4 1539.9 488.5 1531.6Q455.6 1523.3 425.7 1517.3Q334.1 1501.1 252.7 1459.7Q171.2 1418.3 120.2 1351.9Q69.2 1285.5 69.2 1194.4Q69.2 1093.2 122 1019.5Q174.8 945.8 260 905.9Q345.2 866 443.5 866Q561.3 866 661 914.8Q760.6 963.5 821.7 1053.2L604.2 1182.2Q591.3 1163.3 570.6 1145.7Q549.9 1128 523.3 1115.7Q496.8 1103.3 467 1100.6Q427.6 1097.9 396 1105.5Q364.4 1113.1 345.8 1132.9Q327.1 1152.6 327.1 1187.2Q327.1 1220.1 355.9 1235.4Q384.6 1250.8 422.9 1258.5Q461.1 1266.2 490.4 1275.6Q577.2 1303.8 653.8 1347.6Q730.4 1391.4 777.3 1454Q824.1 1516.7 821.4 1602.4Q821.4 1700.9 762.3 1775.5Q703.2 1850.2 609.6 1888.6Q516 1927.1 411.2 1918.2ZM1920 1900H1601.8L1389.8 1535.1L1268 1679.8V1900H992V400H1268V1251L1561.8 900H1922.4L1579.1 1310.6ZM2090 900H2366V1900H2090ZM2229.8 785.3Q2169.5 785.3 2128.6 745.4Q2087.6 705.5 2087.6 646Q2087.6 587.4 2128.6 547Q2169.5 506.7 2229 506.7Q2287.5 506.7 2328 547Q2368.5 587.4 2368.5 646Q2368.5 705.5 2328.9 745.4Q2289.3 785.3 2229.8 785.3ZM2606 1900V400H2882V1900ZM3122 1900V400H3398V1900Z'

const RAYON_ANNEAU = 362
const CIRCONFERENCE = 2 * Math.PI * RAYON_ANNEAU

const VARIANTES = {
  clair: { texte: 'var(--color-ink)', fond: 'var(--color-lavande)', arc: 'var(--color-primary)' },
  fonce: { texte: '#ffffff', fond: 'var(--color-primary-profond)', arc: '#ffffff' },
}

function Logo({ variante = 'clair', className }) {
  const couleurs = VARIANTES[variante] ?? VARIANTES.clair

  return (
    <svg className={className} viewBox="0 380 4640 1560" role="img" aria-label="Skillo">
      <path d={CHEMIN_SKILL} fill={couleurs.texte} />
      <circle cx="4078" cy="1400" r={RAYON_ANNEAU} fill="none" stroke={couleurs.fond} strokeWidth="276" />
      <circle
        cx="4078"
        cy="1400"
        r={RAYON_ANNEAU}
        fill="none"
        stroke={couleurs.arc}
        strokeWidth="276"
        strokeLinecap="round"
        strokeDasharray={`${CIRCONFERENCE * 0.75} ${CIRCONFERENCE}`}
        transform="rotate(-90 4078 1400)"
      />
    </svg>
  )
}

export default Logo
