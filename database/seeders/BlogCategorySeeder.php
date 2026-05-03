<?php

namespace Database\Seeders;

use Faker\Factory;
use Illuminate\Database\Seeder;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class BlogCategorySeeder extends Seeder
{
    public function run(): void
    {
        $faker = Factory::create('fr_FR');

        // ==========================================
        // CATÉGORIES RACINES (niveau 1)
        // ==========================================

        $racines = [
            ['nom' => 'Actualités', 'description' => 'Toutes les actualités et nouveautés'],
            ['nom' => 'Guides & Conseils', 'description' => 'Guides pratiques et conseils d\'experts'],
            ['nom' => 'Tendances', 'description' => 'Les dernières tendances et inspirations'],
            ['nom' => 'Produits', 'description' => 'Focus sur nos produits et collections'],
            ['nom' => 'Événements', 'description' => 'Événements, salons et rencontres'],
            ['nom' => 'Tutoriels', 'description' => 'Tutoriels et DIY'],
            ['nom' => 'Interviews', 'description' => 'Rencontres avec des créateurs et experts'],
            ['nom' => 'Développement Durable', 'description' => 'Engagements et initiatives éco-responsables'],
        ];

        $categoriesCrees = [];

        foreach ($racines as $index => $catData) {
            // CORRECTION : Les mots-clés doivent être un tableau encodé en JSON, pas une chaîne
            $keywordsArray = explode(' ', strtolower($catData['nom']));

            $categorieId = DB::table('posts_categories')->insertGetId([
                'id' => Str::uuid(),
                'parent_id' => null,
                'nom' => $catData['nom'],
                'slug' => Str::slug($catData['nom']),
                'description' => $catData['description'],
                'color' => $faker->hexColor(),
                'metadata' => json_encode(['niveau' => 1, 'type' => 'racine']),
                'ordre' => $index * 10,
                'est_active' => true,
                'est_visible_dans_menu' => true,
                'meta_title' => $catData['nom'].' - Blog',
                'meta_description' => 'Découvrez tous nos articles sur '.strtolower($catData['nom']),
                // CORRECTION : encoder en JSON
                'meta_keywords' => json_encode($keywordsArray),
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now(),
            ]);

            $categoriesCrees[] = $categorieId;
        }

        $this->command->info('✅ 8 catégories racines créées.');

        // ==========================================
        // SOUS-CATÉGORIES (niveau 2)
        // ==========================================

        $sousCategoriesMap = [
            'Actualités' => ['Nouveautés', 'Annonces', 'Partenariats', 'Dans les médias'],
            'Guides & Conseils' => ['Guide d\'achat', 'Entretien', 'Utilisation', 'Comparatifs', 'Astuces'],
            'Tendances' => ['Mode', 'Décoration', 'Tech', 'Lifestyle', 'Couleurs'],
            'Produits' => ['Collections', 'Nouveautés', 'Best-sellers', 'Éditions limitées', 'Collaborations'],
            'Événements' => ['Salons', 'Pop-up stores', 'Webinaires', 'Ateliers'],
            'Tutoriels' => ['DIY', 'Vidéo', 'Débutants', 'Avancés'],
            'Interviews' => ['Créateurs', 'Artisans', 'Experts', 'Clients'],
            'Développement Durable' => ['Éco-conception', 'Recyclage', 'Circuit court', 'Labels & Certifications'],
        ];

        foreach ($sousCategoriesMap as $racineNom => $sousCategories) {
            $parent = DB::table('posts_categories')->where('nom', $racineNom)->first();
            if (! $parent) {
                continue;
            }

            foreach ($sousCategories as $index => $nomSousCat) {
                // Générer des mots-clés sous forme de tableau
                $keywordsArray = array_merge(
                    explode(' ', strtolower($nomSousCat)),
                    explode(' ', strtolower($racineNom))
                );

                DB::table('posts_categories')->insert([
                    'id' => Str::uuid(),
                    'parent_id' => $parent->id,
                    'nom' => $nomSousCat,
                    'slug' => Str::slug($parent->slug.'-'.$nomSousCat),
                    'description' => $faker->sentence(10),
                    'color' => $faker->hexColor(),
                    'metadata' => json_encode(['niveau' => 2, 'parent' => $racineNom]),
                    'ordre' => $index * 5,
                    'est_active' => true,
                    'est_visible_dans_menu' => $faker->boolean(80),
                    'meta_title' => $nomSousCat.' - '.$racineNom,
                    'meta_description' => $faker->text(150),
                    // CORRECTION : encoder en JSON
                    'meta_keywords' => json_encode($keywordsArray),
                    'created_at' => Carbon::now(),
                    'updated_at' => Carbon::now(),
                ]);
            }
        }

        // ==========================================
        // SOUS-SOUS-CATÉGORIES (niveau 3)
        // ==========================================

        $niveau3Map = [
            'Mode' => ['Streetwear', 'Minimaliste', 'Bohème', 'Vintage', 'Business'],
            'Décoration' => ['Scandinave', 'Industriel', 'Japonais', 'Méditerranéen'],
            'Collections' => ['Printemps/Été', 'Automne/Hiver', 'Capsule', 'Permanente'],
            'Guide d\'achat' => ['Débutants', 'Experts', 'Cadeaux', 'Petit budget'],
        ];

        foreach ($niveau3Map as $parentNom => $sousCategories) {
            $parent = DB::table('posts_categories')->where('nom', $parentNom)->first();
            if (! $parent) {
                continue;
            }

            foreach ($sousCategories as $index => $nomSousCat) {
                // Générer des mots-clés
                $keywordsArray = $faker->words(3);

                DB::table('posts_categories')->insert([
                    'id' => Str::uuid(),
                    'parent_id' => $parent->id,
                    'nom' => $nomSousCat,
                    'slug' => Str::slug($parent->slug.'-'.$nomSousCat),
                    'description' => $faker->sentence(8),
                    'color' => $parent->color,
                    'metadata' => json_encode(['niveau' => 3]),
                    'ordre' => $index * 3,
                    'est_active' => true,
                    'est_visible_dans_menu' => false,
                    'meta_title' => $nomSousCat.' - Blog',
                    'meta_description' => $faker->text(120),
                    // CORRECTION : encoder en JSON
                    'meta_keywords' => json_encode($keywordsArray),
                    'created_at' => Carbon::now(),
                    'updated_at' => Carbon::now(),
                ]);
            }
        }

        // ==========================================
        // CATÉGORIES SUPPLÉMENTAIRES POUR ATTEINDRE ~50
        // ==========================================

        $parentsExistants = DB::table('posts_categories')->whereNotNull('parent_id')->pluck('id')->toArray();
        $motsCles = ['Digital', 'Éthique', 'Premium', 'Local', 'Artisanal', 'Innovation', 'Tradition', 'Futur', 'Saison', 'Spécial'];
        $sujets = ['Focus', 'Dossier', 'Sélection', 'Découverte', 'Rencontre', 'Portrait', 'Analyse', 'Reportage'];

        $categoriesExistantes = DB::table('posts_categories')->count();
        $categoriesNeeded = 50 - $categoriesExistantes;

        for ($i = 0; $i < $categoriesNeeded; $i++) {
            $parentId = $faker->randomElement($parentsExistants);
            $parent = DB::table('posts_categories')->find($parentId);

            $nom = $faker->randomElement($motsCles).' '.$faker->randomElement($sujets);

            // Générer des mots-clés
            $keywordsArray = $faker->words(5);

            DB::table('posts_categories')->insert([
                'id' => Str::uuid(),
                'parent_id' => $parentId,
                'nom' => $nom,
                'slug' => Str::slug($parent->slug.'-'.$nom),
                'description' => $faker->sentence(12),
                'color' => $faker->hexColor(),
                'metadata' => json_encode(['niveau' => 3, 'auto_generated' => true]),
                'ordre' => $faker->numberBetween(0, 50),
                'est_active' => $faker->boolean(90),
                'est_visible_dans_menu' => $faker->boolean(30),
                'meta_title' => $nom.' - Articles et conseils',
                'meta_description' => $faker->text(140),
                // CORRECTION : encoder en JSON
                'meta_keywords' => json_encode($keywordsArray),
                'created_at' => Carbon::now()->subDays($faker->numberBetween(1, 365)),
                'updated_at' => Carbon::now(),
            ]);
        }

        $totalCategories = DB::table('posts_categories')->count();
        $this->command->info("✅ {$totalCategories} catégories de blog créées avec succès !");
    }
}
