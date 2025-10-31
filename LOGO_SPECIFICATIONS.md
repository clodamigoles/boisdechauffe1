# 🎨 SPÉCIFICATIONS LOGO - Mon bois de chauffe

## 📍 OÙ LE LOGO EST UTILISÉ

### Actuellement dans le code
**Fichier**: `components/layout/Header.jsx` (lignes 64-78)

Le logo actuel est un **simple SVG en CSS** (carré amber + losange blanc).

---

## 📐 IMAGES DE LOGO À CRÉER

### ⭐ VERSIONS ESSENTIELLES

| Fichier | Taille | Format | Usage |
|---|---|---|---|
| `logo.svg` | Vectoriel | SVG | **Header principal** - Logo responsive |
| `favicon.ico` | 32x32px | ICO | Onglet navigateur (remplace l'actuel) |

### ✨ VERSIONS RECOMMANDÉES (bonus)

| Fichier | Taille | Format | Usage |
|---|---|---|---|
| `logo-icon-16.png` | 16x16px | PNG | Petit favicon |
| `logo-icon-32.png` | 32x32px | PNG | Favicon standard |
| `logo-icon-180.png` | 180x180px | PNG | iPhone/iPad (ajout à ajouter dans code) |

---

## 🎨 SPÉCIFICATIONS DESIGN

### Thème
**Bois de chauffage** - Nature, feu, chaleur

### Couleurs
- **Amber/Orange**: `#d97706` (valeur actuelle dans le site)
- **Blanc**: `#ffffff`
- Option: **Vert** pour représenter la nature

### Style
- Moderne et professionnel
- Lisible petit format (favicon)
- Simple et impactant

### Suggestions de concept
1. **Bûche stylisée** avec feu
2. **Losange/Flamme** (inspiré du logo actuel)
3. **Initiales "MBC"** stylisées
4. **Arbre/Bûche** minimaliste

---

## 📁 EMPLACEMENT

Placer les fichiers dans: `public/images/`

```
public/
├── favicon.ico ← REMPLACER l'actuel
└── images/
    ├── logo.svg ← NOUVEAU
    ├── logo-icon-16.png ← BONUS
    ├── logo-icon-32.png ← BONUS
    └── logo-icon-180.png ← BONUS
```

---

## 🔧 MODIFICATIONS À FAIRE AU CODE

### 1. Modifier Header.jsx

**Fichier**: `components/layout/Header.jsx`

**Ligne 1** - Ajouter l'import Image:
```jsx
import Image from 'next/image'
```

**Lignes 64-78** - Remplacer le logo CSS par l'image:

```jsx
// AVANT
<Link href="/" className="flex items-center space-x-3">
    <div className="w-10 h-10 bg-amber-600 rounded-lg flex items-center justify-center">
        <div className="w-6 h-6 bg-white rounded-sm transform rotate-45"></div>
    </div>
    <div className="hidden sm:block">
        <span className={`text-lg font-bold ${!isScrolled && router.pathname === '/' ? 'text-white' : 'text-gray-900'}`}>
            {siteName}
        </span>
        <p className={`text-sm ${!isScrolled && router.pathname === '/' ? 'text-white/80' : 'text-gray-500'}`}>
            Qualité Premium
        </p>
    </div>
</Link>

// APRÈS
<Link href="/" className="flex items-center space-x-3">
    <div className="relative w-10 h-10 lg:w-12 lg:h-12">
        <Image
            src="/images/logo.svg"
            alt={`${siteName} Logo`}
            fill
            className="object-contain"
            priority
        />
    </div>
    <div className="hidden sm:block">
        <span className={`text-lg font-bold ${!isScrolled && router.pathname === '/' ? 'text-white' : 'text-gray-900'}`}>
            {siteName}
        </span>
        <p className={`text-sm ${!isScrolled && router.pathname === '/' ? 'text-white/80' : 'text-gray-500'}`}>
            Qualité Premium
        </p>
    </div>
</Link>
```

### 2. Remplacer le favicon (optionnel mais recommandé)

**Fichier**: `public/favicon.ico`

Juste remplacer le fichier existant par votre nouveau favicon.ico (32x32px)

---

## ✅ CHECKLIST

- [ ] Créer `logo.svg` (principal)
- [ ] Créer `favicon.ico` (32x32px)
- [ ] Placer dans `public/images/`
- [ ] Modifier Header.jsx (ajout import Image)
- [ ] Modifier Header.jsx (remplacer code logo ligne 64-78)
- [ ] Tester l'affichage

---

## 📊 RÉSUMÉ

**Minimum requis**:
1. `logo.svg` → SVG vectoriel
2. `favicon.ico` → 32x32px

**Modifications code**: 
- 2 petits changements dans Header.jsx

**Temps estimé**: 5 minutes de modification code + temps de création logo

---

**C'est tout ! Simple et efficace** 🎯
