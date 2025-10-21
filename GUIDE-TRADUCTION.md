# 📚 Guide de Traduction - Catégories et Produits

## 🎯 Vue d'ensemble

Ce guide explique comment traduire les catégories et produits de la base de données.

---

## 📋 Étape 1 : Exporter les catégories de la BDD

### Pré-requis
Assurez-vous d'avoir des catégories dans votre base de données :

```bash
# Initialiser la base de données avec des catégories
npm run db:init

# OU utiliser le seed
npm run seed
```

### Exporter les catégories
Une fois les catégories créées, exportez-les pour traduction :

```bash
npm run i18n:export-categories
```

Ce script va :
1. ✅ Se connecter à MongoDB
2. ✅ Récupérer toutes les catégories actives
3. ✅ Générer 2 fichiers dans `scripts/exports/` :
   - `categories-to-translate.json` - Liste complète avec métadonnées
   - `categories-translation-template.json` - Template à traduire

---

## 📝 Étape 2 : Traduire les catégories

### Exemple de fichier généré

Le fichier `categories-to-translate.json` ressemblera à :

```json
{
  "_info": {
    "exportDate": "2025-10-21T...",
    "totalCategories": 4,
    "usage": "Copiez les valeurs dans public/locales/{lang}/categories.json"
  },
  "categories": {
    "bois-feuillus-premium": {
      "name": "Bois Feuillus Premium",
      "shortDescription": "Chêne, hêtre, charme - Excellence garantie",
      "description": "Notre sélection premium de bois feuillus...",
      "_metadata": {
        "featured": true,
        "trending": true,
        "order": 1
      }
    },
    "granules-premium": {
      "name": "Granulés Premium",
      "shortDescription": "Pellets haute performance - Rendement optimal",
      "description": "Granulés de bois haute performance...",
      "_metadata": {
        "featured": true,
        "trending": false,
        "order": 2
      }
    }
  }
}
```

### Traduire dans les fichiers de locale

Copiez la structure dans chaque fichier de langue :

#### `/public/locales/en/categories.json`
```json
{
  "bois-feuillus-premium": {
    "name": "Premium Hardwood",
    "shortDescription": "Oak, beech, hornbeam - Guaranteed excellence",
    "description": "Our premium selection of hardwood..."
  },
  "granules-premium": {
    "name": "Premium Pellets",
    "shortDescription": "High-performance pellets - Optimal yield",
    "description": "High-performance wood pellets..."
  }
}
```

#### `/public/locales/de/categories.json`
```json
{
  "bois-feuillus-premium": {
    "name": "Premium-Hartholz",
    "shortDescription": "Eiche, Buche, Hainbuche - Garantierte Exzellenz",
    "description": "Unsere Premium-Auswahl an Hartholz..."
  },
  "granules-premium": {
    "name": "Premium-Pellets",
    "shortDescription": "Hochleistungs-Pellets - Optimaler Ertrag",
    "description": "Hochleistungs-Holzpellets..."
  }
}
```

#### `/public/locales/es/categories.json`
```json
{
  "bois-feuillus-premium": {
    "name": "Madera Dura Premium",
    "shortDescription": "Roble, haya, carpe - Excelencia garantizada",
    "description": "Nuestra selección premium de madera dura..."
  },
  "granules-premium": {
    "name": "Pellets Premium",
    "shortDescription": "Pellets de alto rendimiento - Rendimiento óptimo",
    "description": "Pellets de madera de alto rendimiento..."
  }
}
```

---

## 🔄 Étape 3 : Système de fallback automatique

Le système gère automatiquement les cas suivants :

### ✅ Traduction disponible
Si la traduction existe dans `/public/locales/{lang}/categories.json`, elle sera utilisée.

### ⚠️ Traduction manquante
Si la traduction n'existe pas :
- Le texte **original de la BDD** sera affiché
- Un warning sera loggé dans la console : `⚠️ Traduction manquante pour la catégorie: {slug}`

### 🔍 Exemple

**BDD** : Catégorie avec slug `nouvelle-categorie`
```json
{
  "name": "Nouvelle Catégorie",
  "slug": "nouvelle-categorie",
  "shortDescription": "Description en français"
}
```

**Fichier EN manquant** :
```json
{
  "bois-feuillus-premium": {...},
  // "nouvelle-categorie" n'existe pas
}
```

**Résultat affiché en anglais** :
- ✅ Affichage : "Nouvelle Catégorie" (texte français original)
- ⚠️ Console : Warning de traduction manquante

---

## 🎨 Étape 4 : Traductions déjà disponibles

Les **4 catégories de base** sont déjà traduites dans les fichiers :

### Catégories traduites (FR, EN, DE, ES)
1. ✅ `bois-feuillus-premium` - Bois Feuillus Premium
2. ✅ `bois-resineux-sec` - Bois Résineux Sec
3. ✅ `granules-premium` - Granulés Premium
4. ✅ `allume-feu-naturel` - Allume-Feu Naturel

Ces catégories correspondent aux données du script `scripts/seed.js`.

---

## 🛠️ Bonnes pratiques

### 1. Toujours utiliser le slug comme clé
```json
{
  "slug-de-la-categorie": {
    "name": "...",
    "shortDescription": "...",
    "description": "..."
  }
}
```

### 2. Garder le slug en français
Le `slug` est utilisé comme identifiant unique et **ne doit pas être traduit**.

### 3. Traductions cohérentes
- Utilisez le même ton dans toutes les langues
- Gardez la même structure
- Respectez la longueur des textes (SEO)

### 4. Vérifier après ajout
Après avoir ajouté des traductions :
1. Redémarrez le serveur : `npm run dev`
2. Testez chaque langue
3. Vérifiez la console pour les warnings

---

## 🚀 Commandes utiles

```bash
# Exporter les catégories de la BDD
npm run i18n:export-categories

# Initialiser la BDD avec catégories de base
npm run db:init

# Seed complet (catégories + produits + témoignages)
npm run seed

# Démarrer le serveur de dev
npm run dev
```

---

## 📊 Structure des fichiers

```
/public/locales/
├── fr/
│   ├── categories.json    ✅ 4 catégories traduites
│   ├── products.json       ✅ 8 produits par défaut
│   ├── common.json         ✅ Textes UI
│   ├── home.json          ✅ Page d'accueil
│   ├── seo.json           ✅ Meta tags
│   └── demo.json          ✅ Témoignages
├── en/
│   └── ...                ✅ Idem
├── de/
│   └── ...                ✅ Idem
└── es/
    └── ...                ✅ Idem
```

---

## 🐛 Dépannage

### Les catégories ne s'affichent pas traduites

1. Vérifiez que le fichier existe : `/public/locales/{lang}/categories.json`
2. Vérifiez que le slug correspond exactement
3. Regardez la console pour les warnings
4. Redémarrez le serveur

### Le script d'export ne trouve pas de catégories

```bash
# Initialiser d'abord la BDD
npm run db:init

# Puis exporter
npm run i18n:export-categories
```

### Traductions partielles

C'est normal ! Le système affichera :
- Texte traduit si disponible
- Texte original de la BDD sinon

---

## ✅ Checklist finale

- [ ] BDD initialisée avec catégories
- [ ] Script d'export exécuté
- [ ] Fichiers `categories.json` mis à jour (EN, DE, ES)
- [ ] Serveur redémarré
- [ ] Test de chaque langue
- [ ] Aucun warning dans la console

---

**Bon courage pour vos traductions ! 🌍**

