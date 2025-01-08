"use client"
import { ScrollArea } from "@radix-ui/themes";
import { useEffect, useState } from "react";
import { Category } from "@/entities/Category";
import { categoryService } from "@/services/categoryService";
import CategoryComponent from "../CategoryComponentProps/CategoryComponentProps";


interface CategoriesProps {
    onSelectedCategory: (categoryId: number | null) => void;
   
}

export default function Categories({onSelectedCategory}: CategoriesProps) {

    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [selectedCategory, setSelectedCategory] = useState<number | null>(1);

    useEffect(() => {
        async function fetchCategories() {
            try {
                const fetchedCategories = await categoryService.fetchCategories();
                setCategories(fetchedCategories);
            } catch (error) {
                console.error("Erro ao buscar categorias:", error);
            } finally {
                setLoading(false);
            }
        }

        fetchCategories();
    }, []);

    if (loading) {
        return <p>Carregando categorias...</p>;
    }





    const handleCategoryClick = (categoryId: number | null) => {
        setSelectedCategory(categoryId)
        onSelectedCategory(categoryId)
    };





    return (
        <div className="w-full h-32 flex items-center px-2">
            <ScrollArea
                scrollbars="horizontal"
                className="w-full h-full py-4"

            >
                <div className="flex gap-4">
                    {categories.map((category) => (
                        <CategoryComponent
                        key={category.id}
                        name={category.name}
                        icon={category.icon}
                        isSelected={selectedCategory === category.id} 
                        onClick={() => handleCategoryClick(Number(category.id))}
                    />
                    ))}
                </div>
            </ScrollArea>
        </div>
    );
}