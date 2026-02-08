# Configuration du Backend - Guide d'intégration

## 📋 Vue d'ensemble

L'application Angular est configurée pour communiquer automatiquement avec le backend Symfony selon l'environnement de déploiement.

## 🔧 Configuration des URLs

### Fichier de configuration: `src/environments/environment.ts`

La configuration détecte automatiquement l'environnement et utilise l'URL appropriée:

```typescript
// Production (Vercel)
https://beelshops.vercel.app → https://api.beelshops.com/api

// Développement local
localhost:4200 → http://localhost:8000/api

// Staging
staging.beelshops.com → https://api-staging.beelshops.com/api
```

## 🚀 Déploiement

### 1. **Configuration locale (développement)**

```bash
# Assurez-vous que le backend Symfony tourne sur:
http://localhost:8000

# Lancez l'app Angular:
ng serve
```

### 2. **Configuration production (Vercel)**

L'URL du backend est automatiquement définie à:
```
https://api.beelshops.com/api
```

**À adapter:** Remplacez `api.beelshops.com` par votre domaine backend réel.

### 3. **Fichiers à modifier**

Modifiez les fichiers suivants avec votre domaine backend:

- `src/environments/environment.ts` (ligne 18)
- `src/environments/environment.prod.ts` (ligne 10)

Remplacez:
```typescript
return 'https://api.beelshops.com/api';
```

Par votre URL réelle:
```typescript
return 'https://votre-api.com/api';
```

## 🔐 Authentification

### Endpoints disponibles

- `POST /api/auth/login` - Connexion
- `POST /api/auth/register` - Inscription
- `GET /api/auth/me` - Récupérer l'utilisateur connecté
- `POST /api/auth/refresh` - Rafraîchir le token

### Flux d'authentification

1. L'utilisateur se connecte via `/login`
2. Le token JWT est stocké dans `localStorage`
3. L'intercepteur HTTP ajoute le token à chaque requête
4. Si le token expire (401), il est automatiquement rafraîchi

### Rôles supportés

- `ROLE_CLIENT` - Utilisateur client
- `ROLE_ADMIN` - Administrateur

## 📁 Structure des fichiers

```
src/
├── app/
│   ├── services/
│   │   ├── auth.service.ts          # Service d'authentification
│   │   └── ...
│   ├── interceptors/
│   │   └── auth.interceptor.ts      # Intercepteur HTTP
│   ├── guards/
│   │   └── auth.guard.ts            # Guard de protection des routes
│   ├── components/
│   │   ├── login/                   # Page de connexion
│   │   ├── register/                # Page d'inscription
│   │   ├── header/                  # Header avec menu utilisateur
│   │   └── ...
│   └── app.routes.ts                # Routes protégées
├── environments/
│   ├── environment.ts               # Config développement
│   └── environment.prod.ts          # Config production
└── ...
```

## 🔗 Intégration CORS

Assurez-vous que votre backend Symfony accepte les requêtes CORS:

```php
// config/packages/nelmio_cors.yaml
nelmio_cors:
    defaults:
        allow_credentials: true
        allow_origin: ['https://beelshops.vercel.app', 'http://localhost:4200']
        allow_headers: ['Content-Type', 'Authorization']
        allow_methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS']
        max_age: 3600
```

## 🧪 Test de l'authentification

### 1. Inscription
```bash
POST /api/auth/register
{
  "email": "test@example.com",
  "password": "SecurePassword123",
  "nom": "Dupont",
  "prenom": "Jean",
  "phone": "+33612345678"
}
```

### 2. Connexion
```bash
POST /api/auth/login
{
  "email": "test@example.com",
  "password": "SecurePassword123"
}
```

Réponse:
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "id": 1,
    "email": "test@example.com",
    "nom": "Dupont",
    "prenom": "Jean",
    "roles": ["ROLE_CLIENT"],
    "isActive": true
  }
}
```

## 🛡️ Sécurité

- Les tokens JWT sont stockés dans `localStorage`
- L'intercepteur ajoute automatiquement le token aux requêtes
- Les erreurs 401 déclenchent un refresh automatique
- La déconnexion supprime le token et l'utilisateur du localStorage

## 📝 Notes importantes

1. **Pas de hardcoding d'URLs** - Utilisez toujours `environment.apiUrl`
2. **HTTPS en production** - Assurez-vous que votre backend est en HTTPS
3. **CORS configuré** - Le backend doit accepter les requêtes du frontend
4. **Tokens JWT** - Vérifiez que votre backend génère des tokens JWT valides

## 🐛 Dépannage

### Erreur: "Cannot find module 'environment'"
```bash
# Assurez-vous que les fichiers existent:
ls src/environments/
```

### Erreur CORS
Vérifiez la configuration CORS du backend Symfony.

### Token invalide
Vérifiez que le backend génère des tokens JWT avec la bonne signature.

## 📞 Support

Pour toute question sur la configuration, consultez:
- Documentation Angular: https://angular.io
- Documentation Symfony: https://symfony.com
- JWT: https://jwt.io
