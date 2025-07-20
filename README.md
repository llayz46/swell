# MaxEsport E-commerce

Une application d'e-commerce spécialisée dans les produits gaming et e-sport construite avec Laravel et React (via
Inertia.js).

## Table des matières

- [Introduction](#introduction)
- [Technologies utilisées](#technologies-utilisées)
- [Fonctionnalités](#fonctionnalités)
    - [Catalogue de produits](#catalogue-de-produits)
    - [Landing Page](#landing-page)
    - [Mode clair/sombre](#mode-clairsombre)
    - [Gestion des utilisateurs](#gestion-des-utilisateurs)
    - [Panier d'achat](#panier-dachat)
    - [Liste de souhaits](#liste-de-souhaits)
    - [Système de commentaires](#système-de-commentaires)
    - [Processus de commande](#processus-de-commande)
    - [Système de paiement](#système-de-paiement)
    - [Dashboard d'administration](#dashboard-dadministration)
    - [Recherche avancée](#recherche-avancée)
- [Installation](#installation)
- [Configuration](#configuration)
- [Utilisation](#utilisation)
- [Structure du projet](#structure-du-projet)
- [Gestion des rôles et permissions](#gestion-des-rôles-et-permissions)
- [API](#api)
- [Tests](#tests)
- [Contribuer](#contribuer)

## Introduction

MaxEsport E-commerce est une plateforme complète de commerce électronique dédiée aux produits gaming et e-sport.
Elle offre une expérience utilisateur fluide avec des fonctionnalités avancées pour les clients et une interface
d'administration puissante pour la gestion des produits, des commandes et du contenu marketing.

## Technologies utilisées

### Backend

- **Laravel 12** : Framework PHP moderne
- **SQLite/PostgreSQL** : Base de données
- **Laravel Cashier** : Gestion des paiements via Stripe
- **Laravel Scout** : Moteur de recherche avec Algolia
- **Spatie Permission** : Gestion des rôles et permissions

### Frontend

- **React** : Bibliothèque JavaScript pour l'interface utilisateur
- **Inertia.js** : Communication entre Laravel et React
- **TypeScript** : Typage statique pour JavaScript
- **TailwindCSS** : Framework CSS utilitaire
- **Shadcn UI** : Composants UI préconçus
- **dnd-kit** : Fonctionnalités de drag-and-drop
- **Headless UI** : Composants UI sans style prédéfini

## Fonctionnalités

### Catalogue de produits

- **Catégories et sous-catégories** : Organisation hiérarchique des produits
- **Marques** : Filtrage des produits par marque
- **Groupes de produits** : Association de produits similaires ou complémentaires (pas de variantes de produits)
- **Images multiples** : Visualisation détaillée de chaque produit
- **Informations détaillées** : Description, spécifications, prix, stock
- **Promotions** : Gestion des réductions et offres spéciales
- **Système de notation** : Avis et évaluations des clients

### Landing Page

- **Design moderne et attrayant** : Une page d'accueil visuellement captivante qui met en avant les produits phares
- **Sections catégorisées** : Présentation organisée des différentes catégories de produits gaming
- **Mise en avant des meilleures ventes** : Section dédiée aux produits les plus populaires

### Mode clair/sombre

- **Thème adaptable** : Basculement fluide entre mode clair et sombre
- **Préférence système** : Détection automatique des préférences de thème de l'utilisateur
- **Persistance de choix** : Mémorisation du mode préféré de l'utilisateur
- **Adaptation complète de l'UI** : Interface entièrement optimisée pour les deux modes

### Gestion des utilisateurs

- **Inscription et connexion** : Création et gestion de compte utilisateur
- **Profils utilisateurs** : Informations personnelles et préférences
- **Historique des commandes** : Suivi des achats précédents
- **Wishlist** : Liste de souhaits pour les produits
- **Gestion des rôles** : Utilisateur, administrateur, etc.

### Panier d'achat

- **Ajout de produits** : Sélection simple des articles
- **Modification des quantités** : Ajustement du nombre d'articles
- **Calcul dynamique** : Mise à jour automatique des totaux
- **Persistance du panier** : Conservation des articles entre les sessions
- **Hook et provider dédié** : Synchronisation de l'état du panier dans toute l'interface UI
- **Transfert de panier** : Migration automatique du panier invité vers le compte utilisateur lors de la connexion

### Liste de souhaits

- **Ajout/suppression de produits** : Gestion flexible des articles souhaités
- **Transfert vers le panier** : Ajout rapide au panier depuis la liste
- **Vue d'ensemble** : Affichage des produits favoris

### Système de commentaires

- **Ajout de commentaires** : Les utilisateurs peuvent laisser des commentaires sur les produits qu'ils ont achetés
- **Modification de commentaires** : Possibilité de modifier ses propres commentaires

### Processus de commande

- **Plusieurs modes d'achat** : Validation classique du panier ou achat direct depuis la page produit
- **Résumé de commande** : Visualisation claire des articles commandés
- **Adresses de facturation/livraison** : Possibilité d'utiliser des adresses différentes

### Système de paiement

- **Intégration Stripe** : Paiement sécurisé par carte
- **Paiement express** : Option de paiement rapide

### Dashboard d'administration

- **Gestion des produits** : Ajout, modification, suppression
- **Gestion des catégories** : Organisation de la structure du catalogue
- **Gestion des commandes** : Suivi et traitement des commandes [en cours]
- **Bannières promotionnelles** : Configuration des messages et promotions sur le site
- **Gestion des marques** : Ajout et organisation des marques

### Recherche avancée

- **Recherche par mots-clés** : Recherche textuelle efficace
- **Filtres multiples** : Affinage des résultats par catégorie, prix, stock, etc. [en cours]
- **Indexation Algolia** : Recherche rapide et pertinente

## Installation

```bash
# Cloner le dépôt
git clone https://github.com/votre-username/clone-maxesport-ecommerce.git
cd clone-maxesport-ecommerce

# Installer les dépendances PHP
composer install

# Installer les dépendances JavaScript
npm install

# Copier le fichier d'environnement
cp .env.example .env

# Générer la clé d'application
php artisan key:generate

# Configurer la base de données dans .env
# Puis exécuter les migrations et les seeders
php artisan migrate --seed

# Compiler les assets
npm run build
```

## Configuration

### Environnement

Configurez les variables d'environnement dans le fichier `.env` en copiant le fichier `.env.example` :

```
# Base de données
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=maxesport
DB_USERNAME=root
DB_PASSWORD=

# Stripe (paiement)
STRIPE_KEY=your_stripe_key
STRIPE_SECRET=your_stripe_secret
STRIPE_WEBHOOK_SECRET=your_stripe_webhook_secret

# Cashier
CASHIER_CURRENCY=eur
CASHIER_CURRENCY_LOCALE=fr_FR

# Algolia (recherche)
SCOUT_QUEUE=true
ALGOLIA_APP_ID=your_algolia_app_id
ALGOLIA_SECRET=your_algolia_secret
```

### Services externes

- **Stripe** : Créez un compte sur [stripe.com](https://stripe.com) et configurez vos clés API
- **Algolia** : Créez un compte sur [algolia.com](https://algolia.com) et configurez votre application

## Utilisation

### Démarrer le serveur de développement

```bash
composer run dev
```

### Accéder à l'application

- **Site principal** : http://localhost:8000 
- **Panneau d'administration** : http://localhost:8000/admin (nécessite un compte avec rôle admin, voir [Gestion des rôles et permissions](#gestion-des-rôles-et-permissions))

## Structure du projet

- **app/** : Code source principal de l'application Laravel
    - **Actions/** : Classes pour encapsuler la logique métier complexe
    - **Http/Controllers/** : Contrôleurs pour gérer les requêtes HTTP
    - **Models/** : Modèles Eloquent pour l'interaction avec la base de données
- **resources/** : Assets frontend (React, CSS)
- **routes/** : Définition des routes de l'application
- **database/** : Migrations et seeders pour la base de données
- **tests/** : Tests automatisés avec Pest

## Gestion des rôles et permissions

L'application utilise le package Spatie Laravel Permission pour gérer les rôles et permissions des utilisateurs. Ce système permet d'attribuer différents niveaux d'accès aux fonctionnalités du site.

### Création manuelle d'un utilisateur administrateur

Voici comment créer un rôle administrateur et l'attribuer à un utilisateur existant :

#### Méthode 1 : Via Tinker

```bash
# Lancer Tinker
php artisan tinker
```

```php
// Créer le rôle admin s'il n'existe pas déjà
Spatie\Permission\Models\Role::firstOrCreate(['name' => 'admin']);

// Attribuer le rôle admin à un utilisateur existant (par ID)
$user = App\Models\User::find(1); // Remplacez 1 par l'ID de l'utilisateur souhaité
$user->assignRole('admin');

$user->hasRole('admin'); // renvoie true ou false
```

#### Méthode 2 : Via une commande Artisan personnalisée

### Structure des rôles

L'interface d'administration permet aux modérateurs et administrateurs de :

- **admin** : Accès complet au tableau de bord d'administration et à toutes les fonctionnalités
- **moderator** : Permissions limitées pour modérer les commentaires et gérer certains contenus
- **user** : Rôle par défaut pour tous les utilisateurs enregistrés

L'application utilise principalement Inertia.js pour la communication entre le backend et le frontend via les routes Laravel.

## Tests

```bash
# Exécuter tous les tests
php artisan test
```

## Contribuer

1. Forkez le projet
2. Créez votre branche de fonctionnalité (`git checkout -b feature/amazing-feature`)
3. Committez vos changements (`git commit -m 'Add some amazing feature'`)
4. Poussez vers la branche (`git push origin feature/amazing-feature`)
5. Ouvrez une Pull Request
