import { useState, useEffect, useCallback, useRef } from "react";

// ─── Seed Data ────────────────────────────────────────────────────────────────
const SEED_MESSAGES = [
  // improve (35)
  { id:"i01", type:"improve", content:"Ít hơn hôm qua một chút, nhưng là tiến về phía trước." },
  { id:"i02", type:"improve", content:"Cơ thể bạn đang nhận ra sự thay đổi này." },
  { id:"i03", type:"improve", content:"Bạn không cần hoàn hảo, chỉ cần tốt hơn hôm qua." },
  { id:"i04", type:"improve", content:"Một bước nhỏ hôm nay đáng giá hơn nhiều lời hứa lớn." },
  { id:"i05", type:"improve", content:"Bạn đang tự tạo khoảng cách với thói quen cũ." },
  { id:"i06", type:"improve", content:"Giảm đi rồi, nghĩa là bạn có kiểm soát." },
  { id:"i07", type:"improve", content:"Không cần nhanh, chỉ cần đúng hướng." },
  { id:"i08", type:"improve", content:"Bạn đang làm điều mà hôm qua chưa làm được." },
  { id:"i09", type:"improve", content:"Cái khó nhất là bắt đầu. Bạn đã làm rồi." },
  { id:"i10", type:"improve", content:"Mỗi lần ít đi là một lần bạn thắng." },
  { id:"i11", type:"improve", content:"Bạn đang học cách dừng lại đúng lúc." },
  { id:"i12", type:"improve", content:"Ít hơn một chút, nhẹ hơn một chút." },
  { id:"i13", type:"improve", content:"Bạn đang thay đổi theo cách rất thật." },
  { id:"i14", type:"improve", content:"Không cần ai biết, chỉ cần bạn thấy rõ." },
  { id:"i15", type:"improve", content:"Bạn đã không buông theo thói quen như trước." },
  { id:"i16", type:"improve", content:"Sự khác biệt nhỏ hôm nay sẽ thành lớn sau này." },
  { id:"i17", type:"improve", content:"Bạn đang cho bản thân một cơ hội khác." },
  { id:"i18", type:"improve", content:"Không cần hoàn hảo, chỉ cần tiếp tục." },
  { id:"i19", type:"improve", content:"Cơ thể bạn sẽ nhớ cảm giác này." },
  { id:"i20", type:"improve", content:"Bạn vừa làm điều có ích cho chính mình." },
  { id:"i21", type:"improve", content:"Giảm rồi, nghĩa là bạn đang tỉnh táo hơn." },
  { id:"i22", type:"improve", content:"Bạn đang điều chỉnh, không phải ép buộc." },
  { id:"i23", type:"improve", content:"Hôm nay bạn chọn khác đi một chút." },
  { id:"i24", type:"improve", content:"Sự thay đổi không ồn ào, nhưng có thật." },
  { id:"i25", type:"improve", content:"Bạn đang đi đúng hướng." },
  { id:"i26", type:"improve", content:"Ít hơn hôm qua là đủ để tự tin." },
  { id:"i27", type:"improve", content:"Bạn đang học cách kiểm soát bản thân." },
  { id:"i28", type:"improve", content:"Không cần nhanh, chỉ cần đều." },
  { id:"i29", type:"improve", content:"Bạn đang tôn trọng chính mình hơn." },
  { id:"i30", type:"improve", content:"Bạn đang rời xa điều không tốt cho mình." },
  { id:"i31", type:"improve", content:"Ít đi không phải là mất, mà là giữ lại." },
  { id:"i32", type:"improve", content:"Bạn vừa chứng minh mình có thể thay đổi." },
  { id:"i33", type:"improve", content:"Cảm giác này đáng để giữ lại." },
  { id:"i34", type:"improve", content:"Bạn đang tiến về phía một phiên bản tốt hơn." },
  { id:"i35", type:"improve", content:"Không cần hoàn hảo, bạn đã tiến rồi." },
  // same (34)
  { id:"s01", type:"same", content:"Hôm nay bạn giữ nguyên. Quan sát thêm một chút." },
  { id:"s02", type:"same", content:"Không tăng cũng là một dạng kiểm soát." },
  { id:"s03", type:"same", content:"Bạn đang dừng lại trước khi đi xa hơn." },
  { id:"s04", type:"same", content:"Giữ được mức này cũng là một nỗ lực." },
  { id:"s05", type:"same", content:"Không phải ngày nào cũng phải tốt hơn." },
  { id:"s06", type:"same", content:"Bạn đang ở trạng thái ổn định." },
  { id:"s07", type:"same", content:"Giữ nguyên là một bước trung gian." },
  { id:"s08", type:"same", content:"Bạn chưa giảm, nhưng cũng không buông." },
  { id:"s09", type:"same", content:"Đôi khi giữ được đã là thành công." },
  { id:"s10", type:"same", content:"Bạn đang kiểm soát được nhịp của mình." },
  { id:"s11", type:"same", content:"Không tăng lên là tín hiệu tốt." },
  { id:"s12", type:"same", content:"Bạn đang giữ thế cân bằng." },
  { id:"s13", type:"same", content:"Không có gì tệ xảy ra hôm nay." },
  { id:"s14", type:"same", content:"Bạn vẫn đang trong tầm kiểm soát." },
  { id:"s15", type:"same", content:"Không cần ép mình quá nhanh." },
  { id:"s16", type:"same", content:"Bạn đang quan sát chính mình." },
  { id:"s17", type:"same", content:"Giữ nguyên là cơ hội để hiểu rõ hơn." },
  { id:"s18", type:"same", content:"Bạn chưa đi lùi." },
  { id:"s19", type:"same", content:"Bạn vẫn đang ở đây, không tệ." },
  { id:"s20", type:"same", content:"Mọi thay đổi đều cần thời gian." },
  { id:"s21", type:"same", content:"Bạn đang giữ được ranh giới." },
  { id:"s22", type:"same", content:"Không tăng nghĩa là bạn có ý thức." },
  { id:"s23", type:"same", content:"Bạn đang làm chậm lại thói quen cũ." },
  { id:"s24", type:"same", content:"Bạn không để mọi thứ vượt khỏi tầm tay." },
  { id:"s25", type:"same", content:"Giữ nguyên cũng là một lựa chọn có ý thức." },
  { id:"s26", type:"same", content:"Bạn đang cho mình thời gian." },
  { id:"s27", type:"same", content:"Không cần vội." },
  { id:"s28", type:"same", content:"Bạn đang học cách dừng lại." },
  { id:"s29", type:"same", content:"Không phải ngày nào cũng phải giảm." },
  { id:"s30", type:"same", content:"Bạn vẫn đang kiểm soát được." },
  { id:"s31", type:"same", content:"Đây là một ngày ổn định." },
  { id:"s32", type:"same", content:"Bạn đang ở giữa quá trình." },
  { id:"s33", type:"same", content:"Không tăng lên là một dấu hiệu tốt." },
  { id:"s34", type:"same", content:"Bạn chưa thắng, nhưng cũng chưa thua." },
  // worse (35)
  { id:"w01", type:"worse", content:"Hôm nay nhiều hơn một chút. Có điều gì đang ảnh hưởng bạn không?" },
  { id:"w02", type:"worse", content:"Không phải ngày tệ, chỉ là ngày khác." },
  { id:"w03", type:"worse", content:"Bạn có thể nhìn lại xem điều gì xảy ra." },
  { id:"w04", type:"worse", content:"Một ngày như vậy không định nghĩa bạn." },
  { id:"w05", type:"worse", content:"Bạn vẫn có thể dừng lại từ đây." },
  { id:"w06", type:"worse", content:"Không cần tự trách, chỉ cần nhận ra." },
  { id:"w07", type:"worse", content:"Bạn đang thấy rõ hơn thói quen của mình." },
  { id:"w08", type:"worse", content:"Hôm nay hơi nhiều, nhưng bạn vẫn đang quan sát." },
  { id:"w09", type:"worse", content:"Bạn chưa mất kiểm soát, chỉ là lệch một chút." },
  { id:"w10", type:"worse", content:"Có thể hôm nay khó hơn bình thường." },
  { id:"w11", type:"worse", content:"Bạn vẫn đang ở đây, vẫn còn cơ hội." },
  { id:"w12", type:"worse", content:"Đừng để một ngày kéo theo nhiều ngày." },
  { id:"w13", type:"worse", content:"Bạn có thể bắt đầu lại từ ngày mai." },
  { id:"w14", type:"worse", content:"Không cần hoàn hảo, chỉ cần quay lại." },
  { id:"w15", type:"worse", content:"Hôm nay là dữ liệu, không phải thất bại." },
  { id:"w16", type:"worse", content:"Bạn đang hiểu bản thân rõ hơn." },
  { id:"w17", type:"worse", content:"Một bước lùi không xoá được những bước trước." },
  { id:"w18", type:"worse", content:"Bạn có thể dừng lại bất cứ lúc nào." },
  { id:"w19", type:"worse", content:"Không cần tự trách quá nhiều." },
  { id:"w20", type:"worse", content:"Bạn vẫn kiểm soát được hướng đi." },
  { id:"w21", type:"worse", content:"Hôm nay có thể là ngày thử thách." },
  { id:"w22", type:"worse", content:"Bạn không cần tiếp tục như vậy." },
  { id:"w23", type:"worse", content:"Bạn có thể chọn khác đi từ lần sau." },
  { id:"w24", type:"worse", content:"Chỉ cần nhận ra là đã tốt." },
  { id:"w25", type:"worse", content:"Bạn vẫn đang trên hành trình." },
  { id:"w26", type:"worse", content:"Không có gì là quá muộn." },
  { id:"w27", type:"worse", content:"Bạn chưa mất tất cả." },
  { id:"w28", type:"worse", content:"Bạn có thể giảm lại từ ngày mai." },
  { id:"w29", type:"worse", content:"Bạn vẫn có quyền thay đổi." },
  { id:"w30", type:"worse", content:"Không cần hoàn hảo ngay lập tức." },
  { id:"w31", type:"worse", content:"Hôm nay chỉ là một điểm trên đường." },
  { id:"w32", type:"worse", content:"Bạn vẫn đang học." },
  { id:"w33", type:"worse", content:"Bạn có thể làm khác đi." },
  { id:"w34", type:"worse", content:"Không cần ép, chỉ cần nhận ra." },
  { id:"w35", type:"worse", content:"Bạn vẫn có thể quay lại quỹ đạo." },
];
const SEED_HABITS = [
  { id: "h1", name: "Hút thuốc", unit: "điếu", created_at: new Date().toISOString() },
];

