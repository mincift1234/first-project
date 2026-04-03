import { useEffect, useState } from 'react'
import {
  addDoc,
  collection,
  doc,
  onSnapshot,
  query,
  serverTimestamp,
  writeBatch,
} from 'firebase/firestore'
import { db } from './firebase'
import { AppointmentForm, MemberForm, NoteForm, PackageForm } from './forms'
import {
  demoAlerts,
  demoCalendarDays,
  demoMembers,
  demoNotes,
  demoPackages,
  demoSessions,
} from './demoData'

const menuItems = [
  { id: 'dashboard', label: '대시보드' },
  { id: 'members', label: '회원 관리' },
  { id: 'schedule', label: '예약 캘린더' },
  { id: 'passes', label: '이용권' },
  { id: 'notes', label: '상담 메모' },
]

const weekdayLabels = ['일', '월', '화', '수', '목', '금', '토']

const initialMemberForm = {
  name: '',
  phone: '',
  pass: '',
  remainingSessions: '',
  expiryDate: '',
  status: '정상',
}

const initialAppointmentForm = {
  member: '',
  trainer: '',
  goal: '',
  startAt: '',
  status: '예정',
}

const initialPackageForm = {
  name: '',
  price: '',
  validDays: '',
  monthlySales: '',
}

const initialNoteForm = {
  member: '',
  title: '',
  body: '',
}

function toDate(value) {
  if (!value) return null
  if (value instanceof Date) return value
  if (typeof value?.toDate === 'function') return value.toDate()

  const parsed = new Date(value)
  return Number.isNaN(parsed.getTime()) ? null : parsed
}

function formatShortDate(value) {
  const date = toDate(value)
  if (!date) return '-'

  return `${date.getMonth() + 1}월 ${date.getDate()}일`
}

function formatCalendarDate(value) {
  const date = toDate(value)
  if (!date) return '미정'

  return `${date.getMonth() + 1}/${date.getDate()}`
}

function formatTime(value) {
  const date = toDate(value)
  if (!date) return typeof value === 'string' ? value : '--:--'

  return date.toLocaleTimeString('ko-KR', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  })
}

function formatCurrency(value) {
  if (typeof value === 'string') return value
  if (typeof value !== 'number') return '₩0'

  return new Intl.NumberFormat('ko-KR', {
    style: 'currency',
    currency: 'KRW',
    maximumFractionDigits: 0,
  }).format(value)
}

