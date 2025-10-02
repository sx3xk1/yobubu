"use client";

import { useParams } from "next/navigation";
import { useMemo, useState } from "react";
import { clubs, type Club } from "@/data/clubs";

type Cart = Record<string, number>;
const ceil100 = (n: number) => Math.ceil(n / 100) * 100;

// 親：存在チェックだけ（ここでは Hooks を使わない）
export default function Page() {
  const { id } = useParams<{ id: string }>();
  const club = (clubs as Club[]).find((c) => c.id === id);

  if (!club) {
    return <main className="max-w-3xl mx-auto p-6">店舗が見つかりません。</main>;
  }
  return <ClubSimulator club={club} />;
}

// 子：ここで Hooks を“常に”同じ順序で呼ぶ
function ClubSimulator({ club }: { club: Club }) {
  // 入力状態
  const [people, setPeople] = useState(3);
  const [hours, setHours] = useState(2);
  const [vip, setVip] = useState(false);
  const [nominate, setNominate] = useState(0);
  const [companion, setCompanion] = useState(0);

  // 注文（id -> qty）
  const [champagneCart, setChampagneCart] = useState<Cart>({});
  const [mixerCart, setMixerCart] = useState<Cart>({});
  const [girlsDrinkQty, setGirlsDrinkQty] = useState(0);

  // 便利関数
  const bump = (cart: Cart, id: string, delta: number) => {
    const next = { ...cart };
    next[id] = Math.max(0, (next[id] ?? 0) + delta);
    if (next[id] === 0) delete next[id];
    return next;
  };

  // 計算
  const result = useMemo(() => {
    const p = club.pricing;

    const setRate = vip && p.vipSet ? p.vipSet : p.set;
    const base = setRate * hours * people;

    const nominateAmt = p.nomination * Math.min(nominate, people) * hours;
    const companionAmt = p.companion * Math.max(0, companion);

    const sumCart = (cart: Cart, list: { id: string; name: string; price: number }[]) => {
      let total = 0;
      const lines: { label: string; amount: number }[] = [];
      for (const item of list) {
        const q = cart[item.id] ?? 0;
        if (!q) continue;
        const amt = item.price * q;
        total += amt;
        lines.push({ label: `${item.name} × ${q}`, amount: amt });
      }
      return { total, lines };
    };

    const ch = sumCart(champagneCart, club.menus.champagne);
    const mx = sumCart(mixerCart, club.menus.mixers);
    const girlsItem = club.menus.girlsDrink[0];
    const girlsAmt = girlsItem ? girlsItem.price * Math.max(0, girlsDrinkQty) : 0;

    const subtotal = base + nominateAmt + companionAmt + ch.total + mx.total + girlsAmt;
    const afterSvc = subtotal * (1 + p.serviceCharge);
    const serviceFee = afterSvc - subtotal;
    const afterTax = afterSvc * (1 + p.tax);
    const taxFee = afterTax - afterSvc;

    const total = ceil100(afterTax);
    const perPerson = ceil100(total / Math.max(1, people));

    const lines = [
      ...ch.lines,
      ...mx.lines,
      ...(girlsAmt ? [{ label: `${girlsItem!.name} × ${girlsDrinkQty}`, amount: girlsAmt }] : []),
    ];

    return {
      base,
      nominateAmt,
      companionAmt,
      drinkTotal: ch.total + mx.total + girlsAmt,
      lines,
      subtotal,
      serviceFee,
      taxFee,
      total,
      perPerson,
    };
  }, [club, vip, hours, people, nominate, companion, champagneCart, mixerCart, girlsDrinkQty]);

  return (
    <main className="max-w-6xl mx-auto p-6 grid gap-6 lg:grid-cols-5">
      {/* --- ここから下はあなたの元の JSX をそのまま --- */}
      <section className="lg:col-span-3 card p-6">
        <h1 className="text-2xl md:text-3xl font-extrabold">{club.name}</h1>
        <p className="text-white/70 text-sm">{club.area}</p>

        {/* 人数・時間・席種 */}
        <div className="mt-5 grid sm:grid-cols-2 gap-4">
          <div>
            <label className="text-sm text-white/80">人数</label>
            <div className="mt-2 flex flex-wrap gap-2">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((n) => (
                <button
                  key={n}
                  onClick={() => {
                    setPeople(n);
                    setNominate((v) => Math.min(v, n));
                  }}
                  className={`px-3 py-2 rounded-xl border ${
                    people === n ? "bg-white/20 border-white/40" : "bg-white/5 border-white/20 hover:bg-white/10"
                  }`}
                >
                  {n} 人
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-sm text-white/80">滞在時間</label>
            <div className="mt-2 flex flex-wrap gap-2">
              {[1, 1.5, 2, 2.5, 3, 4].map((h) => (
                <button
                  key={h}
                  onClick={() => setHours(h)}
                  className={`px-3 py-2 rounded-xl border ${
                    hours === h ? "bg-white/20 border-white/40" : "bg-white/5 border-white/20 hover:bg-white/10"
                  }`}
                >
                  {h} 時間
                </button>
              ))}
            </div>
            <p className="text-xs text-white/60 mt-1">
              セット：¥{club.pricing.set.toLocaleString()} / 60分（1人）
              {club.pricing.vipSet && <> ／ VIP：¥{club.pricing.vipSet.toLocaleString()} / 60分（1人）</>}
            </p>
          </div>

          {club.pricing.vipSet !== undefined && (
            <div>
              <label className="text-sm text-white/80">席種</label>
              <div className="mt-2 flex gap-2">
                <button
                  onClick={() => setVip(false)}
                  className={`px-3 py-2 rounded-xl border ${
                    !vip ? "bg-white/20 border-white/40" : "bg-white/5 border-white/20 hover:bg-white/10"
                  }`}
                >
                  フロア
                </button>
                <button
                  onClick={() => setVip(true)}
                  className={`px-3 py-2 rounded-xl border ${
                    vip ? "bg-white/20 border-white/40" : "bg-white/5 border-white/20 hover:bg-white/10"
                  }`}
                >
                  VIP
                </button>
              </div>
            </div>
          )}

          <div>
            <label className="text-sm text-white/80">指名する人数</label>
            <div className="mt-2 flex items-center gap-2">
              <button className="px-3 py-2 rounded-xl bg-white/10" onClick={() => setNominate((n) => Math.max(0, n - 1))}>
                −
              </button>
              <input
                className="w-20 text-center rounded bg-white/10 border border-white/20 px-2 py-2"
                type="number"
                min={0}
                max={people}
                value={nominate}
                onChange={(e) => setNominate(Math.min(people, Math.max(0, Number(e.target.value))))}
              />
              <button className="px-3 py-2 rounded-xl bg-white/10" onClick={() => setNominate((n) => Math.min(people, n + 1))}>
                ＋
              </button>
            </div>
            <p className="text-xs text-white/60 mt-1">¥{club.pricing.nomination.toLocaleString()} × 時間</p>
          </div>

          <div>
            <label className="text-sm text-white/80">同伴（回）</label>
            <div className="mt-2 flex items-center gap-2">
              <button className="px-3 py-2 rounded-xl bg-white/10" onClick={() => setCompanion((n) => Math.max(0, n - 1))}>
                −
              </button>
              <input
                className="w-20 text-center rounded bg-white/10 border border-white/20 px-2 py-2"
                type="number"
                min={0}
                max={10}
                value={companion}
                onChange={(e) => setCompanion(Math.max(0, Number(e.target.value)))}
              />
              <button className="px-3 py-2 rounded-xl bg-white/10" onClick={() => setCompanion((n) => n + 1)}>
                ＋
              </button>
            </div>
            <p className="text-xs text-white/60 mt-1">¥{club.pricing.companion.toLocaleString()} / 回</p>
          </div>
        </div>

        {/* シャンパン */}
        <div className="mt-6">
          <h3 className="font-semibold mb-2">シャンパン</h3>
          <div className="grid sm:grid-cols-2 gap-2">
            {club.menus.champagne.map((item) => (
              <div key={item.id} className="flex items-center justify-between px-3 py-2 rounded-xl border border-white/15 bg-white/5">
                <div className="text-sm">
                  <div>{item.name}</div>
                  <div className="text-xs text-white/60">¥{item.price.toLocaleString()} / 本</div>
                </div>
                <div className="flex items-center gap-2">
                  <button className="px-2 py-1 rounded bg-white/10" onClick={() => setChampagneCart((c) => bump(c, item.id, -1))}>
                    −
                  </button>
                  <input
                    className="w-14 text-center rounded bg-white/10 border border-white/20 px-2 py-1"
                    type="number"
                    min={0}
                    value={champagneCart[item.id] ?? 0}
                    onChange={(e) => setChampagneCart((c) => ({ ...c, [item.id]: Math.max(0, Number(e.target.value)) }))}
                  />
                  <button className="px-2 py-1 rounded bg-white/10" onClick={() => setChampagneCart((c) => bump(c, item.id, +1))}>
                    ＋
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 割りもの */}
        <div className="mt-6">
          <h3 className="font-semibold mb-2">割りもの（ピッチャー）</h3>
          <div className="grid sm:grid-cols-2 gap-2">
            {club.menus.mixers.map((item) => (
              <div key={item.id} className="flex items-center justify-between px-3 py-2 rounded-xl border border-white/15 bg-white/5">
                <div className="text-sm">
                  <div>{item.name}</div>
                  <div className="text-xs text-white/60">¥{item.price.toLocaleString()} / ピッチャー</div>
                </div>
                <div className="flex items-center gap-2">
                  <button className="px-2 py-1 rounded bg-white/10" onClick={() => setMixerCart((c) => bump(c, item.id, -1))}>
                    −
                  </button>
                  <input
                    className="w-14 text-center rounded bg-white/10 border border-white/20 px-2 py-1"
                    type="number"
                    min={0}
                    value={mixerCart[item.id] ?? 0}
                    onChange={(e) => setMixerCart((c) => ({ ...c, [item.id]: Math.max(0, Number(e.target.value)) }))}
                  />
                  <button className="px-2 py-1 rounded bg白/10" onClick={() => setMixerCart((c) => bump(c, item.id, +1))}>
                    ＋
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 女の子ドリンク */}
        <div className="mt-6">
          <h3 className="font-semibold mb-2">女の子ドリンク（1杯）</h3>
          <div className="flex items-center justify-between px-3 py-2 rounded-xl border border-white/15 bg-white/5">
            <div className="text-sm">
              <div>{club.menus.girlsDrink[0].name}</div>
              <div className="text-xs text白/60">¥{club.menus.girlsDrink[0].price.toLocaleString()} / 杯</div>
            </div>
            <div className="flex items-center gap-2">
              <button className="px-2 py-1 rounded bg白/10" onClick={() => setGirlsDrinkQty((q) => Math.max(0, q - 1))}>−</button>
              <input
                className="w-14 text-center rounded bg白/10 border border白/20 px-2 py-1"
                type="number"
                min={0}
                value={girlsDrinkQty}
                onChange={(e) => setGirlsDrinkQty(Math.max(0, Number(e.target.value)))}
              />
              <button className="px-2 py-1 rounded bg白/10" onClick={() => setGirlsDrinkQty((q) => q + 1)}>＋</button>
            </div>
          </div>
          <p className="text-xs text白/60 mt-1">例：指名1人＋ヘルプ2人に各1杯 → 数量3</p>
        </div>

        <p className="mt-4 text白/60 text-xs">※概算：サービス料→消費税の順に加算／100円単位で切り上げ。</p>
      </section>

      {/* 結果 */}
      <aside className="lg:col-span-2 card p-6 h-fit sticky top-6">
        <h2 className="text-lg font-semibold">見積もり結果</h2>

        <div className="mt-3 space-y-1 text-sm text白/85">
          <div>基本料金：¥{result.base.toLocaleString()}</div>
          {result.nominateAmt > 0 && <div>指名料：¥{result.nominateAmt.toLocaleString()}</div>}
          {result.companionAmt > 0 && <div>同伴：¥{result.companionAmt.toLocaleString()}</div>}
          <div>ドリンク小計：¥{result.drinkTotal.toLocaleString()}</div>
          {result.lines.map((l, i) => (
            <div key={i} className="text白/70">・{l.label} … ¥{l.amount.toLocaleString()}</div>
          ))}

          <div className="mt-2 text白/75">小計（サ・税抜）：¥{Math.round(result.subtotal).toLocaleString()}</div>
          <div className="text白/75">サービス料（{Math.round((club.pricing.serviceCharge ?? 0) * 100)}%）：¥{Math.round(result.serviceFee).toLocaleString()}</div>
          <div className="text白/75">消費税（{Math.round((club.pricing.tax ?? 0) * 100)}%）：¥{Math.round(result.taxFee).toLocaleString()}</div>
        </div>

        <div className="mt-4 p-4 rounded-xl border border白/20 bg-black/20">
          <div className="text-2xl font-extrabold">合計：¥{result.total.toLocaleString()}</div>
          <div className="text白/80 mt-1">お一人あたり：¥{result.perPerson.toLocaleString()}</div>
        </div>
      </aside>
    </main>
  );
}