// ─── Storage ──────────────────────────────────────────────────────────────────
function load(key, fallback) {
  try { return JSON.parse(localStorage.getItem(key)) ?? fallback; }
  catch { return fallback; }
}
function save(key, val) { localStorage.setItem(key, JSON.stringify(val)); }

// ─── Date helpers (local time, timezone-safe) ─────────────────────────────────
function todayStr() {
  const d = new Date();
  return d.getFullYear() + "-" + String(d.getMonth()+1).padStart(2,"0") + "-" + String(d.getDate()).padStart(2,"0");
}
function yesterdayStr() {
  const d = new Date(); d.setDate(d.getDate()-1);
  return d.getFullYear() + "-" + String(d.getMonth()+1).padStart(2,"0") + "-" + String(d.getDate()).padStart(2,"0");
}
function localDateSlice(iso) {
  const d = new Date(iso);
  return d.getFullYear() + "-" + String(d.getMonth()+1).padStart(2,"0") + "-" + String(d.getDate()).padStart(2,"0");
}
function getLast7Days() {
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(); d.setDate(d.getDate()-(6-i));
    return d.getFullYear() + "-" + String(d.getMonth()+1).padStart(2,"0") + "-" + String(d.getDate()).padStart(2,"0");
  });
}
function fmtTime(iso) { return new Date(iso).toLocaleTimeString("vi-VN", { hour:"2-digit", minute:"2-digit" }); }
function dayLabel(dateStr) {
  const [y,m,dd] = dateStr.split("-").map(Number);
  return new Date(y,m-1,dd).toLocaleDateString("vi-VN",{weekday:"short"});
}

