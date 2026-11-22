// =========================================================
// Supabase 接続設定（ご自身のプロジェクトの値に差し替えてください）
// =========================================================
const SUPABASE_URL = 'https://dtgblouomioqqhzunrzv.supabase.co';
const SUPABASE_PUBLISHABLE_KEY = 'sb_publishable_s3V-tNcH0KWQ6mu5UmMA5w_m7os17qA';

// Supabaseクライアント初期化
const supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);

// アプリケーション状態
let currentUser = null;
let currentProfile = {
  nickname: '名無しの生活者',
  avatar_icon: '🏠',
  avatar_color: '#2b8a78',
  living_style: '一人暮らし'
};
let authMode = 'login'; // 'login' | 'signup'
let currentPostFilter = 'all'; // 'all' | 'mine'

// アバター選択肢
const AVATAR_ICONS = ['🏠', '🐱', '🐶', '🐰', '🐻', '🐧', '🌱', '🌻', '🍳', '🧺', '☕', '✨'];
const AVATAR_COLORS = [
  '#2b8a78', // ティールグリーン
  '#3b82f6', // ブルー
  '#6366f1', // インディゴ
  '#ec4899', // ピンク
  '#f97316', // オレンジ
  '#eab308', // イエロー
  '#10b981', // エメラルド
  '#64748b'  // スレートグレー
];

