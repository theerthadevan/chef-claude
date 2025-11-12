export async function getRecipeFromAI(ingredientsArr) {
  if (!Array.isArray(ingredientsArr) || ingredientsArr.length === 0) {
    console.warn("No ingredients provided to getRecipeFromAI().");
    return "Please enter at least one ingredient.";
  }

  try {
    const response = await fetch("http://localhost:5000/api/recipe", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ingredients: ingredientsArr })
    });
    if (!response.ok) {
      console.error(`Backend error: ${response.status} ${response.statusText}`);
      return "There was an issue generating your recipe. Please try again.";
    }

    const data = await response.json();

    if (data?.recipe && data.recipe.trim() !== "") {
      return data.recipe;
    } else {
      return "No recipe returned from the AI model.";
    }

  } catch (err) {
    return "Sorry, I couldn’t generate a recipe right now. Please try again later.";
  }
}
