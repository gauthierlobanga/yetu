# 🏢 Inscription Vendeur & Authentification Multi-Tenant (SSO)

Ce document décrit le flux d'inscription des vendeurs, la gestion de leur logo, et l'authentification cross-domain (Single Sign-On).

## 1. Processus d'inscription (Vendor Registration)

L'inscription d'un vendeur se fait en plusieurs étapes :
1. L'utilisateur (déjà inscrit sur le domaine central) choisit un plan d'abonnement.
2. Il remplit les détails de sa boutique (nom, slug, description, contact, et **logo**).
3. Le contrôleur `VendorRegistrationController` initie la demande via `VendorRegistrationService`.
   - Les données textuelles sont sauvegardées dans la table `vendor_requests`.
   - **Logo** : Le fichier est attaché temporairement au modèle `VendorRequest` grâce à `Spatie\MediaLibrary`.
4. Un job asynchrone `ApproveVendorRequest` est dispatché pour créer la base de données du tenant.
5. Une fois le `Tenant` créé :
   - Les données du tenant (slug, infos) sont remplies.
   - Les documents légaux sont transférés.
   - Le **logo** est automatiquement transféré depuis la `VendorRequest` vers le `Tenant` dans la collection média `tenant_avatar`.

## 2. Authentification et Cookies (`.localhost`)

En environnement de développement avec des sous-domaines (ex: `manager.localhost`), il faut prêter une attention particulière à la configuration des cookies dans le fichier `.env`.

### Le problème avec `SESSION_DOMAIN=.localhost`
Les navigateurs modernes (Chrome, Edge, Firefox) rejettent les cookies définis avec un domaine racine `.localhost` pour des raisons de sécurité strictes (le TLD `localhost` n'accepte pas nativement de sous-domaines wildcards comme `.com`).
- **Symptôme :** Boucle de redirection infinie sur `/login`. Le backend vous authentifie avec succès, génère la session, mais le navigateur refuse de sauvegarder le cookie envoyé, ce qui vous déconnecte immédiatement à la page suivante.
- **Solution :** Pour le développement local, il faut laisser la variable `SESSION_DOMAIN=` vide ou configurer un domaine local valide (ex: `yetu.test`). En la laissant vide, la session est rattachée au domaine exact de la requête (ex: `manager.localhost`), ce qui résout le problème de connexion locale.

## 3. Single Sign-On (SSO)

Yetufy implémente un système de Single Sign-On (SSO) pour permettre à un utilisateur authentifié sur le domaine central d'accéder au panneau d'administration de son/ses tenants sans avoir à ressaisir de mot de passe.

### Fonctionnement du flux SSO :
1. Un jeton de connexion crypté est généré contenant `user_id`, `tenant_id` et un `expires_at`.
2. L'utilisateur clique sur le lien vers son tenant, qui le redirige vers l'endpoint `/tenant-sso-login?token=...` sur le sous-domaine de son tenant (ex: `maboutique.localhost:8000/tenant-sso-login`).
3. Le contrôleur `TenantSsoLoginController` intercepte la requête, décrypte et valide le jeton de sécurité.
4. Le système interroge la **base de données centrale** pour vérifier que l'utilisateur est bien autorisé et propriétaire de la boutique (`is_owner = true` dans la table pivot `user_tenant`).
5. Si autorisé, l'utilisateur est instantanément authentifié sur le guard web du tenant et est redirigé vers son tableau de bord vendeur.