// =========================================================
// 「きほんのき」コラムデータ
// =========================================================
const COLUMNS_DATA = [
  {
    id: 'col-1',
    category: 'laundry',
    categoryLabel: '洗濯',
    title: '色移りを防ぐ！洗濯物の基本の分け方',
    summary: '白物と濃色衣類を分けるだけで、お気に入りの服がピンクやグレーになる悲劇を防げます。',
    body: `
      <p>初めての一人暮らしでよくある失敗が「洗濯物の色移り」です。最低限以下のルールを押さえておきましょう。</p>
      <ul>
        <li><strong>白い服と濃い色の服（黒・紺・赤など）は別々に洗う</strong>：特に新品のジーンズや濃い色のタオルは色落ちしやすいです。</li>
        <li><strong>洗濯ネットを活用する</strong>：ニット、下着、Tシャツのプリント部分は裏返してネットに入れると傷みや型崩れを防げます。</li>
        <li><strong>洗剤の入れすぎに注意</strong>：多く入れても洗浄力は上がらず、すすぎ残しや部屋干し臭の原因になります。</li>
      </ul>
    `
  },
  {
    id: 'col-2',
    category: 'cleaning',
    categoryLabel: '掃除',
    title: 'キッチンの排水口は「週1回」がラクする秘訣',
    summary: 'ぬめりや悪臭が発生してから掃除するのは大変。こまめなネット交換で清潔をキープしましょう。',
    body: `
      <p>キッチンの排水口は放置するとぬめりやコバエの原因になります。</p>
      <ul>
        <li><strong>水切りネットを必ず装着する</strong>：生ゴミを毎日〜2日に1回ネットごと捨てるだけで詰まりを防げます。</li>
        <li><strong>油は絶対に流さない</strong>：フライパンの油はキッチンペーパーで拭き取ってから洗います。冷えると配管で固まり詰まりの原因になります。</li>
        <li><strong>週に1回、食器用洗剤とスポンジで軽く洗う</strong>：汚れが溜まる前なら30秒で終わります。</li>
      </ul>
    `
  },
  {
    id: 'col-3',
    category: 'cooking',
    categoryLabel: '料理・キッチン',
    title: '炊いたご飯の正しい冷凍保存テクニック',
    summary: '炊飯器の保温機能を使い続けると電気代がかかり、ご飯もパサパサになります。',
    body: `
      <p>ご飯はまとめて炊いて、1食分ずつ冷凍するのが節約＆時短の基本です。</p>
      <ul>
        <li><strong>炊きたての湯気ごとラップで包む</strong>：冷めてから包むと水分が抜けてパサつきます。</li>
        <li><strong>平らに薄く形を整える</strong>：電子レンジで解凍する際、加熱ムラがなくなりふっくら仕上がります。</li>
        <li><strong>粗熱が取れたら冷凍庫へ</strong>：熱いまま入れると冷凍庫内の他の食材が傷むので、10〜15分ほど冷ましてから入れましょう。</li>
      </ul>
    `
  },
  {
    id: 'col-4',
    category: 'money',
    categoryLabel: '手続き・節約',
    title: '電気・ガス・水道の「検針票・マイページ」確認習慣',
    summary: '一人暮らしの公共料金の目安を知っておくと、使いすぎや漏水にすぐ気づけます。',
    body: `
      <p>毎月届く検針票やWeb明細をチェックする習慣をつけましょう。</p>
      <ul>
        <li><strong>エアコンは「自動運転」が一番節電になる</strong>：弱運転で長時間動かすより、自動運転で一気に適温にする方が消費電力が抑えられます。</li>
        <li><strong>シャワーの出しっぱなしに注意</strong>：1分間で約12リットルの水を使います。ガス代と水道代の両方に直結します。</li>
        <li><strong>引越し時の水抜き・ブレーカー確認</strong>：長期帰省時は待機電力カットのため不要なコンセントを抜いておきましょう。</li>
      </ul>
    `
  },
  {
    id: 'col-5',
    category: 'cleaning',
    categoryLabel: '掃除',
    title: 'お風呂のピンクぬめり・黒カビ予防の3ステップ',
    summary: 'お風呂上がりのたった1分の習慣で、大掃除の手間が激減します。',
    body: `
      <p>浴室の汚れは「皮脂・石けんカス・湿気」が原因です。</p>
      <ul>
        <li><strong>最後に熱いシャワーで壁と床を流す</strong>：石けんカスや皮脂を洗い流します。</li>
        <li><strong>冷水をかけて浴室の温度を下げる</strong>：カビは20〜30℃の高温多湿を好むため、温度を下げるると繁殖を抑えられます。</li>
        <li><strong>換気扇は24時間つけっぱなしにする</strong>：換気扇の電気代は1ヶ月つけっぱなしでも数百円程度です。</li>
      </ul>
    `
  },
  {
    id: 'col-6',
    category: 'laundry',
    categoryLabel: '洗濯',
    title: '部屋干しでも臭わない！生乾き臭対策のコツ',
    summary: '菌の繁殖を抑える干し方で、雨の日や夜間の部屋干しも快適になります。',
    body: `
      <p>生乾き臭の正体は、洗濯後5時間以上濡れた状態が続くことで増える「モラクセラ菌」です。</p>
      <ul>
        <li><strong>アーチ干しにする</strong>：両端に長い服、真ん中に短い服を干すと空気の通り道ができ早く乾きます。</li>
        <li><strong>扇風機やサーキュレーターで風を当てる</strong>：洗濯物の下から風を送ると乾燥時間が半分近くになります。</li>
        <li><strong>お風呂場での部屋干しは換気扇必須</strong>：浴室乾燥機がなくても、換気扇を回せば効率よく乾かせます。</li>
      </ul>
    `
  }
];

// =========================================================
// DOM要素の取得
// =========================================================
const navBtns = document.querySelectorAll('.nav-btn');
const views = document.querySelectorAll('.view');
const toastEl = document.getElementById('toastMessage');

// 認証・ヘッダープロフィール関連DOM
const openProfileModalBtn = document.getElementById('openProfileModalBtn');
const headerAvatar = document.getElementById('headerAvatar');
const headerNickname = document.getElementById('headerNickname');
const openAuthModalBtn = document.getElementById('openAuthModalBtn');
const logoutBtn = document.getElementById('logoutBtn');
const authModal = document.getElementById('authModal');
const closeAuthModalBtn = document.getElementById('closeAuthModalBtn');
const authTabs = document.querySelectorAll('.auth-tab');
const authForm = document.getElementById('authForm');
const authSubmitBtn = document.getElementById('authSubmitBtn');
const authErrorMsg = document.getElementById('authErrorMsg');

