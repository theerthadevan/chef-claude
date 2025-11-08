import chefClaudeImg from "../assets/chef-claude-icon.png"

export default function Header() {
    return(
        <>
        <header>
            <img src={chefClaudeImg} alt="Chef Claude Icon" />
            <h1>Chef Claude</h1>
        </header>
        </>
    )
}