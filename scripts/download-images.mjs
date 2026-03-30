import { writeFile, access } from "node:fs/promises";
import { join, basename } from "node:path";

const DEST = decodeURIComponent(new URL("../public/images/", import.meta.url).pathname);
const CONCURRENCY = 4;

const urls = [
  "https://www.tactisens.com/wp-content/themes/tactisens/assets/images/france.png",
  "https://www.tactisens.com/wp-content/uploads/2023/05/5AFA77DC-E9C0-47D0-8700-329B94CE61A7.png",
  "https://www.tactisens.com/wp-content/uploads/2023/05/IMG_4213-scaled.jpg",
  "https://www.tactisens.com/wp-content/uploads/2023/05/IMG_4284-1024x768.jpg",
  "https://www.tactisens.com/wp-content/uploads/2023/05/IMG_4287-scaled.jpg",
  "https://www.tactisens.com/wp-content/uploads/2023/05/IMG_4348-1024x768.jpg",
  "https://www.tactisens.com/wp-content/uploads/2023/05/escape-game-toulouse-centre-ville.webp",
  "https://www.tactisens.com/wp-content/uploads/2023/05/escape-game-toulouse-original-sensoriel.webp",
  "https://www.tactisens.com/wp-content/uploads/2023/05/escape-game-toulouse-theme-scientifique.webp",
  "https://www.tactisens.com/wp-content/uploads/2023/05/tarrif-windar-theory.svg",
  "https://www.tactisens.com/wp-content/uploads/2023/05/true.svg",
  "https://www.tactisens.com/wp-content/uploads/2023/06/1060140731-sd.mov",
  "https://www.tactisens.com/wp-content/uploads/2023/11/escape-game-toulouse-20-minutes.webp",
  "https://www.tactisens.com/wp-content/uploads/2023/11/escape-game-toulouse-actu-touiouse.webp",
  "https://www.tactisens.com/wp-content/uploads/2023/11/escape-game-toulouse-aventure-sensorielle.webp",
  "https://www.tactisens.com/wp-content/uploads/2023/11/escape-game-toulouse-centre.webp",
  "https://www.tactisens.com/wp-content/uploads/2023/11/escape-game-toulouse-entreprise.webp",
  "https://www.tactisens.com/wp-content/uploads/2023/11/escape-game-toulouse-evjf.webp",
  "https://www.tactisens.com/wp-content/uploads/2023/11/escape-game-toulouse-fr3-occitanie.webp",
  "https://www.tactisens.com/wp-content/uploads/2023/11/escape-game-toulouse-france-bleu-occitanie.webp",
  "https://www.tactisens.com/wp-content/uploads/2023/11/escape-game-toulouse-institution.webp",
  "https://www.tactisens.com/wp-content/uploads/2023/11/escape-game-toulouse-la-depeche-du-midi.webp",
  "https://www.tactisens.com/wp-content/uploads/2023/11/escape-game-toulouse-le-bonbon.webp",
  "https://www.tactisens.com/wp-content/uploads/2023/11/escape-game-toulouse-le-journal-toulousain.webp",
  "https://www.tactisens.com/wp-content/uploads/2023/11/escape-game-toulouse-le-parisien.webp",
  "https://www.tactisens.com/wp-content/uploads/2023/11/escape-game-toulouse-opinion-independante.webp",
  "https://www.tactisens.com/wp-content/uploads/2023/11/escape-game-toulouse-particuliers.webp",
  "https://www.tactisens.com/wp-content/uploads/2023/11/escape-game-toulouse-sens.webp",
  "https://www.tactisens.com/wp-content/uploads/2023/11/escape-game-toulouse-tactisens-01.webp",
  "https://www.tactisens.com/wp-content/uploads/2023/11/escape-game-toulouse-tactisens-02.webp",
  "https://www.tactisens.com/wp-content/uploads/2023/11/escape-game-toulouse-tactisens-03.webp",
  "https://www.tactisens.com/wp-content/uploads/2023/11/escape-game-toulouse-tactisens-04.webp",
  "https://www.tactisens.com/wp-content/uploads/2023/11/escape-game-toulouse-tactisens-05.webp",
  "https://www.tactisens.com/wp-content/uploads/2023/11/escape-game-toulouse-tactisens-07.webp",
  "https://www.tactisens.com/wp-content/uploads/2023/11/escape-game-toulouse-tactisens-09.webp",
  "https://www.tactisens.com/wp-content/uploads/2023/11/escape-game-toulouse-tactisens-14.webp",
  "https://www.tactisens.com/wp-content/uploads/2023/11/escape-game-toulouse-tactisens-15.webp",
  "https://www.tactisens.com/wp-content/uploads/2023/11/escape-game-toulouse-tactisens-16.webp",
  "https://www.tactisens.com/wp-content/uploads/2023/11/escape-game-toulouse-tactisens-17.webp",
  "https://www.tactisens.com/wp-content/uploads/2023/11/escape-game-toulouse-tactisens-18.webp",
  "https://www.tactisens.com/wp-content/uploads/2023/11/escape-game-toulouse-tactisens-19.webp",
  "https://www.tactisens.com/wp-content/uploads/2023/11/escape-game-toulouse-tactisens-31.webp",
  "https://www.tactisens.com/wp-content/uploads/2023/11/escape-game-toulouse-tactisens-plan-contact.webp",
  "https://www.tactisens.com/wp-content/uploads/2023/11/escape-game-toulouse-tactisens.webp",
  "https://www.tactisens.com/wp-content/uploads/2023/11/escape-game-toulouse-team-building.webp",
  "https://www.tactisens.com/wp-content/uploads/2023/11/escape-game-toulouse-the-bunker.webp",
  "https://www.tactisens.com/wp-content/uploads/2023/11/escape-game-toulouse-viaoccitanie.webp",
  "https://www.tactisens.com/wp-content/uploads/2023/11/escape-room-toulouse-centre-ville.webp",
  "https://www.tactisens.com/wp-content/uploads/2023/11/tactisens-facebook.webp",
  "https://www.tactisens.com/wp-content/uploads/2023/11/tactisens-google.webp",
  "https://www.tactisens.com/wp-content/uploads/2023/11/tactisens-tripadvisor.webp",
  "https://www.tactisens.com/wp-content/uploads/2023/11/toulouse-escape-game-sensoriel.webp",
  "https://www.tactisens.com/wp-content/uploads/2023/12/escape-game-toulouse-tactisens-31-bis.webp",
  "https://www.tactisens.com/wp-content/uploads/2025/03/activite-cohesion-entreprise-toulouse.webp",
  "https://www.tactisens.com/wp-content/uploads/2025/03/cohesion-equipe-toulouse-escape-game.webp",
  "https://www.tactisens.com/wp-content/uploads/2025/03/cohesion-salarie-activite-toulouse.webp",
  "https://www.tactisens.com/wp-content/uploads/2025/03/escape-game-evenement-entreprise-toulouse.webp",
  "https://www.tactisens.com/wp-content/uploads/2025/03/escape-game-grand-groupe-toulouse-1.webp",
  "https://www.tactisens.com/wp-content/uploads/2025/03/escape-game-toulouse-entreprises.webp",
  "https://www.tactisens.com/wp-content/uploads/2025/03/evenement-entreprise-toulouse-centre-escape.webp",
  "https://www.tactisens.com/wp-content/uploads/2025/03/sortie-scolaire-toulouse-insolite-ludique.webp",
  "https://www.tactisens.com/wp-content/uploads/2025/03/team-building-activite-toulouse-centre.webp",
  "https://www.tactisens.com/wp-content/uploads/2025/03/team-building-insolite-toulouse-centre.webp",
  "https://www.tactisens.com/wp-content/uploads/2025/03/team-building-original-escape-game.webp",
  "https://www.tactisens.com/wp-content/uploads/2025/04/Design-sans-titre.webp",
  // 2025/04 version renamed to avoid conflict with 2025/03 version
  { url: "https://www.tactisens.com/wp-content/uploads/2025/04/escape-game-toulouse-entreprises.webp", filename: "escape-game-toulouse-entreprises-2.webp" },
  "https://www.tactisens.com/wp-content/uploads/2025/09/A3B885B0-9EBB-4E84-AD8E-EE95A10C0280-3.jpg",
  "https://www.tactisens.com/wp-content/uploads/2025/09/Laventure-sensorielle-Escape-game-a-Toulouse.png",
  "https://www.tactisens.com/wp-content/uploads/2025/09/The-Bunker-Escape-game-a-Toulouse.png",
];

async function fileExists(path) {
  try {
    await access(path);
    return true;
  } catch {
    return false;
  }
}

async function download(entry) {
  const url = typeof entry === "string" ? entry : entry.url;
  const filename = typeof entry === "string" ? basename(new URL(url).pathname) : entry.filename;
  const dest = join(DEST, filename);

  if (await fileExists(dest)) {
    console.log(`SKIP (exists): ${filename}`);
    return;
  }

  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const buffer = Buffer.from(await res.arrayBuffer());
    await writeFile(dest, buffer);
    console.log(`OK: ${filename} (${(buffer.length / 1024).toFixed(0)} KB)`);
  } catch (err) {
    console.error(`FAIL: ${filename} — ${err.message}`);
  }
}

// Run with concurrency limit
async function run() {
  const queue = [...urls];
  let active = 0;
  let resolve;
  const done = new Promise((r) => (resolve = r));

  function next() {
    while (active < CONCURRENCY && queue.length > 0) {
      active++;
      const url = queue.shift();
      download(url).then(() => {
        active--;
        if (queue.length === 0 && active === 0) resolve();
        else next();
      });
    }
  }

  next();
  if (urls.length > 0) await done;
  console.log(`\nDone. ${urls.length} URLs processed.`);
}

run();