// ─── Misc ─────────────────────────────────────────────────────────────────────
function uid() { return Math.random().toString(36).slice(2) + Date.now().toString(36); }

function getEncouragement(messages, todayCount, yestCount) {
  let type = "same";
  if (todayCount < yestCount) type = "improve";
  else if (todayCount > yestCount) type = "worse";
  const pool = messages.filter(m => m.type === type);
  if (!pool.length) return null;
  return pool[Math.floor(Math.random() * pool.length)];
}

function mergeById(oldArr, newArr) {
  const map = new Map(oldArr.map(i => [i.id, i]));
  newArr.forEach(i => { if (!map.has(i.id)) map.set(i.id, i); });
  return Array.from(map.values());
}

// ─── Export / Import ──────────────────────────────────────────────────────────
function exportData(habits, logs, messages) {
  const payload = { version: 1, exported_at: new Date().toISOString(), data: { habits, logs, messages } };
  const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url; a.download = `quan-sat-backup-${todayStr()}.json`; a.click();
  URL.revokeObjectURL(url);
}

function validateImport(raw) {
  if (!raw.version || !raw.data) throw new Error("Thiếu version hoặc data");
  if (!Array.isArray(raw.data.habits))   throw new Error("habits không hợp lệ");
  if (!Array.isArray(raw.data.logs))     throw new Error("logs không hợp lệ");
  if (!Array.isArray(raw.data.messages)) throw new Error("messages không hợp lệ");
  const now = new Date().toISOString();
  const habits   = raw.data.habits.map(h   => ({ id: h.id||uid(),   name: h.name||"?",       unit: h.unit||"lần", created_at: h.created_at||now }));
  const logs     = raw.data.logs.map(l     => ({ id: l.id||uid(),   habit_id: l.habit_id||"", quantity: Number(l.quantity)||1, note: l.note??"", created_at: l.created_at||now }));
  const messages = raw.data.messages.map(m => ({ id: m.id||uid(),   type: m.type||"same",     content: m.content||"", created_at: m.created_at||now }));
  return { habits, logs, messages };
}

// ─── Toast ────────────────────────────────────────────────────────────────────
function useToast() {
  const [toasts, setToasts] = useState([]);
  const push = useCallback((msg, type="success") => {
    const id = uid();
    setToasts(p => [...p, { id, msg, type }]);
    setTimeout(() => setToasts(p => p.filter(t => t.id !== id)), 3000);
  }, []);
  return { toasts, push };
}
function Toast({ toasts }) {
  return (
    <div className="fixed top-4 right-4 z-[100] flex flex-col gap-2 pointer-events-none">
      {toasts.map(t => (
        <div key={t.id} className={`px-4 py-3 rounded-2xl shadow-lg text-sm font-medium text-white animate-slide-in
          ${t.type==="error"?"bg-rose-500":t.type==="warn"?"bg-amber-500":"bg-emerald-500"}`}>
          {t.msg}
        </div>
      ))}
    </div>
  );
}

// ─── Icons ────────────────────────────────────────────────────────────────────
const Icon = {
  home:     ()=><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-5 h-5"><path d="M3 12L12 3l9 9M5 10v9a1 1 0 001 1h4v-5h4v5h4a1 1 0 001-1v-9"/></svg>,
  list:     ()=><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-5 h-5"><path d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01"/></svg>,
  sparkle:  ()=><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-5 h-5"><path d="M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4L12 17l-6.2 4.3 2.4-7.4L2 9.4h7.6z"/></svg>,
  settings: ()=><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-5 h-5"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-2 2 2 2 0 01-2-2v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 01-2-2 2 2 0 012-2h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 010-2.83 2 2 0 012.83 0l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 012-2 2 2 0 012 2v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 012 2 2 2 0 01-2 2h-.09a1.65 1.65 0 00-1.51 1z"/></svg>,
  plus:     ()=><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" className="w-5 h-5"><path d="M12 5v14M5 12h14"/></svg>,
  trash:    ()=><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-4 h-4"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/><path d="M10 11v6M14 11v6"/><path d="M9 6V4h6v2"/></svg>,
  edit:     ()=><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-4 h-4"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>,
  x:        ()=><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5"><path d="M18 6L6 18M6 6l12 12"/></svg>,
  upload:   ()=><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-5 h-5"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>,
  download: ()=><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-5 h-5"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>,
};

