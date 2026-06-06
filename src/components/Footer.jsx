// src/components/Footer.jsx
// Footer sederhana — Server Component, tidak butuh "use client".

export default function Footer() {
  return (
    <footer className="border-t border-gray-100 py-6 text-center text-sm text-gray-400">
      <p>
        © {new Date().getFullYear()} · Dibuat dengan{" "}
        <span className="text-orange-500 font-medium">Next.js</span> &{" "}
        <span className="text-orange-500 font-medium">Tailwind CSS</span>
      </p>
    </footer>
  );
}
