# 🪵 BoisChauffage Pro - E-commerce Premium

Site e-commerce moderne et fonctionnel pour la vente de bois de chauffage premium, développé avec Next.js, MongoDB et Framer Motion.

## ✨ Fonctionnalités

### 🛍️ E-commerce Complet
- **Catalogue produits** avec filtres avancés et recherche
- **Panier persistant** avec localStorage et Zustand
- **Processus de commande** simplifié en 4 étapes
- **Paiement par virement** avec coordonnées bancaires dynamiques
- **Suivi de commande** avec upload de justificatifs

### 🎨 Design Premium
- **Animations Framer Motion** fluides et professionnelles
- **Palette couleurs** : Ambre (#f59e0b) + Bois (#8b5a3c) + Gris (#1f2937)
- **Responsive design** mobile-first avec Tailwind CSS
- **Typographie** : Krona One (titres) + Inter (texte)
- **Micro-interactions** et effets visuels soignés

### ⚡ Technologies Modernes
- **Next.js 15** avec Pages Router
- **React 19** avec hooks avancés
- **MongoDB** avec Mongoose ODM
- **Cloudinary** pour gestion des images
- **Nodemailer** pour les emails automatiques

### 🔧 Architecture Simplifiée
- **Sans authentification** - Commande directe
- **Sans interface admin** - Gestion par scripts
- **3 collections MongoDB** seulement
- **Configuration dynamique** via base de données

## 🚀 Installation Rapide

### 1. Cloner et installer
```bash
git clone <repository-url>
cd boischauffage-pro
npm install
```

### 2. Configuration environnement
Créer un fichier `.env.local` :
```env
# MongoDB
MONGODB_URI=mongodb://localhost:27017/boischauffage-pro

# Cloudinary (optionnel pour les images)
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Email (optionnel pour les notifications)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password
EMAIL_FROM="BoisChauffage Pro <noreply@boischauffagepro.fr>"

# Développement
NODE_ENV=development
NEXTAUTH_URL=http://localhost:3000
```

### 3. Initialiser la base de données
```bash
# Installer MongoDB localement ou utiliser MongoDB Atlas
# Puis initialiser les données
npm run init-db
```

### 4. Lancer en développement
```bash
npm run dev
```

Le site sera disponible sur `http://localhost:3000`

## 📦 Scripts Disponibles

```bash
# Développement
npm run dev              # Serveur de développement
npm run build           # Build de production
npm run start           # Serveur de production

# Base de données
npm run init-db         # Initialisation complète
npm run init-categories # Catégories seulement
npm run init-products   # Produits seulement
npm run init-settings   # Paramètres seulement
npm run reset-db        # Remise à zéro

# Gestion
npm run update-settings # Modifier paramètres
npm run backup-db       # Sauvegarde
```

## 🗄️ Structure de la Base de Données

### Collections MongoDB

#### 1. `categories` - Catégories de produits
```javascript
{
  name: "Bois Feuillus",
  slug: "bois-feuillus", 
  description: "Chêne, hêtre, charme...",
  image: "url_cloudinary",
  order: 1,
  isActive: true
}
```

#### 2. `products` - Produits
```javascript
{
  name: "Bois de Chêne Premium",
  slug: "bois-de-chene-premium",
  categoryId: ObjectId,
  essence: "chêne",
  price: 95,
  compareAtPrice: 110,
  unit: "m³",
  stock: 50,
  images: [{url, alt, isPrimary}],
  specifications: [{name, value, unit}],
  badges: ["premium", "populaire"],
  featured: true,
  averageRating: 4.8,
  reviewCount: 24
}
```

#### 3. `orders` - Commandes
```javascript
{
  orderNumber: "BC2024-0001",
  items: [{productId, productName, price, quantity, subtotal}],
  customer: {firstName, lastName, email, phone},
  billingAddress: {street, city, zipCode, country},
  shippingAddress: {street, city, zipCode, country},
  subtotal: 190,
  shippingCost: 50,
  tax: 48,
  total: 288,
  status: "payment_pending",
  paymentProofs: [{filename, url, uploadedAt}]
}
```

#### 4. `app_settings` - Configuration dynamique
```javascript
{
  key: "bank_iban",
  value: "FR76 1234 5678 9012 3456 7890 123",
  type: "string",
  category: "payment",
  description: "IBAN pour les virements"
}
```

## 🎯 Fonctionnalités Détaillées

### 🛒 Processus de Commande
1. **Panier** - Gestion avec Zustand + localStorage
2. **Informations** - Formulaire client complet avec validation
3. **Paiement** - Affichage coordonnées bancaires dynamiques
4. **Confirmation** - Email automatique + lien de suivi

### 📱 Pages Principales
- `/` - Accueil avec hero, catégories, produits featured
- `/produits` - Catalogue avec filtres et recherche
- `/produits/[slug]` - Fiche produit détaillée
- `/categories/[slug]` - Produits par catégorie
- `/panier` - Panier et processus de commande
- `/suivi/[orderNumber]` - Suivi de commande avec upload

### 🎨 Composants Réutilisables
- `Layout` - Navigation + footer
- `ProductCard` - Carte produit avec animations
- `CategoryCard` - Carte catégorie avec effets
- `CartSidebar` - Panier latéral animé

### ⚙️ Configuration Dynamique
Tous les paramètres sont modifiables en base :
- Informations bancaires (IBAN, BIC, etc.)
- Seuils livraison gratuite
- Taux de TVA
- Informations entreprise
- Coûts de livraison

## 🔧 Personnalisation

### Couleurs
Modifier dans `tailwind.config.js` :
```javascript
colors: {
  primary: { 500: '#f59e0b' }, // Ambre
  wood: { 500: '#8b5a3c' },    // Bois
  gray: { 800: '#1f2937' }     // Gris
}
```

### Contenu
1. **Images** : Remplacer les placeholders par vraies images
2. **Textes** : Modifier dans les composants
3. **Paramètres** : Via scripts ou directement en base

### Données
```bash
# Modifier les catégories
node scripts/init-categories.js

# Ajouter des produits
node scripts/init-products.js

# Changer les paramètres
node scripts/update-settings.js
```

## 🚀 Déploiement

### Vercel (Recommandé)
```bash
# Installer Vercel CLI
npm i -g vercel

# Déployer
vercel

# Configurer les variables d'environnement dans Vercel dashboard
```

### Variables d'environnement de production
```env
MONGODB_URI=mongodb+srv://...
CLOUDINARY_CLOUD_NAME=...
EMAIL_HOST=...
NEXTAUTH_URL=https://yourdomain.com
NODE_ENV=production
```

## 📊 Performance

- **Lighthouse Score** : 95+ en performance
- **Next.js optimisations** : ISR, Image optimization
- **Animations** : 60fps avec Framer Motion
- **Bundle size** : Optimisé avec tree-shaking

## 🔒 Sécurité

- **Validation** : Yup schemas côté client et serveur
- **Sanitization** : Données nettoyées avant stockage
- **Rate limiting** : Protection API intégrée
- **CORS** : Configuration appropriée

## 🐛 Dépannage

### Problèmes courants

**MongoDB connexion**
```bash
# Vérifier que MongoDB est lancé
mongod --version
```

**Images non affichées**
- Vérifier configuration Cloudinary
- Utiliser des URLs absolues

**Erreurs de build**
```bash
# Nettoyer et réinstaller
rm -rf .next node_modules
npm install
npm run build
```

## 📚 Documentation API

### Routes principales
- `GET /api/categories` - Liste des catégories
- `GET /api/products` - Liste des produits avec filtres
- `GET /api/products/featured` - Produits mis en avant
- `POST /api/orders` - Créer une commande
- `GET /api/orders/[orderNumber]` - Détails commande
- `POST /api/orders/[orderNumber]/upload` - Upload justificatifs

## 🤝 Contribution

1. Fork le projet
2. Créer une branche feature (`git checkout -b feature/AmazingFeature`)
3. Commit (`git commit -m 'Add AmazingFeature'`)
4. Push (`git push origin feature/AmazingFeature`)
5. Ouvrir une Pull Request

## 📝 License

Ce projet est sous licence MIT. Voir `LICENSE` pour plus de détails.

## 🆘 Support

- **Documentation** : Ce README
- **Issues** : GitHub Issues
- **Email** : contact@boischauffagepro.fr

---

**Développé avec ❤️ et 🪵 par l'équipe BoisChauffage Pro**