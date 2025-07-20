<?php

namespace App\Http\Requests;

use App\Models\Product;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Str;
use Illuminate\Validation\Rule;

class ProductRequest extends FormRequest
{
    protected function prepareForValidation()
    {
        $this->merge([
            'slug' => Str::slug($this->name),
        ]);
    }

    public function rules(): array
    {
        return [
            'name' => ['required', 'string', 'max:255'],

            'slug' => ['required', 'string', 'max:255', Rule::unique(Product::class)->ignore($this->route('product')?->id)],

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

            'group_id' => ['nullable', 'exists:product_groups,id'],
        ];
    }

    public function messages()
    {
        return [
            'name.required' => 'Le nom du produit est obligatoire.',
            'name.string' => 'Le nom du produit doit être une chaîne de caractères.',
            'name.max' => 'Le nom du produit ne peut pas dépasser 255 caractères.',

            'slug.required' => 'Le slug du produit est obligatoire.',
            'slug.string' => 'Le slug du produit doit être une chaîne de caractères.',
            'slug.max' => 'Le slug du produit ne peut pas dépasser 255 caractères.',
            'slug.unique' => 'Ce slug est déjà utilisé par un autre produit.',

            'description.required' => 'La description du produit est obligatoire.',
            'description.string' => 'La description du produit doit être une chaîne de caractères.',
            'description.min' => 'La description du produit doit comporter au moins 10 caractères.',
            'description.max' => 'La description du produit ne peut pas dépasser 1000 caractères.',

            'short_description.required' => 'La description courte du produit est obligatoire.',
            'short_description.string' => 'La description courte du produit doit être une chaîne de caractères.',
            'short_description.max' => 'La description courte du produit ne peut pas dépasser 500 caractères.',
            'short_description.min' => 'La description courte du produit doit comporter au moins 10 caractères.',

            'price.required' => "Le prix du produit est obligatoire.",
            'price.numeric' => "Le prix du produit doit être un nombre.",
            'price.min' => "Le prix du produit doit être supérieur ou égal à 0.",

            'discount_price.numeric' => "Le prix promotionnel doit être un nombre.",
            'discount_price.min' => "Le prix promotionnel doit être supérieur ou égal à 0.",
            'discount_price.lt' => "Le prix promotionnel doit être inférieur au prix normal.",

            'cost_price.required' => "Le coût d'achat est obligatoire.",
            'cost_price.numeric' => "Le coût d'achat doit être un nombre.",
            'cost_price.min' => "Le coût d'achat doit être supérieur ou égal à 0.",

            'stock.required' => "Le stock est obligatoire.",
            'stock.integer' => "Le stock doit être un entier.",
            'stock.min' => "Le stock ne peut pas être négatif.",

            'reorder_level.required' => "Le niveau de réapprovisionnement est obligatoire.",
            'reorder_level.integer' => "Le niveau de réapprovisionnement doit être un entier.",
            'reorder_level.min' => "Le niveau de réapprovisionnement doit être supérieur ou égal à 5.",

            'status.required' => "Le statut du produit est obligatoire.",
            'status.boolean' => "Le statut du produit doit être vrai ou faux.",

            'meta_title.string' => "Le titre méta doit être une chaîne de caractères.",
            'meta_title.max' => "Le titre méta ne peut pas dépasser 255 caractères.",

            'meta_description.string' => "La description méta doit être une chaîne de caractères.",
            'meta_description.max' => "La description méta ne peut pas dépasser 500 caractères.",

            'meta_keywords.string' => "Les mots-clés méta doivent être une chaîne de caractères.",
            'meta_keywords.max' => "Les mots-clés méta ne peuvent pas dépasser 255 caractères.",

            'images.array' => 'Les images doivent être un tableau.',
            'images.*.id.exists' => 'L\'image sélectionnée n\'existe pas.',
            'images.*.image_file.file' => 'Le fichier de l\'image doit être un fichier.',
            'images.*.image_file.image' => 'Le fichier de l\'image doit être une image.',
            'images.*.image_file.max' => 'Le fichier de l\'image ne peut pas dépasser 2 Mo.',
            'images.*.image_file.mimes' => 'Le fichier de l\'image doit être au format jpg, jpeg, png, svg, gif ou webp.',
            'images.*.alt_text.string' => 'Le texte alternatif de l\'image doit être une chaîne de caractères.',
            'images.*.is_featured.required' => 'L\'indication de l\'image vedette est obligatoire.',
            'images.*.is_featured.boolean' => 'L\'indication de l\'image vedette doit être vrai ou faux.',
            'images.*.order.integer' => 'L\'ordre de l\'image doit être un entier.',
            'images.*.order.min' => 'L\'ordre de l\'image doit être supérieur ou égal à 1.',

            'brand_id.required' => 'La marque du produit est obligatoire.',
            'brand_id.exists' => 'La marque sélectionnée n\'existe pas.',

            'category_id.required' => 'La catégorie du produit est obligatoire.',
            'category_id.exists' => 'La catégorie sélectionnée n\'existe pas.',

            'group_id.exists' => 'Le groupe de produits sélectionné n\'existe pas.',
        ];
    }
}
