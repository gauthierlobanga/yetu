<?php

namespace Database\Seeders;

use App\Models\Brand;
use App\Models\ProductCategory;
use App\Models\Produit;
use Faker\Factory;
use Illuminate\Database\Seeder;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class ProductSeeder extends Seeder
{
    public function run(): void
    {
        // Vérifier que les marques existent
        if (Brand::count() === 0) {
            $this->command->error('Aucune marque trouvée. Veuillez d\'abord exécuter BrandSeeder.');

            return;
        }

        // Vérifier que les catégories existent
        if (ProductCategory::count() === 0) {
            $this->command->error('Aucune catégorie trouvée. Veuillez d\'abord exécuter ProductCategorySeeder.');

            return;
        }

        // Récupérer les UUID des marques (indexées par ordre de création ou par nom)
        // On peut récupérer les marques dans l'ordre où elles ont été seedées (par ex. les 5 premières)
        $brandUuids = Brand::orderBy('created_at')->pluck('id')->toArray();
        if (count($brandUuids) < 5) {
            $this->command->error('Il faut au moins 5 marques pour ce seeder.');

            return;
        }

        // Assigner les marques dans l'ordre (1 → première marque, 2 → deuxième, etc.)
        $brandIds = [
            1 => $brandUuids[0],
            2 => $brandUuids[1],
            3 => $brandUuids[2],
            4 => $brandUuids[3],
            5 => $brandUuids[4],
        ];

        $faker = Factory::create('fr_FR');

        // Récupérer les catégories
        $categoryIds = ProductCategory::pluck('id')->toArray();
        $this->command->info('IDs des catégories disponibles : '.implode(', ', array_slice($categoryIds, 0, 10)).'...');

        // ID du tenant (doit être un UUID valide existant dans la table tenants)
        $tenantId = '019db819-64d0-73e0-88d0-f474494ce127';

        // ==========================================
        // PRODUITS DÉTAILLÉS
        // ==========================================
        $produits = [
            // [
            //     'tenant_id' => $tenantId,
            //     'nom' => 'Veste Polair Boreal Trail',
            //     'slug' => 'veste-polair-boreal-trail',
            //     'reference' => 'BRL-POL-TRL-02',
            //     'sku' => 'BRL-POL-M-NOIRE',
            //     'ean' => '3701234567892',
            //     'brand_id' => $brandIds[1],
            //     'short_description' => 'Veste polaire technique respirante pour la randonnée rapide.',
            //     'description_longue' => 'La veste Boreal Trail est conçue pour les efforts intenses en montagne...',
            //     'statut' => 'publie',
            //     'published_at' => Carbon::now()->subDays(10),
            //     'scheduled_for' => null,
            //     'expires_at' => null,
            //     'is_featured' => true,
            //     'is_new' => true,
            //     'is_bestseller' => false,
            //     'currency_id' => 59,
            //     'prix_ht' => 79.99,
            //     'prix_ttc' => 96.00,
            //     'prix_promotion' => null,
            //     'quantite_stock' => 45,
            //     'seuil_alerte' => 10,
            //     'poids' => 0.45,
            //     'hauteur' => null,
            //     'largeur' => null,
            //     'profondeur' => null,
            //     'unite_mesure' => 'cm',
            //     'seo_title' => 'Veste Polaire Technique Boreal Trail | Randonnée',
            //     'seo_keywords' => ['polaire', 'randonnée', 'outdoor', 'écologique', 'respirant'],
            //     'seo_description' => 'Veste polaire légère Boreal Trail. Fabriquée en tissu recyclé.',
            //     'metadata' => ['matiere' => 'Polartec® Microgrid 100% recyclé'],
            //     'attributes' => ['Genre' => 'Homme', 'Saison' => 'Automne/Hiver'],
            //     'categories' => array_slice($categoryIds, 0, 2),
            //     'tags' => ['homme', 'polaire', 'recyclé', 'montagne'],
            //     'variantes' => [
            //         ['nom' => 'Taille', 'valeur' => 'M', 'supplement_prix' => 0, 'stock' => 15, 'sku_variante' => 'BRL-POL-M-NOIR'],
            //         ['nom' => 'Taille', 'valeur' => 'L', 'supplement_prix' => 0, 'stock' => 20, 'sku_variante' => 'BRL-POL-L-NOIR'],
            //         ['nom' => 'Taille', 'valeur' => 'XL', 'supplement_prix' => 0, 'stock' => 10, 'sku_variante' => 'BRL-POL-XL-NOIR'],
            //     ],
            // ],
            // [
            //     'tenant_id' => $tenantId,
            //     'nom' => 'Bague Argent Minimaliste Lumen',
            //     'slug' => 'bague-argent-lumen',
            //     'reference' => 'LUM-AG-LUM-01',
            //     'sku' => 'LUM-BAGUE-ARG-54',
            //     'ean' => '3701234567907',
            //     'brand_id' => $brandIds[2],
            //     'short_description' => 'Bague fine en argent recyclé, martelée à la main.',
            //     'description_longue' => 'La bague Lumen capture la lumière...',
            //     'statut' => 'publie',
            //     'published_at' => Carbon::now()->subDays(5),
            //     'scheduled_for' => null,
            //     'expires_at' => null,
            //     'is_featured' => true,
            //     'is_new' => false,
            //     'is_bestseller' => true,
            //     'currency_id' => 59,
            //     'prix_ht' => 49.00,
            //     'prix_ttc' => 58.80,
            //     'prix_promotion' => 45.00,
            //     'quantite_stock' => 8,
            //     'seuil_alerte' => 2,
            //     'poids' => 0.003,
            //     'hauteur' => null,
            //     'largeur' => null,
            //     'profondeur' => null,
            //     'unite_mesure' => 'cm',
            //     'seo_title' => 'Bague Argent Lumen | Bijoux Minimaliste Lyon',
            //     'seo_keywords' => ['bague', 'argent', 'minimaliste', 'fait main'],
            //     'seo_description' => 'Bague en argent recyclé martelé à la main.',
            //     'metadata' => ['matiere' => 'Argent 925 Recyclé'],
            //     'attributes' => ['Genre' => 'Femme'],
            //     'categories' => array_slice($categoryIds, 2, 2),
            //     'tags' => ['bague', 'argent', 'minimaliste', 'cadeau'],
            //     'variantes' => [
            //         ['nom' => 'Taille', 'valeur' => '52', 'supplement_prix' => 0, 'stock' => 2, 'sku_variante' => 'LUM-BAGUE-ARG-52'],
            //         ['nom' => 'Taille', 'valeur' => '54', 'supplement_prix' => 0, 'stock' => 3, 'sku_variante' => 'LUM-BAGUE-ARG-54'],
            //         ['nom' => 'Taille', 'valeur' => '56', 'supplement_prix' => 0, 'stock' => 3, 'sku_variante' => 'LUM-BAGUE-ARG-56'],
            //     ],
            // ],
            // [
            //     'tenant_id' => $tenantId,
            //     'nom' => 'Casque Audio Aether H1',
            //     'slug' => 'casque-audio-aether-h1',
            //     'reference' => 'AETH-H1-NOIR',
            //     'sku' => 'AETH-H1-BLK',
            //     'ean' => '3701234567914',
            //     'brand_id' => $brandIds[3],
            //     'short_description' => 'Casque circum-auriculaire sans fil avec réduction de bruit active.',
            //     'description_longue' => 'Le Aether H1 offre une expérience sonore immersive...',
            //     'statut' => 'publie',
            //     'published_at' => Carbon::now()->subDays(15),
            //     'scheduled_for' => null,
            //     'expires_at' => null,
            //     'is_featured' => true,
            //     'is_new' => true,
            //     'is_bestseller' => false,
            //     'currency_id' => 59,
            //     'prix_ht' => 199.99,
            //     'prix_ttc' => 240.00,
            //     'prix_promotion' => null,
            //     'quantite_stock' => 30,
            //     'seuil_alerte' => 5,
            //     'poids' => 0.250,
            //     'hauteur' => 19.5,
            //     'largeur' => 17.0,
            //     'profondeur' => 8.0,
            //     'unite_mesure' => 'cm',
            //     'seo_title' => 'Casque Aether H1 | Réduction de Bruit Active',
            //     'seo_keywords' => ['casque', 'ANC', 'Bluetooth'],
            //     'seo_description' => 'Casque sans fil Aether H1 avec réduction de bruit.',
            //     'metadata' => ['connectivite' => 'Bluetooth 5.3'],
            //     'attributes' => ['Couleur' => 'Noir'],
            //     'categories' => array_slice($categoryIds, 4, 2),
            //     'tags' => ['audio', 'bluetooth', 'anc'],
            //     'variantes' => [],
            // ],
            // [
            //     'tenant_id' => $tenantId,
            //     'nom' => 'Table Basse Onda Chêne Massif',
            //     'slug' => 'table-basse-onda-chene',
            //     'reference' => 'COB-ONDA-CH-01',
            //     'sku' => 'COB-TB-CHN-120',
            //     'ean' => '3701234567921',
            //     'brand_id' => $brandIds[4],
            //     'short_description' => 'Table basse design en chêne massif et acier brossé.',
            //     'description_longue' => 'La table Onda allie la chaleur du bois...',
            //     'statut' => 'publie',
            //     'published_at' => Carbon::now()->subDays(20),
            //     'scheduled_for' => null,
            //     'expires_at' => null,
            //     'is_featured' => true,
            //     'is_new' => false,
            //     'is_bestseller' => true,
            //     'currency_id' => 59,
            //     'prix_ht' => 490.00,
            //     'prix_ttc' => 588.00,
            //     'prix_promotion' => null,
            //     'quantite_stock' => 4,
            //     'seuil_alerte' => 1,
            //     'poids' => 18.5,
            //     'hauteur' => 40.0,
            //     'largeur' => 120.0,
            //     'profondeur' => 60.0,
            //     'unite_mesure' => 'cm',
            //     'seo_title' => 'Table Basse Design Onda | Studio Cobalt',
            //     'seo_keywords' => ['table basse', 'design', 'chêne'],
            //     'seo_description' => 'Table basse en chêne massif et acier brossé.',
            //     'metadata' => ['materiaux' => 'Chêne FSC'],
            //     'attributes' => ['Forme' => 'Rectangulaire'],
            //     'categories' => array_slice($categoryIds, 6, 2),
            //     'tags' => ['table', 'design', 'scandinave'],
            //     'variantes' => [],
            // ],
            // [
            //     'tenant_id' => $tenantId,
            //     'nom' => 'Café Grains Éthiopie Sidamo Bio',
            //     'slug' => 'cafe-grains-ethiopie-sidamo',
            //     'reference' => 'ECUME-ETH-SID-250',
            //     'sku' => 'ECUME-ETH-250G',
            //     'ean' => '3701234567938',
            //     'brand_id' => $brandIds[5] ?? $brandUuids[0], // fallback si moins de 6 marques
            //     'short_description' => 'Café d\'Éthiopie Sidamo, notes florales et agrumes.',
            //     'description_longue' => 'Découvrez la finesse de ce Grand Cru...',
            //     'statut' => 'publie',
            //     'published_at' => Carbon::now()->subDays(3),
            //     'scheduled_for' => null,
            //     'expires_at' => null,
            //     'is_featured' => false,
            //     'is_new' => true,
            //     'is_bestseller' => false,
            //     'currency_id' => 59,
            //     'prix_ht' => 11.90,
            //     'prix_ttc' => 14.28,
            //     'prix_promotion' => null,
            //     'quantite_stock' => 120,
            //     'seuil_alerte' => 20,
            //     'poids' => 0.250,
            //     'hauteur' => null,
            //     'largeur' => null,
            //     'profondeur' => null,
            //     'unite_mesure' => 'kg',
            //     'seo_title' => 'Café Éthiopie Sidamo Bio',
            //     'seo_keywords' => ['café', 'éthiopie', 'sidamo'],
            //     'seo_description' => 'Café de spécialité Éthiopie Sidamo.',
            //     'metadata' => ['origine' => 'Sidamo, Éthiopie'],
            //     'attributes' => ['Torréfaction' => 'Claire'],
            //     'categories' => array_slice($categoryIds, 8, 2),
            //     'tags' => ['café', 'ethiopie', 'bio'],
            //     'variantes' => [
            //         ['nom' => 'Mouture', 'valeur' => 'Grains', 'supplement_prix' => 0, 'stock' => 80, 'sku_variante' => 'ECUME-ETH-250G'],
            //         ['nom' => 'Mouture', 'valeur' => 'Expresso', 'supplement_prix' => 0, 'stock' => 20, 'sku_variante' => 'ECUME-ETH-250G-ESP'],
            //         ['nom' => 'Mouture', 'valeur' => 'Filtre', 'supplement_prix' => 0, 'stock' => 20, 'sku_variante' => 'ECUME-ETH-250G-FIL'],
            //     ],
            // ],
            // ... (autres produits détaillés si nécessaire, en utilisant les UUID)
        ];

        // Insérer les produits détaillés
        foreach ($produits as $produitData) {
            $this->createProduit($produitData);
        }

        // ==========================================
        // PRODUITS ALÉATOIRES (jusqu'à 50)
        // ==========================================
        $nomsProduits = [/* ... */]; // votre tableau
        $adjectifs = [/* ... */];
        $statutsValides = ['brouillon', 'publie', 'archive'];
        $poidsStatuts = [15, 80, 5];

        $produitsRestants = 50 - count($produits);

        for ($i = 0; $i < $produitsRestants; $i++) {
            $nom = $faker->randomElement($adjectifs).' '.$faker->randomElement($nomsProduits);
            // Utiliser un UUID de marque aléatoire
            $brandId = $faker->randomElement($brandUuids);

            $categories = $faker->randomElements($categoryIds, $faker->numberBetween(1, 3));
            $statut = $this->getRandomWeightedElement($statutsValides, $poidsStatuts);
            $prixHt = $faker->randomFloat(2, 5, 800);

            $produitData = [
                'tenant_id' => $tenantId,
                'nom' => ucfirst($nom),
                'slug' => Str::slug($nom.'-'.$faker->randomNumber(3)),
                'reference' => strtoupper(Str::random(8)),
                'sku' => strtoupper(Str::random(10)),
                'ean' => $faker->ean13(),
                'brand_id' => $brandId, // UUID
                // ... autres champs ...
                'categories' => $categories,
                'tags' => $faker->words(3),
                'variantes' => [],
            ];

            $this->createProduit($produitData);
        }

        $this->command->info('✅ '.Produit::count().' produits créés avec succès !');
    }

    /**
     * Crée un produit avec ses relations
     */
    private function createProduit(array $data): Produit
    {
        // Extraire les relations
        $categories = $data['categories'] ?? [];
        $tags = $data['tags'] ?? [];
        $variantes = $data['variantes'] ?? [];

        unset($data['categories'], $data['tags'], $data['variantes']);

        // Convertir les tableaux en JSON
        if (isset($data['seo_keywords']) && is_array($data['seo_keywords'])) {
            $data['seo_keywords'] = json_encode($data['seo_keywords']);
        }
        if (isset($data['metadata']) && is_array($data['metadata'])) {
            $data['metadata'] = json_encode($data['metadata']);
        }
        if (isset($data['attributes']) && is_array($data['attributes'])) {
            $data['attributes'] = json_encode($data['attributes']);
        }

        // Valeurs par défaut
        $data['seo_keywords'] = $data['seo_keywords'] ?? json_encode([]);
        $data['attributes'] = $data['attributes'] ?? json_encode([]);
        $data['vues'] = 0;
        $data['views_count'] = 0;
        $data['sold_count'] = 0;
        $data['average_rating'] = 0;
        $data['reviews_count'] = 0;

        // Créer le produit
        $produit = Produit::create($data);

        // Attacher les catégories avec DB::table
        if (! empty($categories)) {
            foreach ($categories as $index => $categorieId) {
                // Vérifier que la catégorie existe avant d'insérer
                if (ProductCategory::where('id', $categorieId)->exists()) {
                    DB::table('produit_categorie_pivot')->insert([
                        'produit_id' => $produit->id,
                        'category_id' => $categorieId,
                        'is_primary' => ($index === 0),
                        'order' => $index,
                    ]);
                }
            }
        }

        // Attacher les tags
        if (! empty($tags) && method_exists($produit, 'attachTags')) {
            $produit->attachTags($tags);
        }

        // Créer les variantes
        if (! empty($variantes) && method_exists($produit, 'variantes')) {
            foreach ($variantes as $varianteData) {
                $produit->variantes()->create($varianteData);
            }
        }

        return $produit;
    }

    /**
     * Retourne un élément aléatoire basé sur des poids
     */
    private function getRandomWeightedElement(array $elements, array $weights): mixed
    {
        $totalWeight = array_sum($weights);
        $rand = mt_rand(1, $totalWeight);

        $cumulativeWeight = 0;
        foreach ($elements as $index => $element) {
            $cumulativeWeight += $weights[$index];
            if ($rand <= $cumulativeWeight) {
                return $element;
            }
        }

        return $elements[0];
    }
}
