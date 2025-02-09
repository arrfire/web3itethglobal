import plugin from 'tailwindcss/plugin';
import type { PluginAPI } from "tailwindcss/types/config";

const animations = plugin(function ({
  matchUtilities, theme,
}: { matchUtilities: PluginAPI['matchUtilities'], theme: PluginAPI['theme'] }) {
  matchUtilities({
    "animation-delay": (value: string) => {
      return {
        animationDelay: value,
      };
    },
  }, {
    values: theme('animationDelay'),
  });
})

module.exports = animations;
