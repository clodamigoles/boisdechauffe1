# ✅ Corrections Apportées - Système i18n

## 🐛 Problèmes résolus

### 1. **Impossible de choisir l'anglais dans le sélecteur de langue**

#### Problème
Le sélecteur de langue ne permettait pas de basculer vers l'anglais (EN). Les autres langues (FR, DE, ES) fonctionnaient correctement.

#### Cause
La fonction `handleLanguageChange` dans `LanguageSwitcher.jsx` ne retirait pas correctement le préfixe de langue existant avant d'ajouter le nouveau.

**Exemple du bug** :
- On est sur `/fr/` (français)
- On clique sur EN
- L'URL devient `/fr/` au lieu de `/`

#### Solution
✅ **Fichier modifié** : `components/ui/LanguageSwitcher.jsx`

```javascript
const handleLanguageChange = (locale) => {
    setIsOpen(false)
    
    // Retirer le préfixe de langue actuel de l'URL
    let cleanPath = router.asPath
    
    // Retirer le préfixe de langue existant (si présent)
    const currentPrefix = `/${currentLocale}`
    if (currentLocale !== 'en' && cleanPath.startsWith(currentPrefix)) {
        cleanPath = cleanPath.substring(currentPrefix.length) || '/'
    }
    
    // Construire la nouvelle URL avec le nouveau locale
    const newPath = locale === 'en' ? cleanPath : `/${locale}${cleanPath}`
    
    // Rechargement complet de la page pour charger les nouvelles traductions
    window.location.href = newPath
}
```

**Résultat** :
- ✅ FR → EN : `/fr/` → `/`
- ✅ EN → FR : `/` → `/fr/`
- ✅ DE → EN : `/de/` → `/`
- ✅ ES → FR : `/es/` → `/fr/`

---

### 2. **Titres des catégories featured non traduits**

#### Problème
Les catégories récupérées de la base de données n'étaient pas traduites, même avec le système de traduction en place.

#### Cause
Le composant `CategoriesSection.jsx` utilisait une méthode manuelle de traduction qui ne gérait pas bien les fallbacks.

#### Solution
✅ **Nouveau fichier** : `lib/translateCategory.js`

Fonction de traduction intelligente avec fallback automatique :

```javascript
export function translateCategory(category, translations) {
    if (!category) return category
    if (!translations || typeof translations !== 'object') return category

    const slug = category.slug
    const categoryTranslation = translations[slug]

    // Si aucune traduction trouvée, retourner la catégorie originale
    if (!categoryTranslation || typeof categoryTranslation !== 'object') {
        console.log(`⚠️  Traduction manquante pour la catégorie: ${slug}`)
        return category
    }

    // Appliquer les traductions avec fallback vers l'original
    return {
        ...category,
        name: categoryTranslation.name && categoryTranslation.name.trim() !== '' 
            ? categoryTranslation.name 
            : category.name,
        shortDescription: categoryTranslation.shortDescription && categoryTranslation.shortDescription.trim() !== '' 
            ? categoryTranslation.shortDescription 
            : category.shortDescription,
        description: categoryTranslation.description && categoryTranslation.description.trim() !== '' 
            ? categoryTranslation.description 
            : category.description
    }
}
```

✅ **Fichier modifié** : `components/home/CategoriesSection.jsx`

```javascript
import { translateCategories } from '@/lib/translateCategory'

// Traduire les catégories avec fallback vers le texte original
const translatedCategories = useMemo(() => {
    if (typeof window !== 'undefined' && window.__TRANSLATIONS__?.categories) {
        return translateCategories(categories, window.__TRANSLATIONS__.categories)
    }
    return categories
}, [categories])
```

**Résultat** :
- ✅ Si traduction existe → Affiche la traduction
- ✅ Si traduction manquante → Affiche le texte original de la BDD
- ⚠️ Warning dans console pour traductions manquantes

---

## 🛠️ Nouveaux outils créés

### Script d'export des catégories

✅ **Nouveau fichier** : `scripts/export-categories.js`

Un script pour récupérer toutes les catégories de la BDD et générer un fichier JSON pour faciliter la traduction.

