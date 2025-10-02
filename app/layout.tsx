import "./globals.css";
import Link from "next/link"; // ← 追加

export const metadata = { title: "Yobubu | 北新地 料金シミュレーター" };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ja" className="h-full">
      <body className="min-h-screen">
        <nav className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="inline-block w-8 h-8 rounded-xl bg-white/20 backdrop-blur" />
            <span className="font-extrabold tracking-wide text-xl">Yobubu</span>
          </div>
          {/* ✅ Link を使う */}
          <Link href="/clubs" className="link-ghost">
            店舗一覧
          </Link>
        </nav>
        <main className="px-4">{children}</main>
        <footer className="mt-16 py-8 text-center text-white/70 text-xs">
          ※本サイトの料金は店舗公式HPの掲載内容をもとにした目安です。実際の会計はご利用店舗にてご確認ください。
        </footer>
      </body>
    </html>
  );
}

