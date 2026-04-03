import { useState } from 'react'

const alerts = [
  { member: '김하늘', detail: '잔여 2회 · 4월 8일 만료', tone: 'urgent' },
  { member: '이도윤', detail: '7일째 미예약', tone: 'idle' },
  { member: '박서준', detail: '재등록 상담 필요', tone: 'renewal' },
]

const sessions = [
  { time: '09:00', member: '정유진', goal: '하체 밸런스', trainer: '민코치', status: '완료' },
  { time: '11:30', member: '김민재', goal: '체지방 감량', trainer: '민코치', status: '예정' },
  { time: '14:00', member: '최수아', goal: '재활 운동', trainer: '윤코치', status: '예정' },
  { time: '19:30', member: '오세훈', goal: '상체 근력', trainer: '민코치', status: '대기' },
]

const members = [
  {
    name: '정유진',
    phone: '010-2211-9001',
    pass: '20회권',
    left: '12회 남음',
    expiry: '4월 28일',
    status: '정상',
  },
  {
    name: '김민재',
    phone: '010-3345-7722',
    pass: '10회권',
    left: '2회 남음',
    expiry: '4월 8일',
    status: '재등록 필요',
  },
  {
    name: '최수아',
    phone: '010-5598-1313',
    pass: '주 2회 1개월',
    left: '이번 주 1회 가능',
    expiry: '4월 30일',
    status: '정상',
  },
  {
    name: '오세훈',
    phone: '010-9981-7734',
    pass: '30회권',
    left: '5회 남음',
    expiry: '5월 9일',
    status: '추적',
  },
]

const packages = [
  { name: '10회 집중 감량', price: '₩550,000', rule: '60일', sales: '이번 달 4건' },
  { name: '20회 체형 교정', price: '₩980,000', rule: '90일', sales: '이번 달 7건' },
  { name: '주 2회 1개월', price: '₩390,000', rule: '30일', sales: '이번 달 5건' },
]

const notes = [
  {
    member: '정유진',
    title: '스쿼트 하강 구간 안정화 필요',
    body: '무릎 내회전이 있어 고블릿 스쿼트와 밴드 워크를 먼저 유지.',
    updatedAt: '오늘 09:58',
  },
  {
    member: '김민재',
    title: '식단 피드백 전달',
    body: '평일 야식 빈도 높음. 수업 후 단백질 섭취 루틴 고정 제안.',
    updatedAt: '어제 18:20',
  },
]

const calendarDays = [
  { day: '월', date: '4/7', slots: ['09:00 정유진', '11:30 김민재', '19:30 오세훈'] },
  { day: '화', date: '4/8', slots: ['10:00 신규 상담', '14:00 최수아'] },
  { day: '수', date: '4/9', slots: ['09:00 정유진', '18:00 김하늘'] },
  { day: '목', date: '4/10', slots: ['11:00 김민재', '20:00 오세훈'] },
  { day: '금', date: '4/11', slots: ['08:00 바디체크', '13:00 최수아'] },
]

const menuItems = [
  { id: 'dashboard', label: '대시보드' },
  { id: 'members', label: '회원 관리' },
  { id: 'schedule', label: '예약 캘린더' },
  { id: 'passes', label: '이용권' },
  { id: 'notes', label: '상담 메모' },
]

function StatCard({ label, value, meta }) {
  return (
    <article className="stat-card">
      <p className="stat-label">{label}</p>
      <strong className="stat-value">{value}</strong>
      <p className="stat-meta">{meta}</p>
    </article>
  )
}

function SectionHeader({ eyebrow, title, action }) {
  return (
    <header className="hero-panel">
      <div>
        <p className="eyebrow">{eyebrow}</p>
        <h2>{title}</h2>
      </div>
      <div className="hero-actions">{action}</div>
    </header>
  )
}

function DashboardView() {
  return (
    <>
      <SectionHeader
        eyebrow="Trainer Console"
        title="오늘 운영 현황"
        action={
          <>
            <button className="secondary-button">회원 추가</button>
            <button className="primary-button">수업 기록 입력</button>
          </>
        }
      />

      <section className="stats-grid">
        <StatCard label="오늘 수업" value="8건" meta="완료 2건 · 예정 5건 · 대기 1건" />
        <StatCard label="재등록 위험" value="6명" meta="잔여 3회 이하 회원" />
        <StatCard label="미예약 회원" value="11명" meta="최근 7일간 예약 없음" />
        <StatCard label="이번 주 노쇼" value="2건" meta="전주 대비 1건 감소" />
      </section>

      <section className="panel-grid">
        <article className="panel schedule-panel">
          <div className="panel-head">
            <div>
              <p className="panel-kicker">Today</p>
              <h3>수업 스케줄</h3>
            </div>
            <button className="text-button">전체 보기</button>
          </div>

          <div className="session-list">
            {sessions.map((session) => (
              <div className="session-row" key={`${session.time}-${session.member}`}>
                <div className="session-time">{session.time}</div>
                <div className="session-main">
                  <strong>{session.member}</strong>
                  <span>{session.goal}</span>
                </div>
                <span className={`status-badge ${session.status}`}>{session.status}</span>
              </div>
            ))}
          </div>
        </article>

        <article className="panel alert-panel">
          <div className="panel-head">
            <div>
              <p className="panel-kicker">Retention</p>
              <h3>즉시 확인할 회원</h3>
            </div>
            <button className="text-button">알림 설정</button>
          </div>

          <div className="alert-list">
            {alerts.map((alert) => (
              <div className={`alert-card ${alert.tone}`} key={alert.member}>
                <strong>{alert.member}</strong>
                <span>{alert.detail}</span>
              </div>
            ))}
          </div>
        </article>

        <article className="panel member-panel">
          <div className="panel-head">
            <div>
              <p className="panel-kicker">Members</p>
              <h3>회원권 현황</h3>
            </div>
            <button className="text-button">회원 전체 보기</button>
          </div>

          <div className="member-list">
            {members.slice(0, 3).map((member) => (
              <div className="member-row" key={member.name}>
                <div>
                  <strong>{member.name}</strong>
                  <p>{member.pass}</p>
                </div>
                <div className="member-meta">
                  <span>{member.left}</span>
                  <span>{member.expiry}</span>
                </div>
              </div>
            ))}
          </div>
        </article>

        <article className="panel insight-panel">
          <div className="panel-head">
            <div>
              <p className="panel-kicker">Insight</p>
              <h3>이 제품이 해결하는 문제</h3>
            </div>
          </div>

          <ul className="insight-list">
            <li>회원권 만료일과 잔여 횟수를 자동 추적</li>
            <li>당일 예약과 취소를 캘린더 기준으로 정리</li>
            <li>재등록 타이밍을 운영자가 놓치지 않게 표시</li>
            <li>회원별 수업 메모를 다음 세션에 바로 연결</li>
          </ul>
        </article>
      </section>
    </>
  )
}

