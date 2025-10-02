// app/clubs/page.tsx
import { clubs } from "@/data/clubs";

export default function ClubsPage() {
  return (
    <section className="max-w-5xl mx-auto mt-10 px-4">
      <h1 className="text-2xl font-bold mb-6">店舗一覧</h1>

      {clubs.length === 0 ? (
        <p className="text-white/70">まだ店舗が登録されていません。</p>
      ) : (
        <div className="grid gap-5 sm:grid-cols-2">
          {clubs.map((c) => (
            <a
              key={c.id}
              href={`/clubs/${c.id}`} // ← 次のステップで詳細ページを作ります
              className="card p-5 block hover:bg-white/20 transition"
            >
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold">{c.name}</h2>
                <span className="text-[10px] px-2 py-1 rounded-full bg-black/30 border border-white/10">
                  {c.area}
                </span>
              </div>
              <p className="text-white/70 text-sm mt-2">タップして見積もりへ</p>
            </a>
          ))}
        </div>
      )}
    </section>
  );
}
