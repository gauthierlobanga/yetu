# Système de Gestion des Abonnements et URLs de Tenant

## Vue d'Ensemble

Ce document décrit comment le système gère les abonnements des tenants et assure la cohérence des URLs avec le port 8000.

## 1. Inclusion Dynamique du Port 8000

### 1.1 URLs de Tenant Complètes

**Fichier**: `app/Services/VendorRegistrationService.php` (lignes 547-561)

**Méthode `tenantBaseUrl()`**: Construit l'URL de base du tenant avec le schéma et le port extraits de `APP_URL`

- En environnement local: inclut automatiquement le port (ex: 8000)
- En production: utilise 80/443 implicitement
- Le port s'ajoute à:
  - `getVendeurUrl()` → `http://shop.localhost:8000/vendeur`
  - `getVendeurDashboardUrl()` → `http://shop.localhost:8000/vendor/dashboard`
  - `getTenantSsoLoginUrl()` → `http://shop.localhost:8000/tenant-sso-login?token=...`

### 1.2 Accesseur Tenant

**Fichier**: `app/Models/Tenant.php` (lignes 551-566)

**Accesseurs `getUrlAttribute()` et `getAdminUrlAttribute()`**: Retournent les URLs complètes du tenant

- `$tenant->url` retourne: `http://shop.localhost:8000`
- `$tenant->admin_url` retourne: `http://shop.localhost:8000/vendeur`

## 2. Vérification d'Abonnement au Connexion SSO

### 2.1 Contrôleur SSO Login

**Fichier**: `app/Http/Controllers/Auth/TenantSsoLoginController.php`

**Nouvelles vérifications** (lignes 31-35):
- Après validation du token SSO, vérifie que le tenant a une subscription active
- Si pas d'abonnement: redirige vers `/subscription/none` au lieu de 403
- Permet une expérience cohérente peu importe le point d'accès

**Avant**: 403 Forbidden
**Maintenant**: Page "Aucun abonnement" professionnelle

## 3. Protection des Routes Publiques

### 3.1 Middleware sur Routes E-Commerce

**Fichier**: `routes/tenants/routes.php`

**Page d'accueil**: `Route::middleware(EnsureTenantSubscription::class)->get('/', ...)`

**Routes e-commerce publiques**: `Route::name('tenant.')->middleware(EnsureTenantSubscription::class)->group(...)`

**Comportement**:
- Clients sans abonnement voient: "Aucun abonnement"
- Redirection automatique vers `/subscription/none`
- Pages statiques (terms, privacy) restent publiques
- Login/register restent accessibles

### 3.2 Middleware EnsureTenantSubscription

**Fichier**: `app/Http/Middleware/EnsureTenantSubscription.php`

**Logique de vérification**:
1. ✅ Abonnement actif → Accès autorisé
2. ❌ Pas d'abonnement → `/subscription/none`
3. ⚠️ Essai expiré → `/subscription/required`
4. ⚠️ Période de grâce active → Accès + avertissement
5. ❌ Période de grâce expirée → `/subscription/expired`

## 4. Flux d'Accès

### 4.1 Page d'Accueil Publique
```
Visite: http://shop.localhost:8000/
↓
EnsureTenantSubscription
↓
Abonnement actif? → Oui: Page / Non: /subscription/none
```

### 4.2 Connexion SSO
```
Clique lien SSO
↓
/tenant-sso-login?token=...
↓
TenantSsoLoginController valide token
↓
Subscription active? → Oui: Dashboard / Non: /subscription/none
```

### 4.3 Panel Filament Vendeur
```
Visite: /vendeur
↓
EnsureTenantSubscription (via VendeurPanelProvider)
↓
Abonnement actif? → Oui: Panel / Non: /subscription/none
```

## 5. Configuration

**`.env`**: `APP_URL=http://localhost:8000`

Le port 8000 est automatiquement extrait et inséré dans toutes les URLs générées en environnement local.

## 6. Fichiers Modifiés

| Fichier | Modifications |
|---------|--------------|
| `app/Services/VendorRegistrationService.php` | Port dynamique dans `tenantBaseUrl()` |
| `app/Models/Tenant.php` | Port dynamique dans `getUrlAttribute()` |
| `app/Http/Controllers/Auth/TenantSsoLoginController.php` | Vérification abonnement avant accès |
| `routes/tenants/routes.php` | Middleware `EnsureTenantSubscription` sur routes publiques |

## 7. Tests

```bash
# Vérifier port 8000 dans les URLs
curl -s "http://localhost:8000/account-selection" | grep "localhost:8000/vendeur"

# Test redirection sans abonnement
curl -L "http://shop.localhost:8000/" | grep -i "abonnement"
```
