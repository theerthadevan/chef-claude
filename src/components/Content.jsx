import React from "react"
import ClaudeRecipe from "./ClaudeRecipe"
import IngredientsList from "./IngredientsList"
import LoadingBubble from "./LoadingBubble"
import { getRecipeFromAI } from "../ai"
import { motion, AnimatePresence } from "framer-motion";

export default function Content() {

    const [ingredients, setIngredients] = React.useState([])
    const [recipe, setRecipe] = React.useState("")
    const [isLoading, setIsLoading] = React.useState(false)

    function addIngredients(formData) {
        const newIngredient = formData.get("ingredient")
        setIngredients(prevIngredients => [...prevIngredients, newIngredient])
    }
    
    async function getRecipe() {
        setIsLoading(true)
        const recipeMarkdown = await getRecipeFromAI(ingredients);
        setIsLoading(false)
        
        if (recipeMarkdown && !recipeMarkdown.startsWith("Sorry") && !recipeMarkdown.startsWith("No")) {
            setRecipe(recipeMarkdown);
        } else {
            console.warn("Failed to generate a valid recipe:", recipeMarkdown);
        }
    }

    return (
        <main>
            <form action={addIngredients} className="add-ingredient-form">
                <input 
                type="text"
                placeholder="e.g. Tomato"
                aria-label="Add Ingredient"
                name="ingredient" />
                <button>Add Ingredient</button>
            </form>
        {ingredients.length > 0 && 
        <IngredientsList ingredients = {ingredients}  
        getRecipe ={getRecipe}/>}
        
        <AnimatePresence>
            {isLoading && (<motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{duration: 0.3}}>
                <LoadingBubble />
                </motion.div>)}
        </AnimatePresence>

        {recipe && !isLoading && <ClaudeRecipe recipe = {recipe} />}
        </main>
    )
}