// プロフィールモーダル関連DOM
const profileModal = document.getElementById('profileModal');
const closeProfileModalBtn = document.getElementById('closeProfileModalBtn');
const profileForm = document.getElementById('profileForm');
const profileNicknameInput = document.getElementById('profileNickname');
const profileLivingStyleSelect = document.getElementById('profileLivingStyle');
const avatarIconGrid = document.getElementById('avatarIconGrid');
const avatarColorGrid = document.getElementById('avatarColorGrid');
const previewAvatarCircle = document.getElementById('previewAvatarCircle');
const previewNickname = document.getElementById('previewNickname');
const previewLivingStyle = document.getElementById('previewLivingStyle');
const saveProfileBtn = document.getElementById('saveProfileBtn');

// きほんのきDOM
const columnCategoryFilter = document.getElementById('columnCategoryFilter');
const columnList = document.getElementById('columnList');
const columnModal = document.getElementById('columnModal');
const closeColumnModalBtn = document.getElementById('closeColumnModalBtn');

// おたすけDOM
const helpAuthNotice = document.getElementById('helpAuthNotice');
const postForm = document.getElementById('postForm');
const postAsProfileBtn = document.getElementById('postAsProfileBtn');
const postFormAvatar = document.getElementById('postFormAvatar');
const postFormAuthorInfo = document.getElementById('postFormAuthorInfo');
const postsContainer = document.getElementById('postsContainer');
const postFilterBtns = document.querySelectorAll('[data-post-filter]');
const refreshPostsBtn = document.getElementById('refreshPostsBtn');

// リマインダーDOM
const reminderAuthNotice = document.getElementById('reminderAuthNotice');
const reminderWorkspace = document.getElementById('reminderWorkspace');
const consumableForm = document.getElementById('consumableForm');
const purchasedDateInput = document.getElementById('purchasedDate');
const consumablesContainer = document.getElementById('consumablesContainer');
const refreshConsumablesBtn = document.getElementById('refreshConsumablesBtn');
const homeAlertSummary = document.getElementById('homeAlertSummary');

// =========================================================
// ユーティリティ関数
// =========================================================
function showToast(message, isError = false) {
  toastEl.textContent = message;
  toastEl.classList.remove('hidden', 'error');
  if (isError) toastEl.classList.add('error');
  clearTimeout(window.__toastTimer);
  window.__toastTimer = setTimeout(() => {
    toastEl.classList.add('hidden');
  }, 3500);
}

