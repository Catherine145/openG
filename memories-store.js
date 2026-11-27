// ============================================================
// 💾 Shared Memories Storage Engine (IndexedDB + localStorage)
// ============================================================

(function(window) {
  const DB_NAME = "HBD_MEMORIES_DB";
  const DB_VERSION = 4;
  const STORE_NAME = "memories_store";
  const RECORD_KEY = "all_cards_data";
  const LS_KEY = "hbd_memories";

  // Default 30 memories if nothing is saved yet
  const DEFAULT_MEMORIES = [
    { "src": "assets/images/memories/16d2385834be6b9070cedf0324b7cf71.jpg", "date": "أول عيد ميلاد نقضيه سوا", "caption": "يا رب دايما نفضل سوا ودايما أعرف أبسطك كده", "isVideo": false },
    { "src": "assets/images/memories/IMG-20241223-WA0029.jpg", "date": "23 ديسمبر 2024", "caption": "عيوضي القمر، شياكة وأناقة توب التوب 💯", "isVideo": false },
    { "src": "assets/images/memories/IMG-20250501-WA0034.jpg", "date": "1 مايو 2025", "caption": "خروجة الكوربا بجد كانت تحفة", "isVideo": false },
    { "src": "assets/images/memories/IMG-20250506-WA0175.jpg", "date": "6 مايو 2025", "caption": "مشينا بعد الجامعة، اللي بجد بيبقى شايل ميموريز كتيرة قوي، حاجات حلوة وحاجات صعبة وضحك وحاجات كتيرة جداً", "isVideo": false },
    { "src": "assets/images/memories/IMG-20250513-WA0010.jpg", "date": "أنا وأنت وضرتي", "caption": "أمير صاحبك أجدع واحد بجد وربنا يخليكم لبعض وتفضلوا طول العمر سوا، أحسن صاحب ممكن تشوفه", "isVideo": false },
    { "src": "assets/images/memories/IMG-20250922-WA0279.jpg", "date": "22 سبتمبر 2025", "caption": "خروجات إيتوال اللي ملناش غيرها", "isVideo": false },
    { "src": "assets/images/memories/IMG-20251020-WA0095.jpg", "date": "20 أكتوبر 2025", "caption": "الصور العشوائية بتاعتنا", "isVideo": false },
    { "src": "assets/images/memories/IMG-20251114-WA0083.jpg", "date": "14 نوفمبر 2025", "caption": "الحضن وأحن واحد في الدنيا", "isVideo": false },
    { "src": "assets/images/memories/IMG-20251114-WA0090.jpg", "date": "14 نوفمبر 2025", "caption": "حفلات الجامعة والحاجات اللي أنت بتجيبها علشان خاطري غالي عندك رغم أنها تافهة، البريسلت لسه عندي", "isVideo": false },
    { "src": "assets/images/memories/IMG-20251206-WA0068.jpg", "date": "6 ديسمبر 2025", "caption": "لما بنزلك غصب عنك بس ما تنكرش قاعدتي حلوة وبتخرجك من المود", "isVideo": false },
    { "src": "assets/images/memories/IMG-20251230-WA0062.jpg", "date": "30 ديسمبر 2025", "caption": "ماتش ماتش كده دايما", "isVideo": false },
    { "src": "assets/images/memories/IMG-20260702-WA0018.jpg", "date": "2 يوليو 2026", "caption": "نزولاتنا العشوائية", "isVideo": false },
    { "src": "assets/images/memories/IMG-20260722-WA0001.jpg", "date": "22 يوليو 2026", "caption": "بحب الخروجة دي قوي ودايما هيفضل كتفي مستنيك أو كتفي ليك، أي حاجة يعني", "isVideo": false },
    { "src": "assets/images/memories/IMG-20260921-WA0046.jpg", "date": "21 سبتمبر 2026", "caption": "ده كان أحلى يوم في حياتي والسينما توب", "isVideo": false },
    { "src": "assets/images/memories/Picsart_24-01-09_16-21-04-592.jpg", "date": "أول صورة لينا سوا في التاريخ", "caption": "وبعد سنوات طوال من الإلحاح الرهيب أخيراً اتنازلت واتصورت معاك", "isVideo": false },
    { "src": "assets/images/memories/Screenshot_2024-11-04-16-27-02-534_com.snapchat.android.jpg", "date": "تحت المطر", "caption": "أنا فاكرة يومها أنت جتلي مخصوص ورجعتلي بعد ما كنت خلاص هتمشي، أهو ما تنكرش إني عيشتك ميموري حلوة", "isVideo": false },
    { "src": "assets/images/memories/Snapchat-10078879.jpg", "date": "خروجة رمضان المعتادة", "caption": "بحب الصورة دي جداً", "isVideo": false },
    { "src": "assets/images/memories/Snapchat-1014406887.jpg", "date": "تاني عيد ميلاد لينا سوا", "caption": "يا رب دايما يا عيوطي أقدر أفرحك كده وعقبال كل عيد ميلاد وإحنا سوا", "isVideo": false },
    { "src": "assets/images/memories/Snapchat-1025946463.jpg", "date": "خروجة رمضان التانية", "caption": "البالونة لسه عندي وبجد بحب التفاصيل الصغيرة دي", "isVideo": false },
    { "src": "assets/images/memories/Snapchat-1191593625.jpg", "date": "الشطار", "caption": "يا رب دايما كده نفضل شطار ودايما بنشد بعض للنجاح وبس", "isVideo": false },
    { "src": "assets/images/memories/Snapchat-1342797847.mp4", "date": "أول حفلة في الجامعة", "caption": "أه كان يوم تحفة", "isVideo": true },
    { "src": "assets/images/memories/Snapchat-1376549745.jpg", "date": "السند", "caption": "أنا عارفة إن أنت بتحب الصورة دي جداً ويا رب نفضل سند لبعض على طول وأنا كده كده موجودة", "isVideo": false },
    { "src": "assets/images/memories/Snapchat-1512167119.jpg", "date": "أيام الامتحانات", "caption": "رغم إنها بتبقى أيام زي الزفت بس معاك بتهون كل حاجة", "isVideo": false },
    { "src": "assets/images/memories/Snapchat-1737184744.jpg", "date": "أسرع نزول نزلناها", "caption": "بحب اليوم ده قوي، واتوال بس الفرع الثاني", "isVideo": false },
    { "src": "assets/images/memories/Snapchat-1907026020.mp4", "date": "يوم تحفة", "caption": "ما أنت بتعرف تختار أماكن اهو وساعتها اتبسطت وبحب الفيديو ده قوي", "isVideo": true },
    { "src": "assets/images/memories/Snapchat-2023851695.jpg", "date": "أول خروجة لينا سوا", "caption": "بحب الصورة دي قوي كيوت وشايلة ميموريز كتيرة قوي", "isVideo": false },
    { "src": "assets/images/memories/Snapchat-2035264167.mp4", "date": "أيام الامتحانات", "caption": "نظرتك ليا حنينة موت", "isVideo": true },
    { "src": "assets/images/memories/Snapchat-262237617.jpg", "date": "ذكرى غريبة", "caption": "تزعلني وتصالحني مش عارفة أعمل إيه", "isVideo": false },
    { "src": "assets/images/memories/Snapchat-74414018.jpg", "date": "خروجة الكوربا", "caption": "فاكر أنت اليوم ده طبعاً أول قلم", "isVideo": false },
    { "src": "assets/images/memories/Snapchat-912697055.jpg", "date": "يوم ما نزلتني مخصوص", "caption": "بحب الصورة دي والتيك توكات اللي ورا الصورة دي", "isVideo": false }
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
