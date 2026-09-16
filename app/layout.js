export const metadata = {
  title: 'Todo List — Next.js',
  description: 'A simple, fast todo list app built with Next.js',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
