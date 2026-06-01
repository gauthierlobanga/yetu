# 💿 Storage - `storage/`

Ce dossier contient les fichiers générés lors de l'exécution (logs, cache, uploads).

## 📁 Structure

```
storage/
├── logs/                 # Fichiers de log
│   └── laravel.log      # Log principal
├── cache/               # Fichiers de cache
│   ├── data/
│   └── models/
├── app/                 # Fichiers d'application
│   ├── public/          # Fichiers accessibles publiquement
│   ├── uploads/         # Uploads utilisateurs
│   └── temp/            # Fichiers temporaires
└── framework/           # Fichiers framework
    ├── cache/
    ├── sessions/
    └── views/
```

## 📝 Logs - `storage/logs/`

Fichiers de log de l'application.

### Fichier Principal

```
storage/logs/laravel.log
```

### Format des Logs

```
[2026-06-01 12:34:56] local.ERROR: Exception occurred
{
    "exception": "...",
    "message": "...",
    "stack": [...]
}
```

### Consulter les Logs

```bash
# Dernières 50 lignes
tail -50 storage/logs/laravel.log

# En temps réel
tail -f storage/logs/laravel.log

# Chercher une erreur
grep -i "error" storage/logs/laravel.log

# Compter les erreurs
grep -c "ERROR" storage/logs/laravel.log

# Voir les derniers 5 minutes
grep "$(date -d '5 minutes ago' '+%Y-%m-%d %H:%M')" storage/logs/laravel.log
```

### Configuration des Logs

```php
// config/logging.php
'channels' => [
    'stack' => [
        'driver' => 'stack',
        'channels' => ['single', 'daily'],
    ],

    'single' => [
        'driver' => 'single',
        'path' => storage_path('logs/laravel.log'),
        'level' => 'debug',
    ],

    'daily' => [
        'driver' => 'daily',
        'path' => storage_path('logs/laravel.log'),
        'level' => 'debug',
        'days' => 14,  // Garder 14 jours
    ],
],
```

### Logger dans l'Application

```php
use Illuminate\Support\Facades\Log;

// Niveaux de log
Log::debug('Debug message');
Log::info('Info message');
Log::notice('Notice message');
Log::warning('Warning message');
Log::error('Error message');
Log::critical('Critical message');
Log::alert('Alert message');
Log::emergency('Emergency message');

// Avec contexte
Log::info('User logged in', ['user_id' => $user->id]);

// Channels spécifiques
Log::channel('slack')->error('Something went wrong!');
```

## 💾 Cache - `storage/cache/`

Fichiers de cache pour améliorer les performances.

### Commandes de Cache

```bash
# Vider tout le cache
php artisan cache:clear

# Cache des routes
php artisan route:cache
php artisan route:clear

# Cache de la configuration
php artisan config:cache
php artisan config:clear

# Cache des vues
php artisan view:cache
php artisan view:clear

# Cache d'optimisation
php artisan optimize
php artisan optimize:clear
```

### Utiliser le Cache

```php
use Illuminate\Support\Facades\Cache;

// Stocker dans le cache (1 heure)
Cache::put('key', 'value', 3600);

// Récupérer du cache
$value = Cache::get('key', 'default');

// Récupérer et oublier
$value = Cache::pull('key');

// Ajouter si n'existe pas
Cache::add('key', 'value', 3600);

// Vider une clé
Cache::forget('key');

// Forever
Cache::forever('key', 'value');
```

## 📤 Fichiers Publics - `storage/app/public/`

Fichiers accessibles publiquement (images, documents, etc).

### Configuration

```bash
# Créer un symlink depuis public/storage
php artisan storage:link

# Le lien pointe vers storage/app/public/
# Accès via: http://localhost/storage/...
```

### Stocker des Fichiers

```php
use Illuminate\Support\Facades\Storage;

// Stocker un fichier
$path = Storage::disk('public')->put('uploads', $file);

// Stocker avec un nom
Storage::disk('public')->putAs('uploads', $file, 'custom-name.jpg');

// Récupérer l'URL
$url = Storage::disk('public')->url($path);

// Afficher dans une vue
<img src="{{ asset('storage/' . $path) }}" alt="Image">
```

## 📋 Sessions - `storage/framework/sessions/`

Fichiers de session (si `SESSION_DRIVER=file`).

### Configuration des Sessions

