function FormPanel({ title, description, children, feedback }) {
  return (
    <section className="panel form-panel">
      <div className="panel-head">
        <div>
          <p className="panel-kicker">Create</p>
          <h3>{title}</h3>
        </div>
      </div>
      <p className="form-description">{description}</p>
      {children}
      {feedback ? <p className="form-feedback">{feedback}</p> : null}
    </section>
  )
}

export function MemberForm({ form, onChange, onSubmit, feedback }) {
  return (
    <FormPanel title="회원 추가" description="회원 이름, 연락처, 이용권 상태를 바로 저장합니다." feedback={feedback}>
      <div className="form-grid">
        <input className="app-input" name="name" placeholder="회원 이름" value={form.name} onChange={onChange} />
        <input className="app-input" name="phone" placeholder="연락처" value={form.phone} onChange={onChange} />
        <input className="app-input" name="pass" placeholder="이용권 이름" value={form.pass} onChange={onChange} />
        <input className="app-input" name="remainingSessions" placeholder="잔여 횟수" value={form.remainingSessions} onChange={onChange} />
        <input className="app-input" name="expiryDate" type="date" value={form.expiryDate} onChange={onChange} />
        <select className="app-input" name="status" value={form.status} onChange={onChange}>
          <option value="정상">정상</option>
          <option value="재등록 필요">재등록 필요</option>
          <option value="추적">추적</option>
        </select>
      </div>
      <button className="primary-button form-submit" onClick={onSubmit} type="button">
        회원 저장
      </button>
    </FormPanel>
  )
}

export function AppointmentForm({ form, onChange, onSubmit, feedback }) {
  return (
    <FormPanel title="예약 추가" description="회원, 코치, 목표와 날짜를 입력하면 일정에 반영됩니다." feedback={feedback}>
      <div className="form-grid">
        <input className="app-input" name="member" placeholder="회원 이름" value={form.member} onChange={onChange} />
        <input className="app-input" name="trainer" placeholder="트레이너" value={form.trainer} onChange={onChange} />
        <input className="app-input full-span" name="goal" placeholder="운동 목표" value={form.goal} onChange={onChange} />
        <input className="app-input" name="startAt" type="datetime-local" value={form.startAt} onChange={onChange} />
        <select className="app-input" name="status" value={form.status} onChange={onChange}>
          <option value="예정">예정</option>
          <option value="완료">완료</option>
          <option value="대기">대기</option>
          <option value="노쇼">노쇼</option>
        </select>
      </div>
      <button className="primary-button form-submit" onClick={onSubmit} type="button">
        예약 저장
      </button>
    </FormPanel>
  )
}

export function PackageForm({ form, onChange, onSubmit, feedback }) {
  return (
    <FormPanel title="이용권 추가" description="판매할 상품 이름, 가격, 유효기간을 저장합니다." feedback={feedback}>
      <div className="form-grid">
        <input className="app-input full-span" name="name" placeholder="상품명" value={form.name} onChange={onChange} />
        <input className="app-input" name="price" type="number" placeholder="가격" value={form.price} onChange={onChange} />
        <input className="app-input" name="validDays" type="number" placeholder="유효일수" value={form.validDays} onChange={onChange} />
        <input className="app-input full-span" name="monthlySales" type="number" placeholder="이번 달 판매건수" value={form.monthlySales} onChange={onChange} />
      </div>
      <button className="primary-button form-submit" onClick={onSubmit} type="button">
        상품 저장
      </button>
    </FormPanel>
  )
}

export function NoteForm({ form, onChange, onSubmit, feedback }) {
  return (
    <FormPanel title="메모 추가" description="회원별 운동 기록과 상담 내용을 바로 남깁니다." feedback={feedback}>
      <div className="form-grid">
        <input className="app-input" name="member" placeholder="회원 이름" value={form.member} onChange={onChange} />
        <input className="app-input" name="title" placeholder="메모 제목" value={form.title} onChange={onChange} />
        <textarea className="app-input app-textarea full-span" name="body" placeholder="메모 내용" value={form.body} onChange={onChange} />
      </div>
      <button className="primary-button form-submit" onClick={onSubmit} type="button">
        메모 저장
      </button>
    </FormPanel>
  )
}
