export const demoAlerts = [
  { member: '김하늘', detail: '잔여 2회 · 4월 8일 만료', tone: 'urgent' },
  { member: '이도윤', detail: '7일째 미예약', tone: 'idle' },
  { member: '박서준', detail: '재등록 상담 필요', tone: 'renewal' },
]

export const demoSessions = [
  { time: '09:00', member: '정유진', goal: '하체 밸런스', trainer: '민코치', status: '완료' },
  { time: '11:30', member: '김민재', goal: '체지방 감량', trainer: '민코치', status: '예정' },
  { time: '14:00', member: '최수아', goal: '재활 운동', trainer: '윤코치', status: '예정' },
  { time: '19:30', member: '오세훈', goal: '상체 근력', trainer: '민코치', status: '대기' },
]

export const demoMembers = [
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

export const demoPackages = [
  { name: '10회 집중 감량', price: '₩550,000', rule: '60일', sales: '이번 달 4건' },
  { name: '20회 체형 교정', price: '₩980,000', rule: '90일', sales: '이번 달 7건' },
  { name: '주 2회 1개월', price: '₩390,000', rule: '30일', sales: '이번 달 5건' },
]

export const demoNotes = [
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

export const demoCalendarDays = [
  { day: '월', date: '4/7', slots: ['09:00 정유진', '11:30 김민재', '19:30 오세훈'] },
  { day: '화', date: '4/8', slots: ['10:00 신규 상담', '14:00 최수아'] },
  { day: '수', date: '4/9', slots: ['09:00 정유진', '18:00 김하늘'] },
  { day: '목', date: '4/10', slots: ['11:00 김민재', '20:00 오세훈'] },
  { day: '금', date: '4/11', slots: ['08:00 바디체크', '13:00 최수아'] },
]
