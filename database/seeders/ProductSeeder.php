<?php

namespace Database\Seeders;

use App\Models\Brand;
use App\Models\Category;
use App\Models\Product;
use App\Models\ProductGroup;
use App\Models\ProductImage;
use Illuminate\Database\Seeder;

class ProductSeeder extends Seeder
{
    public function run(): void
    {
        $categoryTapisDeSouris = Category::where('name', 'Tapis de Souris')->first();

        $laOnda = Brand::create([
            'name' => 'LaOnda',
            'slug' => 'laonda',
        ]);

        $lethalGamingGear = Brand::create([
            'name' => 'Lethal Gaming Gear',
            'slug' => 'lethal-gaming-gear',
        ]);

        $artisanfx = Brand::create([
            'name' => 'Artisan FX',
            'slug' => 'artisan-fx',
        ]);

        $moldenEdgeGroup = ProductGroup::factory()->create([
            'name' => 'Molden Edge',
            'slug' => 'molden-edge',
        ]);

        $sr = Product::create([
            'name' => 'SR SQ',
            'sku' => 'LO-SRSQ-6442',
            'slug' => 'sr-sq',
            'description' => 'Conçu avec une surface en tissu texturée, offrant un maximum de contrôle, ce La Onda SR place dans la gamme des tapis de souris Control, pour un ressenti unique, laissant une bonne liberté de mouvement, et un bon contrôle avec une friction permettant tout de même de bons flickshots grâce à son pouvoir d’arrêt. Il est également équipé de la base en PU signature La Onda, et de leur nouvelle technique de couture pour les bords, permettant un meilleur confort grâce à des coutures sous le tapis, ainsi que des bords rembourrés !',
            'short_description' => 'Un tapis de souris haut de gamme pour les gamers exigeants.',
            'price' => 54.90,
            'discount_price' => null,
            'cost_price' => 32.45,
            'stock' => 0,
            'brand_id' => $laOnda->id,
            'product_group_id' => $moldenEdgeGroup->id,
        ]);
        $sr->categories()->attach($categoryTapisDeSouris->id);
        ProductImage::factory(3)->create([
            'product_id' => $sr->id,
        ]);
        ProductImage::factory()->create([
            'product_id' => $sr->id,
            'is_featured' => true,
        ]);

        $qcw = Product::create([
            'name' => 'QCW SQ',
            'sku' => 'LO-QCWSQ-6442',
            'slug' => 'qcw-sq',
            'description' => 'Conçu avec une surface en tissu micro tissée balanced, mais laissant tout de même du contrôle, ce La Onda QCW se place entre un tapis de souris Balanced et un tapis de souris Control, pour un ressenti unique, laissant une très bonne liberté de mouvement, et un bon contrôle. Il est également équipé de la base en PU signature La Onda, et de leur nouvelle technique de couture pour les bords, permettant un meilleur confort grâce à des coutures sous le tapis, ainsi que des bords rembourrés !',
            'short_description' => 'Un tapis de souris haut de gamme pour les gamers exigeants.',
            'price' => 54.90,
            'discount_price' => 52.00,
            'cost_price' => 32.45,
            'stock' => 100,
            'brand_id' => $laOnda->id,
            'product_group_id' => $moldenEdgeGroup->id,
        ]);
        $qcw->categories()->attach($categoryTapisDeSouris->id);
        ProductImage::factory(3)->create([
            'product_id' => $qcw->id,
        ]);
        ProductImage::factory()->create([
            'product_id' => $qcw->id,
            'is_featured' => true,
        ]);

        $saturnProGroup = ProductGroup::factory()->create([
            'name' => 'Saturn Pro',
            'slug' => 'saturn-pro',
        ]);

        $saturnProSoftXlSquareRouge = Product::create([
            'name' => 'Saturn Pro Soft XL Square Rouge',
            'sku' => 'LO-SPXLSQ-3523',
            'slug' => 'saturn-pro-soft-xl-square-rouge',
            'description' => 'Le Saturn Pro est une amélioration du Saturn classique de chez Lethal Gaming Gear, tu y retrouveras une base Soft nouvelle génération te conférant un meilleur pouvoir d’arrêt sur ta souris lorsque que tu l’appuies sur le tapis, sans pour autant détériorer la glisse ! Tu y retrouveras bien sur la Base SlimFlex en PORON® japonais en caoutchouc qui empêchera ton tapis de bouger pendant tes sessions de jeu, et les bords extra fins qui ne te gèneront plus !',
            'short_description' => 'Un tapis de souris haut de gamme pour les gamers exigeants.',
            'price' => 64.90,
            'discount_price' => null,
            'cost_price' => 38.90,
            'stock' => 100,
            'brand_id' => $lethalGamingGear->id,
            'product_group_id' => $saturnProGroup->id,
        ]);
        $saturnProSoftXlSquareRouge->categories()->attach($categoryTapisDeSouris->id);
        ProductImage::factory(3)->create([
            'product_id' => $saturnProSoftXlSquareRouge->id,
        ]);
        ProductImage::factory()->create([
            'product_id' => $saturnProSoftXlSquareRouge->id,
            'is_featured' => true,
        ]);

        $saturnProSoftXlSquareNoir = Product::create([
            'name' => 'Saturn Pro Soft XL Square Noir',
            'sku' => 'LO-SPXLSQ-3524',
            'slug' => 'saturn-pro-soft-xl-square-noir',
            'description' => 'Le Saturn Pro est une amélioration du Saturn classique de chez Lethal Gaming Gear, tu y retrouveras une base Soft nouvelle génération te conférant un meilleur pouvoir d’arrêt sur ta souris lorsque que tu l’appuies sur le tapis, sans pour autant détériorer la glisse ! Tu y retrouveras bien sur la Base SlimFlex en PORON® japonais en caoutchouc qui empêchera ton tapis de bouger pendant tes sessions de jeu, et les bords extra fins qui ne te gèneront plus !',
            'short_description' => 'Un tapis de souris haut de gamme pour les gamers exigeants.',
            'price' => 64.90,
            'discount_price' => null,
            'cost_price' => 38.90,
            'stock' => 100,
            'brand_id' => $lethalGamingGear->id,
            'product_group_id' => $saturnProGroup->id,
        ]);
        $saturnProSoftXlSquareNoir->categories()->attach($categoryTapisDeSouris->id);
        ProductImage::factory(3)->create([
            'product_id' => $saturnProSoftXlSquareNoir->id,
        ]);
        ProductImage::factory()->create([
            'product_id' => $saturnProSoftXlSquareNoir->id,
            'is_featured' => true,
        ]);

        $jupiterProGroup = ProductGroup::factory()->create([
            'name' => 'Jupiter Pro',
            'slug' => 'jupiter-pro',
        ]);

        $jupiterProXSoftXlSquareNoir = Product::create([
            'name' => 'Jupiter Pro XSoft XL Square Noir',
            'sku' => 'LO-JPXLSQ-1234',
            'slug' => 'jupiter-pro-xsoft-xl-square-noir',
            'description' => 'Conçu pour un contrôle absolu des mouvements de ta souris, le LGG Jupiter Pro se compose d’une surface en tissu lisse et douce, ainsi que la base caractéristique des tapis LGG, et de bords cousus sous la surface confortables ! Ce tapis est conçu dans l’unique but de te permettre un contrôle total de ta souris lors de tes sessions de jeu, avec un tracking précis et d’un pouvoir d’arret assez important pour te permettre les micro ajustements nécessaires.',
            'short_description' => 'Le contrôle et le confort du tapis Jupiter de chez LGG, avec une base en Poron Slimflex XSoft et une surface en tissu lisse et douce conçue pour un contrôle absolu, et avec des bords cousus sous la surface confortables !',
            'price' => 64.90,
            'discount_price' => 54.90,
            'cost_price' => 38.90,
            'stock' => 100,
            'brand_id' => $lethalGamingGear->id,
            'product_group_id' => $jupiterProGroup->id,
        ]);
        $jupiterProXSoftXlSquareNoir->categories()->attach($categoryTapisDeSouris->id);
        ProductImage::factory(3)->create([
            'product_id' => $jupiterProXSoftXlSquareNoir->id,
        ]);
        ProductImage::factory()->create([
            'product_id' => $jupiterProXSoftXlSquareNoir->id,
            'is_featured' => true,
        ]);

        $jupiterProXSoftXlSquareRouge = Product::create([
            'name' => 'Jupiter Pro XSoft XL Square Rouge',
            'sku' => 'LO-JPXLSQ-1235',
            'slug' => 'jupiter-pro-xsoft-xl-square-rouge',
            'description' => 'Conçu pour un contrôle absolu des mouvements de ta souris, le LGG Jupiter Pro se compose d’une surface en tissu lisse et douce, ainsi que la base caractéristique des tapis LGG, et de bords cousus sous la surface confortables ! Ce tapis est conçu dans l’unique but de te permettre un contrôle total de ta souris lors de tes sessions de jeu, avec un tracking précis et d’un pouvoir d’arret assez important pour te permettre les micro ajustements nécessaires.',
            'short_description' => 'Le contrôle et le confort du tapis Jupiter de chez LGG, avec une base en Poron Slimflex XSoft et une surface en tissu lisse et douce conçue pour un contrôle absolu, et avec des bords cousus sous la surface confortables !',
            'price' => 64.90,
            'discount_price' => 54.90,
            'cost_price' => 38.90,
            'stock' => 100,
            'brand_id' => $lethalGamingGear->id,
            'product_group_id' => $jupiterProGroup->id,
        ]);
        $jupiterProXSoftXlSquareRouge->categories()->attach($categoryTapisDeSouris->id);
        ProductImage::factory(3)->create([
            'product_id' => $jupiterProXSoftXlSquareRouge->id,
        ]);
        ProductImage::factory()->create([
            'product_id' => $jupiterProXSoftXlSquareRouge->id,
            'is_featured' => true,
        ]);

        $type99Group = ProductGroup::factory()->create([
            'name' => 'TYPE 99',
            'slug' => 'type-99',
        ]);

        $type99noir = Product::create([
            'name' => 'TYPE-99 Soft XXL Noir',
            'sku' => 'LO-FX99-4567',
            'slug' => 'type-99-soft-xxl-noir',
            'description' => 'Si tu es fan de CS2, de Valorant ou de FPS en général, tu as sûrement déjà entendu parler des tapis de souris Artisan ! Marque Japonaise spécialisée dans les tapis de souris, Artisan a su se faire une place de choix dans l’écosystème esport notamment grâce à des gammes travaillées et complètes qui permettent à n’importe quel joueur d’opter pour le tapis qui lui convient. Que ce soit pour un tapis Speed, Control ou Hybrid, Artisan te donne un maximum de choix avec différentes bases (Mid, Soft et XSoft) et différentes tailles. Alors si tu veux suivre les pas de marteen, NiKo, w0nderful ou encore Less, les tapis de souris Artisan sont faits pour toi !',
            'short_description' => 'Le contrôle et le confort du tapis FX TYPE-99 de chez Artisan, en taille XXL, avec une base antidérapante (structure en ventouses) et une surface en polyester tricotée circulairement conçue pour un contrôle absolu, et avec des bords cousus sous la surface confortables !',
            'price' => 74.90,
            'discount_price' => null,
            'cost_price' => 44.90,
            'stock' => 32,
            'brand_id' => $artisanfx->id,
            'product_group_id' => $type99Group->id,
        ]);
        $type99noir->categories()->attach($categoryTapisDeSouris->id);
        ProductImage::factory(3)->create([
            'product_id' => $type99noir->id,
        ]);
        ProductImage::factory()->create([
            'product_id' => $type99noir->id,
            'is_featured' => true,
        ]);

        $type99matcha = Product::create([
            'name' => 'TYPE-99 Soft XXL Matcha',
            'sku' => 'LO-FX99-4568',
            'slug' => 'type-99-soft-xxl-matcha',
            'description' => 'Si tu es fan de CS2, de Valorant ou de FPS en général, tu as sûrement déjà entendu parler des tapis de souris Artisan ! Marque Japonaise spécialisée dans les tapis de souris, Artisan a su se faire une place de choix dans l’écosystème esport notamment grâce à des gammes travaillées et complètes qui permettent à n’importe quel joueur d’opter pour le tapis qui lui convient. Que ce soit pour un tapis Speed, Control ou Hybrid, Artisan te donne un maximum de choix avec différentes bases (Mid, Soft et XSoft) et différentes tailles. Alors si tu veux suivre les pas de marteen, NiKo, w0nderful ou encore Less, les tapis de souris Artisan sont faits pour toi !',
            'short_description' => 'Le contrôle et le confort du tapis FX TYPE-99 de chez Artisan, en taille XXL, avec une base antidérapante (structure en ventouses) et une surface en polyester tricotée circulairement conçue pour un contrôle absolu, et avec des bords cousus sous la surface confortables !',
            'price' => 74.90,
            'discount_price' => null,
            'cost_price' => 44.90,
            'stock' => 32,
            'brand_id' => $artisanfx->id,
            'product_group_id' => $type99Group->id,
        ]);
        $type99matcha->categories()->attach($categoryTapisDeSouris->id);
        ProductImage::factory(3)->create([
            'product_id' => $type99matcha->id,
        ]);
        ProductImage::factory()->create([
            'product_id' => $type99matcha->id,
            'is_featured' => true,
        ]);

        $type99gris = Product::create([
            'name' => 'TYPE-99 Soft XXL Gris',
            'sku' => 'LO-FX99-4569',
            'slug' => 'type-99-soft-xxl-gris',
            'description' => 'Si tu es fan de CS2, de Valorant ou de FPS en général, tu as sûrement déjà entendu parler des tapis de souris Artisan ! Marque Japonaise spécialisée dans les tapis de souris, Artisan a su se faire une place de choix dans l’écosystème esport notamment grâce à des gammes travaillées et complètes qui permettent à n’importe quel joueur d’opter pour le tapis qui lui convient. Que ce soit pour un tapis Speed, Control ou Hybrid, Artisan te donne un maximum de choix avec différentes bases (Mid, Soft et XSoft) et différentes tailles. Alors si tu veux suivre les pas de marteen, NiKo, w0nderful ou encore Less, les tapis de souris Artisan sont faits pour toi !',
            'short_description' => 'Le contrôle et le confort du tapis FX TYPE-99 de chez Artisan, en taille XXL, avec une base antidérapante (structure en ventouses) et une surface en polyester tricotée circulairement conçue pour un contrôle absolu, et avec des bords cousus sous la surface confortables !',
            'price' => 74.90,
            'discount_price' => null,
            'cost_price' => 44.90,
            'stock' => 32,
            'brand_id' => $artisanfx->id,
            'product_group_id' => $type99Group->id,
        ]);
        $type99gris->categories()->attach($categoryTapisDeSouris->id);
        ProductImage::factory(3)->create([
            'product_id' => $type99gris->id,
        ]);
        ProductImage::factory()->create([
            'product_id' => $type99gris->id,
            'is_featured' => true,
        ]);

        $categoryTapisDeSouris->products()->attach(Product::factory(37)->create([
            'brand_id' => fn() => Brand::inRandomOrder()->first()->id,
        ]));
    }
}
