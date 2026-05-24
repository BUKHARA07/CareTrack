import Link from "next/link";

export default function Footer() {
  return (
    <footer>
      <p>(R) MediCore 2026</p>
      <ul>
        <li>
          <Link href="/">Home</Link>
        </li>
        <li>
          <Link href="/sign-up">Sign up</Link>
        </li>
        <li>
          <Link href="/sign-in">Staff sign in</Link>
        </li>
      </ul>
    </footer>
  );
}

