const alerts = [
  { member: '김하늘', detail: '잔여 2회 · 4월 8일 만료', tone: 'urgent' },
  { member: '이도윤', detail: '7일째 미예약', tone: 'idle' },
  { member: '박서준', detail: '재등록 상담 필요', tone: 'renewal' },
]

const sessions = [
  { time: '09:00', member: '정유진', goal: '하체 밸런스', status: '완료' },
  { time: '11:30', member: '김민재', goal: '체지방 감량', status: '예정' },
  { time: '14:00', member: '최수아', goal: '재활 운동', status: '예정' },
  { time: '19:30', member: '오세훈', goal: '상체 근력', status: '대기' },
]

const members = [
  { name: '정유진', pass: '20회권', left: '12회 남음', expiry: '4월 28일' },
  { name: '김민재', pass: '10회권', left: '2회 남음', expiry: '4월 8일' },
  { name: '최수아', pass: '주 2회 1개월', left: '이번 주 1회 가능', expiry: '4월 30일' },
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

export default function App() {
  return (
    <main className="app-shell">
      <div className="ambient ambient-left" />
      <div className="ambient ambient-right" />

      <section className="dashboard-frame">
        <aside className="sidebar">
          <div className="brand-block">
            <p className="brand-mark">PT Flow</p>
            <h1>1:1 PT 운영을 한 화면으로 정리</h1>
            <p className="brand-copy">
              회원권, 예약, 출석 차감, 재등록 타이밍까지 엑셀 없이 관리하는
              대시보드.
            </p>
          </div>

          <nav className="menu">
            <button className="menu-item active">대시보드</button>
            <button className="menu-item">회원 관리</button>
            <button className="menu-item">예약 캘린더</button>
            <button className="menu-item">이용권</button>
            <button className="menu-item">상담 메모</button>
          </nav>

          <div className="sidebar-card">
            <p className="sidebar-label">오늘 매출</p>
            <strong>₩1,240,000</strong>
            <span>재등록 3건 · 신규 상담 2건</span>
          </div>
        </aside>

        <section className="content">
          <header className="hero-panel">
            <div>
              <p className="eyebrow">Trainer Console</p>
              <h2>오늘 운영 현황</h2>
            </div>
            <div className="hero-actions">
              <button className="secondary-button">회원 추가</button>
              <button className="primary-button">수업 기록 입력</button>
            </div>
          </header>

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
                {members.map((member) => (
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
        </section>
      </section>
    </main>
  )
}
