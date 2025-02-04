export const filters: Filter[] = [
  {
    id: "nutritionQuality",
    name: "Qualité nutritionnelle",
    slider: true,
    options: [
      { value: "nutrition_grades=not_important", label: "Pas important", checked: false, markValue: 0 },
      { value: "nutrition_grades=important", label: "Important", checked: false, markValue: 25 },
      { value: "nutrition_grades=very_important", label: "Très important", checked: false, markValue: 50 },
      { value: "nutrition_grades=mandatory", label: "Obligatoire", checked: false, markValue: 75 },
      { value: "nutrition_grades=good", label: "Bon Nutri-score", checked: false, markValue: 100 },
    ],
  },
  {
    id: "salt",
    name: "Sel en faible quantité",
    slider: true,
    options: [
      { value: "salt=not_important", label: "Pas important", checked: false, markValue: 0 },
      { value: "salt=important", label: "Important", checked: false, markValue: 33 },
      { value: "salt=very_important", label: "Très important", checked: false, markValue: 66 },
      { value: "salt=mandatory", label: "Obligatoire", checked: false, markValue: 100 },
    ],
  },
  {
    id: "sugars",
    name: "Sucres en faible quantité",
    slider: true,
    options: [
      { value: "sugars=not_important", label: "Pas important", checked: false, markValue: 0 },
      { value: "sugars=important", label: "Important", checked: false, markValue: 33 },
      { value: "sugars=very_important", label: "Très important", checked: false, markValue: 66 },
      { value: "sugars=mandatory", label: "Obligatoire", checked: false, markValue: 100 },
    ],
  },
  {
    id: "fats",
    name: "Matières grasses en faible quantité",
    slider: true,
    options: [
      { value: "fat=not_important", label: "Pas important", checked: false, markValue: 0 },
      { value: "fat=important", label: "Important", checked: false, markValue: 33 },
      { value: "fat=very_important", label: "Très important", checked: false, markValue: 66 },
      { value: "fat=mandatory", label: "Obligatoire", checked: false, markValue: 100 },
    ],
  },
  {
    id: "saturatedFats",
    name: "Acides gras saturés en faible quantité",
    slider: true,
    options: [
      { value: "saturated-fat=not_important", label: "Pas important", checked: false, markValue: 0 },
      { value: "saturated-fat=important", label: "Important", checked: false, markValue: 33 },
      { value: "saturated-fat=very_important", label: "Très important", checked: false, markValue: 66 },
      { value: "saturated-fat=mandatory", label: "Obligatoire", checked: false, markValue: 100 },
    ],
  },
  {
    id: "foodProcessing",
    name: "Transformation des aliments",
    slider: true,
    options: [
      { value: "nova_group=not_important", label: "Pas important", checked: false, markValue: 0 },
      { value: "nova_group=important", label: "Important", checked: false, markValue: 25 },
      { value: "nova_group=very_important", label: "Très important", checked: false, markValue: 50 },
      { value: "nova_group=mandatory", label: "Obligatoire", checked: false, markValue: 75 },
      { value: "nova_group=1", label: "Non transformé", checked: false, markValue: 100 },
    ],
  },
  {
    id: "additives",
    name: "Pas ou peu d'additifs",
    slider: true,
    options: [
      { value: "additives=without", label: "Pas important", checked: false, markValue: 0 },
      { value: "additives=important", label: "Important", checked: false, markValue: 33 },
      { value: "additives=very_important", label: "Très important", checked: false, markValue: 66 },
      { value: "additives=mandatory", label: "Obligatoire", checked: false, markValue: 100 },
    ],
  },
  {
    id: "allergens",
    name: "Allergènes",
    slider: false,
    options: [
      { value: "allergens=gluten_free", label: "Sans Gluten", checked: false },
      { value: "allergens=milk_free", label: "Sans Lait", checked: false },
      { value: "allergens=egg_free", label: "Sans Œufs", checked: false },
      { value: "allergens=nut_free", label: "Sans Fruits à coque", checked: false },
      { value: "allergens=peanut_free", label: "Sans Arachides", checked: false },
      { value: "allergens=sesame_free", label: "Sans Graines de sésame", checked: false },
      { value: "allergens=soy_free", label: "Sans Soja", checked: false },
      { value: "allergens=celery_free", label: "Sans Céleri", checked: false },
      { value: "allergens=mustard_free", label: "Sans Moutarde", checked: false },
      { value: "allergens=lupin_free", label: "Sans Lupin", checked: false },
      { value: "allergens=fish_free", label: "Sans Poisson", checked: false },
      { value: "allergens=crustacean_free", label: "Sans Crustacés", checked: false },
      { value: "allergens=mollusc_free", label: "Sans Mollusques", checked: false },
      { value: "allergens=sulfite_free", label: "Sans Anhydride sulfureux et sulfites", checked: false },
    ],
  },
  {
    id: "ingredients",
    name: "Ingrédients",
    slider: true,
    options: [
      { value: "ingredients_from_palm_oil=indifferent", label: "Indifférent", checked: false, markValue: 0 },
      { value: "ingredients_from_palm_oil=without", label: "Sans huile de palme", checked: false, markValue: 50 },
      { value: "ingredients_from_palm_oil=with", label: "Avec huile de palme", checked: false, markValue: 100 },
    ],
  },
  {
    id: "labels",
    name: "Labels",
    slider: false,
    options: [
      { value: "labels=organic", label: "Agriculture biologique", checked: false },
      { value: "labels=fair_trade", label: "Commerce équitable", checked: false },
    ],
  },
  {
    id: "environment",
    name: "Environnement",
    slider: false,
    options: [
      { value: "environment=low_impact", label: "Faible impact environnemental (Green-Score)", checked: false },
      { value: "environment=low_deforestation_risk", label: "Faible risque de déforestation (Empreinte forêt)", checked: false },
    ],
  },
];

export interface FilterOption {
  value: string;
  label: string;
  checked: boolean;
  markValue?: number;
}

export interface Filter {
  id: string;
  name: string;
  options: FilterOption[];
  slider?: boolean;
}

export const sortBy : Sort[] = [
  { value: "sort_by=unique_scans_n", label: "Produit les plus scannés" },
  { value: "sort_by=created_t", label: "Date de création" },
  { value: "sort_by=last_modified_t", label: "Date de modification" },
  { value: "sort_by=nutriscore_score", label: "Meilleur nutri-score" },
  { value: "sort_by=environmental_score", label: "Meilleur green-score" },
];

export interface Sort {
  value: string;
  label: string;
}