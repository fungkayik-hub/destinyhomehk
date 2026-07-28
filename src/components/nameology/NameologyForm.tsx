import { apprenticeCopy } from "@/lib/apprentice-copy";

interface Props {
  surname: string;
  givenName: string;
  error?: string | null;
}

export default function NameologyForm({ surname, givenName, error }: Props) {
  const copy = apprenticeCopy;

  return (
    <div className="max-w-5xl mx-auto font-sans">
      <form method="GET" action="/nameology" className="card mb-8">
        <h2 className="font-display text-xl font-bold mb-2">{copy.nameologyName}</h2>
        <p className="text-sm text-destiny-purple/60 mb-6">{copy.nameologyFormHint}</p>

        <div className="grid sm:grid-cols-2 gap-4 mb-6">
          <label className="block">
            <span className="text-sm text-destiny-purple/70 mb-1 block">姓氏</span>
            <input
              type="text"
              name="surname"
              required
              maxLength={4}
              autoComplete="family-name"
              placeholder="例如：陳 / 歐陽"
              defaultValue={surname}
              className="w-full border border-destiny-purple/20 rounded-lg px-3 py-2"
            />
            <p className="text-xs text-destiny-purple/45 mt-1">1–2 字；複姓請一齊填</p>
          </label>

          <label className="block">
            <span className="text-sm text-destiny-purple/70 mb-1 block">名字</span>
            <input
              type="text"
              name="given"
              required
              maxLength={6}
              autoComplete="given-name"
              placeholder="例如：大文 / 美玲"
              defaultValue={givenName}
              className="w-full border border-destiny-purple/20 rounded-lg px-3 py-2"
            />
            <p className="text-xs text-destiny-purple/45 mt-1">1–3 字；支援簡繁體</p>
          </label>
        </div>

        <button type="submit" className="btn-primary w-full sm:w-auto">
          {copy.nameologySubmit}
        </button>

        {error && <p className="text-sm text-destiny-red mt-4">{error}</p>}

        <p className="text-xs text-destiny-purple/50 mt-4">{copy.nameologyFormFooter}</p>
      </form>
    </div>
  );
}
