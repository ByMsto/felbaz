const http = require('http');
const fs = require('fs');
const path = require('path');
const { Server } = require('socket.io');

const PORT = process.env.PORT || 3000;

const server = http.createServer((req, res) => {
  let filePath = path.join(__dirname, 'public', req.url === '/' ? 'index.html' : req.url);
  const ext = path.extname(filePath);
  const mime = { '.html': 'text/html', '.js': 'application/javascript', '.css': 'text/css' };
  fs.readFile(filePath, (err, data) => {
    if (err) {
      // Try index.html for SPA routing
      fs.readFile(path.join(__dirname, 'public', 'index.html'), (e2, d2) => {
        res.writeHead(e2 ? 404 : 200, { 'Content-Type': 'text/html' });
        res.end(e2 ? '404' : d2);
      });
    } else {
      res.writeHead(200, { 'Content-Type': mime[ext] || 'text/plain' });
      res.end(data);
    }
  });
});

const io = new Server(server, { cors: { origin: '*' } });

const CATEGORIES = {
  "🍽️ خواردن": {
    words: ["دۆلمە","کباب","بریانی","قورمە","شوربا","نان","ماست","کەشک","پیاز","تووم","بەیز","سەماق","زەیتوون","ئەنجیر","خرما","بادەمجان","گۆشت","مریشک","قاووت","شیر","پەنیر","عەسەل","بەرزە","هەلیم","رەشتە","بیرینج","فستق","گۆز","باقڵا","کەرەفس","گەنجینە","حەلوا","کلێچە","سامبووسە","کچکلانە"],
    impostorWords: ["پیتزا","بەرگەر","سووشی","تاکۆ","پاستا","ڕیزۆتۆ","ستێیک","ساملسا","بوریتۆ","ناچۆ"]
  },
  "🏙️ شارەکان": {
    words: ["هەولێر","سلێمانی","دهۆک","کەرکووک","زاخۆ","ئەقرێ","ڕانیە","شارەزووڕ","پەنجوین","ئامەدی","سنە","مەریوان","بانە","موسڵ","بغداد","بەصرە","کەلار","خانەقین","حەلەبجە","شنگال","پیرانشار","قەلادزێ","سێروان","کۆیە","چومان","ڕووداو","دربەندیخان","خۆشاو"],
    impostorWords: ["لەندەن","پاریس","تۆکیۆ","دوبەی","ئیستانبول","بەرلین","نیویۆرک","مۆسکۆ","سیدنی","شانگهای"]
  },
  "🌿 سروشت": {
    words: ["کوێستان","ڕووبار","جەنگەڵ","دەریا","هەور","باران","بەرف","گرد","تاڵ","بلووت","گیا","گوڵ","ئاو","باد","خۆر","مانگ","ستێرە","زەوی","گەرمی","ساردی","گریژ","ئاگر","لووتکە","دۆڵ","بەهار","پایز","زستان","هاوین","چیا","زەمین","شیلان","دەشت"],
    impostorWords: ["مەریخ","زەڵزەلە","قاسیف","تووند","شەپۆل","ووتانامی","تووفان","ئاگرفشان"]
  },
  "🎭 کەلتوور": {
    words: ["نەورۆز","هەلپەرکی","داف","بزووق","شاعیر","کتێب","فیلم","موسیقا","سەماع","دیوان","قەلا","شایی","تیاتر","مووزیخانە","خانی","مەم","زین","بێژە","ئەفسانە","سترا","گۆرانی","دوبیتی","ئاهەنگ","جلوبەرگ","شال","کۆیلەک","پاشمینە"],
    impostorWords: ["باڵێ","ڕۆك","جاز","هیپهۆپ","ئۆپەرا","باڵیتۆ","سیرک","مانگا","ئانیمە"]
  },
  "⚽ وەرزش": {
    words: ["فوتبۆل","کوشتی","ئەسپسواری","تەختەلووبان","بۆکس","شنا","ڕاکردن","خولان","تەنیس","تۆپ","دەروازە","تاکتیک","لیگ","کووپا","مێدالیا","یاریگا","قازانین","بازی","تیم","تاییم","کوتایی","سکۆر","گۆل","پەنالتی","کارتی سور","وردۆل"],
    impostorWords: ["گۆلف","بەیسبۆل","ئایسهۆکی","لاکرۆس","ڕووگبی","پۆلۆ","فەنسینگ","کریکێت"]
  },
  "🐾 ئاژەڵ": {
    words: ["شێر","ببر","پلنگ","گورگ","ڕووی","مەڕ","بزن","ئەسپ","گا","مشک","کەتوو","سەگ","زوویرک","کەرگ","ئەردەک","قاز","کەوتر","باز","ماسی","مار","فیل","ژیراف","مەیمون","ئارنەووس","قورباغە","کەڵەش","دووپشک","زەروەشک","ئوتر","کوێرمێشک"],
    impostorWords: ["دینۆسۆر","یونیکۆرن","پاندا","کوالا","ئیگوانا","پیرانا","جاگوار","ئەژدیها"]
  },
  "🏛️ مێژوو": {
    words: ["سومەر","ئاشووری","میدی","کوردو","قەلا","شوار","مێرگەسووری","كورتایی","تختی جمشید","مادی","عارفان","سالادین","گوتی","میتانی","کاساپ","هەلەبجە","1991","ئانفال","پێشمەرگە","ئازادی","سروشت","زمان"],
    impostorWords: ["رۆما","یوونان","مەسر","چین","ئازتێک","مایا","وایکینگ","فەرعەون"]
  },
  "🎬 فیلم و تیلیفزیۆن": {
    words: ["کینۆ","چاودێری","دیدن","ئەکتەر","دەکۆر","سکریپت","دەرهێنەر","مووسیقای پشت","کامێرا","مۆنتاژ","سینما","ئەکشن","ئاگاداری","کارتووناوی","ئیلووزیۆن","سۆپراپرایز","بڵاوکردنەوە","کاراکتەر","سینەماسکۆپ"],
    impostorWords: ["نێتفلیکس","یووتیووب","تیکتۆک","ئینستاگرام","تۆویتەر","دیزنی","مارڤێل","DC"]
  }
};

