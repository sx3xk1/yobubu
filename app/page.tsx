export default function Home() {
  return (
    <section className="max-w-5xl mx-auto mt-16 px-6">
      <div className="grid grid-cols-1 gap-8 items-center">
        <div className="card p-10 text-center bg-white/10 rounded-2xl shadow-xl">
          <h1 className="text-4xl font-extrabold leading-tight text-white mb-4">
            キャバクラの “だいたい”、ここで一発。
          </h1>
          <p className="text-white/80 mb-6">
            人数・時間・指名・ボトル…合計いくら？  
            Yobubuは公式情報をもとに、総額と１人あたりを即シミュレーションします。
          </p>
          <div className="flex gap-4 justify-center">
            <a href="/clubs" className="button-primary">店舗を選ぶ</a>
            <a href="#how" className="link-ghost">使い方</a>
          </div>
        </div>

        <div className="card p-8">
          <ul className="space-y-3 text-white/90 text-base">
            <li>・公式HPベース／出典と最終確認日を明示</li>
            <li>・サービス料→消費税の順で計算</li>
            <li>・週末加算・ハッピーアワー対応</li>
            <li>・お一人あたりは100円単位で切上げ</li>
          </ul>
          <p className="mt-4 text-white/60 text-xs">
            ※店舗や日により実額は異なる場合があります。
          </p>
        </div>
      </div>

      <section id="how" className="mt-14">
        <h2 className="text-2xl font-bold text-white mb-6">使い方</h2>
        <ol className="list-decimal text-white/80 space-y-2 text-base pl-6">
          <li>店舗を選ぶ</li>
          <li>人数と滞在時間、指名とボトルを選択</li>
          <li>総額と１人あたりが表示（PDF保存は後日対応）</li>
        </ol>
      </section>
    </section>
  );
}
