export default function Content() {
    return (
        <main>
            <form className="add-ingredient-form">
                <input 
                type="text"
                placeholder="eg. Tomato"
                aria-label="Add Ingredient" />
                <button>Add Ingredient</button>
            </form>
        </main>
    )
}