const AVATARS = ["🔴","🟠","🟡","🟢","🔵","🟣","🟤","⚪","🌸","⭐"];

// Room state
const rooms = {};

function generateRoomCode() {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let code = '';
  for (let i = 0; i < 5; i++) code += chars[Math.floor(Math.random() * chars.length)];
  return code;
}

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function getRoomPublic(room) {
  return {
    code: room.code,
    hostId: room.hostId,
    players: room.players.map(p => ({ id: p.id, name: p.name, avatar: p.avatar, ready: p.ready })),
    phase: room.phase,
    impostorCount: room.impostorCount,
    selectedCats: room.selectedCats,
    votes: room.votes,
    voteRevealed: room.voteRevealed || false,
  };
}

io.on('connection', (socket) => {
  console.log('connected:', socket.id);

  socket.on('create-room', ({ playerName }) => {
    let code;
    do { code = generateRoomCode(); } while (rooms[code]);

    const room = {
      code,
      hostId: socket.id,
      players: [{ id: socket.id, name: playerName || 'هۆست', avatar: AVATARS[0], ready: true }],
      phase: 'lobby', // lobby | reveal | vote | result
      impostorCount: 1,
      selectedCats: Object.keys(CATEGORIES),
      assignments: [],
      votes: {},
      voteRevealed: false,
    };
    rooms[code] = room;
    socket.join(code);
    socket.emit('room-joined', { code, playerId: socket.id, isHost: true });
    io.to(code).emit('room-update', getRoomPublic(room));
  });

  socket.on('join-room', ({ code, playerName }) => {
    const room = rooms[code];
    if (!room) { socket.emit('error-msg', 'ژوورەکە نەدۆزرایەوە!'); return; }
    if (room.phase !== 'lobby') { socket.emit('error-msg', 'یارییەکە دەستی پێکردووە!'); return; }
    if (room.players.length >= 10) { socket.emit('error-msg', 'ژوورەکە پڕە!'); return; }
    if (room.players.find(p => p.id === socket.id)) { socket.emit('error-msg', 'پێشتر تۆمارت کردووە!'); return; }

    const idx = room.players.length % AVATARS.length;
    room.players.push({ id: socket.id, name: playerName || `یاریزان ${room.players.length + 1}`, avatar: AVATARS[idx], ready: true });
    socket.join(code);
    socket.emit('room-joined', { code, playerId: socket.id, isHost: false });
    io.to(code).emit('room-update', getRoomPublic(room));
  });

  socket.on('update-settings', ({ code, impostorCount, selectedCats }) => {
    const room = rooms[code];
    if (!room || room.hostId !== socket.id) return;
    if (impostorCount !== undefined) room.impostorCount = Math.max(1, Math.min(Math.floor(room.players.length / 2), impostorCount));
    if (selectedCats !== undefined && selectedCats.length > 0) room.selectedCats = selectedCats;
    io.to(code).emit('room-update', getRoomPublic(room));
  });

  socket.on('start-game', ({ code }) => {
    const room = rooms[code];
    if (!room || room.hostId !== socket.id) return;
    if (room.players.length < 3) { socket.emit('error-msg', 'کەمی سێ یاریزانت پێویستە!'); return; }

    const catKeys = room.selectedCats.filter(k => CATEGORIES[k]);
    const chosenCat = catKeys[Math.floor(Math.random() * catKeys.length)];
    const cat = CATEGORIES[chosenCat];
    const crewWord = cat.words[Math.floor(Math.random() * cat.words.length)];

    const idxs = shuffle([...Array(room.players.length).keys()]);
    const impostorIdxs = new Set(idxs.slice(0, room.impostorCount));

    room.assignments = room.players.map((p, i) => ({
      id: p.id,
      name: p.name,
      avatar: p.avatar,
      isImpostor: impostorIdxs.has(i),
      word: impostorIdxs.has(i) ? null : crewWord,
      chosenCat,
      crewWord,
    }));

    room.phase = 'reveal';
    room.votes = {};
    room.voteRevealed = false;

    // Send each player their private assignment
    room.assignments.forEach(a => {
      io.to(a.id).emit('your-assignment', {
        name: a.name,
        avatar: a.avatar,
        isImpostor: a.isImpostor,
        word: a.word,
        chosenCat: a.chosenCat,
      });
    });

    io.to(code).emit('room-update', getRoomPublic(room));
    io.to(code).emit('phase-change', { phase: 'reveal' });
  });

  socket.on('player-ready-vote', ({ code }) => {
    const room = rooms[code];
    if (!room) return;
    if (!room.readyForVote) room.readyForVote = new Set();
    room.readyForVote.add(socket.id);
    io.to(code).emit('ready-count', { count: room.readyForVote.size, total: room.players.length });
    if (room.readyForVote.size >= room.players.length) {
      room.phase = 'vote';
      room.readyForVote = new Set();
      io.to(code).emit('phase-change', { phase: 'vote' });
      io.to(code).emit('room-update', getRoomPublic(room));
    }
  });

  socket.on('cast-vote', ({ code, targetId }) => {
    const room = rooms[code];
    if (!room || room.phase !== 'vote') return;
    if (room.votes[socket.id]) return; // already voted
    room.votes[socket.id] = targetId;
    io.to(code).emit('room-update', getRoomPublic(room));
    // Check if all voted
    if (Object.keys(room.votes).length >= room.players.length) {
      revealResult(code);
    }
  });

  socket.on('force-reveal', ({ code }) => {
    const room = rooms[code];
    if (!room || room.hostId !== socket.id) return;
    revealResult(code);
  });

  socket.on('new-game', ({ code }) => {
    const room = rooms[code];
    if (!room || room.hostId !== socket.id) return;
    room.phase = 'lobby';
    room.assignments = [];
    room.votes = {};
    room.voteRevealed = false;
    room.readyForVote = new Set();
    io.to(code).emit('phase-change', { phase: 'lobby' });
    io.to(code).emit('room-update', getRoomPublic(room));
  });

  socket.on('disconnect', () => {
    for (const code in rooms) {
      const room = rooms[code];
      const idx = room.players.findIndex(p => p.id === socket.id);
      if (idx === -1) continue;
      room.players.splice(idx, 1);
      if (room.players.length === 0) {
        delete rooms[code];
      } else {
        if (room.hostId === socket.id) room.hostId = room.players[0].id;
        io.to(code).emit('room-update', getRoomPublic(room));
        io.to(code).emit('player-left', { name: room.players[idx]?.name || 'یاریزانێک' });
      }
    }
  });
});