function escapeHtml(str) {
  if (!str) return '';
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function formatDateJP(dateString) {
  const date = new Date(dateString);
  if (Number.isNaN(date.getTime())) return dateString;
  return `${date.getFullYear()}年${date.getMonth() + 1}月${date.getDate()}日`;
}

function getTodayISO() {
  const now = new Date();
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, '0');
  const d = String(now.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

// =========================================================
// 画面切り替え（ルーティング）
// =========================================================
function switchView(targetName) {
  views.forEach((v) => {
    v.classList.toggle('hidden', v.id !== `view-${targetName}`);
  });
  navBtns.forEach((btn) => {
    btn.classList.toggle('active', btn.dataset.target === targetName);
  });

  if (targetName === 'help') {
    loadPosts();
  } else if (targetName === 'reminder' && currentUser) {
    loadConsumables();
  }
}

navBtns.forEach((btn) => {
  btn.addEventListener('click', () => switchView(btn.dataset.target));
});

document.getElementById('logoBtn').addEventListener('click', () => switchView('home'));

document.querySelectorAll('.feature-card').forEach((card) => {
  card.addEventListener('click', () => switchView(card.dataset.goto));
});

// =========================================================
// プロフィール管理（作成・編集・プレビュー）
// =========================================================
let selectedIcon = '🏠';
let selectedColor = '#2b8a78';

function initProfilePickers() {
  avatarIconGrid.innerHTML = AVATAR_ICONS.map((icon) => `
    <button type="button" class="icon-choice" data-icon="${icon}">${icon}</button>
  `).join('');

  avatarColorGrid.innerHTML = AVATAR_COLORS.map((color) => `
    <button type="button" class="color-choice" data-color="${color}" style="background-color: ${color};" aria-label="${color}"></button>
  `).join('');

  avatarIconGrid.addEventListener('click', (e) => {
    const btn = e.target.closest('.icon-choice');
    if (!btn) return;
    selectedIcon = btn.dataset.icon;
    updateProfilePreview();
  });

  avatarColorGrid.addEventListener('click', (e) => {
    const btn = e.target.closest('.color-choice');
    if (!btn) return;
    selectedColor = btn.dataset.color;
    updateProfilePreview();
  });

  profileNicknameInput.addEventListener('input', updateProfilePreview);
  profileLivingStyleSelect.addEventListener('change', updateProfilePreview);
}

function updateProfilePreview() {
  const nick = profileNicknameInput.value.trim() || '名無しの生活者';
  const style = profileLivingStyleSelect.value;

  previewAvatarCircle.textContent = selectedIcon;
  previewAvatarCircle.style.backgroundColor = selectedColor;
  previewNickname.textContent = nick;
  previewLivingStyle.textContent = style;

  avatarIconGrid.querySelectorAll('.icon-choice').forEach((btn) => {
    btn.classList.toggle('selected', btn.dataset.icon === selectedIcon);
  });

  avatarColorGrid.querySelectorAll('.color-choice').forEach((btn) => {
    btn.classList.toggle('selected', btn.dataset.color === selectedColor);
  });
}

function openProfileModal(isFirstSetup = false) {
  if (!currentUser) return;
  document.getElementById('profileModalTitle').textContent = isFirstSetup
    ? 'はじめまして！プロフィールを作成しよう'
    : 'プロフィール設定';

  profileNicknameInput.value = currentProfile.nickname || '';
  profileLivingStyleSelect.value = currentProfile.living_style || '一人暮らし';
  selectedIcon = currentProfile.avatar_icon || '🏠';
  selectedColor = currentProfile.avatar_color || '#2b8a78';

  updateProfilePreview();
  profileModal.classList.remove('hidden');
}

function renderProfileDisplays() {
  // ヘッダー表示更新
  headerAvatar.textContent = currentProfile.avatar_icon;
  headerAvatar.style.backgroundColor = currentProfile.avatar_color;
  headerNickname.textContent = currentProfile.nickname;

  // 投稿フォーム上の表示更新
  postFormAvatar.textContent = currentProfile.avatar_icon;
  postFormAvatar.style.backgroundColor = currentProfile.avatar_color;
  postFormAuthorInfo.textContent = `${currentProfile.nickname}（${currentProfile.living_style}）`;
}

async function fetchOrCreateUserProfile(user) {
  const { data, error } = await supabaseClient
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .maybeSingle();

  if (error) {
    console.error('プロフィール取得エラー:', error.message);
    return;
  }

  if (data) {
    currentProfile = {
      nickname: data.nickname || '名無しの生活者',
      avatar_icon: data.avatar_icon || '🏠',
      avatar_color: data.avatar_color || '#2b8a78',
      living_style: data.living_style || '一人暮らし'
    };
    renderProfileDisplays();

    // 初期状態のままなら初回作成モーダルを案内
    if (!data.nickname || data.nickname === '名無しの生活者') {
      openProfileModal(true);
    }
  } else {
    // レコードがない場合はデフォルト作成してモーダルを開く
    const defaultProfile = {
      id: user.id,
      nickname: '名無しの生活者',
      avatar_icon: '🏠',
      avatar_color: '#2b8a78',
      living_style: '一人暮らし'
    };
    await supabaseClient.from('profiles').upsert(defaultProfile);
    currentProfile = defaultProfile;
    renderProfileDisplays();
    openProfileModal(true);
  }
}

profileForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  if (!currentUser) return;

  const nickname = profileNicknameInput.value.trim() || '名無しの生活者';
  const livingStyle = profileLivingStyleSelect.value;

  saveProfileBtn.disabled = true;

  const { error } = await supabaseClient
    .from('profiles')
    .upsert({
      id: currentUser.id,
      nickname,
      avatar_icon: selectedIcon,
      avatar_color: selectedColor,
      living_style: livingStyle
    });

  saveProfileBtn.disabled = false;

  if (error) {
    showToast(`プロフィールの保存に失敗しました: ${error.message}`, true);
    return;
  }

  currentProfile = {
    nickname,
    avatar_icon: selectedIcon,
    avatar_color: selectedColor,
    living_style: livingStyle
  };

  renderProfileDisplays();
  profileModal.classList.add('hidden');
  showToast('プロフィールを保存しました！');
  loadPosts();
});

