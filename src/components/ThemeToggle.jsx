function ThemeToggle({ theme, onToggle }) {
  return (
    <button className="theme-toggle" onClick={onToggle}>
      {theme === "dark" ? "Light" : "Dark"}
    </button>
  );
}

export default ThemeToggle;