```php
// config/session.php
'driver' => env('SESSION_DRIVER', 'database'),

'lifetime' => env('SESSION_LIFETIME', 120),  // Minutes

'secure' => env('SESSION_SECURE_COOKIES', false),

'http_only' => true,
```

### Utiliser les Sessions

```php
// Stocker
session(['key' => 'value']);

// Récupérer
$value = session('key');

// Avec défaut
$value = session('key', 'default');

// Flash (une seule requête)
session()->flash('success', 'Message');

// Récupérer dans la vue
{{ session('success') }}
```

## 📦 Uploads - `storage/app/uploads/`

Fichiers uploadés par les utilisateurs.

### Structure

```
storage/app/uploads/
├── products/        # Images produits
├── avatars/         # Avatars utilisateurs
├── documents/       # Documents
└── temp/            # Fichiers temporaires
```

### Stocker les Uploads

```php
// Dans le controller
$file = $request->file('upload');

// Valider
$file->validate(['mimes:jpg,png,pdf', 'max:5120']);

// Stocker
$path = $file->store('uploads/products', 'public');

// Récupérer l'URL
$url = Storage::disk('public')->url($path);
```

### Nettoyer les Uploads

```bash
# Supprimer les fichiers orphelins
php artisan storage:cleanup

# Supprimer les fichiers temporaires
find storage/app/uploads/temp -mtime +7 -delete  # Plus de 7 jours
```

## 🗑️ Nettoyage et Maintenance

### Nettoyer le Storage

```bash
# Vider tous les caches
php artisan cache:clear
php artisan view:clear
php artisan route:clear
php artisan config:clear

# Nettoyer les fichiers temporaires
find storage/app/temp -type f -mtime +30 -delete

# Nettoyer les logs anciens
find storage/logs -mtime +90 -delete

# Tout nettoyer (sauf logs)
php artisan optimize:clear
```

### Permissions des Fichiers

```bash
# Définir les permissions correctes
chmod -R 775 storage
chmod -R 775 bootstrap/cache

# Vérifier la propriété
ls -la storage/
chown -R www-data:www-data storage/
```

## 📊 Disques de Stockage

### Configuration

```php
// config/filesystems.php
'disks' => [
    'local' => [       // Stockage local
        'driver' => 'local',
        'root' => storage_path('app'),
    ],

    'public' => [      // Accessible publiquement
        'driver' => 'local',
        'root' => storage_path('app/public'),
        'url' => env('APP_URL') . '/storage',
    ],

    's3' => [          // AWS S3
        'driver' => 's3',
        'key' => env('AWS_ACCESS_KEY_ID'),
        'secret' => env('AWS_SECRET_ACCESS_KEY'),
        'region' => env('AWS_DEFAULT_REGION'),
        'bucket' => env('AWS_BUCKET'),
    ],
],
```

### Utiliser Différents Disques

```php
// Stockage local
Storage::disk('local')->put('file.txt', 'contents');

// Stockage public
Storage::disk('public')->put('uploads/file.jpg', $file);

// AWS S3
Storage::disk('s3')->put('uploads/file.jpg', $file);

// Par défaut
Storage::put('file.txt', 'contents');  // Utilise le disque par défaut
```

## 🔒 Sécurité

### Protéger les Fichiers Sensibles

```bash
# Ne pas commiter le storage (sauf logs)
echo "storage/" >> .gitignore
echo "!storage/logs" >> .gitignore
```

### Valider les Uploads

```php
$request->validate([
    'document' => 'required|file|mimes:pdf,doc,docx|max:5120',
    'image' => 'required|image|mimes:jpeg,png,gif|max:2048',
]);
```

## 📈 Monitoring

### Vérifier l'Espace Disque

```bash
# Voir l'utilisation disque
df -h storage/

# Voir les dossiers volumineux
du -sh storage/*

# Fichiers les plus gros
find storage -type f -exec du -h {} + | sort -rh | head -20
```

### Alertes Recommandées

```
- Espace disque < 10% disponible
- Logs > 1GB
- Fichiers temporaires > 30 jours
- Cache non invalidé après 7 jours
```

## 🔗 Ressources

- [Laravel Docs - File Storage](https://laravel.com/docs/filesystem)
- [Laravel Docs - Logging](https://laravel.com/docs/logging)

---

**Besoin d'aide?** Consultez la [documentation principale](../README.md)