openProfileModalBtn.addEventListener('click', () => openProfileModal(false));
postAsProfileBtn.addEventListener('click', () => openProfileModal(false));
closeProfileModalBtn.addEventListener('click', () => profileModal.classList.add('hidden'));

// =========================================================
// 認証処理（Supabase Auth: メール + パスワード）
// =========================================================
function openAuthModal(mode = 'login') {
  authMode = mode;
  authErrorMsg.classList.add('hidden');
  authForm.reset();
  updateAuthModalUI();
  authModal.classList.remove('hidden');
}

function updateAuthModalUI() {
  authTabs.forEach((tab) => {
    tab.classList.toggle('active', tab.dataset.authMode === authMode);
  });
  authSubmitBtn.textContent = authMode === 'login' ? 'ログインする' : '新規会員登録する';
}

openAuthModalBtn.addEventListener('click', () => openAuthModal('login'));
closeAuthModalBtn.addEventListener('click', () => authModal.classList.add('hidden'));

document.querySelectorAll('.trigger-login').forEach((btn) => {
  btn.addEventListener('click', () => openAuthModal('login'));
});

authTabs.forEach((tab) => {
  tab.addEventListener('click', () => {
    authMode = tab.dataset.authMode;
    authErrorMsg.classList.add('hidden');
    updateAuthModalUI();
  });
});

authForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const email = document.getElementById('authEmail').value.trim();
  const password = document.getElementById('authPassword').value;

  authErrorMsg.classList.add('hidden');
  authSubmitBtn.disabled = true;

  try {
    if (authMode === 'signup') {
      const { data, error } = await supabaseClient.auth.signUp({
        email,
        password
      });
      if (error) throw error;

      if (data.session) {
        showToast('会員登録が完了しました！プロフィールを設定しましょう');
        authModal.classList.add('hidden');
      } else {
        showToast('確認メールを送信しました。メール内のリンクを確認してログインしてください。');
        authModal.classList.add('hidden');
      }
    } else {
      const { error } = await supabaseClient.auth.signInWithPassword({
        email,
        password
      });
      if (error) throw error;

      showToast('ログインしました！');
      authModal.classList.add('hidden');
    }
  } catch (err) {
    authErrorMsg.textContent = `エラー: ${err.message}`;
    authErrorMsg.classList.remove('hidden');
  } finally {
    authSubmitBtn.disabled = false;
  }
});

logoutBtn.addEventListener('click', async () => {
  const { error } = await supabaseClient.auth.signOut();
  if (error) {
    showToast(`ログアウトに失敗しました: ${error.message}`, true);
    return;
  }
  showToast('ログアウトしました');
});

async function updateUIForUser(user) {
  currentUser = user;
  if (user) {
    openProfileModalBtn.classList.remove('hidden');
    openAuthModalBtn.classList.add('hidden');
    logoutBtn.classList.remove('hidden');

    // おたすけフォーム表示
    helpAuthNotice.classList.add('hidden');
    postForm.classList.remove('hidden');
    postAsProfileBtn.classList.remove('hidden');

    // リマインダー表示
    reminderAuthNotice.classList.add('hidden');
    reminderWorkspace.classList.remove('hidden');

    await fetchOrCreateUserProfile(user);
    loadConsumables();
  } else {
    openProfileModalBtn.classList.add('hidden');
    openAuthModalBtn.classList.remove('hidden');
    logoutBtn.classList.add('hidden');

    // おたすけフォーム非表示
    helpAuthNotice.classList.remove('hidden');
    postForm.classList.add('hidden');
    postAsProfileBtn.classList.add('hidden');

    // リマインダー非表示
    reminderAuthNotice.classList.remove('hidden');
    reminderWorkspace.classList.add('hidden');
    homeAlertSummary.classList.add('hidden');
  }
  loadPosts();
}

