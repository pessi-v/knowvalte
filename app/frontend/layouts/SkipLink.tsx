export default function SkipLink() {
  return (
    <a
      href="#main"
      className="sr-only rounded-md bg-background px-4 py-2 text-foreground shadow focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-50"
    >
      Skip to content
    </a>
  )
}
