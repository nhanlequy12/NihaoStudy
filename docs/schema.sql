-- Cấu trúc database đề xuất cho Nǐ hǎo (PostgreSQL 15+, dùng được với Supabase).
-- Nội dung (từ, chữ, bài học, đề) nạp từ data/ bằng script; dữ liệu người học ghi theo user_id.

-- ========== NỘI DUNG ==========

create table word (
  id            serial primary key,
  hz            text not null unique,          -- giản thể
  trad          text,
  py            text not null,                 -- pinyin có dấu
  py_num        text,
  py_alt        text[],
  hsk2          smallint check (hsk2 between 1 and 6),
  hsk3          smallint check (hsk3 between 1 and 7),   -- 7 = cấp 7–9
  pos           text,                          -- mã từ loại gốc
  pos_vi        text,
  vi            text,                          -- nghĩa tiếng Việt (tự soạn)
  hv            text,                          -- âm Hán Việt
  hv_checked    boolean not null default false,
  en            text,                          -- CC-CEDICT (CC BY-SA 4.0)
  freq          integer,
  radical       text,
  src           jsonb not null default '{}'    -- nguồn từng trường, vd {"en":"cc-cedict","vi":"nihao"}
);
create index on word (hsk3);
create index on word (hsk2);

create table example (
  id        serial primary key,
  word_id   integer not null references word(id) on delete cascade,
  zh        text not null,
  py        text not null,
  vi        text not null,
  audio_url text,
  sort      smallint not null default 0
);

create table hanzi (
  ch             text primary key,             -- một chữ
  strokes        smallint,
  rs             text,                         -- bộ.số nét (Unihan kRSUnicode)
  hv             text,
  decomposition  text,                         -- Make Me a Hanzi (LGPL)
  etymology      jsonb,
  stroke_data    text                          -- URL hanzi-writer-data (Arphic PL)
);

create table radical (
  id      smallint primary key,                -- số thứ tự Khang Hy 1–214
  form    text not null,
  variants text[],
  hv      text,
  vi      text,
  strokes smallint
);

create table course (                          -- "HSK 2.0" / "HSK 3.0"
  id    text primary key,                      -- 'hsk2' | 'hsk3'
  name  text not null
);

create table lesson (
  id        serial primary key,
  course_id text not null references course(id),
  level     smallint not null,
  no        smallint not null,                 -- số bài trong khóa
  title     text not null,
  subtitle  text,
  body      jsonb not null,                    -- goals, grammar[], dialogue[], sentences[], tips
  published boolean not null default false,
  unique (course_id, no)
);

create table lesson_word (
  lesson_id integer references lesson(id) on delete cascade,
  word_id   integer references word(id),
  sort      smallint,
  primary key (lesson_id, word_id)
);

create table reading (
  id         serial primary key,
  level      smallint not null,
  after_lesson integer references lesson(id),
  title      text not null,
  zh text not null, py text, vi text,
  questions  jsonb
);

-- ========== ĐỀ THI ==========

create table exam (
  id          text primary key,                -- 'hsk4-de01'
  course_id   text not null references course(id),
  level       smallint not null,
  title       text not null,
  minutes     smallint not null,
  total_score smallint not null,
  pass_score  smallint not null,
  spec        jsonb not null,                  -- cấu trúc phần/thời gian
  published   boolean not null default false
);

create table exam_item (
  id        serial primary key,
  exam_id   text not null references exam(id) on delete cascade,
  section   text not null,                     -- listening | reading | writing | translation | speaking
  part      smallint not null,
  no        smallint not null,                 -- số câu trong đề
  type      text not null,                     -- l_tf, r_cloze, w_order...
  payload   jsonb not null,                    -- audio script, câu hỏi, lựa chọn
  answer    jsonb not null,
  explain_vi text,
  skill_tags text[],                           -- để thống kê lỗi theo kỹ năng
  unique (exam_id, no)
);

-- ========== NGƯỜI HỌC ==========

create table app_user (
  id          uuid primary key,                -- = auth.users.id nếu dùng Supabase
  display_name text,
  target_course text references course(id) default 'hsk3',
  target_level smallint,
  exam_date   date,
  daily_goal_min smallint default 30,
  created_at  timestamptz not null default now()
);

create table srs_card (                        -- thẻ ôn tập SM-2
  user_id   uuid references app_user(id) on delete cascade,
  word_id   integer references word(id),
  deck      text not null default 'read',      -- read | write
  ease      real not null default 2.5,
  interval_days integer not null default 0,
  reps      integer not null default 0,
  lapses    integer not null default 0,
  due_at    timestamptz not null default now(),
  primary key (user_id, word_id, deck)
);
create index on srs_card (user_id, due_at);

create table review_log (
  id        bigserial primary key,
  user_id   uuid references app_user(id) on delete cascade,
  word_id   integer references word(id),
  deck      text,
  card_type text,                              -- hz | vi | audio | cloze | pinyin | tone
  grade     smallint,                          -- 1 quên … 4 dễ
  ms        integer,
  at        timestamptz not null default now()
);

create table lesson_progress (
  user_id   uuid references app_user(id) on delete cascade,
  lesson_id integer references lesson(id),
  best_score smallint,
  done_at   timestamptz,
  primary key (user_id, lesson_id)
);

create table exam_attempt (
  id        bigserial primary key,
  user_id   uuid references app_user(id) on delete cascade,
  exam_id   text references exam(id),          -- null nếu đề sinh ngẫu nhiên
  level     smallint,
  started_at timestamptz not null default now(),
  finished_at timestamptz,
  score     jsonb,                             -- điểm từng phần
  total     smallint,
  passed    boolean
);

create table exam_answer (
  attempt_id bigint references exam_attempt(id) on delete cascade,
  item_id    integer references exam_item(id),
  response   jsonb,
  correct    boolean,
  primary key (attempt_id, item_id)
);

create table daily_activity (                  -- chuỗi ngày, bản đồ hoạt động
  user_id uuid references app_user(id) on delete cascade,
  day     date not null,
  minutes smallint not null default 0,
  new_words smallint not null default 0,
  reviews smallint not null default 0,
  primary key (user_id, day)
);

create table notebook (                        -- sổ tay từ cá nhân
  user_id uuid references app_user(id) on delete cascade,
  word_id integer references word(id),
  note    text,
  added_at timestamptz not null default now(),
  primary key (user_id, word_id)
);

-- Supabase: bật Row Level Security cho mọi bảng người học, chỉ cho user đọc/ghi dòng của chính mình, ví dụ:
-- alter table srs_card enable row level security;
-- create policy own on srs_card using (user_id = auth.uid()) with check (user_id = auth.uid());
