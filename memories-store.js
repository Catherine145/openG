// ============================================================
// 💾 Shared Memories Storage Engine (IndexedDB + localStorage)
// ============================================================

(function(window) {
  const DB_NAME = "HBD_MEMORIES_DB";
  const DB_VERSION = 3;
  const STORE_NAME = "memories_store";
  const RECORD_KEY = "all_cards_data";
  const LS_KEY = "hbd_memories";

  // Default 30 memories if nothing is saved yet
  const DEFAULT_MEMORIES = [
    { "src": "assets/images/memories/16d2385834be6b9070cedf0324b7cf71.jpg", "date": "ذكرى جميلة", "caption": "لحظة ما نقدر ننساها أبداً 💛", "isVideo": false },
    { "src": "assets/images/memories/IMG-20241223-WA0029.jpg", "date": "23 ديسمبر 2024", "caption": "الضحكة دي مش هتتعوض 😂❤️", "isVideo": false },
    { "src": "assets/images/memories/IMG-20250501-WA0034.jpg", "date": "1 مايو 2025", "caption": "يوم من أحلى الأيام 🌟", "isVideo": false },
    { "src": "assets/images/memories/IMG-20250506-WA0175.jpg", "date": "6 مايو 2025", "caption": "سوا دايماً وفي كل حاجة 🫂", "isVideo": false },
    { "src": "assets/images/memories/IMG-20250513-WA0010.jpg", "date": "13 مايو 2025", "caption": "أجمل ذكريات عمرنا ✨", "isVideo": false },
    { "src": "assets/images/memories/IMG-20250922-WA0279.jpg", "date": "22 سبتمبر 2025", "caption": "لما نبص للصورة دي بنفتكر كل حاجة حلوة 🐥", "isVideo": false },
    { "src": "assets/images/memories/IMG-20251020-WA0095.jpg", "date": "20 أكتوبر 2025", "caption": "ربنا يديم الصحبة الحلوة دي ❤️", "isVideo": false },
    { "src": "assets/images/memories/IMG-20251114-WA0083.jpg", "date": "14 نوفمبر 2025", "caption": "يوم ما نقدر ننساه 💖", "isVideo": false },
    { "src": "assets/images/memories/IMG-20251114-WA0090.jpg", "date": "14 نوفمبر 2025", "caption": "لحظة من أحلى اللحظات 🎉", "isVideo": false },
    { "src": "assets/images/memories/IMG-20251206-WA0068.jpg", "date": "6 ديسمبر 2025", "caption": "شيء بيفرحنا كل ما نشوفه 😘", "isVideo": false },
    { "src": "assets/images/memories/IMG-20251230-WA0062.jpg", "date": "30 ديسمبر 2025", "caption": "ذكرى غالية على قلبي 🌸", "isVideo": false },
    { "src": "assets/images/memories/IMG-20260702-WA0018.jpg", "date": "2 يوليو 2026", "caption": "سعادة حقيقية 💃", "isVideo": false },
    { "src": "assets/images/memories/IMG-20260722-WA0001.jpg", "date": "22 يوليو 2026", "caption": "لما تكون الضحكة من القلب 😄", "isVideo": false },
    { "src": "assets/images/memories/IMG-20260921-WA0046.jpg", "date": "21 سبتمبر 2026", "caption": "يوم زي الفل 🌺", "isVideo": false },
    { "src": "assets/images/memories/Picsart_24-01-09_16-21-04-592.jpg", "date": "ذكرى جميلة", "caption": "أحلى خروجة 🚗", "isVideo": false },
    { "src": "assets/images/memories/Screenshot_2024-11-04-16-27-02-534_com.snapchat.android.jpg", "date": "ذكرى جميلة", "caption": "وقت ما نقدر نرجعه بس في قلبنا دايماً 💝", "isVideo": false },
    { "src": "assets/images/memories/Snapchat-10078879.jpg", "date": "79  1007", "caption": "صورة بتحكي أحلى قصة 📸", "isVideo": false },
    { "src": "assets/images/memories/Snapchat-1014406887.jpg", "date": "68  1014", "caption": "برديه الحلوة دي 🌙", "isVideo": false },
    { "src": "assets/images/memories/Snapchat-1025946463.jpg", "date": "64  1025", "caption": "لحظة ما بتتكررش 💫", "isVideo": false },
    { "src": "assets/images/memories/Snapchat-1191593625.jpg", "date": "36  1191", "caption": "كل تفصيلة فيها ذكرى 🎈", "isVideo": false },
    { "src": "assets/images/memories/Snapchat-1342797847.mp4", "date": "78  1342", "caption": "ربنا يكرمك دايماً يا عايودي ❤️", "isVideo": true },
    { "src": "assets/images/memories/Snapchat-1376549745.jpg", "date": "97  1376", "caption": "سعيدة إننا عيشنا اللحظة دي سوا 🫂", "isVideo": false },
    { "src": "assets/images/memories/Snapchat-1512167119.jpg", "date": "71  1512", "caption": "من أجمل أيامنا 🌟", "isVideo": false },
    { "src": "assets/images/memories/Snapchat-1737184744.jpg", "date": "47  1737", "caption": "لما نبص على الأيام دي بنفتكر إيه قد إيه إحنا محظوظين 💛", "isVideo": false },
    { "src": "assets/images/memories/Snapchat-1907026020.mp4", "date": "60 فبراير 1907", "caption": "ضحكة عايودي الحلوة 😄✨", "isVideo": true },
    { "src": "assets/images/memories/Snapchat-2023851695.jpg", "date": "16  2023", "caption": "لحظة بتسوى الدنيا كلها 🌍❤️", "isVideo": false },
    { "src": "assets/images/memories/Snapchat-2035264167.mp4", "date": "41  2035", "caption": "ذكريات مش هتتنسى أبداً 🐥", "isVideo": true },
    { "src": "assets/images/memories/Snapchat-262237617.jpg", "date": "61  2622", "caption": "يوم أحلى من يوم 🌸", "isVideo": false },
    { "src": "assets/images/memories/Snapchat-74414018.jpg", "date": "18  7441", "caption": "الصحبة الحلوة دي ربنا يديمها 🫂💖", "isVideo": false },
    { "src": "assets/images/memories/Snapchat-912697055.jpg", "date": "5  9126", "caption": "حاجة بتفرحنا دايماً لما نشوفها 🎊", "isVideo": false }
  ];

  function openDatabase() {
    return new Promise(function(resolve, reject) {
      if (!window.indexedDB) {
        resolve(null);
        return;
      }
      const req = indexedDB.open(DB_NAME, DB_VERSION);
      req.onupgradeneeded = function(e) {
        try { localStorage.removeItem(LS_KEY); } catch(err) {}
        const db = e.target.result;
        if (db.objectStoreNames.contains(STORE_NAME)) {
          db.deleteObjectStore(STORE_NAME);
        }
        db.createObjectStore(STORE_NAME);
      };
      req.onsuccess = function(e) {
        resolve(e.target.result);
      };
      req.onerror = function(e) {
        console.warn("IndexedDB open error:", e);
        resolve(null);
      };
    });
  }

  function readFromLocalStorage() {
    try {
      const dataStr = localStorage.getItem(LS_KEY);
      if (dataStr) {
        const parsed = JSON.parse(dataStr);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
        if (typeof parsed === "object") {
          const arr = [];
          for (let i = 0; i < 30; i++) {
            arr.push(parsed[i] || DEFAULT_MEMORIES[i]);
          }
          return arr;
        }
      }
    } catch(e) {}
    return null;
  }

  // Get all memories: IndexedDB -> localStorage -> Defaults
  async function getAllMemories() {
    try {
      const db = await openDatabase();
      if (db) {
        const fromIDB = await new Promise(function(resolve) {
          const tx = db.transaction(STORE_NAME, "readonly");
          const store = tx.objectStore(STORE_NAME);
          const req = store.get(RECORD_KEY);
          req.onsuccess = function() { resolve(req.result); };
          req.onerror = function() { resolve(null); };
        });

        if (Array.isArray(fromIDB) && fromIDB.length > 0) {
          return normalizeMemories(fromIDB);
        }
      }
    } catch(e) {
      console.warn("Could not read from IndexedDB:", e);
    }

    const fromLS = readFromLocalStorage();
    if (fromLS) return normalizeMemories(fromLS);

    return JSON.parse(JSON.stringify(DEFAULT_MEMORIES));
  }

  function normalizeMemories(rawList) {
    const result = [];
    for (let i = 0; i < 30; i++) {
      const item = rawList[i] || {};
      const def = DEFAULT_MEMORIES[i] || {};
      const isOldPlaceholder = typeof item.src === "string" && /^assets\/images\/photo\d+\.jpg$/.test(item.src);
      const src = (!item.src || isOldPlaceholder) ? def.src : item.src;
      result.push({
        src: src,
        date: (!isOldPlaceholder && item.date !== undefined && item.date !== null && item.date !== "") ? item.date : def.date,
        caption: (!isOldPlaceholder && item.caption !== undefined && item.caption !== null && item.caption !== "") ? item.caption : def.caption,
        isVideo: isOldPlaceholder ? Boolean(def.isVideo) : Boolean(item.isVideo)
      });
    }
    return result;
  }

  // Save all memories: writes to both IndexedDB and localStorage
  async function saveAllMemories(memoriesArray) {
    let savedToIDB = false;
    try {
      const db = await openDatabase();
      if (db) {
        savedToIDB = await new Promise(function(resolve) {
          const tx = db.transaction(STORE_NAME, "readwrite");
          const store = tx.objectStore(STORE_NAME);
          const req = store.put(memoriesArray, RECORD_KEY);
          req.onsuccess = function() { resolve(true); };
          req.onerror = function() { resolve(false); };
        });
      }
    } catch(e) {
      console.warn("IndexedDB save error:", e);
    }

    // Backup to localStorage (ignore quota error if images are large)
    try {
      localStorage.setItem(LS_KEY, JSON.stringify(memoriesArray));
    } catch(e) {
      console.warn("localStorage quota reached, IndexedDB used:", e);
    }

    return true;
  }

  // Reset to default cards
  async function resetAllMemories() {
    try {
      localStorage.removeItem(LS_KEY);
      const db = await openDatabase();
      if (db) {
        await new Promise(function(resolve) {
          const tx = db.transaction(STORE_NAME, "readwrite");
          const store = tx.objectStore(STORE_NAME);
          const req = store.delete(RECORD_KEY);
          req.onsuccess = function() { resolve(true); };
          req.onerror = function() { resolve(false); };
        });
      }
    } catch(e) {}
    return JSON.parse(JSON.stringify(DEFAULT_MEMORIES));
  }

  // Automatic high-quality client-side image compression
  function compressImageFile(file, maxDimension = 1200, quality = 0.82) {
    return new Promise(function(resolve, reject) {
      if (!file || !file.type.startsWith("image/")) {
        reject(new Error("Not an image"));
        return;
      }
      const reader = new FileReader();
      reader.onerror = reject;
      reader.onload = function(e) {
        const img = new Image();
        img.onerror = reject;
        img.onload = function() {
          let w = img.width;
          let h = img.height;
          if (w > maxDimension || h > maxDimension) {
            if (w > h) {
              h = Math.round((h * maxDimension) / w);
              w = maxDimension;
            } else {
              w = Math.round((w * maxDimension) / h);
              h = maxDimension;
            }
          }
          const canvas = document.createElement("canvas");
          canvas.width = w;
          canvas.height = h;
          const ctx = canvas.getContext("2d");
          ctx.drawImage(img, 0, 0, w, h);
          resolve(canvas.toDataURL("image/jpeg", quality));
        };
        img.src = e.target.result;
      };
      reader.readAsDataURL(file);
    });
  }

  // Read video file as Data URL
  function readVideoFile(file) {
    return new Promise(function(resolve, reject) {
      const reader = new FileReader();
      reader.onerror = reject;
      reader.onload = function(e) {
        resolve(e.target.result);
      };
      reader.readAsDataURL(file);
    });
  }

  const USER_SLOTS_KEY = "user_extra_slots";
  const LS_USER_SLOTS_KEY = "hbd_user_extra_slots";

  async function getUserSlots() {
    const defaults = [
      { src: "", caption: "صورتك المفضلة هنا يا عايودي ✨" },
      { src: "", caption: "ذكرى من اختيارك يا صاحبي 🫂" },
      { src: "", caption: "أحلى لقطة تحب تضيفها 🎉" }
    ];
    try {
      const db = await openDatabase();
      if (db) {
        const fromIDB = await new Promise(function(resolve) {
          const tx = db.transaction(STORE_NAME, "readonly");
          const store = tx.objectStore(STORE_NAME);
          const req = store.get(USER_SLOTS_KEY);
          req.onsuccess = function() { resolve(req.result); };
          req.onerror = function() { resolve(null); };
        });
        if (Array.isArray(fromIDB) && fromIDB.length === 3) {
          return fromIDB;
        }
      }
    } catch(e) {}
    try {
      const str = localStorage.getItem(LS_USER_SLOTS_KEY);
      if (str) {
        const parsed = JSON.parse(str);
        if (Array.isArray(parsed) && parsed.length === 3) return parsed;
      }
    } catch(e) {}
    return defaults;
  }

  async function saveUserSlots(slotsArray) {
    try {
      const db = await openDatabase();
      if (db) {
        await new Promise(function(resolve) {
          const tx = db.transaction(STORE_NAME, "readwrite");
          const store = tx.objectStore(STORE_NAME);
          const req = store.put(slotsArray, USER_SLOTS_KEY);
          req.onsuccess = function() { resolve(true); };
          req.onerror = function() { resolve(false); };
        });
      }
    } catch(e) {}
    try {
      localStorage.setItem(LS_USER_SLOTS_KEY, JSON.stringify(slotsArray));
    } catch(e) {}
    return true;
  }

  window.MemoriesStore = {
    DEFAULT_MEMORIES: DEFAULT_MEMORIES,
    getAll: getAllMemories,
    saveAll: saveAllMemories,
    resetAll: resetAllMemories,
    getUserSlots: getUserSlots,
    saveUserSlots: saveUserSlots,
    compressImage: compressImageFile,
    readVideo: readVideoFile
  };
})(window);