// ─── Mini Chart ───────────────────────────────────────────────────────────────
function MiniChart({ logs, habitId }) {
  const days = getLast7Days();
  const counts = days.map(d =>
    logs.filter(l => l.habit_id===habitId && localDateSlice(l.created_at)===d)
        .reduce((s,l) => s+l.quantity, 0)
  );
  const max = Math.max(...counts, 1);
  return (
    <div className="flex items-end gap-1 h-12 mt-3">
      {counts.map((c,i) => (
        <div key={i} className="flex-1 flex flex-col items-center gap-0.5">
          <div className={`w-full rounded-t transition-all duration-500 ${i===6?"bg-amber-500":"bg-stone-300"}`}
               style={{ height:`${Math.max((c/max)*40, c>0?4:1)}px` }} />
          <span className="text-[9px] text-stone-400">{dayLabel(days[i])}</span>
        </div>
      ))}
    </div>
  );
}

// ─── Modal ────────────────────────────────────────────────────────────────────
function Modal({ title, onClose, children, maxW="sm:max-w-md" }) {
  useEffect(() => {
    const h = e => e.key==="Escape" && onClose();
    document.addEventListener("keydown", h);
    return () => document.removeEventListener("keydown", h);
  }, [onClose]);
  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="absolute inset-0 bg-stone-900/40 backdrop-blur-sm" onClick={onClose}/>
      <div className={`relative w-full ${maxW} bg-amber-50 rounded-t-3xl sm:rounded-2xl shadow-2xl p-6 pb-8`}>
        <div className="flex items-center justify-between mb-5">
          <h3 className="font-semibold text-stone-800 text-lg">{title}</h3>
          <button onClick={onClose} className="text-stone-400 hover:text-stone-700 transition-colors"><Icon.x/></button>
        </div>
        {children}
      </div>
    </div>
  );
}

// ─── Dashboard Page ───────────────────────────────────────────────────────────
function DashboardPage({ habits, logs, messages, onAddLog, onAddHabit, onDeleteHabit }) {
  const [showHabitForm, setShowHabitForm] = useState(false);
  const [newHabit, setNewHabit] = useState({ name:"", unit:"" });
  const [customState, setCustomState] = useState({});

  const today = todayStr();
  const yest  = yesterdayStr();

  function sumLogs(habitId, dateStr) {
    return logs.filter(l => l.habit_id===habitId && localDateSlice(l.created_at)===dateStr)
               .reduce((s,l) => s+l.quantity, 0);
  }
  function quickAdd(habit, qty, note="") {
    onAddLog({ id:uid(), habit_id:habit.id, quantity:qty, note, created_at:new Date().toISOString() });
  }
  function getCustom(id) { return customState[id] || { show:false, qty:"", note:"" }; }
  function setCustom(id, patch) { setCustomState(p => ({ ...p, [id]:{ ...getCustom(id), ...patch } })); }

  function handleAddHabit() {
    if (!newHabit.name.trim()) return;
    onAddHabit({ id:uid(), name:newHabit.name.trim(), unit:newHabit.unit.trim()||"lần", created_at:new Date().toISOString() });
    setNewHabit({ name:"", unit:"" }); setShowHabitForm(false);
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs text-stone-400 tracking-widest uppercase mb-0.5">Nhật ký</p>
          <h1 className="text-2xl font-bold text-stone-800">
            {new Date().toLocaleDateString("vi-VN",{weekday:"long",day:"numeric",month:"long"})}
          </h1>
        </div>
        <button onClick={()=>setShowHabitForm(true)}
          className="w-10 h-10 rounded-full bg-amber-500 text-white flex items-center justify-center shadow-lg hover:bg-amber-600 transition-all active:scale-95">
          <Icon.plus/>
        </button>
      </div>

      {habits.length===0 && (
        <div className="text-center py-16 text-stone-400">
          <p className="text-4xl mb-3">🌱</p>
          <p className="text-sm">Chưa có thói quen nào.<br/>Nhấn <strong>+</strong> để bắt đầu.</p>
        </div>
      )}

      {habits.map(habit => {
        const t = sumLogs(habit.id, today);
        const y = sumLogs(habit.id, yest);
        const diff = t - y;
        const enc = getEncouragement(messages, t, y);
        const custom = getCustom(habit.id);
        return (
          <div key={habit.id} className="bg-white rounded-2xl p-5 shadow-sm border border-stone-100">
            <div className="flex items-start justify-between">
              <div>
                <h2 className="font-semibold text-stone-800 text-lg">{habit.name}</h2>
                <div className="flex items-baseline gap-1.5 mt-1">
                  <span className="text-3xl font-bold text-amber-600">{t}</span>
                  <span className="text-stone-400 text-sm">{habit.unit} hôm nay</span>
                </div>
                <div className="mt-1">
                  {diff===0 && y===0 ? <span className="text-xs text-stone-400">Ngày đầu tiên</span>
                  : diff===0         ? <span className="text-xs text-stone-500">= Hôm qua: {y} {habit.unit}</span>
                  : diff<0           ? <span className="text-xs text-emerald-600">↓ {Math.abs(diff)} {habit.unit} so với hôm qua ({y})</span>
                                     : <span className="text-xs text-rose-500">↑ {diff} {habit.unit} so với hôm qua ({y})</span>}
                </div>
              </div>
              <button onClick={()=>onDeleteHabit(habit.id)} className="text-stone-300 hover:text-rose-400 transition-colors p-1"><Icon.trash/></button>
            </div>

            <div className="flex gap-2 mt-4">
              <button onClick={()=>quickAdd(habit,1)}
                className="flex-1 bg-amber-50 hover:bg-amber-100 border border-amber-200 text-amber-700 font-medium text-sm rounded-xl py-2.5 transition-all active:scale-95">
                +1 {habit.unit}
              </button>
              <button onClick={()=>setCustom(habit.id,{show:!custom.show})}
                className="px-4 bg-stone-50 hover:bg-stone-100 border border-stone-200 text-stone-600 font-medium text-sm rounded-xl py-2.5 transition-all">
                + Khác
              </button>
            </div>

            {custom.show && (
              <div className="mt-3 space-y-2">
                <div className="flex gap-2">
                  <input type="number" min="1" placeholder={`Số ${habit.unit}`} value={custom.qty}
                    onChange={e=>setCustom(habit.id,{qty:e.target.value})}
                    className="w-24 border border-stone-200 rounded-xl px-3 py-2 text-sm bg-stone-50 focus:outline-none focus:border-amber-400"/>
                  <input placeholder="Ghi chú (tuỳ chọn)" value={custom.note}
                    onChange={e=>setCustom(habit.id,{note:e.target.value})}
                    className="flex-1 border border-stone-200 rounded-xl px-3 py-2 text-sm bg-stone-50 focus:outline-none focus:border-amber-400"/>
                </div>
                <button
                  onClick={()=>{const q=parseInt(custom.qty); if(q>0){quickAdd(habit,q,custom.note);setCustom(habit.id,{show:false,qty:"",note:""});}}}
                  className="w-full bg-amber-500 text-white text-sm font-medium py-2 rounded-xl hover:bg-amber-600 transition-all active:scale-95">
                  Thêm
                </button>
              </div>
            )}

            <MiniChart logs={logs} habitId={habit.id}/>

            {enc && t>0 && (
              <div className="mt-3 pt-3 border-t border-stone-100">
                <p className="text-xs text-stone-400 italic">"{enc.content}"</p>
              </div>
            )}
          </div>
        );
      })}

      {showHabitForm && (
        <Modal title="Thêm thói quen mới" onClose={()=>setShowHabitForm(false)}>
          <div className="space-y-3">
            <div>
              <label className="text-xs font-medium text-stone-500 uppercase tracking-wider">Tên thói quen</label>
              <input autoFocus value={newHabit.name} onChange={e=>setNewHabit(p=>({...p,name:e.target.value}))}
                placeholder="Ví dụ: Hút thuốc, Uống cà phê…"
                className="w-full mt-1.5 border border-stone-200 rounded-xl px-4 py-3 bg-white text-stone-800 placeholder-stone-300 focus:outline-none focus:border-amber-400 text-sm"/>
            </div>
            <div>
              <label className="text-xs font-medium text-stone-500 uppercase tracking-wider">Đơn vị</label>
              <input value={newHabit.unit} onChange={e=>setNewHabit(p=>({...p,unit:e.target.value}))}
                placeholder="điếu, ly, lần…"
                className="w-full mt-1.5 border border-stone-200 rounded-xl px-4 py-3 bg-white text-stone-800 placeholder-stone-300 focus:outline-none focus:border-amber-400 text-sm"/>
            </div>
            <button onClick={handleAddHabit} disabled={!newHabit.name.trim()}
              className="w-full bg-amber-500 text-white font-medium py-3 rounded-xl hover:bg-amber-600 transition-all active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed mt-1">
              Tạo thói quen
            </button>
          </div>
        </Modal>
      )}
    </div>
  );
}

