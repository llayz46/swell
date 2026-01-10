<?php

namespace App\Http\Requests\Product;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Str;

abstract class BaseProductRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    protected function prepareForValidation(): void
    {
        $this->merge([
            'slug' => Str::slug($this->name),
        ]);
    }

    public function messages(): array
    {
        return [
            'name.required' => 'Oups ! N\'oubliez pas de donner un nom au produit.',
            'name.string' => 'Hmm, le nom doit être du texte.',
            'name.max' => 'Désolé, le nom est trop long (255 caractères maximum).',

            'sku.string' => 'Hmm, le SKU doit être du texte.',
            'sku.max' => 'Désolé, le SKU est trop long (100 caractères maximum).',
            'sku.unique' => 'Oups ! Ce SKU est déjà utilisé par un autre produit.',

            'slug.required' => 'Oups ! Le slug est requis.',
            'slug.string' => 'Hmm, le slug doit être du texte.',
            'slug.max' => 'Désolé, le slug est trop long (255 caractères maximum).',
            'slug.unique' => 'Oups ! Ce slug est déjà utilisé par un autre produit.',

            'description.required' => 'Oups ! La description est obligatoire.',
            'description.string' => 'Hmm, la description doit être du texte.',
            'description.min' => 'La description est un peu courte ! Elle doit comporter au moins 10 caractères.',
            'description.max' => 'Désolé, la description est trop longue (1000 caractères maximum).',

            'short_description.required' => 'Oups ! La description courte est obligatoire.',
            'short_description.string' => 'Hmm, la description courte doit être du texte.',
            'short_description.max' => 'Désolé, la description courte est trop longue (500 caractères maximum).',
            'short_description.min' => 'La description courte est un peu courte ! Elle doit comporter au moins 10 caractères.',

            'price.required' => 'Oups ! Le prix est obligatoire.',
            'price.numeric' => 'Hmm, le prix doit être un nombre.',
            'price.min' => 'Désolé, le prix doit être supérieur ou égal à 0.',

            'discount_price.numeric' => 'Hmm, le prix promotionnel doit être un nombre.',
            'discount_price.min' => 'Désolé, le prix promotionnel doit être supérieur ou égal à 0.',
            'discount_price.lt' => 'Oups ! Le prix promotionnel doit être inférieur au prix normal.',

            'cost_price.required' => 'Oups ! Le coût d\'achat est obligatoire.',
            'cost_price.numeric' => 'Hmm, le coût d\'achat doit être un nombre.',
            'cost_price.min' => 'Désolé, le coût d\'achat doit être supérieur ou égal à 0.',

            'stock.required' => 'Oups ! Le stock est obligatoire.',
            'stock.integer' => 'Hmm, le stock doit être un nombre entier.',
            'stock.min' => 'Désolé, le stock ne peut pas être négatif.',

            'reorder_level.required' => 'Oups ! Le niveau de réapprovisionnement est obligatoire.',
            'reorder_level.integer' => 'Hmm, le niveau de réapprovisionnement doit être un nombre entier.',
            'reorder_level.min' => 'Le niveau de réapprovisionnement doit être d\'au moins 5.',

            'status.required' => 'Oups ! Le statut est obligatoire.',
            'status.boolean' => 'Hmm, le statut doit être vrai ou faux.',

            'meta_title.string' => 'Hmm, le titre méta doit être du texte.',
            'meta_title.max' => 'Désolé, le titre méta est trop long (255 caractères maximum).',

            'meta_description.string' => 'Hmm, la description méta doit être du texte.',
            'meta_description.max' => 'Désolé, la description méta est trop longue (500 caractères maximum).',

            'meta_keywords.string' => 'Hmm, les mots-clés méta doivent être du texte.',
            'meta_keywords.max' => 'Désolé, les mots-clés méta sont trop longs (255 caractères maximum).',

            'images.array' => 'Hmm, les images doivent être un tableau.',
            'images.*.id.exists' => 'Désolé, l\'image sélectionnée est introuvable.',
            'images.*.image_file.file' => 'Oups ! Le fichier doit être un fichier valide.',
            'images.*.image_file.image' => 'Oups ! Le fichier doit être une image.',
            'images.*.image_file.max' => 'Hmm, l\'image est trop lourde ! Elle ne doit pas dépasser 2 Mo.',
            'images.*.alt_text.string' => 'Hmm, le texte alternatif doit être du texte.',
            'images.*.is_featured.required' => 'Oups ! Veuillez indiquer si l\'image est en vedette.',
            'images.*.is_featured.boolean' => 'Hmm, l\'indication vedette doit être vrai ou faux.',
            'images.*.order.integer' => 'Hmm, l\'ordre doit être un nombre entier.',
            'images.*.order.min' => 'L\'ordre doit être d\'au moins 1.',

            'brand_id.required' => 'Oups ! Veuillez sélectionner une marque.',
            'brand_id.exists' => 'Désolé, la marque sélectionnée est introuvable.',

            'category_id.required' => 'Oups ! Veuillez sélectionner une catégorie.',
            'category_id.exists' => 'Désolé, la catégorie sélectionnée est introuvable.',

            'collection_id.exists' => 'Désolé, la collection sélectionnée est introuvable.',

            'options.array' => 'Hmm, les options doivent être un tableau.',
            'options.*.name.string' => 'Hmm, le nom de l\'option doit être du texte.',
            'options.*.name.max' => 'Désolé, le nom de l\'option est trop long (255 caractères maximum).',
            'options.*.values.array' => 'Hmm, les valeurs de l\'option doivent être un tableau.',
            'options.*.values.*.value.string' => 'Hmm, chaque valeur doit être du texte.',
            'options.*.values.*.value.max' => 'Désolé, la valeur est trop longue (255 caractères maximum).',
        ];
    }

    protected function baseRules(): array
    {
        return [
            'name' => ['required', 'string', 'max:255'],
            'description' => ['required', 'string', 'min:10', 'max:1000'],
            'short_description' => ['required', 'string', 'max:500', 'min:10'],
            'price' => ['required', 'numeric', 'min:0'],
            'discount_price' => ['nullable', 'numeric', 'min:0', 'lt:price'],
            'cost_price' => ['required', 'numeric', 'min:0'],
            'stock' => ['required', 'integer', 'min:0'],
            'reorder_level' => ['required', 'integer', 'min:5'],
            'status' => ['required', 'boolean'],
            'meta_title' => ['nullable', 'string', 'max:255'],
            'meta_description' => ['nullable', 'string', 'max:500'],
            'meta_keywords' => ['nullable', 'string', 'max:255'],
            'images' => ['array'],
            'images.*.id' => ['nullable', 'exists:product_images,id'],
            'images.*.image_file' => ['nullable', 'file', 'image', 'max:2048'],
            'images.*.alt_text' => ['nullable', 'string'],
            'images.*.is_featured' => ['required', 'boolean'],
            'images.*.order' => ['nullable', 'integer', 'min:1'],
            'brand_id' => ['required', 'exists:brands,id'],
            'category_id' => ['required', 'exists:categories,id'],
            'collection_id' => ['nullable', 'exists:collections,id'],
            'options' => ['array'],
            'options.*.name' => ['nullable', 'string', 'max:255'],
            'options.*.values' => ['array'],
            'options.*.values.*.value' => ['string', 'max:255'],
        ];
    }
}