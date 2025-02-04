export interface Ingredient {
  ciqual_food_code: string;
  ecobalyse_code: string;
  id: string;
  is_in_taxonomy: number;
  percent_estimate: number;
  percent_max: number;
  percent_min: number;
  text: string;
  vegan: string;
  vegetarian: string;
}

export interface NutriscoreComponent {
  id: string;
  points: number;
  points_max: number;
  unit: string;
  value: number | null;
}

export interface Nutriscore {
  year: string;
  nutriscore: {
    components: {
      negative: NutriscoreComponent[];
      positive: NutriscoreComponent[];
    };
    count_proteins: number;
    count_proteins_reason: string;
    grade: string;
    is_beverage: number;
    is_cheese: number;
    is_fat_oil_nuts_seeds: number;
    is_red_meat_product: number;
    is_water: string;
    negative_points: number;
    negative_points_max: number;
    positive_nutrients: string[];
    positive_points: number;
    positive_points_max: number;
    score: number;
  };
}

export interface Nutrients {
    'energy-kcal_100g': string | number;
    'fat_100g': string | number;
    'saturated-fat_100g': string | number;
    'carbohydrates_100g': string | number;
    'sugars_100g': string | number;
    'proteins_100g': string | number;
    'salt_100g': string | number;
}

export interface Product {
  id: string;
  brands: string;
  origins: string;
  quantity: string;
  generic_name: string;
  ingredients: Ingredient[];
  allergens: string;
  labels: string;
  nutriscore: Nutriscore;
  nutriments: Nutrients;
  nutrient_levels: { [key: string]: any };
  img: {
    front: string;
    ingredients: string;
    nutrition: string;
  };
}

export interface UserDrawerProps {
  isOpen: boolean;
  mode: "show" | "update" | "create";
  user: User | null;
  onClose: () => void;
  onUpdate: (id: number, data: Partial<User>) => void;
  onCreate: (data: Partial<User>) => void;
}

export interface User {
  id: number;
  first_name?: string;
  last_name?: string;
  email: string;
  phone?: string;
  address?: string;
  zip_code?: string;
  country?: string;
  city?: string;
  role_id: number;
  createdAt: string;
  updatedAt: string;
  password?: string;
}

export interface StockItem {
  id: number;
  created_at: string;
  updated_at: string;
  productId: string;
  quantity: number;
  product: Product;
}

export interface Order {
  id: number;
  user_id: number;
  order_items: OrderItem[];
  total_amount: number;
  status: string;
  createdAt: string;
  updatedAt: string;
}

export interface Invoice {
  id: number;
  order_id: number;
  billing_address: string;
  payment_method: string;
  payment_status: string;
  order: Order;
  cp : String;
}

export interface OrderItem {
  id: number;
  order_id: number;
  product_id: number;
  quantity: number;
}

  export interface ProductModalProps {
    product: Product;
    open: boolean;
    setOpen: (open: boolean) => void;
    handleAddProduct: (e: React.MouseEvent, product: Product,quantity : number,price:number|null) => void;
  }

export interface SearchChangeEvent extends React.ChangeEvent<HTMLInputElement> {}