// ─── Log Page ─────────────────────────────────────────────────────────────────
function LogPage({ habits, logs, onDeleteLog }) {
  const [selectedHabit, setSelectedHabit] = useState("all");
  const today = todayStr();
  const filtered = logs
    .filter(l => selectedHabit==="all" || l.habit_id===selectedHabit)
    .filter(l => localDateSlice(l.created_at)===today)
    .sort((a,b) => new Date(b.created_at)-new Date(a.created_at));
  const getHabit = id => habits.find(h => h.id===id);
  return (
    <div className="space-y-4">
      <div>
        <p className="text-xs text-stone-400 tracking-widest uppercase mb-0.5">Nhật ký</p>
        <h1 className="text-2xl font-bold text-stone-800">Hôm nay</h1>
      </div>
      <div className="flex gap-2 overflow-x-auto pb-1">
        {[{id:"all",name:"Tất cả"},...habits].map(h=>(
          <button key={h.id} onClick={()=>setSelectedHabit(h.id)}
            className={`whitespace-nowrap px-4 py-1.5 rounded-full text-sm font-medium transition-all ${
              selectedHabit===h.id?"bg-amber-500 text-white":"bg-stone-100 text-stone-500 hover:bg-stone-200"}`}>
            {h.name}
          </button>
        ))}
      </div>
      {filtered.length===0 ? (
        <div className="text-center py-16 text-stone-400">
          <p className="text-4xl mb-3">📋</p>
          <p className="text-sm">Chưa có ghi chép nào hôm nay.</p>
        </div>
      ) : (
        <div className="space-y-2">
          {filtered.map(log=>{
            const habit=getHabit(log.habit_id); if(!habit)return null;
            return (
              <div key={log.id} className="bg-white rounded-2xl px-4 py-3 shadow-sm border border-stone-100 flex items-center justify-between">
                <div className="flex items-start gap-3">
                  <span className="text-xs text-stone-400 font-mono w-10 mt-0.5">{fmtTime(log.created_at)}</span>
                  <div>
                    <span className="text-stone-700 text-sm font-medium">{log.quantity} {habit.unit}</span>
                    <span className="text-stone-400 text-xs ml-1.5">· {habit.name}</span>
                    {log.note?<p className="text-xs text-stone-400 mt-0.5 italic">{log.note}</p>:null}
                  </div>
                </div>
                <button onClick={()=>onDeleteLog(log.id)} className="text-stone-300 hover:text-rose-400 transition-colors p-1 shrink-0"><Icon.trash/></button>
              </div>
            );
          })}
          <p className="text-center text-xs text-stone-300 pt-2">{filtered.length} lần ghi hôm nay</p>
        </div>
      )}
    </div>
  );
}