function revealResult(code) {
  const room = rooms[code];
  if (!room) return;

  // Count votes
  const voteCounts = {};
  Object.values(room.votes).forEach(targetId => {
    voteCounts[targetId] = (voteCounts[targetId] || 0) + 1;
  });

  let maxVotes = 0, votedOutId = null;
  Object.entries(voteCounts).forEach(([id, cnt]) => {
    if (cnt > maxVotes) { maxVotes = cnt; votedOutId = id; }
  });

  const votedOutPlayer = room.assignments.find(a => a.id === votedOutId);
  const isCorrect = votedOutPlayer?.isImpostor || false;
  const crewWord = room.assignments.find(a => !a.isImpostor)?.crewWord || '—';
  const impostors = room.assignments.filter(a => a.isImpostor);

  room.phase = 'result';
  room.voteRevealed = true;

  io.to(code).emit('phase-change', { phase: 'result' });
  io.to(code).emit('result', {
    isCorrect,
    votedOutId,
    votedOutName: votedOutPlayer?.name || '—',
    crewWord,
    impostors: impostors.map(a => ({ id: a.id, name: a.name, avatar: a.avatar })),
    assignments: room.assignments.map(a => ({ id: a.id, name: a.name, avatar: a.avatar, isImpostor: a.isImpostor, word: a.word || `✦ (${crewWord})` })),
    voteCounts,
  });
}

server.listen(PORT, () => {
  console.log(`\n🕵️  فێڵباز سێرڤەر دەستی پێکرد لە: http://localhost:${PORT}\n`);
});