function formatRelativeUpdate(value) {
  const date = toDate(value)
  if (!date) return '업데이트 없음'

  return date.toLocaleString('ko-KR', {
    month: 'numeric',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

function mapMember(doc) {
  const data = doc.data()

  return {
    id: doc.id,
    name: data.name ?? '이름 없음',
    phone: data.phone ?? '-',
    pass: data.pass ?? data.passName ?? '이용권 미설정',
    left:
      data.left ??
      (typeof data.remainingSessions === 'number' ? `${data.remainingSessions}회 남음` : '-'),
    expiry: data.expiry ?? formatShortDate(data.expiryDate),
    status: data.status ?? '정상',
  }
}

function mapAppointment(doc) {
  const data = doc.data()

  return {
    id: doc.id,
    startAt: data.startAt ?? data.dateTime ?? null,
    time: data.time ?? formatTime(data.startAt ?? data.dateTime),
    member: data.member ?? data.memberName ?? '미정',
    goal: data.goal ?? data.program ?? '목표 미설정',
    trainer: data.trainer ?? data.trainerName ?? '-',
    status: data.status ?? '예정',
  }
}

function mapPackage(doc) {
  const data = doc.data()

  return {
    id: doc.id,
    name: data.name ?? '이용권',
    price: formatCurrency(data.price),
    rule: data.rule ?? (data.validDays ? `${data.validDays}일` : '-'),
    sales:
      data.sales ??
      (typeof data.monthlySales === 'number' ? `이번 달 ${data.monthlySales}건` : '판매 데이터 없음'),
  }
}

function mapNote(doc) {
  const data = doc.data()

  return {
    id: doc.id,
    member: data.member ?? data.memberName ?? '회원 미지정',
    title: data.title ?? '메모 제목 없음',
    body: data.body ?? data.memo ?? '',
    updatedAt: formatRelativeUpdate(data.updatedAt ?? data.createdAt),
  }
}

function buildAlerts(memberData) {
  const renewalMembers = memberData.filter((member) => member.status.includes('재등록'))
  const lowMembers = memberData.filter((member) => member.left.includes('2회') || member.left.includes('3회'))

  const result = [
    ...renewalMembers.slice(0, 2).map((member) => ({
      member: member.name,
      detail: `${member.left} · ${member.expiry}`,
      tone: 'renewal',
    })),
    ...lowMembers.slice(0, 1).map((member) => ({
      member: member.name,
      detail: `${member.left} · ${member.expiry}`,
      tone: 'urgent',
    })),
  ]

  return result.length > 0 ? result : demoAlerts
}

function buildCalendar(appointments) {
  const grouped = appointments
    .filter((appointment) => toDate(appointment.startAt))
    .sort((a, b) => toDate(a.startAt) - toDate(b.startAt))
    .slice(0, 10)
    .reduce((acc, appointment) => {
      const date = toDate(appointment.startAt)
      const key = date.toDateString()

      if (!acc[key]) {
        acc[key] = {
          day: weekdayLabels[date.getDay()],
          date: formatCalendarDate(date),
          slots: [],
        }
      }

      acc[key].slots.push(`${formatTime(date)} ${appointment.member}`)

      return acc
    }, {})

  const items = Object.values(grouped)
  return items.length > 0 ? items : demoCalendarDays
}

function buildStats(memberData, appointmentData) {
  const sessionsToday = appointmentData.length
  const completed = appointmentData.filter((item) => item.status === '완료').length
  const scheduled = appointmentData.filter((item) => item.status === '예정').length
  const waiting = appointmentData.filter((item) => item.status === '대기').length
  const renewalRisk = memberData.filter((item) => item.status.includes('재등록')).length
  const tracking = memberData.filter((item) => item.status.includes('추적')).length
  const noShows = appointmentData.filter((item) => item.status === '노쇼').length

  return [
    {
      label: '오늘 수업',
      value: `${sessionsToday || demoSessions.length}건`,
      meta: `완료 ${completed}건 · 예정 ${scheduled}건 · 대기 ${waiting}건`,
    },
    {
      label: '재등록 위험',
      value: `${renewalRisk || 0}명`,
      meta: '잔여 횟수와 만료일이 임박한 회원',
    },
    {
      label: '추적 회원',
      value: `${tracking || 0}명`,
      meta: '최근 예약 공백이 있는 회원',
    },
    {
      label: '이번 주 노쇼',
      value: `${noShows || 0}건`,
      meta: '실제 운영 데이터 기준',
    },
  ]
}

function StatCard({ label, value, meta }) {
  return (
    <article className="stat-card">
      <p className="stat-label">{label}</p>
      <strong className="stat-value">{value}</strong>
      <p className="stat-meta">{meta}</p>
    </article>
  )
}

function SectionHeader({ eyebrow, title, action, status }) {
  return (
    <header className="hero-panel">
      <div>
        <p className="eyebrow">{eyebrow}</p>
        <h2>{title}</h2>
      </div>
      <div className="hero-actions">
        {status ? <span className="sync-badge">{status}</span> : null}
        {action}
      </div>
    </header>
  )
}

function DashboardView({ alerts, members, sessions, stats, syncStatus, onQuickAction }) {
  return (
    <>
      <SectionHeader
        eyebrow="Trainer Console"
        title="오늘 운영 현황"
        status={syncStatus}
        action={
          <>
            <button className="secondary-button" onClick={() => onQuickAction('members')} type="button">
              회원 추가
            </button>
            <button className="primary-button" onClick={() => onQuickAction('schedule')} type="button">
              수업 기록 입력
            </button>
          </>
        }
      />

      <section className="stats-grid">
        {stats.map((stat) => (
          <StatCard key={stat.label} {...stat} />
        ))}
      </section>

      <section className="panel-grid">
        <article className="panel schedule-panel">
          <div className="panel-head">
            <div>
              <p className="panel-kicker">Today</p>
              <h3>수업 스케줄</h3>
            </div>
            <button className="text-button" onClick={() => onQuickAction('schedule')} type="button">
              전체 보기
            </button>
          </div>

          <div className="session-list">
            {sessions.slice(0, 4).map((session) => (
              <div className="session-row" key={session.id ?? `${session.time}-${session.member}`}>
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
              <div className={`alert-card ${alert.tone}`} key={`${alert.member}-${alert.detail}`}>
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
            <button className="text-button" onClick={() => onQuickAction('members')} type="button">
              회원 전체 보기
            </button>
          </div>

          <div className="member-list">
            {members.slice(0, 3).map((member) => (
              <div className="member-row" key={member.id ?? member.name}>
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
              <p className="panel-kicker">Firebase</p>
              <h3>현재 연결 상태</h3>
            </div>
          </div>

          <ul className="insight-list">
            <li>Firestore 컬렉션 `members`, `appointments`, `packages`, `sessionNotes` 구독</li>
            <li>컬렉션이 비어 있으면 데모 데이터로 화면 유지</li>
            <li>실데이터가 들어오면 대시보드 수치와 카드가 자동 갱신</li>
            <li>회원, 예약, 메모, 이용권을 섹션별 폼에서 바로 생성 가능</li>
          </ul>
        </article>
      </section>
    </>
  )
}

function MembersView({ members, form, onChange, onSubmit, feedback }) {
  return (
    <>
      <SectionHeader
        eyebrow="Members"
        title="회원 관리"
        action={<button className="primary-button" onClick={onSubmit} type="button">신규 회원 등록</button>}
      />
      <section className="split-layout">
        <MemberForm form={form} onChange={onChange} onSubmit={onSubmit} feedback={feedback} />
        <section className="panel stacked-panel">
        <div className="toolbar">
          <div className="search-chip">실시간 회원 목록</div>
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
            <div className="table-row" key={member.id ?? member.phone}>
              <span>{member.name}</span>
              <span>{member.phone}</span>
              <span>{member.pass}</span>
              <span>{member.left} · {member.expiry}</span>
              <span className={`mini-badge ${member.status}`}>{member.status}</span>
            </div>
          ))}
        </div>
        </section>
      </section>
    </>
  )
}

function ScheduleView({ calendarDays, form, onChange, onSubmit, feedback }) {
  return (
    <>
      <SectionHeader
        eyebrow="Schedule"
        title="예약 캘린더"
        action={
          <>
            <button className="secondary-button">트레이너 필터</button>
            <button className="primary-button" onClick={onSubmit} type="button">예약 추가</button>
          </>
        }
      />
      <section className="split-layout">
        <AppointmentForm form={form} onChange={onChange} onSubmit={onSubmit} feedback={feedback} />
        <section className="calendar-grid">
        {calendarDays.map((day) => (
          <article className="panel calendar-card" key={`${day.day}-${day.date}`}>
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
      </section>
    </>
  )
}

function PassesView({ packages, form, onChange, onSubmit, feedback }) {
  return (
    <>
      <SectionHeader
        eyebrow="Packages"
        title="이용권 관리"
        action={<button className="primary-button" onClick={onSubmit} type="button">이용권 상품 추가</button>}
      />
      <section className="split-layout">
        <PackageForm form={form} onChange={onChange} onSubmit={onSubmit} feedback={feedback} />
        <section className="split-grid">
        {packages.map((item) => (
          <article className="panel package-card" key={item.id ?? item.name}>
            <p className="panel-kicker">Package</p>
            <h3>{item.name}</h3>
            <strong className="price-text">{item.price}</strong>
            <p className="package-meta">유효기간 {item.rule}</p>
            <p className="package-meta">{item.sales}</p>
          </article>
        ))}
        </section>
      </section>
    </>
  )
}

function NotesView({ notes, form, onChange, onSubmit, feedback }) {
  return (
    <>
      <SectionHeader
        eyebrow="Session Notes"
        title="상담 메모"
        action={<button className="primary-button" onClick={onSubmit} type="button">메모 작성</button>}
      />
      <section className="split-layout">
        <NoteForm form={form} onChange={onChange} onSubmit={onSubmit} feedback={feedback} />
        <section className="split-grid">
        {notes.map((note) => (
          <article className="panel note-card" key={note.id ?? `${note.member}-${note.updatedAt}`}>
            <div className="note-head">
              <strong>{note.member}</strong>
              <span>{note.updatedAt}</span>
            </div>
            <h3>{note.title}</h3>
            <p className="note-body">{note.body}</p>
          </article>
        ))}
        </section>
      </section>
    </>
  )
}

export default function App() {
  const [activeView, setActiveView] = useState('dashboard')
  const [members, setMembers] = useState(demoMembers)
  const [sessions, setSessions] = useState(demoSessions)
  const [packages, setPackages] = useState(demoPackages)
  const [notes, setNotes] = useState(demoNotes)
  const [syncStatus, setSyncStatus] = useState('Firebase 연결 중')
  const [errorMessage, setErrorMessage] = useState('')
  const [seedStatus, setSeedStatus] = useState('')
  const [memberForm, setMemberForm] = useState(initialMemberForm)
  const [appointmentForm, setAppointmentForm] = useState(initialAppointmentForm)
  const [packageForm, setPackageForm] = useState(initialPackageForm)
  const [noteForm, setNoteForm] = useState(initialNoteForm)
  const [memberFeedback, setMemberFeedback] = useState('')
  const [appointmentFeedback, setAppointmentFeedback] = useState('')
  const [packageFeedback, setPackageFeedback] = useState('')
  const [noteFeedback, setNoteFeedback] = useState('')

  function handleFieldChange(setter) {
    return (event) => {
      const { name, value } = event.target
      setter((prev) => ({ ...prev, [name]: value }))
    }
  }

  async function seedFirestore() {
    setSeedStatus('샘플 데이터 쓰는 중')
    setErrorMessage('')

    try {
      const batch = writeBatch(db)

      demoMembers.forEach((member, index) => {
        batch.set(doc(db, 'members', `member-${index + 1}`), {
          name: member.name,
          phone: member.phone,
          pass: member.pass,
          left: member.left,
          expiry: member.expiry,
          status: member.status,
          createdAt: serverTimestamp(),
        })
      })

      demoSessions.forEach((session, index) => {
        batch.set(doc(db, 'appointments', `appointment-${index + 1}`), {
          member: session.member,
          goal: session.goal,
          trainer: session.trainer,
          status: session.status,
          time: session.time,
          createdAt: serverTimestamp(),
        })
      })

      demoPackages.forEach((item, index) => {
        batch.set(doc(db, 'packages', `package-${index + 1}`), {
          name: item.name,
          price:
            typeof item.price === 'string'
              ? Number(item.price.replace(/[^\d]/g, '')) || 0
              : item.price,
          rule: item.rule,
          sales: item.sales,
          createdAt: serverTimestamp(),
        })
      })

      demoNotes.forEach((note, index) => {
        batch.set(doc(db, 'sessionNotes', `note-${index + 1}`), {
          member: note.member,
          title: note.title,
          body: note.body,
          updatedAt: serverTimestamp(),
        })
      })

      await batch.commit()
      setSeedStatus('샘플 데이터 입력 완료')
      setSyncStatus('Firebase 동기화 완료')
    } catch (error) {
      console.error('Firebase seed failed:', error)
      setSeedStatus('샘플 데이터 입력 실패')
      setErrorMessage(error?.message ?? '샘플 데이터 입력 중 오류가 발생했습니다.')
    }
  }

  async function submitMember() {
    if (!memberForm.name.trim() || !memberForm.phone.trim()) {
      setMemberFeedback('회원 이름과 연락처는 필수입니다.')
      return
    }

    try {
      await addDoc(collection(db, 'members'), {
        name: memberForm.name.trim(),
        phone: memberForm.phone.trim(),
        pass: memberForm.pass.trim() || '이용권 미설정',
        remainingSessions: Number(memberForm.remainingSessions) || 0,
        expiryDate: memberForm.expiryDate ? new Date(memberForm.expiryDate) : null,
        status: memberForm.status,
        createdAt: serverTimestamp(),
      })
      setMemberFeedback('회원이 저장되었습니다.')
      setMemberForm(initialMemberForm)
    } catch (error) {
      console.error('member create failed:', error)
      setMemberFeedback(error?.message ?? '회원 저장에 실패했습니다.')
    }
  }

  async function submitAppointment() {
    if (!appointmentForm.member.trim() || !appointmentForm.startAt) {
      setAppointmentFeedback('회원 이름과 예약 일시는 필수입니다.')
      return
    }

    try {
      await addDoc(collection(db, 'appointments'), {
        member: appointmentForm.member.trim(),
        trainer: appointmentForm.trainer.trim() || '-',
        goal: appointmentForm.goal.trim() || '목표 미설정',
        startAt: new Date(appointmentForm.startAt),
        status: appointmentForm.status,
        createdAt: serverTimestamp(),
      })
      setAppointmentFeedback('예약이 저장되었습니다.')
      setAppointmentForm(initialAppointmentForm)
    } catch (error) {
      console.error('appointment create failed:', error)
      setAppointmentFeedback(error?.message ?? '예약 저장에 실패했습니다.')
    }
  }

  async function submitPackage() {
    if (!packageForm.name.trim() || !packageForm.price) {
      setPackageFeedback('상품명과 가격은 필수입니다.')
      return
    }

    try {
      await addDoc(collection(db, 'packages'), {
        name: packageForm.name.trim(),
        price: Number(packageForm.price) || 0,
        validDays: Number(packageForm.validDays) || 0,
        monthlySales: Number(packageForm.monthlySales) || 0,
        createdAt: serverTimestamp(),
      })
      setPackageFeedback('이용권 상품이 저장되었습니다.')
      setPackageForm(initialPackageForm)
    } catch (error) {
      console.error('package create failed:', error)
      setPackageFeedback(error?.message ?? '이용권 저장에 실패했습니다.')
    }
  }

  async function submitNote() {
    if (!noteForm.member.trim() || !noteForm.title.trim()) {
      setNoteFeedback('회원 이름과 메모 제목은 필수입니다.')
      return
    }

    try {
      await addDoc(collection(db, 'sessionNotes'), {
        member: noteForm.member.trim(),
        title: noteForm.title.trim(),
        body: noteForm.body.trim(),
        updatedAt: serverTimestamp(),
        createdAt: serverTimestamp(),
      })
      setNoteFeedback('메모가 저장되었습니다.')
      setNoteForm(initialNoteForm)
    } catch (error) {
      console.error('note create failed:', error)
      setNoteFeedback(error?.message ?? '메모 저장에 실패했습니다.')
    }
  }

  useEffect(() => {
    const unsubscribers = []
    let memberLoaded = false
    let appointmentLoaded = false
    let packageLoaded = false
    let noteLoaded = false

    const updateStatus = () => {
      if (memberLoaded && appointmentLoaded && packageLoaded && noteLoaded) {
        setSyncStatus('Firebase 동기화 완료')
      }
    }

    unsubscribers.push(
      onSnapshot(
        query(collection(db, 'members')),
        (snapshot) => {
          const nextMembers = snapshot.docs.map(mapMember)
          setMembers(nextMembers.length > 0 ? nextMembers : demoMembers)
          memberLoaded = true
          updateStatus()
        },
        (error) => {
          console.error('members read failed:', error)
          setSyncStatus('Firebase 읽기 실패')
          setErrorMessage(error?.message ?? 'members 컬렉션 읽기에 실패했습니다.')
        },
      ),
    )

    unsubscribers.push(
      onSnapshot(
        query(collection(db, 'appointments')),
        (snapshot) => {
          const nextAppointments = snapshot.docs.map(mapAppointment)
          setSessions(nextAppointments.length > 0 ? nextAppointments : demoSessions)
          appointmentLoaded = true
          updateStatus()
        },
        (error) => {
          console.error('appointments read failed:', error)
          setSyncStatus('Firebase 읽기 실패')
          setErrorMessage(error?.message ?? 'appointments 컬렉션 읽기에 실패했습니다.')
        },
      ),
    )

    unsubscribers.push(
      onSnapshot(
        query(collection(db, 'packages')),
        (snapshot) => {
          const nextPackages = snapshot.docs.map(mapPackage)
          setPackages(nextPackages.length > 0 ? nextPackages : demoPackages)
          packageLoaded = true
          updateStatus()
        },
        (error) => {
          console.error('packages read failed:', error)
          setSyncStatus('Firebase 읽기 실패')
          setErrorMessage(error?.message ?? 'packages 컬렉션 읽기에 실패했습니다.')
        },
      ),
    )

    unsubscribers.push(
      onSnapshot(
        query(collection(db, 'sessionNotes')),
        (snapshot) => {
          const nextNotes = snapshot.docs.map(mapNote)
          setNotes(nextNotes.length > 0 ? nextNotes : demoNotes)
          noteLoaded = true
          updateStatus()
        },
        (error) => {
          console.error('sessionNotes read failed:', error)
          setSyncStatus('Firebase 읽기 실패')
          setErrorMessage(error?.message ?? 'sessionNotes 컬렉션 읽기에 실패했습니다.')
        },
      ),
    )

    return () => {
      unsubscribers.forEach((unsubscribe) => unsubscribe())
    }
  }, [])

  const alerts = buildAlerts(members)
  const calendarDays = buildCalendar(sessions)
  const stats = buildStats(members, sessions)

  const views = {
    dashboard: (
      <DashboardView
        alerts={alerts}
        members={members}
        sessions={sessions}
        stats={stats}
        syncStatus={syncStatus}
        onQuickAction={setActiveView}
      />
    ),
    members: (
      <MembersView
        members={members}
        form={memberForm}
        onChange={handleFieldChange(setMemberForm)}
        onSubmit={submitMember}
        feedback={memberFeedback}
      />
    ),
    schedule: (
      <ScheduleView
        calendarDays={calendarDays}
        form={appointmentForm}
        onChange={handleFieldChange(setAppointmentForm)}
        onSubmit={submitAppointment}
        feedback={appointmentFeedback}
      />
    ),
    passes: (
      <PassesView
        packages={packages}
        form={packageForm}
        onChange={handleFieldChange(setPackageForm)}
        onSubmit={submitPackage}
        feedback={packageFeedback}
      />
    ),
    notes: (
      <NotesView
        notes={notes}
        form={noteForm}
        onChange={handleFieldChange(setNoteForm)}
        onSubmit={submitNote}
        feedback={noteFeedback}
      />
    ),
  }

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
            <span>{syncStatus}</span>
            <button className="sidebar-action" onClick={seedFirestore} type="button">
              샘플 데이터 넣기
            </button>
            {seedStatus ? <p className="sidebar-feedback">{seedStatus}</p> : null}
            {errorMessage ? <p className="sidebar-error">{errorMessage}</p> : null}
          </div>
        </aside>

        <section className="content">{views[activeView]}</section>
      </section>
    </main>
  )
}