// ─── Encouragement Page ───────────────────────────────────────────────────────
function EncouragementPage({ messages, onAdd, onEdit, onDelete }) {
  const [showForm, setShowForm] = useState(false);
  const [editTarget, setEditTarget] = useState(null);
  const [form, setForm] = useState({ type:"improve", content:"" });
  const types = [
    { key:"improve", label:"Cải thiện ↓", color:"text-emerald-600 bg-emerald-50 border-emerald-200" },
    { key:"same",    label:"Giữ nguyên →",color:"text-sky-600 bg-sky-50 border-sky-200" },
    { key:"worse",   label:"Tăng thêm ↑", color:"text-rose-500 bg-rose-50 border-rose-200" },
  ];
  function openAdd()    { setForm({type:"improve",content:""}); setEditTarget(null); setShowForm(true); }
  function openEdit(m)  { setForm({type:m.type,content:m.content}); setEditTarget(m.id); setShowForm(true); }
  function handleSave() {
    if(!form.content.trim())return;
    if(editTarget) onEdit(editTarget,form); else onAdd({id:uid(),...form,created_at:new Date().toISOString()});
    setShowForm(false);
  }
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs text-stone-400 tracking-widest uppercase mb-0.5">Lời nhắc</p>
          <h1 className="text-2xl font-bold text-stone-800">Động viên</h1>
        </div>
        <button onClick={openAdd} className="w-10 h-10 rounded-full bg-amber-500 text-white flex items-center justify-center shadow-lg hover:bg-amber-600 transition-all active:scale-95"><Icon.plus/></button>
      </div>
      {types.map(t=>{
        const pool=messages.filter(m=>m.type===t.key);
        return (
          <div key={t.key}>
            <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full border text-xs font-medium mb-2 ${t.color}`}>{t.label}</div>
            {pool.length===0&&<p className="text-xs text-stone-300 pl-1 mb-3">Chưa có câu nào.</p>}
            <div className="space-y-2 mb-4">
              {pool.map(msg=>(
                <div key={msg.id} className="bg-white rounded-2xl px-4 py-3 border border-stone-100 shadow-sm flex items-start justify-between gap-3">
                  <p className="text-stone-700 text-sm italic flex-1">"{msg.content}"</p>
                  <div className="flex gap-2 shrink-0 mt-0.5">
                    <button onClick={()=>openEdit(msg)} className="text-stone-300 hover:text-amber-500 transition-colors"><Icon.edit/></button>
                    <button onClick={()=>onDelete(msg.id)} className="text-stone-300 hover:text-rose-400 transition-colors"><Icon.trash/></button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      })}
      {showForm&&(
        <Modal title={editTarget?"Sửa câu động viên":"Thêm câu động viên"} onClose={()=>setShowForm(false)}>
          <div className="space-y-3">
            <div>
              <label className="text-xs font-medium text-stone-500 uppercase tracking-wider">Loại</label>
              <div className="flex gap-2 mt-1.5">
                {types.map(t=>(
                  <button key={t.key} onClick={()=>setForm(p=>({...p,type:t.key}))}
                    className={`flex-1 py-2 rounded-xl text-xs font-medium border transition-all ${form.type===t.key?t.color:"bg-stone-50 border-stone-200 text-stone-500"}`}>
                    {t.label}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="text-xs font-medium text-stone-500 uppercase tracking-wider">Nội dung</label>
              <textarea autoFocus rows={3} value={form.content} onChange={e=>setForm(p=>({...p,content:e.target.value}))}
                placeholder="Viết câu động viên nhẹ nhàng, không phán xét…"
                className="w-full mt-1.5 border border-stone-200 rounded-xl px-4 py-3 bg-white text-stone-800 placeholder-stone-300 focus:outline-none focus:border-amber-400 text-sm resize-none"/>
            </div>
            <button onClick={handleSave} disabled={!form.content.trim()}
              className="w-full bg-amber-500 text-white font-medium py-3 rounded-xl hover:bg-amber-600 transition-all active:scale-95 disabled:opacity-40">
              {editTarget?"Lưu thay đổi":"Thêm câu"}
            </button>
          </div>
        </Modal>
      )}
    </div>
  );
}

// ─── Import Confirm Modal ─────────────────────────────────────────────────────
function ImportModal({ preview, onClose, onImport }) {
  const { habits, logs, messages } = preview;
  return (
    <Modal title="Nhập dữ liệu" onClose={onClose}>
      <div className="space-y-4">
        <div className="bg-stone-50 rounded-2xl p-4 border border-stone-100 space-y-2">
          <p className="text-xs text-stone-500 font-medium uppercase tracking-wider mb-1">Xem trước file</p>
          {[["Thói quen", habits.length],["Lần ghi", logs.length],["Câu động viên", messages.length]].map(([k,v])=>(
            <div key={k} className="flex justify-between text-sm">
              <span className="text-stone-500">{k}</span>
              <span className="font-semibold text-stone-800">{v}</span>
            </div>
          ))}
        </div>
        <p className="text-xs text-stone-400 text-center">Chọn cách nhập dữ liệu</p>
        <div className="grid grid-cols-2 gap-2">
          <button onClick={()=>onImport("overwrite")}
            className="py-4 rounded-2xl border-2 border-rose-200 bg-rose-50 text-rose-600 text-sm font-medium hover:bg-rose-100 transition-all active:scale-95">
            🔁 Ghi đè
            <p className="text-[10px] font-normal mt-1 text-rose-400">Xoá dữ liệu cũ</p>
          </button>
          <button onClick={()=>onImport("merge")}
            className="py-4 rounded-2xl border-2 border-emerald-200 bg-emerald-50 text-emerald-600 text-sm font-medium hover:bg-emerald-100 transition-all active:scale-95">
            ➕ Gộp
            <p className="text-[10px] font-normal mt-1 text-emerald-400">Giữ dữ liệu cũ</p>
          </button>
        </div>
      </div>
    </Modal>
  );
}

// ─── Settings / Habits Page ───────────────────────────────────────────────────
function HabitsPage({ habits, logs, messages, onAddHabit, onDeleteHabit, onImportData, onExportData, toast }) {
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name:"", unit:"" });
  const [importPreview, setImportPreview] = useState(null);
  const [dragOver, setDragOver] = useState(false);
  const fileRef = useRef();

  function handleAdd() {
    if(!form.name.trim())return;
    onAddHabit({id:uid(),name:form.name.trim(),unit:form.unit.trim()||"lần",created_at:new Date().toISOString()});
    setForm({name:"",unit:""}); setShowForm(false);
  }

  async function processFile(file) {
    if(!file)return;
    if(file.size>5*1024*1024){ toast("File quá lớn (tối đa 5MB)","error"); return; }
    try {
      const text = await file.text();
      const raw  = JSON.parse(text);
      setImportPreview(validateImport(raw));
    } catch(e) { toast("File không hợp lệ: "+e.message,"error"); }
  }

  function handleFileChange(e) { processFile(e.target.files[0]); e.target.value=""; }
  function handleDrop(e) { e.preventDefault(); setDragOver(false); processFile(e.dataTransfer.files[0]); }

  function handleImport(mode) {
    onImportData(importPreview, mode);
    setImportPreview(null);
    toast(mode==="overwrite"?"Đã ghi đè dữ liệu thành công ✓":"Đã gộp dữ liệu thành công ✓");
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs text-stone-400 tracking-widest uppercase mb-0.5">Quản lý</p>
          <h1 className="text-2xl font-bold text-stone-800">Cài đặt</h1>
        </div>
        <button onClick={()=>setShowForm(true)}
          className="w-10 h-10 rounded-full bg-amber-500 text-white flex items-center justify-center shadow-lg hover:bg-amber-600 transition-all active:scale-95">
          <Icon.plus/>
        </button>
      </div>

      {/* Habit list */}
      <div>
        <p className="text-xs text-stone-400 tracking-widest uppercase mb-2">Thói quen</p>
        {habits.length===0 && <p className="text-sm text-stone-400 py-3 text-center">Chưa có thói quen nào.</p>}
        <div className="space-y-2">
          {habits.map(h=>(
            <div key={h.id} className="bg-white rounded-2xl px-4 py-4 border border-stone-100 shadow-sm flex items-center justify-between">
              <div>
                <p className="font-semibold text-stone-800">{h.name}</p>
                <p className="text-xs text-stone-400">Đơn vị: {h.unit}</p>
              </div>
              <button onClick={()=>onDeleteHabit(h.id)} className="text-stone-300 hover:text-rose-400 transition-colors p-1"><Icon.trash/></button>
            </div>
          ))}
        </div>
      </div>

      {/* Export / Import */}
      <div className="pt-2 border-t border-stone-200">
        <p className="text-xs text-stone-400 tracking-widest uppercase mb-3">Sao lưu dữ liệu</p>

        <button
          onClick={()=>{ onExportData(); toast("Đã xuất file backup ✓"); }}
          className="w-full flex items-center justify-center gap-2.5 py-3.5 rounded-2xl bg-amber-500 hover:bg-amber-600 text-white font-medium text-sm transition-all active:scale-95 shadow-sm mb-3">
          <Icon.download/> Xuất dữ liệu (.json)
        </button>

        {/* Drag & drop zone */}
        <div
          onDragOver={e=>{e.preventDefault();setDragOver(true);}}
          onDragLeave={()=>setDragOver(false)}
          onDrop={handleDrop}
          onClick={()=>fileRef.current?.click()}
          className={`w-full flex flex-col items-center justify-center gap-2 py-6 rounded-2xl border-2 border-dashed cursor-pointer transition-all
            ${dragOver?"border-amber-400 bg-amber-50 text-amber-600":"border-stone-200 bg-stone-50 text-stone-500 hover:border-amber-300 hover:bg-amber-50/50 hover:text-amber-500"}`}>
          <Icon.upload/>
          <span className="text-sm font-medium">Nhập dữ liệu</span>
          <span className="text-xs text-stone-400">Kéo & thả hoặc nhấn để chọn file .json</span>
        </div>
        <input ref={fileRef} type="file" accept="application/json" className="hidden" onChange={handleFileChange}/>

        <p className="text-xs text-stone-400 text-center mt-3 leading-relaxed px-4">
          Dữ liệu lưu dưới dạng JSON — có thể backup hoặc chuyển sang thiết bị khác.
        </p>
      </div>

      {showForm && (
        <Modal title="Thêm thói quen" onClose={()=>setShowForm(false)}>
          <div className="space-y-3">
            <div>
              <label className="text-xs font-medium text-stone-500 uppercase tracking-wider">Tên</label>
              <input autoFocus value={form.name} onChange={e=>setForm(p=>({...p,name:e.target.value}))}
                placeholder="Hút thuốc, uống cà phê…"
                className="w-full mt-1.5 border border-stone-200 rounded-xl px-4 py-3 bg-white text-sm focus:outline-none focus:border-amber-400"/>
            </div>
            <div>
              <label className="text-xs font-medium text-stone-500 uppercase tracking-wider">Đơn vị</label>
              <input value={form.unit} onChange={e=>setForm(p=>({...p,unit:e.target.value}))}
                placeholder="điếu, ly, lần…"
                className="w-full mt-1.5 border border-stone-200 rounded-xl px-4 py-3 bg-white text-sm focus:outline-none focus:border-amber-400"/>
            </div>
            <button onClick={handleAdd} disabled={!form.name.trim()}
              className="w-full bg-amber-500 text-white font-medium py-3 rounded-xl hover:bg-amber-600 transition-all disabled:opacity-40">
              Tạo thói quen
            </button>
          </div>
        </Modal>
      )}

      {importPreview && <ImportModal preview={importPreview} onClose={()=>setImportPreview(null)} onImport={handleImport}/>}
    </div>
  );
}

// ─── App Shell ────────────────────────────────────────────────────────────────
export default function App() {
  const [habits,   setHabits]   = useState(()=>load("habits",       SEED_HABITS));
  const [logs,     setLogs]     = useState(()=>load("logs",         []));
  const [messages, setMessages] = useState(()=>{
    const stored = load("enc_messages", null);
    // Migrate old 7-item seed to new 104-item seed
    if (!stored || (stored.length <= 7 && stored.every(m => /^m\d$/.test(m.id)))) return SEED_MESSAGES;
    return stored;
  });
  const [page, setPage] = useState("dashboard");
  const { toasts, push:toast } = useToast();

  useEffect(()=>{ save("habits",       habits);   },[habits]);
  useEffect(()=>{ save("logs",         logs);     },[logs]);
  useEffect(()=>{ save("enc_messages", messages); },[messages]);

  const addHabit    = useCallback(h=>setHabits(p=>[...p,h]),[]);
  const deleteHabit = useCallback(id=>{ setHabits(p=>p.filter(h=>h.id!==id)); setLogs(p=>p.filter(l=>l.habit_id!==id)); },[]);
  const addLog      = useCallback(l=>setLogs(p=>[l,...p]),[]);
  const deleteLog   = useCallback(id=>setLogs(p=>p.filter(l=>l.id!==id)),[]);
  const addMsg      = useCallback(m=>setMessages(p=>[...p,m]),[]);
  const editMsg     = useCallback((id,d)=>setMessages(p=>p.map(m=>m.id===id?{...m,...d}:m)),[]);
  const deleteMsg   = useCallback(id=>setMessages(p=>p.filter(m=>m.id!==id)),[]);

  const handleExport = useCallback(()=>exportData(habits,logs,messages),[habits,logs,messages]);
  const handleImport = useCallback((data,mode)=>{
    if(mode==="overwrite"){ setHabits(data.habits); setLogs(data.logs); setMessages(data.messages); }
    else { setHabits(p=>mergeById(p,data.habits)); setLogs(p=>mergeById(p,data.logs)); setMessages(p=>mergeById(p,data.messages)); }
  },[]);

  const nav = [
    { id:"dashboard",     icon:<Icon.home/>,     label:"Tổng quan" },
    { id:"logs",          icon:<Icon.list/>,     label:"Nhật ký" },
    { id:"encouragement", icon:<Icon.sparkle/>,  label:"Lời nhắc" },
    { id:"habits",        icon:<Icon.settings/>, label:"Cài đặt" },
  ];

  return (
    <div className="min-h-screen bg-amber-50 font-sans">
      <style>{`
        @keyframes slide-in { from{opacity:0;transform:translateY(-8px)} to{opacity:1;transform:translateY(0)} }
        .animate-slide-in { animation:slide-in 0.2s ease; }
      `}</style>

      <Toast toasts={toasts}/>

      {/* Desktop sidebar */}
      <div className="hidden sm:flex fixed left-0 top-0 h-full w-56 bg-white border-r border-stone-100 flex-col py-8 px-4 shadow-sm z-10">
        <div className="mb-8 px-2">
          <p className="text-xs text-stone-400 tracking-widest uppercase">Ứng dụng</p>
          <h1 className="text-xl font-bold text-stone-800 mt-0.5">Quan sát</h1>
        </div>
        {nav.map(n=>(
          <button key={n.id} onClick={()=>setPage(n.id)}
            className={`flex items-center gap-3 px-3 py-2.5 rounded-xl mb-1 text-sm font-medium transition-all ${
              page===n.id?"bg-amber-50 text-amber-700":"text-stone-500 hover:text-stone-800 hover:bg-stone-50"}`}>
            {n.icon}{n.label}
          </button>
        ))}
      </div>

      <main className="sm:ml-56 pb-24 sm:pb-8 min-h-screen">
        <div className="max-w-xl mx-auto px-4 pt-8">
          {page==="dashboard"     && <DashboardPage habits={habits} logs={logs} messages={messages} onAddLog={addLog} onAddHabit={addHabit} onDeleteHabit={deleteHabit}/>}
          {page==="logs"          && <LogPage habits={habits} logs={logs} onDeleteLog={deleteLog}/>}
          {page==="encouragement" && <EncouragementPage messages={messages} onAdd={addMsg} onEdit={editMsg} onDelete={deleteMsg}/>}
          {page==="habits"        && <HabitsPage habits={habits} logs={logs} messages={messages} onAddHabit={addHabit} onDeleteHabit={deleteHabit} onImportData={handleImport} onExportData={handleExport} toast={toast}/>}
        </div>
      </main>

      {/* Mobile bottom nav */}
      <nav className="sm:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-stone-100 flex z-10">
        {nav.map(n=>(
          <button key={n.id} onClick={()=>setPage(n.id)}
            className={`flex-1 flex flex-col items-center gap-1 py-3 transition-all ${page===n.id?"text-amber-600":"text-stone-400"}`}>
            {n.icon}
            <span className="text-[10px] font-medium">{n.label}</span>
          </button>
        ))}
      </nav>
    </div>
  );
}
