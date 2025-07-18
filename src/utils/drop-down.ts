const dropdown = document.querySelector(".dropdown-toggle") as HTMLElement | null;
const dropSvg = document.querySelector(".dropdownsvg") as HTMLElement | null;

if (dropdown) {
	dropdown.addEventListener("click", () => {
		dropdown.classList.toggle("active");
	});
}

// Generate random color and apply to CSS variable
const randomColor = "#" + ((Math.random() * 0xffffff) << 0).toString(16).padStart(6, "0");
document.documentElement.style.setProperty("--main-bg-color", randomColor);
