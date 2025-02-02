const css = String.raw;
import { type CatppuccinColors, flavors } from "@catppuccin/palette";
function generate(flavor: CatppuccinColors, className: "dark" | "light") {
	return css`
      .${className}-mode {
          --scalar-color-1: ${flavor.text.hex};
          --scalar-color-2: ${flavor.subtext0.hex};
          --scalar-color-3: ${flavor.subtext1.hex};
          --scalar-color-accent: ${flavor.mauve.hex};
          --scalar-background-1: ${flavor.base.hex};
          --scalar-background-2: ${flavor.mantle.hex};
          --scalar-background-3: ${flavor.crust.hex};
          --scalar-background-accent: ${flavor.mauve.hex};
          --scalar-border-color: ${flavor.surface1.hex};
          --scalar-color-green: ${flavor.green.hex};
          --scalar-color-red:  ${flavor.red.hex};
          --scalar-color-yellow: ${flavor.yellow.hex};
          --scalar-color-blue: ${flavor.blue.hex};
          --scalar-color-orange: ${flavor.peach.hex};
          --scalar-color-purple: ${flavor.lavender.hex};
          --scalar-selection-1: ${flavor.surface0.hex};
      }
    `;
}
export default css`
    ${generate(flavors.latte.colors, "light")}
    ${generate(flavors.mocha.colors, "dark")}
    .sidebar {
        --scalar-sidebar-background-1: var(--scalar-background-2);
        --scalar-sidebar-item-hover-background: var(--scalar-background-3);
        --scalar-sidebar-item-active-background: var(--scalar-selection-1);
    }
    .show-api-client-button {
        color: var(--scalar-color-1);
        background-color: var(--scalar-color-accent);
    }
  `;
