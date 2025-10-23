import packageJson from "../package.json"

const currentYear = new Date().getFullYear()

export const metaConfig = {
  name: "AtomicMeta Admin",
  version: packageJson.version,
  copyright: `© ${currentYear}, AtomicMeta Admin Panel.`,
  meta: {
    title: "AtomicMeta | Admin Panel",
    description:
      "AtomicMeta is a modern, open-source dashboard starter template built with Next.js 15, Tailwind CSS v4, and shadcn/ui. Perfect for SaaS apps, admin panels, and internal tools—fully customizable and production-ready.",
  },
};