// =========================================================
// きほんのき（コラム表示・フィルタリング）
// =========================================================
function renderColumns(category = 'all') {
  const filtered = category === 'all'
    ? COLUMNS_DATA
    : COLUMNS_DATA.filter((col) => col.category === category);

  columnList.innerHTML = filtered.map((col) => `
    <article class="column-card" data-col-id="${col.id}">
      <span class="badge">${escapeHtml(col.categoryLabel)}</span>
      <h3>${escapeHtml(col.title)}</h3>
      <p>${escapeHtml(col.summary)}</p>
    </article>
  `).join('');

  columnList.querySelectorAll('.column-card').forEach((card) => {
    card.addEventListener('click', () => {
      const target = COLUMNS_DATA.find((c) => c.id === card.dataset.colId);
      if (!target) return;
      document.getElementById('columnModalBadge').textContent = target.categoryLabel;
      document.getElementById('columnModalTitle').textContent = target.title;
      document.getElementById('columnModalBody').innerHTML = target.body;
      columnModal.classList.remove('hidden');
    });
  });
}

columnCategoryFilter.addEventListener('click', (e) => {
  const btn = e.target.closest('.filter-chip');
  if (!btn) return;
  columnCategoryFilter.querySelectorAll('.filter-chip').forEach((c) => c.classList.remove('active'));
  btn.classList.add('active');
  renderColumns(btn.dataset.category);
});

closeColumnModalBtn.addEventListener('click', () => columnModal.classList.add('hidden'));

// =========================================================
// おたすけ掲示板（Supabase: posts テーブル CRUD）
// =========================================================
async function loadPosts() {
  postsContainer.innerHTML = '<p class="loading-text">読み込み中...</p>';

  let query = supabaseClient
    .from('posts')
    .select('*')
    .order('created_at', { ascending: false });

  if (currentPostFilter === 'mine') {
    if (!currentUser) {
      postsContainer.innerHTML = '<p class="empty-text">自分の投稿を見るにはログインしてください。</p>';
      return;
    }
    query = query.eq('user_id', currentUser.id);
  }

  const { data, error } = await query;

  if (error) {
    postsContainer.innerHTML = `<p class="empty-text">投稿の取得に失敗しました: ${escapeHtml(error.message)}</p>`;
    return;
  }

  if (!data || data.length === 0) {
    postsContainer.innerHTML = '<p class="empty-text">まだ投稿がありません。最初の投稿をしてみましょう！</p>';
    return;
  }

  postsContainer.innerHTML = data.map((post) => {
    const isMine = currentUser && post.user_id === currentUser.id;
    // 自分の投稿は最新のプロフィールを反映、他人の投稿は保存されたプロフィールを表示
    const nickname = isMine ? currentProfile.nickname : (post.author_nickname || '名無しの生活者');
    const avatarIcon = isMine ? currentProfile.avatar_icon : (post.author_avatar_icon || '🏠');
    const avatarColor = isMine ? currentProfile.avatar_color : (post.author_avatar_color || '#2b8a78');
    const livingStyle = isMine ? currentProfile.living_style : (post.author_living_style || '一人暮らし');

    return `
      <article class="post-item">
        <div class="post-meta">
          <span class="badge">${escapeHtml(post.category)}</span>
          <span class="post-date">${formatDateJP(post.created_at)}</span>
        </div>
        <h4 class="post-title">${escapeHtml(post.title)}</h4>
        <p class="post-content">${escapeHtml(post.content)}</p>
        <div class="post-footer">
          <div class="post-author-box">
            <span class="avatar-circle avatar-md" style="background-color: ${escapeHtml(avatarColor)};">${escapeHtml(avatarIcon)}</span>
            <div class="post-author-meta">
              <span class="post-author-name">${escapeHtml(nickname)}</span>
              <span class="living-tag">${escapeHtml(livingStyle)}</span>
            </div>
          </div>
          ${isMine ? `<button type="button" class="btn btn-danger btn-sm delete-post-btn" data-id="${post.id}">削除</button>` : ''}
        </div>
      </article>
    `;
  }).join('');

  postsContainer.querySelectorAll('.delete-post-btn').forEach((btn) => {
    btn.addEventListener('click', () => deletePost(btn.dataset.id));
  });
}

postForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  if (!currentUser) {
    showToast('投稿するにはログインが必要です', true);
    return;
  }

  const category = document.getElementById('postCategory').value;
  const title = document.getElementById('postTitle').value.trim();
  const content = document.getElementById('postContent').value.trim();

  const { error } = await supabaseClient.from('posts').insert([
    {
      user_id: currentUser.id,
      author_email: currentUser.email,
      author_nickname: currentProfile.nickname,
      author_avatar_icon: currentProfile.avatar_icon,
      author_avatar_color: currentProfile.avatar_color,
      author_living_style: currentProfile.living_style,
      category,
      title,
      content
    }
  ]);

  if (error) {
    showToast(`投稿に失敗しました: ${error.message}`, true);
    return;
  }

  postForm.reset();
  showToast('投稿しました！');
  loadPosts();
});

async function deletePost(postId) {
  if (!confirm('この投稿を削除してもよろしいですか？')) return;

  const { error } = await supabaseClient
    .from('posts')
    .delete()
    .eq('id', postId);

  if (error) {
    showToast(`削除に失敗しました: ${error.message}`, true);
    return;
  }

  showToast('投稿を削除しました');
  loadPosts();
}

postFilterBtns.forEach((btn) => {
  btn.addEventListener('click', () => {
    postFilterBtns.forEach((b) => b.classList.remove('active'));
    btn.classList.add('active');
    currentPostFilter = btn.dataset.postFilter;
    loadPosts();
  });
});

refreshPostsBtn.addEventListener('click', loadPosts);

// =========================================================
// 消耗品リマインダー（Supabase: consumables テーブル CRUD）
// =========================================================
function calculateConsumableStatus(purchasedDateStr, cycleDays) {
  const purchased = new Date(purchasedDateStr + 'T00:00:00');
  const today = new Date(getTodayISO() + 'T00:00:00');
  const elapsedDays = Math.max(0, Math.floor((today - purchased) / (1000 * 60 * 60 * 24)));
  const remainingDays = cycleDays - elapsedDays;
  const remainingPercent = Math.max(0, Math.min(100, Math.round((remainingDays / cycleDays) * 100)));

  const nextPurchaseDate = new Date(purchased);
  nextPurchaseDate.setDate(nextPurchaseDate.getDate() + Number(cycleDays));
  const nextDateStr = `${nextPurchaseDate.getFullYear()}年${nextPurchaseDate.getMonth() + 1}月${nextPurchaseDate.getDate()}日`;

  let status = 'safe';
  let statusText = `あと約${remainingDays}日（余裕あり）`;

  if (remainingDays <= 0) {
    status = 'danger';
    statusText = remainingDays === 0 ? '今日が買い替え目安！' : `${Math.abs(remainingDays)}日超過・要補充！`;
  } else if (remainingDays <= 5 || remainingPercent <= 20) {
    status = 'warning';
    statusText = `そろそろ補充（残り約${remainingDays}日）`;
  }

  return {
    elapsedDays,
    remainingDays,
    remainingPercent,
    nextDateStr,
    status,
    statusText
  };
}