function MembersView() {
  return (
    <>
      <SectionHeader
        eyebrow="Members"
        title="회원 관리"
        action={<button className="primary-button">신규 회원 등록</button>}
      />
      <section className="panel stacked-panel">
        <div className="toolbar">
          <div className="search-chip">이름, 연락처, 이용권으로 검색</div>
          <div className="toolbar-actions">
            <button className="secondary-button">재등록 필요만 보기</button>
            <button className="secondary-button">엑셀 다운로드</button>
          </div>
        </div>
        <div className="data-table">
          <div className="table-row table-head-row">
            <span>회원명</span>
            <span>연락처</span>
            <span>이용권</span>
            <span>잔여/만료</span>
            <span>상태</span>
          </div>
          {members.map((member) => (
            <div className="table-row" key={member.phone}>
              <span>{member.name}</span>
              <span>{member.phone}</span>
              <span>{member.pass}</span>
              <span>{member.left} · {member.expiry}</span>
              <span className={`mini-badge ${member.status}`}>{member.status}</span>
            </div>
          ))}
        </div>
      </section>
    </>
  )
}

function ScheduleView() {
  return (
    <>
      <SectionHeader
        eyebrow="Schedule"
        title="예약 캘린더"
        action={
          <>
            <button className="secondary-button">트레이너 필터</button>
            <button className="primary-button">예약 추가</button>
          </>
        }
      />
      <section className="calendar-grid">
        {calendarDays.map((day) => (
          <article className="panel calendar-card" key={day.date}>
            <div className="calendar-head">
              <strong>{day.day}</strong>
              <span>{day.date}</span>
            </div>
            <div className="calendar-slots">
              {day.slots.map((slot) => (
                <div className="slot-pill" key={slot}>{slot}</div>
              ))}
            </div>
          </article>
        ))}
      </section>
    </>
  )
}

function PassesView() {
  return (
    <>
      <SectionHeader
        eyebrow="Packages"
        title="이용권 관리"
        action={<button className="primary-button">이용권 상품 추가</button>}
      />
      <section className="split-grid">
        {packages.map((item) => (
          <article className="panel package-card" key={item.name}>
            <p className="panel-kicker">Package</p>
            <h3>{item.name}</h3>
            <strong className="price-text">{item.price}</strong>
            <p className="package-meta">유효기간 {item.rule}</p>
            <p className="package-meta">{item.sales}</p>
          </article>
        ))}
      </section>
    </>
  )
}

function NotesView() {
  return (
    <>
      <SectionHeader
        eyebrow="Session Notes"
        title="상담 메모"
        action={<button className="primary-button">메모 작성</button>}
      />
      <section className="split-grid">
        {notes.map((note) => (
          <article className="panel note-card" key={`${note.member}-${note.updatedAt}`}>
            <div className="note-head">
              <strong>{note.member}</strong>
              <span>{note.updatedAt}</span>
            </div>
            <h3>{note.title}</h3>
            <p className="note-body">{note.body}</p>
          </article>
        ))}
      </section>
    </>
  )
}

const views = {
  dashboard: <DashboardView />,
  members: <MembersView />,
  schedule: <ScheduleView />,
  passes: <PassesView />,
  notes: <NotesView />,
}

export default function App() {
  const [activeView, setActiveView] = useState('dashboard')

  return (
    <main className="app-shell">
      <div className="ambient ambient-left" />
      <div className="ambient ambient-right" />

      <section className="dashboard-frame">
        <aside className="sidebar">
          <div className="sidebar-top">
            <div className="brand-block">
              <p className="brand-mark">PT Flow</p>
              <h1>1:1 PT 운영을 한 화면으로 정리</h1>
              <p className="brand-copy">
                회원권, 예약, 출석 차감, 재등록 타이밍까지 엑셀 없이 관리하는
                운영 콘솔.
              </p>
            </div>

            <nav className="menu">
              {menuItems.map((item) => (
                <button
                  key={item.id}
                  className={`menu-item ${activeView === item.id ? 'active' : ''}`}
                  onClick={() => setActiveView(item.id)}
                  type="button"
                >
                  {item.label}
                </button>
              ))}
            </nav>
          </div>

          <div className="sidebar-card">
            <p className="sidebar-label">오늘 매출</p>
            <strong>₩1,240,000</strong>
            <span>재등록 3건 · 신규 상담 2건</span>
          </div>
        </aside>

        <section className="content">{views[activeView]}</section>
      </section>
    </main>
  )
}
