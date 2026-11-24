const paths: Record<string, string> = {
  brand: 'M4 18h16M8 14l4-8 4 8M9.5 11h5',
  home: 'M3.5 10.5 12 4l8.5 6.5v8a1 1 0 0 1-1 1h-15a1 1 0 0 1-1-1zM9 19.5v-6h6v6',
  applications:
    'M7 3.5h7l4 4v12a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1v-15a1 1 0 0 1 1-1zM14 3.5v4h4M9 12h6M9 16h6',
  review: 'M6 5h12v15H6zM9 5V3h6v2m-6 8 2 2 4-4',
  funding: 'M10.5 4a6.5 6.5 0 1 0 0 13 6.5 6.5 0 0 0 0-13zm5 11.5 4.5 4.5',
  knowledge:
    'M12 6.5C9.5 4.5 6.5 4 3.5 5v13c3-1 6-.5 8.5 1.5 2.5-2 5.5-2.5 8.5-1.5V5c-3-1-6-.5-8.5 1.5zm0 0v13',
  automation: 'M4 7h16M4 12h16M4 17h16M8 5v4m8 1v4m-6 1v4',
  skills: 'M12 3v4m0 10v4M3 12h4m10 0h4M8.5 8.5l7 7m0-7-7 7',
  arrow: 'M4 12h15m-6-6 6 6-6 6',
}

export function WorkspaceIcon({ name }: { name: string }) {
  return (
    <svg
      aria-hidden="true"
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d={paths[name]} />
    </svg>
  )
}