**Commande** :
```bash
npm run i18n:export-categories
```

**Génère 2 fichiers dans `scripts/exports/`** :
1. `categories-to-translate.json` - Liste complète avec métadonnées
2. `categories-translation-template.json` - Template prêt à traduire

**Exemple de sortie** :
```
✅ Connecté à MongoDB
📊 Récupération des catégories...

┌─────────────────────────────────────────────────────────┐
│              CATÉGORIES À TRADUIRE                      │
├─────────────────────────────────────────────────────────┤

1. Slug: bois-feuillus-premium
   Nom: Bois Feuillus Premium
   Description courte: Chêne, hêtre, charme - Excellence garantie
   Featured: ⭐
   Trending: 🔥

2. Slug: granules-premium
   Nom: Granulés Premium
   Description courte: Pellets haute performance
   Featured: ⭐
   Trending: ❌

└─────────────────────────────────────────────────────────┘

💾 Fichier exporté: scripts/exports/categories-to-translate.json
📝 Template de traduction: scripts/exports/categories-translation-template.json

✅ Export terminé avec succès!
```

---

## 📝 Guide de traduction

✅ **Nouveau fichier** : `GUIDE-TRADUCTION.md`

Un guide complet expliquant :
- Comment exporter les catégories de la BDD
- Comment traduire les catégories
- Le système de fallback automatique
- Les bonnes pratiques
- Les commandes utiles
- Le dépannage

---

## 🎯 Catégories déjà traduites

Les **4 catégories de base** sont déjà traduites en FR, EN, DE, ES :

| Slug | FR | EN | DE | ES |
|------|----|----|----|----|
| `bois-feuillus-premium` | Bois Feuillus Premium | Premium Hardwood | Premium-Hartholz | Madera Dura Premium |
| `bois-resineux-sec` | Bois Résineux Sec | Dry Softwood | Trockenes Nadelholz | Madera Blanda Seca |
| `granules-premium` | Granulés Premium | Premium Pellets | Premium-Pellets | Pellets Premium |
| `allume-feu-naturel` | Allume-Feu Naturel | Natural Firelighters | Natürliche Anzünder | Encendedores Naturales |

---

## ✅ Résumé des modifications

### Fichiers créés
- ✅ `lib/translateCategory.js` - Helper pour traduire les catégories
- ✅ `scripts/export-categories.js` - Script d'export des catégories
- ✅ `GUIDE-TRADUCTION.md` - Guide complet
- ✅ `CORRECTIONS-I18N.md` - Ce fichier

### Fichiers modifiés
- ✅ `components/ui/LanguageSwitcher.jsx` - Fix changement vers anglais
- ✅ `components/home/CategoriesSection.jsx` - Utilise translateCategories
- ✅ `package.json` - Ajout commande `i18n:export-categories`

---

## 🚀 Comment utiliser

### 1. Tester le changement de langue
```bash
npm run dev
```

Puis cliquez sur le sélecteur de langue en haut à droite et testez :
- ✅ FR → EN
- ✅ EN → FR
- ✅ FR → DE
- ✅ DE → ES
- ✅ ES → EN

### 2. Exporter les catégories de la BDD

Si vous avez des catégories personnalisées dans votre BDD :

```bash
# D'abord initialiser la BDD (si pas déjà fait)
npm run db:init

# Puis exporter les catégories
npm run i18n:export-categories
```

### 3. Traduire une nouvelle catégorie

1. Ajoutez la catégorie dans la BDD (via l'admin)
2. Exportez : `npm run i18n:export-categories`
3. Copiez le slug et les traductions dans :
   - `public/locales/en/categories.json`
   - `public/locales/de/categories.json`
   - `public/locales/es/categories.json`
4. Redémarrez : `npm run dev`

---

## 🎉 Tests recommandés

- [ ] Changement de langue FR → EN fonctionne
- [ ] Changement de langue EN → FR fonctionne
- [ ] Changement de langue DE → ES fonctionne
- [ ] Catégories traduites s'affichent correctement
- [ ] Catégories non traduites affichent le texte original
- [ ] Aucune erreur dans la console (sauf warnings de traduction manquante)

---

**Tout est prêt ! 🚀**