async function loadConsumables() {
  if (!currentUser) return;
  consumablesContainer.innerHTML = '<p class="loading-text">読み込み中...</p>';

  const { data, error } = await supabaseClient
    .from('consumables')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    consumablesContainer.innerHTML = `<p class="empty-text">データの取得に失敗しました: ${escapeHtml(error.message)}</p>`;
    return;
  }

  if (!data || data.length === 0) {
    consumablesContainer.innerHTML = '<p class="empty-text">登録された消耗品はまだありません。上のフォームから登録しましょう！</p>';
    homeAlertSummary.classList.add('hidden');
    return;
  }

  const enriched = data.map((item) => ({
    ...item,
    calc: calculateConsumableStatus(item.purchased_date, item.usage_cycle_days)
  })).sort((a, b) => a.calc.remainingDays - b.calc.remainingDays);

  const urgentItems = enriched.filter((i) => i.calc.status === 'danger' || i.calc.status === 'warning');
  if (urgentItems.length > 0) {
    const names = urgentItems.slice(0, 3).map((i) => i.name).join('、');
    homeAlertSummary.textContent = `⚠️ そろそろなくなりそうな消耗品が ${urgentItems.length}件 あります（${names}）`;
    homeAlertSummary.classList.remove('hidden');
  } else {
    homeAlertSummary.classList.add('hidden');
  }

  consumablesContainer.innerHTML = enriched.map((item) => {
    const { calc } = item;
    return `
      <article class="consumable-card status-${calc.status}">
        <div class="consumable-header">
          <div>
            <span class="badge">${escapeHtml(item.category)}</span>
            <h4>${escapeHtml(item.name)}</h4>
          </div>
          <span class="status-pill ${calc.status}">${calc.statusText}</span>
        </div>

        <div class="progress-track" aria-label="推定残量 ${calc.remainingPercent}%">
          <div class="progress-fill ${calc.status}" style="width: ${calc.remainingPercent}%"></div>
        </div>

        <div class="consumable-details">
          <span>推定残量目安: <strong>${calc.remainingPercent}%</strong>（${item.usage_cycle_days}日ペース）</span>
          <span>購入日: ${formatDateJP(item.purchased_date)} ／ 買い替え目安: ${calc.nextDateStr}</span>
        </div>

        <div class="consumable-actions">
          <button type="button" class="btn btn-primary btn-sm restock-btn" data-id="${item.id}">🛒 今日買い替えた（リセット）</button>
          <button type="button" class="btn btn-danger btn-sm delete-item-btn" data-id="${item.id}">削除</button>
        </div>
      </article>
    `;
  }).join('');

  consumablesContainer.querySelectorAll('.restock-btn').forEach((btn) => {
    btn.addEventListener('click', () => restockConsumable(btn.dataset.id));
  });

  consumablesContainer.querySelectorAll('.delete-item-btn').forEach((btn) => {
    btn.addEventListener('click', () => deleteConsumable(btn.dataset.id));
  });
}

consumableForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  if (!currentUser) return;

  const name = document.getElementById('itemName').value.trim();
  const category = document.getElementById('itemCategory').value;
  const purchasedDate = purchasedDateInput.value;
  const usageCycleDays = parseInt(document.getElementById('usageCycleDays').value, 10);

  const { error } = await supabaseClient.from('consumables').insert([
    {
      user_id: currentUser.id,
      name,
      category,
      purchased_date: purchasedDate,
      usage_cycle_days: usageCycleDays
    }
  ]);

  if (error) {
    showToast(`登録に失敗しました: ${error.message}`, true);
    return;
  }

  consumableForm.reset();
  purchasedDateInput.value = getTodayISO();
  showToast('消耗品を登録しました！');
  loadConsumables();
});

async function restockConsumable(itemId) {
  const { error } = await supabaseClient
    .from('consumables')
    .update({ purchased_date: getTodayISO() })
    .eq('id', itemId);

  if (error) {
    showToast(`更新に失敗しました: ${error.message}`, true);
    return;
  }

  showToast('購入日を本日に更新しました！');
  loadConsumables();
}

async function deleteConsumable(itemId) {
  if (!confirm('この消耗品をリストから削除しますか？')) return;

  const { error } = await supabaseClient
    .from('consumables')
    .delete()
    .eq('id', itemId);

  if (error) {
    showToast(`削除に失敗しました: ${error.message}`, true);
    return;
  }

  showToast('削除しました');
  loadConsumables();
}

refreshConsumablesBtn.addEventListener('click', loadConsumables);

// =========================================================
// 初期化処理
// =========================================================
async function initApp() {
  purchasedDateInput.value = getTodayISO();
  initProfilePickers();
  renderColumns('all');

  const { data: { session } } = await supabaseClient.auth.getSession();
  await updateUIForUser(session?.user ?? null);

  supabaseClient.auth.onAuthStateChange((_event, newSession) => {
    updateUIForUser(newSession?.user ?? null);
  });
}

initApp();