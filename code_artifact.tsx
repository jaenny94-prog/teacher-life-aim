import React, { useState, useEffect, useRef } from 'react';
import { 
  Shield, Zap, Award, Sparkles, BookOpen, Brain, 
  CheckSquare, Plus, Trash2, Edit3, Volume2, VolumeX, 
  ChevronLeft, ChevronRight, RefreshCw, Star, Heart, Flame, Compass,
  TrendingUp, ArrowRight, Smile, Frown, Meh, Sun, Moon,
  ShoppingBag, Check, Lock, AlertCircle, Coins, DollarSign,
  PiggyBank, Calculator, ArrowUpRight, ArrowDownRight, CreditCard,
  UserCheck, Briefcase, GraduationCap, Waves, CircleDollarSign,
  FileSpreadsheet, Sliders, Gem, HelpCircle,
  Upload, Camera, FileText, CheckCircle2, Image as ImageIcon,
  FileCheck, ScanLine, Loader2, X, Download, Smartphone, Settings,
  FolderPlus, Plane, MapPin, Save, Share2, Layers,
  Table, Grid, CheckCircle, Target, Coffee, Dumbbell, Feather, Calendar,
  Palmtree, Snowflake, Clock, Tag, Filter
} from 'lucide-react';

// ==========================================
// 1. Audio & Retro SFX Engine (Web Audio API)
// ==========================================
const playRetroSound = (type, enabled = true) => {
  if (!enabled) return;
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    const now = ctx.currentTime;

    if (type === 'questClear') {
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(523.25, now);
      osc.frequency.setValueAtTime(659.25, now + 0.08);
      osc.frequency.setValueAtTime(783.99, now + 0.16);
      osc.frequency.setValueAtTime(1046.50, now + 0.24);
      gain.gain.setValueAtTime(0.2, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.4);
      osc.start(now);
      osc.stop(now + 0.4);
    } else if (type === 'levelUp') {
      osc.type = 'square';
      [440, 554, 659, 880].forEach((freq, idx) => {
        osc.frequency.setValueAtTime(freq, now + idx * 0.1);
      });
      gain.gain.setValueAtTime(0.25, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.6);
      osc.start(now);
      osc.stop(now + 0.6);
    } else if (type === 'recallChime') {
      osc.type = 'sine';
      osc.frequency.setValueAtTime(880, now);
      osc.frequency.exponentialRampToValueAtTime(1760, now + 0.35);
      gain.gain.setValueAtTime(0.2, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.4);
      osc.start(now);
      osc.stop(now + 0.4);
    } else if (type === 'bubble') {
      osc.type = 'sine';
      osc.frequency.setValueAtTime(400, now);
      osc.frequency.exponentialRampToValueAtTime(800, now + 0.12);
      gain.gain.setValueAtTime(0.15, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.15);
      osc.start(now);
      osc.stop(now + 0.15);
    } else if (type === 'deposit') {
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(587.33, now);
      osc.frequency.setValueAtTime(880, now + 0.1);
      gain.gain.setValueAtTime(0.2, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.3);
      osc.start(now);
      osc.stop(now + 0.3);
    }
  } catch (e) {
    console.warn('Audio not supported:', e);
  }
};

// ==========================================
// 2. Initial Presets & Data
// ==========================================

// 2026 초등 교원 호봉표 (기본급 추정)
const TEACHER_BASE_SALARIES = {
  14: 2850000,
  15: 2980000,
  16: 3120000,
  17: 3270000,
  18: 3440000,
  19: 3600000,
  20: 3780000,
  21: 3950000,
  22: 4120000,
  23: 4300000,
  24: 4480000
};

// 2026년 제공 엑셀 원본 데이터 (단위: 만원)
const INITIAL_2026_EXCEL_DATA = [
  { m: 1, salary: 382, trip: 0, rentInc: 130, mort: -122.8, prin: 22, union: 3, ptTax: 110, rentJung: -95, phone: -5.2, ins: -3.8, devCar: 0, hosp: -4, event: -20, club: -2, card: -210, net: 184.2 },
  { m: 2, salary: 592, trip: 0, rentInc: 130, mort: -122.8, prin: 22, union: 3, ptTax: 110, rentJung: -95, phone: -5.2, ins: -3.8, devCar: 0, hosp: -12, event: -2, club: -2, card: -138, net: 476.2 },
  { m: 3, salary: 308, trip: 440, rentInc: 130, mort: -122.8, prin: 22, union: 3, ptTax: 0, rentJung: -95, phone: -5.2, ins: -3.8, devCar: 0, hosp: -4, event: -2, club: -2, card: -177, net: 491.2 },
  { m: 4, salary: 305, trip: 0, rentInc: 130, mort: -122.8, prin: 22, union: 3, ptTax: 0, rentJung: -95, phone: -5.2, ins: -3.8, devCar: 0, hosp: -4, event: -2, club: -2, card: -103, net: 122.2 },
  { m: 5, salary: 309, trip: 0, rentInc: 130, mort: -122.8, prin: 22, union: 3, ptTax: 0, rentJung: -95, phone: -5.2, ins: -3.8, devCar: 0, hosp: -4, event: -10, club: -2, card: -214, net: 7.2 },
  { m: 6, salary: 307, trip: 0, rentInc: 130, mort: -122.8, prin: 22, union: 3, ptTax: -25.3, rentJung: -95, phone: -5.2, ins: -3.8, devCar: 0, hosp: -4, event: -2, club: -2, card: -135, net: 66.9 },
  { m: 7, salary: 406, trip: 4, rentInc: 130, mort: -122.8, prin: 22, union: 3, ptTax: 0, rentJung: -95, phone: -5.2, ins: -3.8, devCar: 0, hosp: -4, event: -2, club: -2, card: -156, net: 174.2 },
  { m: 8, salary: 310, trip: 5, rentInc: 130, mort: -122.8, prin: 22, union: 3, ptTax: -0.5, rentJung: -95, phone: -5.2, ins: -3.8, devCar: 0, hosp: -4, event: -2, club: -2, card: -134, net: 100.7 },
  { m: 9, salary: 489, trip: 0, rentInc: 130, mort: -122.8, prin: 22, union: 3, ptTax: -25.3, rentJung: -95, phone: -5.2, ins: -3.8, devCar: 0, hosp: -6, event: -2, club: -2, card: -333, net: 48.9 },
  { m: 10, salary: 303, trip: 4, rentInc: 130, mort: -122.8, prin: 22, union: 3, ptTax: 0, rentJung: -95, phone: -5.2, ins: -53.8, devCar: -60, hosp: -4, event: -22, club: -2, card: -167, net: -69.8 },
  { m: 11, salary: 303, trip: 0, rentInc: 130, mort: -122.8, prin: 22, union: 3, ptTax: 0, rentJung: -95, phone: -5.2, ins: -3.8, devCar: -35, hosp: -4, event: -92, club: -2, card: -130, net: -31.8 },
  { m: 12, salary: 303, trip: 0, rentInc: 130, mort: -122.8, prin: 22, union: 3, ptTax: 0, rentJung: -95, phone: -5.2, ins: -3.8, devCar: 0, hosp: -4, event: -20, club: -2, card: -130, net: 75.2 }
];

// 초기 사용자 프로필 (모험가 & 초등 교사)
const INITIAL_PLAYER = {
  name: '모험가 김선생',
  classTitle: '초등 교사 & 지혜의 마법사',
  avatarImage: 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=200&auto=format&fit=crop&q=80',
  level: 18,
  exp: 420,
  maxExp: 1000,
  hp: 95,
  maxHp: 100,
  mp: 88,
  maxMp: 100,
  gold: 3450,
  equippedTitle: '18호봉 현명한 가계부 마스터',
  titles: [
    { id: 't1', name: '초임 모험가', unlocked: true },
    { id: 't2', name: '18호봉 현명한 가계부 마스터', unlocked: true },
    { id: 't3', name: '연간 2,000만원 저축 달성자', unlocked: false, cost: 2000 },
    { id: 't4', name: '시냅스 브레인 개척자', unlocked: false, cost: 1500 },
    { id: 't5', name: '행복한 학급 & 자유 여행자', unlocked: false, cost: 3000 }
  ]
};

// 사용자 정의 카테고리 프리셋
const INITIAL_CATEGORIES = [
  { id: 'finance', name: '💰 재테크 & 자산', color: 'emerald' },
  { id: 'travel', name: '✈️ 여행 & 버킷', color: 'sky' },
  { id: 'career', name: '📚 자기계발 & 교직', color: 'indigo' },
  { id: 'health', name: '🧘 건강 & 라이프', color: 'rose' }
];

// 기간별 에픽 퀘스트(장기 목표)
const INITIAL_GOALS = [
  {
    id: 'g-1',
    title: '2026~2027 연간 순저축 2,000만원 달성',
    period: 'year',
    category: 'finance',
    deadline: '2027-12-31',
    progress: 78,
    targetAmount: 20000000,
    currentAmount: 16453000,
    unit: '원',
    isMoneyGoal: true,
    subTasks: [
      { id: 'st-1', text: '삼성·신한 신용카드 월 130만원 이하로 방어', done: false },
      { id: 'st-2', text: '정자동 월세 및 주담대 차질 없이 자동이체', done: true },
      { id: 'st-3', text: '3월 성과상여금 전액 비상금 저축계좌 입금', done: true }
    ]
  },
  {
    id: 'g-2',
    title: '일본 삿포로 온천 & 미식 여행 (100만원 모으기)',
    period: 'quarter',
    category: 'travel',
    deadline: '2027-01-15',
    progress: 85,
    targetAmount: 1000000,
    currentAmount: 850000,
    unit: '원',
    isMoneyGoal: true,
    subTasks: [
      { id: 'st-4', text: '신치토세 왕복 항공권 특가 예매', done: true },
      { id: 'st-5', text: '삿포로/오타루 료칸 예약 완료', done: true },
      { id: 'st-6', text: '엔화 환전 5만엔 완료', done: false }
    ]
  },
  {
    id: 'g-3',
    title: '이집트 카이로 & 나일강 크루즈 여행 (500만원 모으기)',
    period: 'year',
    category: 'travel',
    deadline: '2027-12-20',
    progress: 40,
    targetAmount: 5000000,
    currentAmount: 2000000,
    unit: '원',
    isMoneyGoal: true,
    subTasks: [
      { id: 'st-7', text: '월 30만원씩 여행 전용 통장 적립', done: false },
      { id: 'st-8', text: '마르사알람/다합 다이빙 일정 사전 리서치', done: true }
    ]
  },
  {
    id: 'g-4',
    title: '토플 114점 달성 & 서울대 대학원 파견 준비',
    period: 'half',
    category: 'career',
    deadline: '2026-10-31',
    progress: 55,
    isMoneyGoal: false,
    subTasks: [
      { id: 'st-9', text: '그래머인유즈 완독 및 오답노트 정리', done: true },
      { id: 'st-10', text: '매일 퇴근길 영어듣기 팟캐스트 청취', done: true },
      { id: 'st-11', text: '토플 실전 모의고사 1회 풀기', done: false }
    ]
  }
];

// 데일리 퀘스트(할 일 목록)
const INITIAL_TODOS = [
  { id: 't-1', text: '학교 계단 오르기 + 영단어 15개 외우기', exp: 20, gold: 15, completed: false },
  { id: 't-2', text: '점심 식사 시 배부르면 수저 내려놓기 (소식 루틴)', exp: 15, gold: 10, completed: true },
  { id: 't-3', text: '편의점 커피 대신 텀블러 티백 마시기 (절약)', exp: 15, gold: 20, completed: false },
  { id: 't-4', text: '가계부 카드 지출 영수증 정리 & 대조', exp: 25, gold: 30, completed: false },
  { id: 't-5', text: '오늘의 감정 일기 작성하고 키워드 뇌구조로 보내기', exp: 30, gold: 25, completed: false }
];

// 시냅스 뇌구조 초기 노드
const INITIAL_BRAIN_NODES = [
  { id: 'bn-1', text: '2,000만원 저축', weight: 4, x: 28, y: 35, side: 'left', category: '자산' },
  { id: 'bn-2', text: '삿포로 여행', weight: 3, x: 70, y: 30, side: 'right', category: '버킷' },
  { id: 'bn-3', text: '토플 114점', weight: 3, x: 35, y: 65, side: 'left', category: '성장' },
  { id: 'bn-4', text: '소식 & 체중감량', weight: 2, x: 65, y: 65, side: 'right', category: '건강' },
  { id: 'bn-5', text: '다합 프리다이빙', weight: 2, x: 80, y: 50, side: 'right', category: '휴식' },
  { id: 'bn-6', text: '카드값 방어', weight: 3, x: 22, y: 50, side: 'left', category: '지출' }
];

// 초기 일기 목록
const INITIAL_DIARIES = [
  {
    id: 'd-1',
    date: '2026-03-28',
    weather: 'sun',
    mood: '기대와 열정',
    content: '새 학기가 시작되고 아이들과 함께하는 일상이 조금씩 자리잡고 있다. 이번 달은 월세 수입과 카드값을 잘 조율해서 400만원 이상 저축을 확보했다. 올해 목표인 2,000만원 저축과 겨울 삿포로 여행을 위해 퇴근길 편의점 소비를 줄이고 건강한 식단을 유지하자.',
    keywords: ['저축', '삿포로', '카드값', '건강한 식단', '월세 수입']
  }
];

// 엑셀 기반 인생 마스터 매트릭스 기본 데이터
const INITIAL_LIFE_MATRIX = {
  slogan: "나만의 속도로 한 걸음씩 채워가는 소중한 인생 마스터 로드맵 ✨",
  masterGoals: [
    { id: 'mg-1', no: 1, text: '다이어트 45kg 달성', category: '운동/다이어트', progress: 0,
      milestones: [
        { period: '한달', title: '야식 끊기 & 몸무게 1kg 감량', done: false },
        { period: '분기', title: '계단오르기 습관화 & 3kg 감량', done: false },
        { period: '반기', title: '체지방률 22% 달성', done: false },
        { period: '1년', title: '45kg 도달 및 체형 유지', done: false }
      ]
    },
    { id: 'mg-2', no: 2, text: '계단오르기 + 영어듣기 루틴', category: '루틴/습관', progress: 0,
      milestones: [
        { period: '한달', title: '매일 출근길 팟캐스트 10분', done: false },
        { period: '분기', title: '학교 계단오르기 주 4회', done: false },
        { period: '반기', title: '영어 뉴스 섀도잉 30일', done: false },
        { period: '1년', title: '자연스러운 영어 청취 체화', done: false }
      ]
    },
    { id: 'mg-3', no: 3, text: '출퇴근 + 영어듣기', category: '루틴/습관', progress: 0,
      milestones: [
        { period: '한달', title: '영어 오디오북 플레이리스트 세팅', done: false },
        { period: '1년', title: '출퇴근 통근시간 100시간 달성', done: false }
      ]
    },
    { id: 'mg-4', no: 4, text: '출퇴근 + 영단어 외우기', category: '어학/커리어', progress: 0,
      milestones: [
        { period: '한달', title: '하루 15단어 암기', done: false },
        { period: '분기', title: '필수 1000단어 1회독', done: false }
      ]
    },
    { id: 'mg-5', no: 5, text: '방학-일본어 공부 단기 집중', category: '어학/커리어', progress: 0,
      milestones: [
        { period: '한달', title: '히라가나/가타카나 완벽 마스터', done: false },
        { period: '분기', title: '기초 회화 50문장 암기', done: false }
      ]
    },
    { id: 'mg-6', no: 6, text: '27년 1월 - 삿포로 여행', category: '여행/버킷', progress: 0,
      milestones: [
        { period: '분기', title: '항공권 및 숙소 예약 (100만원 예산)', done: false },
        { period: '1년', title: '눈꽃 축제 & 료칸 힐링 완료', done: false }
      ]
    },
    { id: 'mg-7', no: 7, text: '방학하기 전에 프리다이빙 배우기', category: '운동/다이어트', progress: 0,
      milestones: [
        { period: '한달', title: '체험 다이빙 강습 신청', done: false },
        { period: '분기', title: '레벨1 라이선스 취득', done: false }
      ]
    },
    { id: 'mg-8', no: 8, text: '프리다이빙 가기 전에 살 빼기', category: '운동/다이어트', progress: 0,
      milestones: [
        { period: '한달', title: '수영복 피팅 목표 체중 달성', done: false }
      ]
    },
    { id: 'mg-9', no: 9, text: '좀 배부르면 수저 내려놓기 (소식 습관)', category: '루틴/습관', progress: 0,
      milestones: [
        { period: '한달', title: '점심시간 과식 방지 20일 성공', done: false }
      ]
    },
    { id: 'mg-10', no: 10, text: '경제지 매주 읽기 - 블로그 정리', category: '루틴/습관', progress: 0,
      milestones: [
        { period: '한달', title: '경제 기사 주 2편 포스팅', done: false },
        { period: '1년', title: '경제 블로그 글 100편 누적', done: false }
      ]
    },
    { id: 'mg-11', no: 11, text: '토플 114점 - 문제집 사서 돌리기', category: '어학/커리어', progress: 0,
      milestones: [
        { period: '분기', title: '토플 기본서 1회독 & 기출 분석', done: false },
        { period: '반기', title: '실전 모의고사 105점 돌파', done: false },
        { period: '1년', title: '토플 114점 최종 취득', done: false }
      ]
    },
    { id: 'mg-12', no: 12, text: '스트레칭 - 거북목, 햄스트링 교정', category: '운동/다이어트', progress: 0,
      milestones: [
        { period: '한달', title: '자기 전 폼롤러 15분', done: false }
      ]
    },
    { id: 'mg-13', no: 13, text: '필라테스 꾸준히 다니기', category: '운동/다이어트', progress: 0,
      milestones: [
        { period: '한달', title: '주 2회 출석 체크 완료', done: false }
      ]
    },
    { id: 'mg-14', no: 14, text: '수영도 꾸준히 (겨울방학 매일 가자)', category: '운동/다이어트', progress: 0,
      milestones: [
        { period: '분기', title: '자유형/평영 50m 논스톱 완주', done: false }
      ]
    },
    { id: 'mg-15', no: 15, text: '토플 114점 채우면 서울대 대학원 준비', category: '어학/커리어', progress: 0,
      milestones: [
        { period: '반기', title: '모집 요강 분석 및 연구계획서 초안', done: false }
      ]
    },
    { id: 'mg-16', no: 16, text: '대학원 파견 가려면 표창 받아야 함', category: '어학/커리어', progress: 0,
      milestones: [
        { period: '1년', title: '교과 연구대회 및 교육감 표창 실적', done: false }
      ]
    },
    { id: 'mg-17', no: 17, text: '블로그 키우기 - 생활비 보태기', category: '재테크/부업', progress: 0,
      milestones: [
        { period: '분기', title: '애드포스트 승인 및 일방문 500명', done: false }
      ]
    },
    { id: 'mg-18', no: 18, text: '국제교육원 파견 도전', category: '어학/커리어', progress: 0,
      milestones: [
        { period: '1년', title: '선발 서류 요건 및 어학 증빙 완성', done: false }
      ]
    },
    { id: 'mg-19', no: 19, text: '풀브라이트 장학 프로그램 지원', category: '어학/커리어', progress: 0,
      milestones: [
        { period: '반기', title: '영문 에세이 및 추천서 준비', done: false },
        { period: '1년', title: '풀브라이트 서류 최종 제출', done: false }
      ]
    },
    { id: 'mg-20', no: 20, text: '28년 1월 마르사알람 한달살기 (혹은 다합)', category: '여행/버킷', progress: 0,
      milestones: [
        { period: '1년', title: '다이빙 로그 100회 & 여비 400만 적립', done: false }
      ]
    },
    { id: 'mg-21', no: 21, text: '크루즈 여행 타보기', category: '여행/버킷', progress: 0,
      milestones: [
        { period: '1년', title: '지중해 크루즈 프로모션 탐색', done: false }
      ]
    },
    { id: 'mg-22', no: 22, text: '유럽 한달살기 (포르투갈 혹은 조지아)', category: '여행/버킷', progress: 0,
      milestones: [
        { period: '1년', title: '숙소 리서치 및 500만원 저축 플랜', done: false }
      ]
    }
  ],
  habitsQ4: [
    { id: 'h1', text: '살빼기 (한달 3kg, 총 9kg 감량)', done: false },
    { id: 'h2', text: '계단오르기 + 영어듣기', done: false },
    { id: 'h3', text: '출퇴근 + 영어듣기 + 영단어 외우기', done: false },
    { id: 'h4', text: '주말엔 수영가기', done: false },
    { id: 'h5', text: '블로그에 기록 꾸준히 쌓기', done: false },
    { id: 'h6', text: '자전적 소설 + 웹소설 쓰기', done: false },
    { id: 'h7', text: '그래머인유즈 다 끝내기', done: false },
    { id: 'h8', text: '그래머인유즈 오답노트 달달 외우기', done: false },
    { id: 'h9', text: '필라테스 주 2~3회 출석', done: false },
    { id: 'h10', text: '홈트 스트레칭 열심히 하기', done: false },
    { id: 'h11', text: '경제지 매주 읽고 블로그 정리', done: false },
    { id: 'h12', text: '봉사활동 시작하기 (용기 내보기)', done: false },
    { id: 'h13', text: '일본여행 준비 - 히라가나, 회화 익히기', done: false },
    { id: 'h14', text: '물건 안 사고 최대한 비우고 줄이기', done: false },
    { id: 'h15', text: '독하게 편의점 커피, 음료 끊기', done: false },
    { id: 'h16', text: '과자 끊고 아메리카노만 마시기', done: false }
  ],
  timelineMonths: [
    { month: '10월', title: '습관 초석 & 건강 루틴', items: ['필라테스 주2회', '수영 주말이라도 가기', '매일 계단오르기', '영단어 외우기', '9kg 감량 도전'] },
    { month: '1월', title: '삿포로 여행 & 어학 몰입', items: ['일본어 집중공부', '프리다이빙 등록', '매일 수영, 필라테스', '다이어트 빡세게', '일본 여행 잘 다녀오기'] },
    { month: '2월', title: '어학 & 창작 폭발', items: ['프리다이빙', '영어공부 빡세게', '글쓰기, 작사작곡', '토플 문제집 시작', '블로그 더 열심히'] },
    { month: '3월', title: '연구대회 & 새학기 초석', items: ['연구대회 준비 및 초석', '학급경영 세팅', '기록 꼼꼼히 시작', '금융공모전 준비', '교과서 연구'] },
    { month: '4월', title: '풀브라이트 제출 & 도약', items: ['풀브라이트 제출이라도 해보자', '부장 일 잘하기', '이집트 한달살기 준비', '블로그 키우기'] }
  ],
  year2027MasterPlan: [
    "1. 연구대회", "2. 영어토플 114", "3. 대학원준비", "4. 풀브라이트 준비", 
    "5. 금융공모전 준비", "6. 부장 일 잘하기", "7. 학급경영 초석", "8. 다이어트 45kg", 
    "9. 프리다이빙", "10. 이집트 한달살기 준비", "11. 돈 열심히 모으기 (2천만)", 
    "12. 블로그 키우기, 글쓰기", "13. 봉사활동하기", "14. 외부강의도 도전"
  ],
  innerThoughts: [
    "일단 여행이라도 열심히 다녀보자! 새로운 세상을 만나며 리프레시하기.",
    "나만의 재능과 글쓰기, 창작으로 부업 파이프라인 만들어보기.",
    "정체된 느낌이 들 땐 작은 루틴 하나부터 실천해서 성취감 채우기.",
    "차곡차곡 남기는 이 모든 기록들이 결국 나의 가장 큰 자산이 된다.",
    "나 자신을 너무 다그치지 말고, 하루하루 내 호흡대로 나아가자."
  ]
};

// 기본 학교 연간 학사일정 및 방학 프리셋 데이터
const INITIAL_SCHOOL_EVENTS = [
  { id: 'se-1', title: '1학기 시업식 & 입학식', date: '2026-03-02', type: 'school', note: '새 학년 첫 만남' },
  { id: 'se-2', title: '학부모 총회 및 공개수업', date: '2026-03-18', type: 'school', note: '교육과정 설명회' },
  { id: 'se-3', title: '개교기념일 (재량휴업일)', date: '2026-05-01', type: 'holiday', note: '황금연휴 리프레시' },
  { id: 'se-4', title: '봄 현장체험학습', date: '2026-05-15', type: 'event', note: '학생 안전 지도 철저' },
  { id: 'se-5', title: '여름방학식 🏖️', date: '2026-07-22', type: 'vacation', note: '1학기 교육과정 종료' },
  { id: 'se-6', title: '2학기 개학식', date: '2026-08-24', type: 'school', note: '건강하게 2학기 시작' },
  { id: 'se-7', title: '가을 학예발표회 & 운동회', date: '2026-10-14', type: 'event', note: '학급 협동 발표' },
  { id: 'se-8', title: '겨울방학식 ❄️', date: '2026-12-30', type: 'vacation', note: '겨울방학 및 자기계발 돌입' },
  { id: 'se-9', title: '종업식 및 졸업식 🎓', date: '2027-02-12', type: 'school', note: '한 해 학급 마무리' }
];

// 여름/겨울 방학 디테일 플래너 기본 프리셋
const INITIAL_VACATION_PLANS = {
  summer: {
    startDate: '2026-07-23',
    endDate: '2026-08-23',
    slogan: '프리다이빙 입문 & 건강한 체력 증진, 힐링 여름방학! 🌊',
    routines: [
      { id: 'sr-1', time: '08:00', text: '기상 & 모닝 스트레칭 20분', done: false },
      { id: 'sr-2', time: '10:00', text: '프리다이빙 호흡 훈련 & 수영', done: false },
      { id: 'sr-3', time: '14:00', text: '경제지 및 교직 연구 도서 독서', done: false },
      { id: 'sr-4', time: '20:00', text: '블로그 기록 및 하루 감사일기', done: false }
    ],
    milestones: [
      { id: 'sm-1', date: '2026-07-28', title: '프리다이빙 레벨1 라이선스 실습', status: 'planned' },
      { id: 'sm-2', date: '2026-08-05', title: '국내 동해안 힐링 바다여행', status: 'planned' },
      { id: 'sm-3', date: '2026-08-15', title: '2학기 프로젝트 수업 교안 미리 완성', status: 'planned' }
    ]
  },
  winter: {
    startDate: '2026-12-31',
    endDate: '2027-02-11',
    slogan: '삿포로 눈꽃 여행 & 토플 114점 올인 겨울방학! ❄️',
    routines: [
      { id: 'wr-1', time: '08:30', text: '기상 & 그래머인유즈 영문법 1단원', done: false },
      { id: 'wr-2', time: '13:00', text: '실내 필라테스 & 계단오르기', done: false },
      { id: 'wr-3', time: '15:30', text: '토플 리딩/리스닝 모의고사 풀이', done: false },
      { id: 'wr-4', time: '21:00', text: '삿포로 여행 일정 및 일본어 회화 복습', done: false }
    ],
    milestones: [
      { id: 'wm-1', date: '2027-01-08', title: '일본 삿포로 4박5일 눈꽃 여행 ✈️', status: 'planned' },
      { id: 'wm-2', date: '2027-01-20', title: '토플 모의고사 100점 돌파 테스트', status: 'planned' },
      { id: 'wm-3', date: '2027-02-01', title: '새 학년 학급경영 초안 및 환경구성 구상', status: 'planned' }
    ]
  }
};

// ==========================================
// 3. Main Dashboard Component
// ==========================================
export default function AdventurerDashboard() {
  // Navigation: 'quests'(메인) -> 'matrix' -> 'school' -> 'finance' -> 'brain' -> 'diary' -> 'character'
  const [activeTab, setActiveTab] = useState('quests');
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [toastMessage, setToastMessage] = useState(null);

  // Core App States
  const [player, setPlayer] = useState(() => {
    const saved = localStorage.getItem('teacher_money_player');
    return saved ? JSON.parse(saved) : INITIAL_PLAYER;
  });

  const [categories, setCategories] = useState(() => {
    const saved = localStorage.getItem('teacher_money_categories');
    return saved ? JSON.parse(saved) : INITIAL_CATEGORIES;
  });

  const [goals, setGoals] = useState(() => {
    const saved = localStorage.getItem('teacher_money_goals');
    return saved ? JSON.parse(saved) : INITIAL_GOALS;
  });

  const [todos, setTodos] = useState(() => {
    const saved = localStorage.getItem('teacher_money_todos');
    return saved ? JSON.parse(saved) : INITIAL_TODOS;
  });

  const [brainNodes, setBrainNodes] = useState(() => {
    const saved = localStorage.getItem('teacher_money_brain_nodes');
    return saved ? JSON.parse(saved) : INITIAL_BRAIN_NODES;
  });

  const [diaries, setDiaries] = useState(() => {
    const saved = localStorage.getItem('teacher_money_diaries');
    return saved ? JSON.parse(saved) : INITIAL_DIARIES;
  });

  const [lifeMatrix, setLifeMatrix] = useState(() => {
    const saved = localStorage.getItem('teacher_money_life_matrix');
    return saved ? JSON.parse(saved) : INITIAL_LIFE_MATRIX;
  });

  // 학교 학사일정 및 방학 플래너 상태
  const [schoolEvents, setSchoolEvents] = useState(() => {
    const saved = localStorage.getItem('teacher_money_school_events');
    return saved ? JSON.parse(saved) : INITIAL_SCHOOL_EVENTS;
  });

  const [vacationPlans, setVacationPlans] = useState(() => {
    const saved = localStorage.getItem('teacher_money_vacation_plans');
    return saved ? JSON.parse(saved) : INITIAL_VACATION_PLANS;
  });

  // 캘린더 네비게이션
  const [calCurrentDate, setCalCurrentDate] = useState(new Date(2026, 2, 1)); // 2026년 3월 기본
  const [calSelectedDateStr, setCalSelectedDateStr] = useState('2026-03-02');
  const [schoolPlannerSubTab, setSchoolPlannerSubTab] = useState('calendar'); // 'calendar' | 'summer' | 'winter'

  // 학교 계획서 파일 업로드 상태
  const schoolPlanFileRef = useRef(null);
  const [isScanningSchoolPlan, setIsScanningSchoolPlan] = useState(false);

  // 학사일정 직접 추가/수정 모달 상태
  const [showEventModal, setShowEventModal] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);
  const [eventFormTitle, setEventFormTitle] = useState('');
  const [eventFormDate, setEventFormDate] = useState('2026-03-02');
  const [eventFormType, setEventFormType] = useState('school');
  const [eventFormNote, setEventFormNote] = useState('');

  // 방학 루틴/마일스톤 추가 폼
  const [newVacationRoutineTime, setNewVacationRoutineTime] = useState('10:00');
  const [newVacationRoutineText, setNewVacationRoutineText] = useState('');
  const [newVacationMilestoneTitle, setNewVacationMilestoneTitle] = useState('');
  const [newVacationMilestoneDate, setNewVacationMilestoneDate] = useState('2026-08-01');

  // 퀘스트 필터 및 상태
  const [selectedPeriod, setSelectedPeriod] = useState('all'); // 'all' | 'month' | 'quarter' | 'half' | 'year'
  const [newTodoText, setNewTodoText] = useState('');
  const [newBrainIdea, setNewBrainIdea] = useState('');

  // 가계부 상태
  const [currentHobong, setCurrentHobong] = useState(18);
  const [isClassTeacher, setIsClassTeacher] = useState(false);
  const [isHeadTeacher, setIsHeadTeacher] = useState(false);
  const [leaveStatus, setLeaveStatus] = useState('normal'); // 'normal' | 'parental_1' | 'parental_2' | 'sick'
  const [financeViewMode, setFinanceViewMode] = useState('month'); // 'month' | 'annual'
  const [cardSavingPercent, setCardSavingPercent] = useState(15);
  const [excelData2026, setExcelData2026] = useState(INITIAL_2026_EXCEL_DATA);

  // 매트릭스 필터 및 상태
  const [matrixFilterCat, setMatrixFilterCat] = useState('all');
  const [selectedMasterGoalId, setSelectedMasterGoalId] = useState(null);
  const [isEditingSlogan, setIsEditingSlogan] = useState(false);
  const [tempSlogan, setTempSlogan] = useState(lifeMatrix.slogan || '');
  const [showAddMasterGoalModal, setShowAddMasterGoalModal] = useState(false);
  const [newMasterGoalTitle, setNewMasterGoalTitle] = useState('');
  const [newMasterGoalCat, setNewMasterGoalCat] = useState('루틴/습관');

  // 모달 제어 상태
  const [showDepositModal, setShowDepositModal] = useState(false);
  const [activeDepositGoal, setActiveDepositGoal] = useState(null);
  const [depositAmount, setDepositAmount] = useState('');
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [newCatName, setNewCatName] = useState('');
  const [newCatColor, setNewCatColor] = useState('indigo');
  const [showAddGoalModal, setShowAddGoalModal] = useState(false);
  const [showEditGoalModal, setShowEditGoalModal] = useState(false);
  const [editingGoal, setEditingGoal] = useState(null);
  const [newEditSubTask, setNewEditSubTask] = useState('');

  // 일기 입력 폼
  const [diaryDate, setDiaryDate] = useState('2026-03-29');
  const [diaryWeather, setDiaryWeather] = useState('sun');
  const [diaryMood, setDiaryMood] = useState('보람찬 하루');
  const [diaryContent, setDiaryContent] = useState('');
  const [extractedKeywords, setExtractedKeywords] = useState([]);

  // 아바타 커스텀 모달
  const [showAvatarModal, setShowAvatarModal] = useState(false);
  const [customAvatarUrl, setCustomAvatarUrl] = useState('');
  const fileInputRef = useRef(null);

  // 명세서 분석 모달
  const [showPaystubModal, setShowPaystubModal] = useState(false);
  const [isScanningPaystub, setIsScanningPaystub] = useState(false);
  const paystubFileRef = useRef(null);
  const [scannedPaystubData, setScannedPaystubData] = useState(null);

  // PWA 모달
  const [showPwaModal, setShowPwaModal] = useState(false);

  // Sync states to LocalStorage
  useEffect(() => {
    localStorage.setItem('teacher_money_player', JSON.stringify(player));
  }, [player]);

  useEffect(() => {
    localStorage.setItem('teacher_money_categories', JSON.stringify(categories));
  }, [categories]);

  useEffect(() => {
    localStorage.setItem('teacher_money_goals', JSON.stringify(goals));
  }, [goals]);

  useEffect(() => {
    localStorage.setItem('teacher_money_todos', JSON.stringify(todos));
  }, [todos]);

  useEffect(() => {
    localStorage.setItem('teacher_money_brain_nodes', JSON.stringify(brainNodes));
  }, [brainNodes]);

  useEffect(() => {
    localStorage.setItem('teacher_money_diaries', JSON.stringify(diaries));
  }, [diaries]);

  useEffect(() => {
    localStorage.setItem('teacher_money_life_matrix', JSON.stringify(lifeMatrix));
  }, [lifeMatrix]);

  useEffect(() => {
    localStorage.setItem('teacher_money_school_events', JSON.stringify(schoolEvents));
  }, [schoolEvents]);

  useEffect(() => {
    localStorage.setItem('teacher_money_vacation_plans', JSON.stringify(vacationPlans));
  }, [vacationPlans]);

 // Toast Trigger
  const triggerToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3000);
  };
// ==========================================
  // [수정 가능 데이터] 습관 챌린지, 2027 목표, 월별 액션플랜
  // ==========================================
  
  // 1. 습관 챌린지 상태
  const [habitSectionTitle, setHabitSectionTitle] = useState(() => {
    return localStorage.getItem('teacher_habit_title') || '10~12월 습관 & 600 더 모으기';
  });
  const [habitSectionSubtitle, setHabitSectionSubtitle] = useState(() => {
    return localStorage.getItem('teacher_habit_sub') || '몸과 마음을 다잡는 16가지 실천 챌린지';
  });
  const [habitList, setHabitList] = useState(() => {
    const saved = localStorage.getItem('teacher_habit_items');
    if (saved) { try { return JSON.parse(saved); } catch (e) {} }
    return [
      { id: 1, text: "자전적 소설 + 웹소설 쓰기", done: false },
      { id: 2, text: "그래머인유즈 다 끝내기", done: false },
      { id: 3, text: "그래머인유즈 오답노트 달달 외우기", done: false },
      { id: 4, text: "필라테스 주 2~3회 출석", done: false },
      { id: 5, text: "홈트 스트레칭 열심히 하기", done: false },
      { id: 6, text: "경제지 매주 읽고 블로그 정리", done: false },
      { id: 7, text: "봉사활동 시작하기 (용기 내보기)", done: false },
      { id: 8, text: "일본여행 준비 - 히라가나, 회화 익히기", done: false },
      { id: 9, text: "물건 안 사고 최대한 비우고 줄이기", done: false },
      { id: 10, text: "독하게 편의점 커피, 음료 끊기", done: false },
      { id: 11, text: "과자 끊고 아메리카노만 마시기", done: false }
    ];
  });

  // 2. 2027 마스터 과제 상태
  const [master2027Title, setMaster2027Title] = useState(() => {
    return localStorage.getItem('teacher_2027_title') || '2027년 14대 핵심 마스터 과제';
  });
  const [master2027List, setMaster2027List] = useState(() => {
    const saved = localStorage.getItem('teacher_2027_items');
    if (saved) { try { return JSON.parse(saved); } catch (e) {} }
    return [
      "연구대회", "영어토플 114", "대학원준비", "풀브라이트 준비",
      "금융공모전 준비", "부장 일 잘하기", "학급경영 초석", "다이어트 45kg",
      "프리다이빙", "이집트 한달살기 준비", "돈 열심히 모으기 (2천만)",
      "블로그 키우기, 글쓰기", "봉사활동하기", "외부강의도 도전"
    ];
  });

  // 3. 월별 액션 플랜 타임라인 상태
  const [monthlyTimeline, setMonthlyTimeline] = useState(() => {
    const saved = localStorage.getItem('teacher_monthly_timeline');
    if (saved) { try { return JSON.parse(saved); } catch (e) {} }
    return [
      {
        month: "10월",
        theme: "습관 초석 & 건강 ...",
        items: ["필라테스 주2회", "수영 주말이라도 가기", "매원 계단오르기", "영단어 외우기", "9kg 감량 도전"]
      },
      {
        month: "1월",
        theme: "삿포로 여행 & 어학...",
        items: ["일본어 집중공부", "프리다이빙 등록", "매원 수영, 필라테스", "다이어트 빡세게", "일본 여행 잘 다녀오기"]
      },
      {
        month: "2월",
        theme: "어학 & 창작 폭발",
        items: ["프리다이빙", "영어공부 빡세게", "글쓰기, 작사작곡", "토플 문제집 시작", "블로그 더 열심히"]
      },
      {
        month: "3월",
        theme: "연구대회 & 새학기 ...",
        items: ["연구대회 준비 및 초석", "학급경영 세팅", "기록 꼼꼼히 시작", "금융공모전 준비", "교과서 연구"]
      },
      {
        month: "4월",
        theme: "풀브라이트 제출 & ...",
        items: ["풀브라이트 제출이라도 해보자", "부장 일 잘하기", "이집트 한달살기 준비", "블로그 키우기"]
      }
    ];
  });

  // 편집 모달용 임시 상태
  const [editModalType, setEditModalType] = useState(null);
  const [tempTextValue, setTempTextValue] = useState('');
  const [tempMonthlyData, setTempMonthlyData] = useState([]);

  // 습관 체크 토글 함수
  const toggleHabitDone = (id) => {
    const updated = habitList.map(item => item.id === id ? { ...item, done: !item.done } : item);
    setHabitList(updated);
    localStorage.setItem('teacher_habit_items', JSON.stringify(updated));
  };
  // 1. 아바타 커스텀 상태 (내 사진 업로드 Data URL)
  const [avatarUrl, setAvatarUrl] = useState(() => {
    return localStorage.getItem('teacher_avatar_url') || '';
  });

  // 이미지 파일 업로드 핸들러
  const handleAvatarUpload = (e) => {
    const file = e.target.files && e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarUrl(reader.result);
        localStorage.setItem('teacher_avatar_url', reader.result);
        triggerToast('아바타 이미지가 변경되었습니다! ✨');
      };
      reader.readAsDataURL(file);
    }
  };

  // 2. 일기 데이터 상태 및 제어 함수
  const [diaryEntries, setDiaryEntries] = useState(() => {
    const saved = localStorage.getItem('teacher_diary_entries');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { console.error(e); }
    }
    return [
      {
        id: 'd-1',
        date: new Date().toISOString().split('T')[0],
        title: '오늘의 교실 기록',
        content: '아이들과 함께 규칙을 정하고 차분하게 하루를 보냈다.',
        mood: 'smile',
        comments: [
          { id: 'c-1', date: new Date().toISOString().replace('T', ' ').slice(0, 16), text: '다음 주에는 모둠 활동 규칙도 보완해보기.' }
        ]
      }
    ];
  });

  const [editingDiary, setEditingDiary] = useState(null);
  const [diaryDateInput, setDiaryDateInput] = useState(new Date().toISOString().split('T')[0]);
  const [diaryTitleInput, setDiaryTitleInput] = useState('');
  const [diaryContentInput, setDiaryContentInput] = useState('');
  const [diaryMoodInput, setDiaryMoodInput] = useState('smile');

  const [activeCommentEntryId, setActiveCommentEntryId] = useState(null);
  const [commentTextInput, setCommentTextInput] = useState('');

  const saveDiaryList = (newList) => {
    setDiaryEntries(newList);
    localStorage.setItem('teacher_diary_entries', JSON.stringify(newList));
  };

  const handleSaveDiaryEntry = () => {
    if (!diaryTitleInput.trim() || !diaryContentInput.trim()) {
      alert('제목과 내용을 모두 입력해 주세요.');
      return;
    }

    if (editingDiary && editingDiary.id) {
      const updated = diaryEntries.map(entry => 
        entry.id === editingDiary.id 
          ? { ...entry, date: diaryDateInput, title: diaryTitleInput, content: diaryContentInput, mood: diaryMoodInput }
          : entry
      );
      saveDiaryList(updated);
      triggerToast('일기가 성공적으로 수정되었습니다! 📝');
    } else {
      const newEntry = {
        id: 'd-' + Date.now(),
        date: diaryDateInput,
        title: diaryTitleInput,
        content: diaryContentInput,
        mood: diaryMoodInput,
        comments: []
      };
      saveDiaryList([newEntry, ...diaryEntries]);
      triggerToast('새 일기가 저장되었습니다! ✨');
    }

    setEditingDiary(null);
    setDiaryTitleInput('');
    setDiaryContentInput('');
    setDiaryDateInput(new Date().toISOString().split('T')[0]);
  };

  const handleDeleteDiaryEntry = (id) => {
    if (window.confirm('이 일기를 정말 삭제하시겠습니까?')) {
      const filtered = diaryEntries.filter(entry => entry.id !== id);
      saveDiaryList(filtered);
      triggerToast('일기가 삭제되었습니다. 🗑️');
    }
  };

  const handleOpenEditModal = (entry) => {
    setEditingDiary(entry);
    setDiaryDateInput(entry.date);
    setDiaryTitleInput(entry.title);
    setDiaryContentInput(entry.content);
    setDiaryMoodInput(entry.mood || 'smile');
  };

  const handleAddComment = (entryId) => {
    if (!commentTextInput.trim()) return;
    const nowStr = new Date().toLocaleString('ko-KR', { 
      year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' 
    });
    
    const updated = diaryEntries.map(entry => {
      if (entry.id === entryId) {
        const newComments = entry.comments ? [...entry.comments] : [];
        newComments.push({
          id: 'c-' + Date.now(),
          date: nowStr,
          text: commentTextInput.trim()
        });
        return { ...entry, comments: newComments };
      }
      return entry;
    });

    saveDiaryList(updated);
    setCommentTextInput('');
    triggerToast('회고 댓글이 추가되었습니다! 💬');
  };

  const handleDeleteComment = (entryId, commentId) => {
    const updated = diaryEntries.map(entry => {
      if (entry.id === entryId) {
        return {
          ...entry,
          comments: (entry.comments || []).filter(c => c.id !== commentId)
        };
      }
      return entry;
    });
    saveDiaryList(updated);
  };

  // EXP & Gold Reward System
  const grantRewards = (expGain, goldGain) => {
    setPlayer(prev => {
      let newExp = prev.exp + expGain;
      let newLevel = prev.level;
      let newMaxExp = prev.maxExp;
      let leveledUp = false;

      while (newExp >= newMaxExp) {
        newExp -= newMaxExp;
        newLevel += 1;
        newMaxExp = Math.round(newMaxExp * 1.25);
        leveledUp = true;
      }

      if (leveledUp) {
        playRetroSound('levelUp', soundEnabled);
        triggerToast(`🎉 LEVEL UP! Lv.${newLevel} 달성! (최대 HP/MP 상승)`);
      }

      return {
        ...prev,
        level: newLevel,
        exp: newExp,
        maxExp: newMaxExp,
        gold: prev.gold + goldGain,
        hp: Math.min(prev.maxHp, prev.hp + 5),
        mp: Math.min(prev.maxMp, prev.mp + 5)
      };
    });
  };

  // 학교 연간 교육계획서 파일 자동인식 및 캘린더 일괄 등록
  const processSchoolPlanUpload = (fileName = '2026학년도_초등_교육계획서_학사일정.pdf') => {
    setIsScanningSchoolPlan(true);
    playRetroSound('bubble', soundEnabled);

    setTimeout(() => {
      const extracted = [
        { id: `se-${Date.now()}-1`, title: '1학기 현장체험학습 (봄 소풍)', date: '2026-04-24', type: 'event', note: '교외 안전 지도' },
        { id: `se-${Date.now()}-2`, title: '개교기념일 재량휴업일', date: '2026-05-01', type: 'holiday', note: '나이스 복무 사전 상신' },
        { id: `se-${Date.now()}-3`, title: '1학기 학부모 상담주간', date: '2026-05-18', type: 'school', note: '오후 상담 일정 편성' },
        { id: `se-${Date.now()}-4`, title: '1학기 여름방학식 🏖️', date: '2026-07-22', type: 'vacation', note: '생활기록부 마감 및 방학 돌입' },
        { id: `se-${Date.now()}-5`, title: '2학기 개학식', date: '2026-08-24', type: 'school', note: '2학기 교과서 배부' },
        { id: `se-${Date.now()}-6`, title: '추석 연휴 및 징검다리 재량휴업', date: '2026-09-25', type: 'holiday', note: '연휴 휴식' },
        { id: `se-${Date.now()}-7`, title: '꿈끼 자랑 학예회', date: '2026-11-06', type: 'event', note: '학급별 무대 준비' },
        { id: `se-${Date.now()}-8`, title: '겨울방학식 ❄️', date: '2026-12-30', type: 'vacation', note: '겨울방학 시작' }
      ];

      setSchoolEvents(prev => {
        const existingKeys = new Set(prev.map(e => `${e.date}_${e.title}`));
        const filteredNew = extracted.filter(e => !existingKeys.has(`${e.date}_${e.title}`));
        return [...prev, ...filteredNew].sort((a, b) => a.date.localeCompare(b.date));
      });

      setIsScanningSchoolPlan(false);
      playRetroSound('questClear', soundEnabled);
      grantRewards(50, 40);
      triggerToast(`📄 [${fileName}] 분석 완료! 8개의 학사일정이 캘린더에 자동 배치되었습니다.`);
    }, 1300);
  };

  // 캘린더 일정 저장/수정 핸들러
  const handleSaveEvent = () => {
    if (!eventFormTitle.trim()) return;

    if (editingEvent) {
      setSchoolEvents(prev => prev.map(ev => 
        ev.id === editingEvent.id 
          ? { ...ev, title: eventFormTitle.trim(), date: eventFormDate, type: eventFormType, note: eventFormNote.trim() }
          : ev
      ));
      triggerToast('✨ 학사일정이 수정되었습니다.');
    } else {
      const newEv = {
        id: `se-${Date.now()}`,
        title: eventFormTitle.trim(),
        date: eventFormDate,
        type: eventFormType,
        note: eventFormNote.trim()
      };
      setSchoolEvents(prev => [...prev, newEv].sort((a, b) => a.date.localeCompare(b.date)));
      playRetroSound('bubble', soundEnabled);
      triggerToast(`📅 [${newEv.title}] 일정이 캘린더에 등록되었습니다.`);
    }

    setShowEventModal(false);
    setEditingEvent(null);
  };

  // 캘린더 일정 삭제
  const handleDeleteEvent = (eventId) => {
    setSchoolEvents(prev => prev.filter(e => e.id !== eventId));
    playRetroSound('bubble', soundEnabled);
    triggerToast('학사일정이 삭제되었습니다.');
  };

  // 방학 루틴 토글 핸들러
  const toggleVacationRoutine = (season, routineId) => {
    setVacationPlans(prev => {
      const updated = { ...prev };
      updated[season].routines = updated[season].routines.map(r => 
        r.id === routineId ? { ...r, done: !r.done } : r
      );
      return updated;
    });
    playRetroSound('questClear', soundEnabled);
    grantRewards(15, 10);
  };

  // 방학 루틴 추가
  const handleAddVacationRoutine = (season) => {
    if (!newVacationRoutineText.trim()) return;
    const newR = {
      id: `vr-${Date.now()}`,
      time: newVacationRoutineTime,
      text: newVacationRoutineText.trim(),
      done: false
    };
    setVacationPlans(prev => ({
      ...prev,
      [season]: {
        ...prev[season],
        routines: [...prev[season].routines, newR]
      }
    }));
    setNewVacationRoutineText('');
    playRetroSound('bubble', soundEnabled);
    triggerToast('🏖️ 방학 루틴이 등록되었습니다.');
  };

  // 방학 마일스톤 추가
  const handleAddVacationMilestone = (season) => {
    if (!newVacationMilestoneTitle.trim()) return;
    const newM = {
      id: `vm-${Date.now()}`,
      date: newVacationMilestoneDate,
      title: newVacationMilestoneTitle.trim(),
      status: 'planned'
    };
    setVacationPlans(prev => ({
      ...prev,
      [season]: {
        ...prev[season],
        milestones: [...prev[season].milestones, newM]
      }
    }));
    setNewVacationMilestoneTitle('');
    playRetroSound('deposit', soundEnabled);
    triggerToast('🎯 방학 핵심 마일스톤이 등록되었습니다.');
  };

  // 슬로건 저장 핸들러
  const handleSaveSlogan = () => {
    setLifeMatrix(prev => ({ ...prev, slogan: tempSlogan }));
    setIsEditingSlogan(false);
    triggerToast('✨ 슬로건이 업데이트되었습니다.');
  };

  // 마스터 목표 추가 핸들러
  const handleAddMasterGoal = () => {
    if (!newMasterGoalTitle.trim()) return;
    const newGoalObj = {
      id: `mg-${Date.now()}`,
      no: lifeMatrix.masterGoals.length + 1,
      text: newMasterGoalTitle.trim(),
      category: newMasterGoalCat,
      progress: 0,
      milestones: [
        { period: '한달', title: '1단계 시작하기', done: false },
        { period: '분기', title: '2단계 점검', done: false },
        { period: '반기', title: '3단계 도약', done: false },
        { period: '1년', title: '최종 달성', done: false }
      ]
    };
    setLifeMatrix(prev => ({
      ...prev,
      masterGoals: [...prev.masterGoals, newGoalObj]
    }));
    setNewMasterGoalTitle('');
    setShowAddMasterGoalModal(false);
    playRetroSound('bubble', soundEnabled);
    triggerToast(`🎯 [${newGoalObj.text}] 목표가 추가되었습니다!`);
  };

  // 마스터 목표 삭제 핸들러
  const handleDeleteMasterGoal = (goalId) => {
    setLifeMatrix(prev => ({
      ...prev,
      masterGoals: prev.masterGoals.filter(g => g.id !== goalId)
    }));
    if (selectedMasterGoalId === goalId) setSelectedMasterGoalId(null);
    triggerToast('목표가 삭제되었습니다.');
  };

  // 마스터 목표 도달률(%) 직접 수정 핸들러
  const handleUpdateMasterGoalProgress = (goalId, newProgress) => {
    const p = Math.max(0, Math.min(100, Number(newProgress)));
    setLifeMatrix(prev => ({
      ...prev,
      masterGoals: prev.masterGoals.map(g => g.id === goalId ? { ...g, progress: p } : g)
    }));
  };

  // 마스터 목표 하위 마일스톤 체크 시 도달률 자동 재계산
  const handleToggleMilestone = (goalId, milestoneIndex) => {
    setLifeMatrix(prev => {
      const updatedGoals = prev.masterGoals.map(g => {
        if (g.id !== goalId) return g;
        const newMilestones = [...(g.milestones || [])];
        if (newMilestones[milestoneIndex]) {
          newMilestones[milestoneIndex] = {
            ...newMilestones[milestoneIndex],
            done: !newMilestones[milestoneIndex].done
          };
        }
        const doneCount = newMilestones.filter(m => m.done).length;
        const autoProgress = newMilestones.length > 0 ? Math.round((doneCount / newMilestones.length) * 100) : g.progress;
        return {
          ...g,
          milestones: newMilestones,
          progress: autoProgress
        };
      });
      return { ...prev, masterGoals: updatedGoals };
    });
    playRetroSound('questClear', soundEnabled);
    grantRewards(15, 10);
  };

  // 전체 목표 0% 리셋 핸들러
  const handleResetMasterGoalsToZero = () => {
    setLifeMatrix(prev => ({
      ...prev,
      masterGoals: prev.masterGoals.map(g => ({
        ...g,
        progress: 0,
        milestones: (g.milestones || []).map(m => ({ ...m, done: false }))
      })),
      habitsQ4: prev.habitsQ4.map(h => ({ ...h, done: false }))
    }));
    playRetroSound('bubble', soundEnabled);
    triggerToast('모든 목표의 도달률과 체크박스가 0%로 초기화되었습니다.');
  };

  // 데이터 백업(JSON 다운로드) 함수
  const exportDataJson = () => {
    const allData = {
      player,
      categories,
      lifeMatrix,
      goals,
      todos,
      brainNodes,
      diaries,
      schoolEvents,
      vacationPlans,
      exportDate: new Date().toISOString()
    };
    const blob = new Blob([JSON.stringify(allData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `티처_머니앤라이프_백업_${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
    triggerToast('💾 전체 데이터가 JSON 백업 파일로 다운로드되었습니다.');
  };

  // NEIS 급여명세서 파일 자동 스캔 및 계산 모의 로직
  const processPaystubUpload = (fileName = '2026_03_급여명세서.pdf') => {
    setIsScanningPaystub(true);
    playRetroSound('bubble', soundEnabled);

    setTimeout(() => {
      const mockResult = {
        month: '2026년 3월',
        hobong: 18,
        incomes: [
          { name: '본봉 (기본급)', amount: 3440000 },
          { name: '정근수당가산금', amount: 50000 },
          { name: '교직수당', amount: 250000 },
          { name: '담임수당 (가산금4)', amount: 200000 },
          { name: '보직교사수당', amount: 70000 },
          { name: '정액급식비', amount: 140000 },
          { name: '교원연구비', amount: 60000 },
          { name: '시간외근무수당(정액)', amount: 135000 }
        ],
        deductions: [
          { name: '소득세', amount: 125000 },
          { name: '지방소득세', amount: 12500 },
          { name: '공무원연금 기여금', amount: 335000 },
          { name: '건강보험료', amount: 145000 },
          { name: '노인장기요양보험', amount: 18700 },
          { name: '대한교직원공제회', amount: 300000 },
          { name: '학교 친목회비', amount: 20000 }
        ]
      };

      const totalIncome = mockResult.incomes.reduce((acc, cur) => acc + cur.amount, 0);
      const totalDeduction = mockResult.deductions.reduce((acc, cur) => acc + cur.amount, 0);
      const netPay = totalIncome - totalDeduction;

      setScannedPaystubData({
        ...mockResult,
        totalIncome,
        totalDeduction,
        netPay,
        fileName
      });

      setIsScanningPaystub(false);
      setShowPaystubModal(true);
      playRetroSound('questClear', soundEnabled);
      grantRewards(30, 20);
      triggerToast(`📄 [${fileName}] 급여명세서 인식이 완료되었습니다!`);
    }, 1200);
  };

  // 급여명세서 분석값을 가계부에 일괄 적용
  const applyPaystubToFinance = () => {
    if (!scannedPaystubData) return;
    setCurrentHobong(scannedPaystubData.hobong);
    setIsClassTeacher(true);
    setIsHeadTeacher(true);
    setShowPaystubModal(false);
    triggerToast('✨ 급여명세서 내역이 가계부에 성공적으로 반영되었습니다.');
    playRetroSound('levelUp', soundEnabled);
  };

  // 계산 로직: 교원 월별 소득 계산
  const baseSalary = TEACHER_BASE_SALARIES[currentHobong] || 3440000;
  const leaveRate = leaveStatus === 'normal' ? 1.0 : leaveStatus === 'parental_1' ? 0.8 : leaveStatus === 'parental_2' ? 0.5 : 0.7;
  const adjustedBase = Math.round(baseSalary * leaveRate);
  const classAllowance = isClassTeacher ? 200000 : 0;
  const headAllowance = isHeadTeacher ? 150000 : 0;
  const fixedResearchAllowance = 250000;
  const monthlySalaryTotal = adjustedBase + classAllowance + headAllowance + fixedResearchAllowance;

  // 2026년 엑셀 연간 순저축 합계
  const total2026NetSavings = excelData2026.reduce((acc, row) => acc + row.net, 0);
  const total2026CardSpend = Math.abs(excelData2026.reduce((acc, row) => acc + row.card, 0));

  // 2027년 시뮬레이션 계산
  const nextYearHobong = Math.min(24, currentHobong + 1);
  const nextBase = TEACHER_BASE_SALARIES[nextYearHobong] || 3600000;
  const simAnnualBase = nextBase * 12;
  const simBonus = (nextBase * 0.5 * 2) + (nextBase * 0.6 * 2);
  const simAllowances = (classAllowance + headAllowance + fixedResearchAllowance) * 12;
  const simAnnualGrossSalary = (simAnnualBase + simBonus + simAllowances) / 10000;
  const simRentalNetAnnual = (130 - 122.8 - 95) * 12;
  const simFixedExpenses = (3 + 5.2 + 3.8 + 2 + 10) * 12;
  const simEstimatedCardTotal = total2026CardSpend * (1 - cardSavingPercent / 100);
  const simTotal2027Net = Math.round(simAnnualGrossSalary + simRentalNetAnnual - simFixedExpenses - simEstimatedCardTotal);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans pb-20 selection:bg-indigo-100">

      {/* =========================================================================
          GLOBAL RETRO HUD HEADER
         ========================================================================= */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-indigo-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-2.5 flex items-center justify-between gap-4">
          
          {/* 좌측: 로고 & 브랜드 */}
          <div className="flex items-center space-x-3">
            <div className="relative group cursor-pointer" onClick={() => setShowAvatarModal(true)}>
              <div className="w-12 h-12 rounded-2xl overflow-hidden border-2 border-indigo-500 shadow-md flex items-center justify-center bg-indigo-50">
                <img 
                  src={player.avatarImage} 
                  alt={player.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute -bottom-1 -right-1 bg-amber-400 text-slate-900 text-[10px] font-black px-1.5 py-0.2 rounded-full border border-white">
                Lv.{player.level}
              </div>
            </div>

            <div>
              <div className="flex items-center space-x-2">
                <h1 className="text-base sm:text-lg font-black tracking-tight text-slate-900 flex items-center gap-1.5">
                  <span>티처 머니 앤 라이프</span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200">
                    RPG Dashboard
                  </span>
                </h1>
              </div>
              <div className="flex items-center gap-2 text-xs text-slate-500">
                <span className="font-bold text-indigo-600">{player.name}</span>
                <span>•</span>
                <span className="truncate max-w-[140px] sm:max-w-[200px] text-slate-600 font-medium">
                  {player.equippedTitle}
                </span>
              </div>
            </div>
          </div>

          {/* 우측: 퀵 스탯 HUD & 컨트롤 */}
          <div className="flex items-center gap-3">
            
            {/* 골드 & 경험치 HUD (PC) */}
            <div className="hidden md:flex items-center gap-3 bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-2xl">
              <div className="flex items-center gap-1 text-xs font-bold text-amber-600">
                <Coins className="w-4 h-4 text-amber-500" />
                <span>{player.gold.toLocaleString()} G</span>
              </div>
              <div className="w-px h-4 bg-slate-200" />
              <div className="flex items-center gap-1.5 text-xs">
                <span className="text-[11px] font-bold text-indigo-600">EXP</span>
                <div className="w-20 bg-slate-200 rounded-full h-2 overflow-hidden">
                  <div 
                    className="bg-indigo-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${Math.min(100, (player.exp / player.maxExp) * 100)}%` }}
                  />
                </div>
              </div>
            </div>

            {/* 유틸리티 액션 버튼들 */}
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => setShowPwaModal(true)}
                className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-bold transition border border-indigo-200 active:scale-95"
                title="앱 다운로드 및 설치 안내"
              >
                <Smartphone className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">앱 다운로드</span>
              </button>

              <button
                onClick={exportDataJson}
                className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-700 text-xs font-bold transition border border-emerald-200 active:scale-95"
                title="전체 데이터 백업 다운로드"
              >
                <Download className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">백업 저장</span>
              </button>

              <button
                onClick={() => setSoundEnabled(!soundEnabled)}
                className="p-2 rounded-xl text-slate-500 hover:bg-slate-100 transition active:scale-95"
                title={soundEnabled ? '효과음 끄기' : '효과음 켜기'}
              >
                {soundEnabled ? <Volume2 className="w-4 h-4 text-indigo-600" /> : <VolumeX className="w-4 h-4 text-slate-400" />}
              </button>
            </div>

          </div>
        </div>

        {/* 내비게이션 탭 바 (메인: 퀘스트 보드가 첫 번째, 신규: 인생 매트릭스, 학사일정&방학) */}
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 flex gap-2 border-t border-slate-100 pt-1 pb-1 overflow-x-auto scrollbar-none">
          {[
            { id: 'quests', label: '⚔️ 퀘스트 보드 (메인)', icon: CheckSquare, highlight: true },
            { id: 'matrix', label: '🗺️ 인생 마스터 매트릭스', icon: Table, highlight: false },
            { id: 'school', label: '📅 학사일정 & 방학 플래너', icon: Calendar, highlight: false },
            { id: 'finance', label: '📊 교사 가계부 & 연간계획', icon: Calculator },
            { id: 'brain', label: '🧠 시냅스 뇌구조 맵', icon: Brain },
            { id: 'diary', label: '📖 기록의 서재 (일기)', icon: BookOpen },
            { id: 'character', label: '👑 캐릭터 & 성장', icon: Shield },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => {
                  playRetroSound('bubble', soundEnabled);
                  setActiveTab(tab.id);
                }}
                className={`flex items-center space-x-1.5 px-3 py-2 rounded-xl font-bold text-xs sm:text-sm transition-all whitespace-nowrap cursor-pointer active:scale-95 ${
                  isActive
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-200'
                    : 'text-slate-600 hover:text-indigo-600 hover:bg-indigo-50/70'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-500'}`} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </nav>
      </header>

      {/* Global Toast Message */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-4 py-2.5 rounded-2xl shadow-xl flex items-center space-x-2 text-xs animate-bounce border border-slate-700">
          <Sparkles className="w-4 h-4 text-amber-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* =========================================================================
          MAIN CONTAINER ROUTING
         ========================================================================= */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 pt-5">
        
        {/* =========================================================================
            TAB 1 (메인): ⚔️ 퀘스트 보드 (목표 & 해야 할 일 분리 보드)
           ========================================================================= */}
        {activeTab === 'quests' && (
          <div className="space-y-6 animate-fadeIn">
            
            {/* 상단: 기간별 목표 필터 탭 & 카테고리 관리 바 */}
            <div className="bg-white rounded-3xl p-4 sm:p-5 border border-indigo-100 shadow-sm flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
                <span className="text-xs font-bold text-slate-500 mr-1 flex items-center gap-1">
                  <Filter className="w-3.5 h-3.5 text-indigo-500" /> 목표 기간:
                </span>
                {[
                  { id: 'all', label: '전체 보기' },
                  { id: 'month', label: '한달 목표' },
                  { id: 'quarter', label: '분기 목표 (3개월)' },
                  { id: 'half', label: '반기 목표 (6개월)' },
                  { id: 'year', label: '1년 목표' },
                ].map(p => (
                  <button
                    key={p.id}
                    onClick={() => {
                      playRetroSound('bubble', soundEnabled);
                      setSelectedPeriod(p.id);
                    }}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition whitespace-nowrap active:scale-95 ${
                      selectedPeriod === p.id
                        ? 'bg-indigo-600 text-white shadow-sm'
                        : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                    }`}
                  >
                    {p.label}
                  </button>
                ))}
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setShowCategoryModal(true)}
                  className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition active:scale-95"
                >
                  <Settings className="w-3.5 h-3.5" />
                  <span>카테고리 관리</span>
                </button>

                <button
                  onClick={() => setShowAddGoalModal(true)}
                  className="flex items-center gap-1 px-3.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition shadow-sm active:scale-95"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>+ 새 목표 추가</span>
                </button>
              </div>
            </div>

            {/* 1. 에픽 퀘스트 (목표 & 금전 계획) 그리드 */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <h2 className="text-base sm:text-lg font-black text-slate-900 flex items-center gap-2">
                    <Target className="w-5 h-5 text-indigo-600" />
                    <span>에픽 퀘스트 (장기 목표 & 금전 플랜)</span>
                  </h2>
                  <span className="text-xs font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-full border border-indigo-200">
                    {goals.filter(g => selectedPeriod === 'all' || g.period === selectedPeriod).length}개 활성
                  </span>
                </div>
                <span className="text-xs text-slate-400 hidden sm:inline">
                  저축액을 납입하거나 마일스톤을 체크하면 진척도가 상승합니다.
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {goals
                  .filter(g => selectedPeriod === 'all' || g.period === selectedPeriod)
                  .map(goal => {
                    const catObj = categories.find(c => c.id === goal.category) || { name: '일반', color: 'slate' };
                    return (
                      <div 
                        key={goal.id} 
                        className="bg-white rounded-3xl p-5 border border-indigo-100 shadow-sm hover:shadow-md transition flex flex-col justify-between space-y-4"
                      >
                        <div>
                          {/* 카드 상단: 카테고리, 기간 태그, 수정/삭제 */}
                          <div className="flex items-center justify-between gap-2">
                            <div className="flex items-center gap-1.5">
                              <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-indigo-50 text-indigo-700 border border-indigo-200">
                                {catObj.name}
                              </span>
                              <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-slate-100 text-slate-600">
                                {goal.period === 'month' ? '한달' : goal.period === 'quarter' ? '분기' : goal.period === 'half' ? '반기' : '1년'}
                              </span>
                            </div>

                            <div className="flex items-center gap-1">
                              <button
                                onClick={() => {
                                  setEditingGoal(goal);
                                  setShowEditGoalModal(true);
                                }}
                                className="text-slate-400 hover:text-indigo-600 p-1 transition"
                                title="목표 수정"
                              >
                                <Edit3 className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() => {
                                  setGoals(prev => prev.filter(it => it.id !== goal.id));
                                  triggerToast('목표가 삭제되었습니다.');
                                }}
                                className="text-slate-400 hover:text-rose-500 p-1 transition"
                                title="목표 삭제"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>

                          {/* 제목 & 마감일 */}
                          <h3 className="text-sm font-black text-slate-900 mt-2 leading-snug">
                            {goal.title}
                          </h3>
                          <div className="text-[11px] text-slate-400 mt-0.5 font-mono">
                            목표 완료일: {goal.deadline}
                          </div>

                          {/* 금전 목표 전용: 목표 금액 vs 저축액 박스 */}
                          {goal.isMoneyGoal && (
                            <div className="mt-3 p-3 bg-emerald-50/70 border border-emerald-200 rounded-2xl space-y-1.5">
                              <div className="flex justify-between items-center text-xs">
                                <span className="font-bold text-emerald-800">현재 저축액</span>
                                <span className="font-extrabold text-emerald-700 font-mono">
                                  {goal.currentAmount?.toLocaleString()} {goal.unit}
                                </span>
                              </div>
                              <div className="flex justify-between items-center text-[11px] text-slate-500">
                                <span>목표 금액</span>
                                <span className="font-mono">{goal.targetAmount?.toLocaleString()} {goal.unit}</span>
                              </div>
                              
                              <button
                                onClick={() => {
                                  setActiveDepositGoal(goal);
                                  setDepositAmount('');
                                  setShowDepositModal(true);
                                }}
                                className="w-full mt-1 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition flex items-center justify-center gap-1 shadow-sm active:scale-95"
                              >
                                <PiggyBank className="w-3.5 h-3.5" />
                                <span>+ 저축액 납입하기</span>
                              </button>
                            </div>
                          )}

                          {/* 진척도 프로그레스 바 */}
                          <div className="mt-3 space-y-1">
                            <div className="flex justify-between text-xs font-bold">
                              <span className="text-slate-600">달성 진척도</span>
                              <span className="text-indigo-600 font-mono">{goal.progress}%</span>
                            </div>
                            <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                              <div
                                className="bg-gradient-to-r from-indigo-500 to-sky-500 h-2 rounded-full transition-all duration-500"
                                style={{ width: `${goal.progress}%` }}
                              />
                            </div>
                          </div>

                          {/* 하위 마일스톤 체크리스트 */}
                          {goal.subTasks && goal.subTasks.length > 0 && (
                            <div className="mt-3 space-y-1.5 border-t border-slate-100 pt-2.5">
                              <div className="flex items-center justify-between text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                                <span>실행 마일스톤</span>
                                <button
                                  type="button"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setEditingGoal(goal);
                                    setShowEditGoalModal(true);
                                  }}
                                  className="text-indigo-600 hover:text-indigo-800 text-[10px] font-bold flex items-center gap-0.5 normal-case"
                                >
                                  <Edit3 className="w-2.5 h-2.5" />
                                  <span>마일스톤 편집</span>
                                </button>
                              </div>
                              {goal.subTasks.map(st => (
                                <div
                                  key={st.id}
                                  onClick={() => {
                                    setGoals(prev => prev.map(g => {
                                      if (g.id !== goal.id) return g;
                                      const updatedSubs = g.subTasks.map(s => s.id === st.id ? { ...s, done: !s.done } : s);
                                      const doneCount = updatedSubs.filter(s => s.done).length;
                                      const newP = Math.round((doneCount / updatedSubs.length) * 100);
                                      return { ...g, subTasks: updatedSubs, progress: newP };
                                    }));
                                    playRetroSound('questClear', soundEnabled);
                                    grantRewards(15, 10);
                                  }}
                                  className="flex items-center gap-2 text-xs text-slate-700 cursor-pointer hover:bg-slate-50 p-1 rounded-lg transition"
                                >
                                  <div className={`w-3.5 h-3.5 rounded flex items-center justify-center border transition ${
                                    st.done ? 'bg-indigo-600 border-indigo-600 text-white' : 'border-slate-300'
                                  }`}>
                                    {st.done && <Check className="w-2.5 h-2.5 stroke-[3]" />}
                                  </div>
                                  <span className={`truncate ${st.done ? 'line-through text-slate-400' : 'text-slate-800'}`}>
                                    {st.text}
                                  </span>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>

                        {/* 카드 하단 슬라이더 조절 */}
                        <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400">
                          <span>진척도 미세조절:</span>
                          <input
                            type="range"
                            min="0"
                            max="100"
                            value={goal.progress}
                            onChange={(e) => {
                              const v = Number(e.target.value);
                              setGoals(prev => prev.map(it => it.id === goal.id ? { ...it, progress: v } : it));
                            }}
                            className="w-24 accent-indigo-600 cursor-pointer"
                          />
                        </div>
                      </div>
                    );
                  })}
              </div>
            </div>

            {/* 2. 데일리 퀘스트 (오늘 해야 할 일 TO-DO LIST) */}
            <div className="bg-white rounded-3xl p-5 sm:p-6 border border-indigo-100 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <h2 className="text-base sm:text-lg font-black text-slate-900 flex items-center gap-2">
                    <CheckSquare className="w-5 h-5 text-emerald-600" />
                    <span>데일리 퀘스트 (오늘 해야 할 일)</span>
                  </h2>
                  <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                    {todos.filter(t => t.completed).length}/{todos.length} 완료
                  </span>
                </div>
                <span className="text-xs text-slate-400 hidden sm:inline">
                  완료 시 EXP와 골드를 획득하여 캐릭터가 성장합니다!
                </span>
              </div>

              {/* 할 일 입력 인풋 */}
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="오늘 완수할 새로운 일일 퀘스트를 입력하세요 (예: 퇴근 후 스트레칭 20분)..."
                  value={newTodoText}
                  onChange={(e) => setNewTodoText(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && newTodoText.trim()) {
                      const newT = {
                        id: `t-${Date.now()}`,
                        text: newTodoText.trim(),
                        exp: 20,
                        gold: 15,
                        completed: false
                      };
                      setTodos([newT, ...todos]);
                      setNewTodoText('');
                      playRetroSound('bubble', soundEnabled);
                      triggerToast('새 데일리 퀘스트가 등록되었습니다.');
                    }
                  }}
                  className="flex-1 bg-slate-50 border border-slate-200 rounded-2xl px-4 py-2.5 text-xs sm:text-sm text-slate-800 focus:outline-none focus:border-indigo-400 shadow-inner"
                />
                <button
                  onClick={() => {
                    if (newTodoText.trim()) {
                      const newT = {
                        id: `t-${Date.now()}`,
                        text: newTodoText.trim(),
                        exp: 20,
                        gold: 15,
                        completed: false
                      };
                      setTodos([newT, ...todos]);
                      setNewTodoText('');
                      playRetroSound('bubble', soundEnabled);
                      triggerToast('새 데일리 퀘스트가 등록되었습니다.');
                    }
                  }}
                  className="px-5 py-2.5 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs sm:text-sm font-bold shadow-md transition active:scale-95"
                >
                  등록
                </button>
              </div>

              {/* 할 일 목록 */}
              <div className="space-y-2">
                {todos.map(todo => (
                  <div
                    key={todo.id}
                    onClick={() => {
                      const willBeCompleted = !todo.completed;
                      setTodos(prev => prev.map(it => it.id === todo.id ? { ...it, completed: willBeCompleted } : it));
                      if (willBeCompleted) {
                        playRetroSound('questClear', soundEnabled);
                        grantRewards(todo.exp, todo.gold);
                        triggerToast(`퀘스트 완료! +${todo.exp} EXP, +${todo.gold} Gold`);
                      }
                    }}
                    className={`flex items-center justify-between p-3.5 rounded-2xl border transition-all cursor-pointer active:scale-[0.99] ${
                      todo.completed 
                        ? 'bg-slate-50/80 border-slate-200 text-slate-400' 
                        : 'bg-white hover:bg-indigo-50/40 border-slate-200 hover:border-indigo-300 shadow-sm'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-5 h-5 rounded-lg flex items-center justify-center border transition ${
                        todo.completed ? 'bg-emerald-500 border-emerald-500 text-white' : 'border-slate-300 bg-white'
                      }`}>
                        {todo.completed && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                      </div>
                      <span className={`text-xs sm:text-sm font-bold ${todo.completed ? 'line-through text-slate-400' : 'text-slate-800'}`}>
                        {todo.text}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-amber-50 text-amber-700 border border-amber-200">
                        +{todo.exp} EXP / +{todo.gold} G
                      </span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setTodos(prev => prev.filter(it => it.id !== todo.id));
                        }}
                        className="text-slate-300 hover:text-rose-500 p-1 transition"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        )}

        {/* =========================================================================
            TAB: 📅 학사일정 & 방학 플래너 (신규 추가)
           ========================================================================= */}
        {activeTab === 'school' && (
          <div className="space-y-4 animate-fadeIn">
            
            {/* 상단 서브 내비게이션 & 학교 연간계획서 업로드 바 */}
            <div className="bg-white rounded-3xl p-4 sm:p-5 border border-indigo-100 shadow-sm flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
                {[
                  { id: 'calendar', label: '📅 연간 학사일정 캘린더', icon: Calendar },
                  { id: 'summer', label: '🏖️ 여름방학 디테일 플래너', icon: Palmtree },
                  { id: 'winter', label: '❄️ 겨울방학 디테일 플래너', icon: Snowflake },
                ].map(sub => {
                  const Icon = sub.icon;
                  const isActive = schoolPlannerSubTab === sub.id;
                  return (
                    <button
                      key={sub.id}
                      onClick={() => {
                        playRetroSound('bubble', soundEnabled);
                        setSchoolPlannerSubTab(sub.id);
                      }}
                      className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold transition whitespace-nowrap active:scale-95 ${
                        isActive
                          ? 'bg-indigo-600 text-white shadow-sm'
                          : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      <span>{sub.label}</span>
                    </button>
                  );
                })}
              </div>

              {/* 연간계획 파일 업로드 및 일정 추가 버튼 */}
              <div className="flex items-center gap-2">
                <input
                  type="file"
                  ref={schoolPlanFileRef}
                  accept=".pdf,image/*"
                  className="hidden"
                  onChange={(e) => {
                    const f = e.target.files?.[0];
                    if (f) processSchoolPlanUpload(f.name);
                  }}
                />

                <button
                  onClick={() => schoolPlanFileRef.current?.click()}
                  disabled={isScanningSchoolPlan}
                  className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 text-white text-xs font-bold transition shadow-sm disabled:opacity-50 active:scale-95"
                  title="학교 교육계획서나 학사일정표 PDF/사진 업로드"
                >
                  {isScanningSchoolPlan ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Upload className="w-3.5 h-3.5" />}
                  <span>{isScanningSchoolPlan ? '학사일정 분석 중...' : '학교 계획서 PDF/사진 업로드'}</span>
                </button>

                <button
                  onClick={() => processSchoolPlanUpload('2026_초등_교육계획서_샘플.pdf')}
                  disabled={isScanningSchoolPlan}
                  className="hidden sm:flex items-center gap-1 px-3 py-2 rounded-xl bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 text-indigo-700 text-xs font-bold transition active:scale-95"
                >
                  <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                  <span>샘플 자동인식</span>
                </button>

                <button
                  onClick={() => {
                    setEditingEvent(null);
                    setEventFormTitle('');
                    setEventFormDate(calSelectedDateStr);
                    setEventFormType('school');
                    setEventFormNote('');
                    setShowEventModal(true);
                  }}
                  className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition shadow-sm active:scale-95"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>+ 일정 추가</span>
                </button>
              </div>
            </div>

            {/* 1. 연간 학사일정 인터랙티브 캘린더 뷰 */}
            {schoolPlannerSubTab === 'calendar' && (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
                
                {/* 캘린더 메인 바디 */}
                <div className="lg:col-span-8 bg-white rounded-3xl p-4 sm:p-6 border border-indigo-100 shadow-sm space-y-4">
                  {/* 월 네비게이션 헤더 */}
                  <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => {
                          playRetroSound('bubble', soundEnabled);
                          setCalCurrentDate(new Date(calCurrentDate.getFullYear(), calCurrentDate.getMonth() - 1, 1));
                        }}
                        className="p-1.5 rounded-xl hover:bg-slate-100 text-slate-600 transition"
                      >
                        <ChevronLeft className="w-5 h-5" />
                      </button>
                      <h2 className="text-base sm:text-lg font-black text-slate-900 font-mono tracking-tight">
                        {calCurrentDate.getFullYear()}년 {calCurrentDate.getMonth() + 1}월
                      </h2>
                      <button
                        onClick={() => {
                          playRetroSound('bubble', soundEnabled);
                          setCalCurrentDate(new Date(calCurrentDate.getFullYear(), calCurrentDate.getMonth() + 1, 1));
                        }}
                        className="p-1.5 rounded-xl hover:bg-slate-100 text-slate-600 transition"
                      >
                        <ChevronRight className="w-5 h-5" />
                      </button>
                    </div>

                    <div className="flex items-center gap-2 text-[10px] font-bold">
                      <span className="flex items-center gap-1 text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-md">
                        <span className="w-2 h-2 rounded-full bg-indigo-500" /> 학사일정
                      </span>
                      <span className="flex items-center gap-1 text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md">
                        <span className="w-2 h-2 rounded-full bg-emerald-500" /> 방학
                      </span>
                      <span className="flex items-center gap-1 text-rose-700 bg-rose-50 px-2 py-0.5 rounded-md">
                        <span className="w-2 h-2 rounded-full bg-rose-500" /> 재량휴업/휴일
                      </span>
                    </div>
                  </div>

                  {/* 달력 그리드 렌더링 */}
                  {(() => {
                    const year = calCurrentDate.getFullYear();
                    const month = calCurrentDate.getMonth();
                    const firstDayIndex = new Date(year, month, 1).getDay(); // 0(일) ~ 6(토)
                    const lastDate = new Date(year, month + 1, 0).getDate();

                    const daysArray = [];
                    for (let i = 0; i < firstDayIndex; i++) {
                      daysArray.push(null);
                    }
                    for (let d = 1; d <= lastDate; d++) {
                      daysArray.push(d);
                    }

                    return (
                      <div>
                        <div className="grid grid-cols-7 text-center text-xs font-bold text-slate-400 mb-2">
                          <span className="text-rose-500">일</span>
                          <span>월</span>
                          <span>화</span>
                          <span>수</span>
                          <span>목</span>
                          <span>금</span>
                          <span className="text-sky-500">토</span>
                        </div>

                        <div className="grid grid-cols-7 gap-1 sm:gap-2">
                          {daysArray.map((dayNum, idx) => {
                            if (!dayNum) {
                              return <div key={`empty-${idx}`} className="h-16 sm:h-20 bg-slate-50/50 rounded-xl" />;
                            }

                            const monthStr = String(month + 1).padStart(2, '0');
                            const dayStr = String(dayNum).padStart(2, '0');
                            const dateKey = `${year}-${monthStr}-${dayStr}`;

                            const dayEvents = schoolEvents.filter(e => e.date === dateKey);
                            const isSelected = calSelectedDateStr === dateKey;
                            const isSunday = idx % 7 === 0;
                            const isSaturday = idx % 7 === 6;

                            return (
                              <div
                                key={dateKey}
                                onClick={() => {
                                  setCalSelectedDateStr(dateKey);
                                  playRetroSound('bubble', soundEnabled);
                                }}
                                className={`h-16 sm:h-20 p-1 sm:p-1.5 rounded-xl border cursor-pointer transition flex flex-col justify-between ${
                                  isSelected 
                                    ? 'border-indigo-600 bg-indigo-50/50 ring-2 ring-indigo-400' 
                                    : 'border-slate-200 hover:border-indigo-300 hover:bg-slate-50 bg-white'
                                }`}
                              >
                                <span className={`text-xs font-bold ${
                                  isSunday ? 'text-rose-600' : isSaturday ? 'text-sky-600' : 'text-slate-800'
                                }`}>
                                  {dayNum}
                                </span>

                                <div className="space-y-0.5 overflow-hidden">
                                  {dayEvents.slice(0, 2).map(ev => {
                                    const badgeColor = ev.type === 'vacation' 
                                      ? 'bg-emerald-100 text-emerald-800' 
                                      : ev.type === 'holiday' 
                                      ? 'bg-rose-100 text-rose-800' 
                                      : 'bg-indigo-100 text-indigo-800';
                                    return (
                                      <div 
                                        key={ev.id} 
                                        className={`text-[9px] sm:text-[10px] font-semibold px-1 py-0.2 rounded truncate ${badgeColor}`}
                                        title={ev.title}
                                      >
                                        {ev.title}
                                      </div>
                                    );
                                  })}
                                  {dayEvents.length > 2 && (
                                    <div className="text-[9px] text-slate-400 font-bold">+{dayEvents.length - 2}개</div>
                                  )}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    );
                  })()}
                </div>

                {/* 캘린더 사이드바: 선택된 날짜의 일정 상세 및 빠른 추가 */}
                <div className="lg:col-span-4 bg-white rounded-3xl p-4 sm:p-5 border border-indigo-100 shadow-sm space-y-4">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                    <div>
                      <div className="text-[10px] font-bold text-indigo-600 uppercase">선택한 날짜</div>
                      <h3 className="text-base font-black text-slate-900 font-mono">
                        {calSelectedDateStr}
                      </h3>
                    </div>

                    <button
                      onClick={() => {
                        setEditingEvent(null);
                        setEventFormTitle('');
                        setEventFormDate(calSelectedDateStr);
                        setEventFormType('school');
                        setEventFormNote('');
                        setShowEventModal(true);
                      }}
                      className="px-2.5 py-1 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition flex items-center gap-1 active:scale-95"
                    >
                      <Plus className="w-3 h-3" />
                      <span>일정 등록</span>
                    </button>
                  </div>

                  {/* 해당 날짜 일정 목록 */}
                  <div className="space-y-2 max-h-72 overflow-y-auto pr-0.5">
                    {schoolEvents.filter(e => e.date === calSelectedDateStr).length === 0 ? (
                      <div className="py-8 text-center text-xs text-slate-400 border border-dashed border-slate-200 rounded-2xl">
                        등록된 학사일정이 없습니다.
                        <br />
                        <span className="text-[11px] text-indigo-600 font-semibold cursor-pointer" onClick={() => {
                          setEditingEvent(null);
                          setEventFormDate(calSelectedDateStr);
                          setShowEventModal(true);
                        }}>
                          + 이 날짜에 일정 추가하기
                        </span>
                      </div>
                    ) : (
                      schoolEvents
                        .filter(e => e.date === calSelectedDateStr)
                        .map(ev => (
                          <div 
                            key={ev.id} 
                            className="p-3 rounded-2xl bg-slate-50 border border-slate-200 space-y-1.5"
                          >
                            <div className="flex justify-between items-start">
                              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                                ev.type === 'vacation' 
                                  ? 'bg-emerald-100 text-emerald-800' 
                                  : ev.type === 'holiday' 
                                  ? 'bg-rose-100 text-rose-800' 
                                  : 'bg-indigo-100 text-indigo-800'
                              }`}>
                                {ev.type === 'vacation' ? '방학' : ev.type === 'holiday' ? '휴일/재량' : '학사일정'}
                              </span>

                              <div className="flex items-center gap-1">
                                <button
                                  onClick={() => {
                                    setEditingEvent(ev);
                                    setEventFormTitle(ev.title);
                                    setEventFormDate(ev.date);
                                    setEventFormType(ev.type);
                                    setEventFormNote(ev.note || '');
                                    setShowEventModal(true);
                                  }}
                                  className="text-slate-400 hover:text-indigo-600 p-1"
                                  title="일정 수정"
                                >
                                  <Edit3 className="w-3 h-3" />
                                </button>
                                <button
                                  onClick={() => handleDeleteEvent(ev.id)}
                                  className="text-slate-400 hover:text-rose-500 p-1"
                                  title="일정 삭제"
                                >
                                  <Trash2 className="w-3 h-3" />
                                </button>
                              </div>
                            </div>

                            <div className="font-bold text-xs sm:text-sm text-slate-800">{ev.title}</div>
                            {ev.note && (
                              <p className="text-[11px] text-slate-500 leading-snug">{ev.note}</p>
                            )}
                          </div>
                        ))
                    )}
                  </div>

                  {/* 전체 주요 학사일정 리스트 */}
                  <div className="pt-2 border-t border-slate-100 space-y-1.5">
                    <div className="text-xs font-bold text-slate-700 flex items-center justify-between">
                      <span>연간 주요 학사 타임라인</span>
                      <span className="text-[10px] font-mono text-slate-400">{schoolEvents.length}개</span>
                    </div>
                    <div className="space-y-1 max-h-40 overflow-y-auto pr-0.5 text-xs">
                      {schoolEvents.map(e => (
                        <div 
                          key={e.id}
                          onClick={() => {
                            setCalSelectedDateStr(e.date);
                            const parts = e.date.split('-');
                            setCalCurrentDate(new Date(Number(parts[0]), Number(parts[1]) - 1, 1));
                          }}
                          className="flex items-center justify-between p-1.5 rounded-lg hover:bg-slate-100 cursor-pointer transition"
                        >
                          <span className="font-medium text-slate-800 truncate mr-2">{e.title}</span>
                          <span className="text-[10px] font-mono text-slate-500 whitespace-nowrap">{e.date}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                </div>

              </div>
            )}

            {/* 2. 여름방학 / 3. 겨울방학 디테일 플래너 */}
            {(schoolPlannerSubTab === 'summer' || schoolPlannerSubTab === 'winter') && (() => {
              const season = schoolPlannerSubTab;
              const plan = vacationPlans[season];
              const isSummer = season === 'summer';

              const startD = new Date(plan.startDate);
              const endD = new Date(plan.endDate);
              const totalDays = Math.max(1, Math.round((endD - startD) / (1000 * 60 * 60 * 24)) + 1);

              return (
                <div className="space-y-4">
                  {/* 방학 헤더 히어로 배너 */}
                  <div className={`p-5 sm:p-6 rounded-3xl text-white shadow-lg relative overflow-hidden ${
                    isSummer 
                      ? 'bg-gradient-to-r from-teal-600 via-sky-600 to-indigo-700' 
                      : 'bg-gradient-to-r from-indigo-900 via-sky-950 to-slate-900'
                  }`}>
                    <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                      <div>
                        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 text-white text-xs font-bold mb-2 backdrop-blur-md">
                          {isSummer ? <Palmtree className="w-3.5 h-3.5" /> : <Snowflake className="w-3.5 h-3.5" />}
                          <span>{isSummer ? '여름방학 집중 몰입 & 리프레시' : '겨울방학 자기계발 & 어학 올인'}</span>
                        </div>
                        <h2 className="text-xl sm:text-2xl font-black tracking-tight text-white">
                          {isSummer ? '2026학년도 여름방학 플래너' : '2026~2027 겨울방학 플래너'}
                        </h2>
                        <p className="text-xs text-white/90 mt-1 italic font-medium">
                          "{plan.slogan}"
                        </p>
                      </div>

                      {/* 방학 기간 설정 및 일수 */}
                      <div className="bg-white/10 p-3 sm:p-4 rounded-2xl border border-white/20 backdrop-blur-md text-center flex items-center gap-4">
                        <div>
                          <div className="text-[10px] text-white/80 font-bold">방학 기간</div>
                          <div className="text-xs font-mono font-bold text-white mt-0.5">
                            {plan.startDate} ~ {plan.endDate}
                          </div>
                        </div>
                        <div className="border-l border-white/20 pl-4">
                          <div className="text-[10px] text-white/80 font-bold">총 방학 일수</div>
                          <div className="text-xl font-black text-amber-300 font-mono">
                            {totalDays}일간의 여정
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* 2컬럼: 일일 루틴 관리 vs 방학 핵심 마일스톤 */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    
                    {/* 좌측: 방학 하루 루틴 체크리스트 */}
                    <div className="bg-white rounded-3xl p-5 border border-indigo-100 shadow-sm space-y-3">
                      <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                        <div className="flex items-center gap-2">
                          <div className="w-7 h-7 rounded-lg bg-sky-100 text-sky-700 flex items-center justify-center text-sm font-bold">
                            ⏰
                          </div>
                          <div>
                            <h3 className="text-sm font-black text-slate-900">방학 하루 시간표 & 루틴</h3>
                            <p className="text-[10px] text-slate-500">방학 중에도 흐트러지지 않는 나만의 황금 루틴</p>
                          </div>
                        </div>
                        <span className="text-[10px] font-mono font-bold text-sky-700 bg-sky-50 px-2 py-0.5 rounded-lg border border-sky-200">
                          {plan.routines.filter(r => r.done).length}/{plan.routines.length} 완료
                        </span>
                      </div>

                      <div className="space-y-2">
                        {plan.routines.map(r => (
                          <div
                            key={r.id}
                            onClick={() => toggleVacationRoutine(season, r.id)}
                            className={`flex items-center justify-between p-3 rounded-2xl border cursor-pointer transition text-xs active:scale-[0.99] ${
                              r.done 
                                ? 'bg-sky-50/70 border-sky-300 text-sky-900' 
                                : 'bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-700'
                            }`}
                          >
                            <div className="flex items-center gap-2.5">
                              <div className={`w-4 h-4 rounded flex items-center justify-center border transition ${
                                r.done ? 'bg-sky-600 border-sky-600 text-white' : 'border-slate-300 bg-white'
                              }`}>
                                {r.done && <Check className="w-3 h-3 stroke-[3]" />}
                              </div>
                              <span className="font-mono font-bold text-indigo-700 bg-white px-2 py-0.5 rounded border border-slate-200 text-[10px]">
                                {r.time}
                              </span>
                              <span className={`font-semibold ${r.done ? 'line-through text-slate-400' : ''}`}>
                                {r.text}
                              </span>
                            </div>

                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setVacationPlans(prev => ({
                                  ...prev,
                                  [season]: {
                                    ...prev[season],
                                    routines: prev[season].routines.filter(it => it.id !== r.id)
                                  }
                                }));
                              }}
                              className="text-slate-300 hover:text-rose-500 p-1"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        ))}
                      </div>

                      {/* 루틴 추가 폼 */}
                      <div className="pt-2 flex gap-2">
                        <input
                          type="time"
                          value={newVacationRoutineTime}
                          onChange={(e) => setNewVacationRoutineTime(e.target.value)}
                          className="bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-1.5 text-xs text-slate-800 font-bold focus:outline-none"
                        />
                        <input
                          type="text"
                          placeholder="새 방학 루틴 입력 (예: 영단어 30개 외우기)..."
                          value={newVacationRoutineText}
                          onChange={(e) => setNewVacationRoutineText(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') handleAddVacationRoutine(season);
                          }}
                          className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-xs text-slate-800 focus:outline-none"
                        />
                        <button
                          onClick={() => handleAddVacationRoutine(season)}
                          className="px-3.5 py-1.5 bg-sky-600 hover:bg-sky-700 text-white text-xs font-bold rounded-xl transition active:scale-95 whitespace-nowrap"
                        >
                          추가
                        </button>
                      </div>
                    </div>

                    {/* 우측: 방학 핵심 마일스톤 & 여행/연구 계획 */}
                    <div className="bg-white rounded-3xl p-5 border border-indigo-100 shadow-sm space-y-3">
                      <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                        <div className="flex items-center gap-2">
                          <div className="w-7 h-7 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center text-sm font-bold">
                            🎯
                          </div>
                          <div>
                            <h3 className="text-sm font-black text-slate-900">방학 핵심 마일스톤</h3>
                            <p className="text-[10px] text-slate-500">여행, 시험, 라이선스 취득 등 방학 목표 일정</p>
                          </div>
                        </div>
                        <span className="text-[10px] font-mono font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-lg border border-emerald-200">
                          {plan.milestones.length}개 프로젝트
                        </span>
                      </div>

                      <div className="space-y-2">
                        {plan.milestones.map(m => (
                          <div
                            key={m.id}
                            className="p-3 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between text-xs"
                          >
                            <div className="flex items-center gap-2.5">
                              <span className="font-mono text-[10px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-md">
                                {m.date}
                              </span>
                              <span className="font-bold text-slate-800">{m.title}</span>
                            </div>

                            <button
                              onClick={() => {
                                setVacationPlans(prev => ({
                                  ...prev,
                                  [season]: {
                                    ...prev[season],
                                    milestones: prev[season].milestones.filter(it => it.id !== m.id)
                                  }
                                }));
                              }}
                              className="text-slate-300 hover:text-rose-500 p-1"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        ))}
                      </div>

                      {/* 마일스톤 추가 폼 */}
                      <div className="pt-2 flex gap-2">
                        <input
                          type="date"
                          value={newVacationMilestoneDate}
                          onChange={(e) => setNewVacationMilestoneDate(e.target.value)}
                          className="bg-slate-50 border border-slate-200 rounded-xl px-2 py-1.5 text-xs text-slate-800 font-bold focus:outline-none"
                        />
                        <input
                          type="text"
                          placeholder="프로젝트/여행 일정 (예: 삿포로 눈꽃 여행)..."
                          value={newVacationMilestoneTitle}
                          onChange={(e) => setNewVacationMilestoneTitle(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') handleAddVacationMilestone(season);
                          }}
                          className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-xs text-slate-800 focus:outline-none"
                        />
                        <button
                          onClick={() => handleAddVacationMilestone(season)}
                          className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl transition active:scale-95 whitespace-nowrap"
                        >
                          추가
                        </button>
                      </div>
                    </div>

                  </div>
                </div>
              );
            })()}

          </div>
        )}

        {/* =========================================================================
            TAB 2: 🗺️ 인생 마스터 매트릭스 (한눈에 보기)
           ========================================================================= */}
        {activeTab === 'matrix' && (
          <div className="space-y-3 animate-fadeIn">
            
            {/* 상단: 슬로건 바 & 0% 초기화 버튼 */}
            <div className="bg-white rounded-3xl p-3 sm:p-4 border border-indigo-100 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2.5">
              <div className="flex-1 w-full">
                {isEditingSlogan ? (
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={tempSlogan}
                      onChange={(e) => setTempSlogan(e.target.value)}
                      className="flex-1 bg-slate-50 border border-indigo-300 rounded-xl px-3 py-1.5 text-xs sm:text-sm font-bold text-slate-800 focus:outline-none"
                    />
                    <button
                      onClick={handleSaveSlogan}
                      className="px-3 py-1.5 bg-indigo-600 text-white rounded-xl text-xs font-bold"
                    >
                      저장
                    </button>
                    <button
                      onClick={() => setIsEditingSlogan(false)}
                      className="px-2 py-1.5 text-xs text-slate-500"
                    >
                      취소
                    </button>
                  </div>
                ) : (
                  <div 
                    onClick={() => {
                      setTempSlogan(lifeMatrix.slogan);
                      setIsEditingSlogan(true);
                    }}
                    className="flex items-center gap-2 cursor-pointer group"
                  >
                    <Sparkles className="w-4 h-4 text-amber-500" />
                    <span className="font-extrabold text-xs sm:text-sm text-slate-800 group-hover:text-indigo-600 transition">
                      "{lifeMatrix.slogan}"
                    </span>
                    <Edit3 className="w-3 h-3 text-slate-400 group-hover:text-indigo-500" />
                  </div>
                )}
              </div>

              <div className="flex items-center gap-2 self-end sm:self-center">
                <button
                  onClick={handleResetMasterGoalsToZero}
                  className="px-2.5 py-1 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 text-[11px] font-bold transition active:scale-95"
                >
                  0%로 초기화
                </button>
                <button
                  onClick={() => setShowAddMasterGoalModal(true)}
                  className="px-3 py-1 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition shadow-sm active:scale-95 flex items-center gap-1"
                >
                  <Plus className="w-3 h-3" />
                  <span>+ 목표 추가</span>
                </button>
              </div>
            </div>

            {/* 그리드: 마스터 목표 목록 vs 10~12월 습관 & 분기 목표 */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-3">
              
              {/* 좌측 (7): 삶의 마스터 목표 */}
              <div className="lg:col-span-7 bg-white rounded-3xl p-3.5 sm:p-4 border border-indigo-100 shadow-sm space-y-2.5">
                <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-black text-slate-900">
                      삶의 마스터 목표 ({lifeMatrix.masterGoals.length}개)
                    </h3>
                    <span className="text-[10px] text-slate-400">클릭 시 기간별 마일스톤 관리</span>
                  </div>

                  {/* 카테고리 필터 칩 */}
                  <div className="flex items-center gap-1 overflow-x-auto text-[10px] scrollbar-none">
                    {['all', '운동/다이어트', '루틴/습관', '어학/커리어', '여행/버킷'].map(cat => (
                      <button
                        key={cat}
                        onClick={() => setMatrixFilterCat(cat)}
                        className={`px-2 py-0.5 rounded-lg font-bold transition ${
                          matrixFilterCat === cat ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                        }`}
                      >
                        {cat === 'all' ? '전체' : cat}
                      </button>
                    ))}
                  </div>
                </div>

                {/* 목표 리스트 (촘촘한 뷰) */}
                <div className="space-y-1.5 max-h-[480px] overflow-y-auto pr-1">
                  {lifeMatrix.masterGoals
                    .filter(g => matrixFilterCat === 'all' || g.category === matrixFilterCat)
                    .map(goal => {
                      const isSelected = selectedMasterGoalId === goal.id;
                      return (
                        <div
                          key={goal.id}
                          onClick={() => setSelectedMasterGoalId(isSelected ? null : goal.id)}
                          className={`p-2 rounded-2xl border transition-all cursor-pointer ${
                            isSelected 
                              ? 'bg-indigo-50/70 border-indigo-400 shadow-sm' 
                              : 'bg-slate-50/60 hover:bg-white border-slate-200/80 hover:border-indigo-200'
                          }`}
                        >
                          <div className="flex items-center justify-between gap-2">
                            <div className="flex items-center gap-2 flex-1 min-w-0">
                              <span className="w-5 h-5 rounded-lg bg-indigo-100 text-indigo-800 text-[10px] font-black flex items-center justify-center flex-shrink-0">
                                {goal.no}
                              </span>
                              <span className="text-xs font-bold text-slate-800 truncate">
                                {goal.text}
                              </span>
                              <span className="text-[9px] font-semibold text-slate-500 bg-white px-1.5 py-0.2 rounded border border-slate-200 flex-shrink-0">
                                {goal.category}
                              </span>
                            </div>

                            <div className="flex items-center gap-2 flex-shrink-0">
                              <div className="flex items-center gap-1">
                                <span className="text-[10px] font-bold font-mono text-indigo-700">{goal.progress}%</span>
                                <div className="w-12 bg-slate-200 rounded-full h-1.5 overflow-hidden">
                                  <div
                                    className="bg-indigo-600 h-1.5 rounded-full transition-all"
                                    style={{ width: `${goal.progress}%` }}
                                  />
                                </div>
                              </div>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleDeleteMasterGoal(goal.id);
                                }}
                                className="text-slate-300 hover:text-rose-500 p-0.5"
                              >
                                <Trash2 className="w-3 h-3" />
                              </button>
                            </div>
                          </div>

                          {/* 목표 클릭 시 확장되는 세부 기간별 마일스톤 (한달, 분기, 반기, 1년) */}
                          {isSelected && (
                            <div className="mt-2.5 pt-2 border-t border-indigo-100 space-y-1.5 pl-7 pr-1">
                              <div className="text-[10px] font-bold text-indigo-600 flex justify-between">
                                <span>기간별 실천 마일스톤</span>
                                <span>체크 시 도달률 자동 반영</span>
                              </div>
                              {(goal.milestones || []).map((m, mIdx) => (
                                <div
                                  key={mIdx}
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleToggleMilestone(goal.id, mIdx);
                                  }}
                                  className="flex items-center gap-2 text-[11px] text-slate-700 hover:text-indigo-700 cursor-pointer py-0.5"
                                >
                                  <div className={`w-3.5 h-3.5 rounded flex items-center justify-center border transition ${
                                    m.done ? 'bg-indigo-600 border-indigo-600 text-white' : 'border-slate-300 bg-white'
                                  }`}>
                                    {m.done && <Check className="w-2.5 h-2.5 stroke-[3]" />}
                                  </div>
                                  <span className="font-mono text-[9px] font-bold text-indigo-800 bg-indigo-50 px-1 py-0.2 rounded border border-indigo-100">
                                    {m.period}
                                  </span>
                                  <span className={`truncate ${m.done ? 'line-through text-slate-400' : ''}`}>
                                    {m.title}
                                  </span>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      );
                    })}
                </div>
              </div>

             {/* 우측 (5): 10~12월 습관 & 2027 마스터 과제 (수정 가능) */}
            <div className="lg:col-span-5 space-y-3">
              {/* 10~12월 습관 챌린지 카드 */}
              <div className="bg-white rounded-3xl p-3.5 sm:p-4 border border-indigo-100 shadow-sm space-y-2.5">
                <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                  <div>
                    <h3 className="text-sm font-black text-slate-900">{habitSectionTitle}</h3>
                    <p className="text-[10px] text-slate-400">{habitSectionSubtitle}</p>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-[10px] font-mono font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-lg border border-emerald-200">
                      {habitList.filter(h => h.done).length}/{habitList.length} 실천
                    </span>
                    <button
                      onClick={() => {
                        setTempTextValue(habitList.map(h => h.text).join('\n'));
                        setEditModalType('habits');
                      }}
                      className="text-[11px] px-2 py-0.5 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-lg font-bold transition"
                    >
                      ✏️ 수정
                    </button>
                  </div>
                </div>

                {/* 습관 체크 리스트 */}
                <div className="space-y-1 max-h-[300px] overflow-y-auto pr-1">
                  {habitList.map((habit) => (
                    <div
                      key={habit.id}
                      onClick={() => toggleHabitDone(habit.id)}
                      className={`flex items-center gap-2 p-1.5 rounded-xl border text-xs cursor-pointer transition ${
                        habit.done
                          ? 'bg-emerald-50/70 border-emerald-200 text-emerald-900 line-through'
                          : 'bg-slate-50 hover:bg-slate-100 border-slate-200/80 text-slate-700'
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={habit.done}
                        readOnly
                        className="rounded border-slate-300 text-emerald-600 pointer-events-none ml-1"
                      />
                      <span className="font-medium text-xs truncate flex-1">{habit.text}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* 2027년 마스터 과제 카드 (다크 네이비) */}
              <div className="bg-[#0b132b] text-white rounded-3xl p-4 shadow-sm relative">
                <div className="flex items-center justify-between pb-2 border-b border-slate-700/60">
                  <h3 className="font-bold text-xs text-amber-300 flex items-center gap-1.5">
                    <span>🎖️</span> {master2027Title}
                  </h3>
                  <button
                    onClick={() => {
                      setTempTextValue(master2027List.join('\n'));
                      setEditModalType('2027');
                    }}
                    className="text-[11px] px-2 py-0.5 bg-white/10 hover:bg-white/20 text-white rounded-lg transition font-medium"
                  >
                    ✏️ 수정
                  </button>
                </div>
                <div className="grid grid-cols-2 gap-x-3 gap-y-1.5 pt-2 text-[11px] text-slate-200">
                  {master2027List.map((item, idx) => (
                    <div key={idx} className="truncate hover:text-white transition">
                      <span className="text-amber-400 font-bold mr-1">{idx + 1}.</span>
                      {item}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* 하단: 월별 액션 플랜 타임라인 */}
          <div className="bg-white rounded-3xl p-4 sm:p-5 border border-indigo-100 shadow-sm mt-3">
            <div className="flex items-center justify-between pb-2.5 border-b border-slate-100 mb-3">
              <div className="flex items-center gap-2">
                <span className="text-sm">🕒</span>
                <h3 className="font-black text-slate-900 text-xs sm:text-sm">월별 액션 플랜 타임라인</h3>
              </div>
              <button
                onClick={() => {
                  setTempMonthlyData(JSON.parse(JSON.stringify(monthlyTimeline)));
                  setEditModalType('monthly');
                }}
                className="text-xs px-2.5 py-1 bg-indigo-50 hover:bg-indigo-100 text-indigo-600 rounded-lg font-bold transition flex items-center gap-1"
              >
                ✏️ 액션플랜 수정
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-2.5">
              {monthlyTimeline.map((plan, idx) => (
                <div key={idx} className="bg-slate-50/80 rounded-2xl p-3 border border-slate-200/60 flex flex-col">
                  <div className="flex items-center justify-between border-b border-slate-200/50 pb-1.5 mb-1.5">
                    <span className="text-xs font-black text-indigo-600">{plan.month}</span>
                    <span className="text-[10px] text-slate-400 truncate max-w-[80px]">{plan.theme}</span>
                  </div>
                  <ul className="space-y-1 text-[11px] text-slate-600 flex-1">
                    {plan.items.map((it, i) => (
                      <li key={i} className="truncate">• {it}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>

          {/* 수정 팝업 모달 (습관 / 2027 / 월별플랜) */}
          {editModalType && (
            <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
              <div className="bg-white rounded-3xl p-5 w-full max-w-lg shadow-xl border border-slate-200 space-y-3 animate-fadeIn">
                <div className="flex items-center justify-between border-b pb-2.5">
                  <h4 className="font-bold text-slate-800 text-sm">
                    {editModalType === 'habits' && '습관 챌린지 항목 수정'}
                    {editModalType === '2027' && '2027년 마스터 과제 수정'}
                    {editModalType === 'monthly' && '월별 액션 플랜 타임라인 수정'}
                  </h4>
                  <button onClick={() => setEditModalType(null)} className="text-slate-400 hover:text-slate-600 text-sm font-bold">✕</button>
                </div>

                {(editModalType === 'habits' || editModalType === '2027') && (
                  <div>
                    <p className="text-[11px] text-slate-500 mb-2">한 줄에 하나씩 입력해 주세요 (엔터로 줄바꿈).</p>
                    <textarea
                      rows={9}
                      value={tempTextValue}
                      onChange={(e) => setTempTextValue(e.target.value)}
                      className="w-full p-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none leading-relaxed"
                      placeholder="항목을 입력하세요..."
                    />
                  </div>
                )}

                {editModalType === 'monthly' && (
                  <div className="max-h-[55vh] overflow-y-auto space-y-3 pr-1">
                    {tempMonthlyData.map((m, mIdx) => (
                      <div key={mIdx} className="p-3 bg-slate-50 rounded-xl border border-slate-200/70 space-y-2">
                        <div className="flex gap-2">
                          <input
                            type="text"
                            value={m.month}
                            onChange={(e) => {
                              const copy = [...tempMonthlyData];
                              copy[mIdx].month = e.target.value;
                              setTempMonthlyData(copy);
                            }}
                            className="w-20 px-2 py-1 text-xs font-bold bg-white border border-slate-200 rounded-lg outline-none"
                            placeholder="월 (예: 10월)"
                          />
                          <input
                            type="text"
                            value={m.theme}
                            onChange={(e) => {
                              const copy = [...tempMonthlyData];
                              copy[mIdx].theme = e.target.value;
                              setTempMonthlyData(copy);
                            }}
                            className="flex-1 px-2 py-1 text-xs bg-white border border-slate-200 rounded-lg outline-none"
                            placeholder="테마/소제목"
                          />
                        </div>
                        <textarea
                          rows={3}
                          value={m.items.join('\n')}
                          onChange={(e) => {
                            const copy = [...tempMonthlyData];
                            copy[mIdx].items = e.target.value.split('\n').filter(t => t.trim() !== '');
                            setTempMonthlyData(copy);
                          }}
                          className="w-full p-2 text-xs bg-white border border-slate-200 rounded-lg outline-none resize-none leading-relaxed"
                          placeholder="세부 항목들 (줄바꿈 구분)"
                        />
                      </div>
                    ))}
                  </div>
                )}

                <div className="flex justify-end gap-2 pt-2 border-t">
                  <button
                    onClick={() => setEditModalType(null)}
                    className="px-3 py-1.5 text-xs font-semibold text-slate-500 hover:bg-slate-100 rounded-xl"
                  >
                    취소
                  </button>
                  <button
                    onClick={() => {
                      if (editModalType === 'habits') {
                        const lines = tempTextValue.split('\n').map(t => t.trim()).filter(Boolean);
                        const newHabits = lines.map((text, idx) => ({ id: idx + 1, text, done: false }));
                        setHabitList(newHabits);
                        localStorage.setItem('teacher_habit_items', JSON.stringify(newHabits));
                        if (typeof triggerToast === 'function') triggerToast('습관 챌린지가 업데이트되었습니다! ✨');
                      } else if (editModalType === '2027') {
                        const lines = tempTextValue.split('\n').map(t => t.trim()).filter(Boolean);
                        setMaster2027List(lines);
                        localStorage.setItem('teacher_2027_items', JSON.stringify(lines));
                        if (typeof triggerToast === 'function') triggerToast('2027년 마스터 과제가 수정되었습니다! 🎯');
                      } else if (editModalType === 'monthly') {
                        setMonthlyTimeline(tempMonthlyData);
                        localStorage.setItem('teacher_monthly_timeline', JSON.stringify(tempMonthlyData));
                        if (typeof triggerToast === 'function') triggerToast('월별 액션플랜이 저장되었습니다! 📅');
                      }
                      setEditModalType(null);
                    }}
                    className="px-4 py-1.5 text-xs font-bold bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl shadow transition"
                  >
                    저장하기
                  </button>
                </div>
              </div>
            </div>
          )}

                {/* 2027 핵심 플랜 요약 */}
                <div className="bg-slate-900 rounded-3xl p-4 text-white shadow-sm space-y-2">
                  <div className="text-xs font-black text-amber-400 flex items-center gap-1.5">
                    <Award className="w-4 h-4" />
                    <span>2027년 14대 핵심 마스터 과제</span>
                  </div>
                  <div className="grid grid-cols-2 gap-1 text-[11px] text-slate-300 font-medium">
                    {lifeMatrix.year2027MasterPlan.map((item, idx) => (
                      <div key={idx} className="truncate hover:text-white transition">
                        {item}
                      </div>
                    ))}
                  </div>
                </div>
              </div>

            </div>

            {/* 하단: 월별 타임라인 트랙 & 마음의 나침반 */}
            <div className="bg-white rounded-3xl p-4 border border-indigo-100 shadow-sm space-y-3">
              <h3 className="text-sm font-black text-slate-900 flex items-center gap-2">
                <Clock className="w-4 h-4 text-indigo-600" />
                <span>월별 액션 플랜 타임라인 (10월 ~ 4월)</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-2.5">
                {lifeMatrix.timelineMonths.map((m, idx) => (
                  <div key={idx} className="bg-slate-50 border border-slate-200 rounded-2xl p-3 space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-black text-indigo-700 font-mono">{m.month}</span>
                      <span className="text-[10px] font-bold text-slate-500 truncate max-w-[100px]">{m.title}</span>
                    </div>
                    <ul className="text-[10px] text-slate-600 space-y-0.5">
                      {m.items.map((it, iIdx) => (
                        <li key={iIdx} className="truncate">• {it}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>

          </div>
        )}

        {/* =========================================================================
            TAB 3: 📊 교사 가계부 & 연간계획
           ========================================================================= */}
        {activeTab === 'finance' && (
          <div className="space-y-5 animate-fadeIn">
            
            {/* 가계부 뷰 모드 스위처 & NEIS 명세서 업로드 버튼 */}
            <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-4 rounded-3xl border border-indigo-100 shadow-sm">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setFinanceViewMode('month')}
                  className={`px-4 py-2 rounded-2xl text-xs sm:text-sm font-bold transition active:scale-95 ${
                    financeViewMode === 'month'
                      ? 'bg-indigo-600 text-white shadow-sm'
                      : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                  }`}
                >
                  월별 호봉·수당 계산기
                </button>
                <button
                  onClick={() => setFinanceViewMode('annual')}
                  className={`px-4 py-2 rounded-2xl text-xs sm:text-sm font-bold transition active:scale-95 ${
                    financeViewMode === 'annual'
                      ? 'bg-indigo-600 text-white shadow-sm'
                      : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                  }`}
                >
                  12개월 연간 결산표 & 2027 시뮬레이터
                </button>
              </div>

              {/* NEIS 급여명세서 업로드 위젯 */}
              <div className="flex items-center gap-2">
                <input
                  type="file"
                  ref={paystubFileRef}
                  accept=".pdf,image/*"
                  className="hidden"
                  onChange={(e) => {
                    const f = e.target.files?.[0];
                    if (f) processPaystubUpload(f.name);
                  }}
                />
                <button
                  onClick={() => paystubFileRef.current?.click()}
                  disabled={isScanningPaystub}
                  className="flex items-center gap-1.5 px-3.5 py-2 rounded-2xl bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 text-indigo-700 text-xs font-bold transition active:scale-95 disabled:opacity-50"
                  title="PDF나 사진 파일로 된 급여명세서를 자동 계산"
                >
                  {isScanningPaystub ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Upload className="w-3.5 h-3.5" />}
                  <span>{isScanningPaystub ? '명세서 분석 중...' : '급여명세서 파일 업로드'}</span>
                </button>
                <button
                  onClick={() => processPaystubUpload('2026_03_급여명세서_샘플.pdf')}
                  disabled={isScanningPaystub}
                  className="hidden sm:flex items-center gap-1 px-3 py-2 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-600 text-xs font-bold transition active:scale-95"
                >
                  <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                  <span>샘플 1클릭 테스트</span>
                </button>
              </div>
            </div>

            {/* 1. 월별 호봉/수당 계산기 뷰 */}
            {financeViewMode === 'month' && (
              <div className="space-y-4">
                {/* 3대 KPI 카드 */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="bg-white rounded-3xl p-4 sm:p-5 border-2 border-emerald-400/80 shadow-sm">
                    <div className="text-xs font-bold text-slate-500">총 수입 (근로소득 + 월세부수입)</div>
                    <div className="text-xl sm:text-2xl font-black text-emerald-600 font-mono mt-1">
                      {(monthlySalaryTotal + 1300000).toLocaleString()} 원
                    </div>
                    <div className="text-[10px] text-slate-400 mt-1">교원 본봉/수당 + 부수입 월세 130만</div>
                  </div>

                  <div className="bg-white rounded-3xl p-4 sm:p-5 border-2 border-rose-400/80 shadow-sm">
                    <div className="text-xs font-bold text-slate-500">고정 지출 및 공제 (추정)</div>
                    <div className="text-xl sm:text-2xl font-black text-rose-500 font-mono mt-1">
                      1,130,000 원
                    </div>
                    <div className="text-[10px] text-slate-400 mt-1">정자동월세 95만 + 공제회/보험료 등</div>
                  </div>

                  <div className="bg-white rounded-3xl p-4 sm:p-5 border-2 border-indigo-400/80 shadow-sm">
                    <div className="text-xs font-bold text-slate-500">이번 달 예상 순잔액</div>
                    <div className="text-xl sm:text-2xl font-black text-indigo-600 font-mono mt-1">
                      {(monthlySalaryTotal + 1300000 - 1130000).toLocaleString()} 원
                    </div>
                    <div className="text-[10px] text-slate-400 mt-1">저축 및 자유 운용 가능 금액</div>
                  </div>
                </div>

                {/* 교원 소득 산출 및 근무 상태 설정 카드 */}
                <div className="bg-white rounded-3xl p-5 border border-indigo-100 shadow-sm space-y-4">
                  <h3 className="text-sm font-black text-slate-900 flex items-center gap-2">
                    <GraduationCap className="w-4 h-4 text-indigo-600" />
                    <span>초등교원 근로소득 및 수당 체계 설정 (2026년 기준)</span>
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="text-xs font-bold text-slate-600 block mb-1">현재 호봉</label>
                      <select
                        value={currentHobong}
                        onChange={(e) => setCurrentHobong(Number(e.target.value))}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-800 focus:outline-none"
                      >
                        {Object.keys(TEACHER_BASE_SALARIES).map(h => (
                          <option key={h} value={h}>
                            {h}호봉 ({TEACHER_BASE_SALARIES[h].toLocaleString()}원)
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="text-xs font-bold text-slate-600 block mb-1">근무 / 휴직 상태</label>
                      <select
                        value={leaveStatus}
                        onChange={(e) => setLeaveStatus(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-800 focus:outline-none"
                      >
                        <option value="normal">정상 근무 (100%)</option>
                        <option value="parental_1">육아휴직 1년차 (80%)</option>
                        <option value="parental_2">육아휴직 2년차 (50%)</option>
                        <option value="sick">질병휴직 (70%)</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-xs font-bold text-slate-600 block mb-1">특수 / 보직 수당 체크</label>
                      <div className="flex items-center gap-3 pt-1">
                        <label className="flex items-center gap-1.5 text-xs text-slate-700 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={isClassTeacher}
                            onChange={(e) => setIsClassTeacher(e.target.checked)}
                            className="rounded text-indigo-600"
                          />
                          <span>담임수당 (20만)</span>
                        </label>
                        <label className="flex items-center gap-1.5 text-xs text-slate-700 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={isHeadTeacher}
                            onChange={(e) => setIsHeadTeacher(e.target.checked)}
                            className="rounded text-indigo-600"
                          />
                          <span>보직수당 (15만)</span>
                        </label>
                      </div>
                    </div>
                  </div>

                  {/* 세부 항목 자동 계산 카드 */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 border-t border-slate-100 text-xs">
                    <div className="p-2.5 bg-slate-50 rounded-xl">
                      <span className="text-slate-400 block text-[10px]">기본급</span>
                      <span className="font-mono font-bold text-slate-800">{adjustedBase.toLocaleString()}원</span>
                    </div>
                    <div className="p-2.5 bg-slate-50 rounded-xl">
                      <span className="text-slate-400 block text-[10px]">교직/급식/보조비</span>
                      <span className="font-mono font-bold text-slate-800">{fixedResearchAllowance.toLocaleString()}원</span>
                    </div>
                    <div className="p-2.5 bg-slate-50 rounded-xl">
                      <span className="text-slate-400 block text-[10px]">담임/보직 수당 합계</span>
                      <span className="font-mono font-bold text-slate-800">{(classAllowance + headAllowance).toLocaleString()}원</span>
                    </div>
                    <div className="p-2.5 bg-indigo-50 border border-indigo-200 rounded-xl">
                      <span className="text-indigo-600 block text-[10px] font-bold">월 총 근로소득</span>
                      <span className="font-mono font-black text-indigo-700">{monthlySalaryTotal.toLocaleString()}원</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* 2. 12개월 연간 결산표 & 2027 시뮬레이터 뷰 */}
            {financeViewMode === 'annual' && (
              <div className="space-y-4">
                {/* 2026년 엑셀 원본 테이블 */}
                <div className="bg-white rounded-3xl p-5 border border-indigo-100 shadow-sm space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-sm font-black text-slate-900 flex items-center gap-1.5">
                        <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
                        <span>2026년 12개월 실적 가계부 (제공해주신 엑셀 원본)</span>
                      </h3>
                      <p className="text-[10px] text-slate-400">숫자를 클릭하면 테이블에서 직접 수정할 수 있습니다.</p>
                    </div>

                    <div className="text-right">
                      <span className="text-[10px] font-bold text-slate-400 block">2026 연간 순저축 합계</span>
                      <span className="text-base sm:text-lg font-black text-amber-500 font-mono">
                        {total2026NetSavings.toFixed(1)} 만원
                      </span>
                    </div>
                  </div>

                  <div className="overflow-x-auto max-h-72 border border-slate-200 rounded-2xl">
                    <table className="w-full text-[11px] text-center border-collapse whitespace-nowrap">
                      <thead className="bg-slate-100 text-slate-700 font-bold sticky top-0">
                        <tr>
                          <th className="p-2 border-b">월</th>
                          <th className="p-2 border-b bg-amber-50">월급</th>
                          <th className="p-2 border-b">출장,보결</th>
                          <th className="p-2 border-b">월세</th>
                          <th className="p-2 border-b">주담대</th>
                          <th className="p-2 border-b">원금</th>
                          <th className="p-2 border-b">정자동월세</th>
                          <th className="p-2 border-b bg-rose-50">카드값</th>
                          <th className="p-2 border-b bg-amber-100 font-black">합계(순저축)</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 font-mono">
                        {excelData2026.map((row, idx) => (
                          <tr key={idx} className="hover:bg-indigo-50/50">
                            <td className="p-2 font-bold text-slate-800">{row.m}월</td>
                            <td className="p-2 bg-amber-50/50 font-bold">{row.salary}</td>
                            <td className="p-2 text-slate-600">{row.trip || '-'}</td>
                            <td className="p-2 text-emerald-600">+{row.rentInc}</td>
                            <td className="p-2 text-rose-500">{row.mort}</td>
                            <td className="p-2 text-slate-600">{row.prin}</td>
                            <td className="p-2 text-rose-500">{row.rentJung}</td>
                            <td className="p-2 bg-rose-50/50 text-rose-600 font-bold">{row.card}</td>
                            <td className="p-2 bg-amber-50 font-black text-slate-900">{row.net}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* 2027년 내년도 예산 시뮬레이터 (카드값 절감 슬라이더) */}
                <div className="bg-gradient-to-br from-indigo-900 via-slate-900 to-indigo-950 text-white rounded-3xl p-5 sm:p-6 shadow-xl space-y-4">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-b border-white/10 pb-3">
                    <div>
                      <div className="text-xs font-bold text-amber-400 uppercase tracking-wider">
                        Future Forecast & Simulation
                      </div>
                      <h3 className="text-base sm:text-lg font-black text-white">
                        2027년 '2,000만원 남기기' 목표 달성 시뮬레이터
                      </h3>
                    </div>

                    <div className="text-right">
                      <span className="text-[10px] text-slate-400 block">2027 예상 순저축액</span>
                      <span className="text-xl sm:text-2xl font-black text-amber-400 font-mono">
                        {simTotal2027Net.toLocaleString()} 만원
                      </span>
                    </div>
                  </div>

                  {/* 카드값 절감 슬라이더 */}
                  <div className="bg-white/10 p-4 rounded-2xl border border-white/10 space-y-2">
                    <div className="flex justify-between items-center text-xs">
                      <span className="font-bold text-white flex items-center gap-1.5">
                        <CreditCard className="w-4 h-4 text-amber-400" />
                        카드값 절감 목표율 설정
                      </span>
                      <span className="text-amber-300 font-mono font-bold text-sm">
                        {cardSavingPercent}% 절감
                      </span>
                    </div>

                    <input
                      type="range"
                      min="0"
                      max="40"
                      step="5"
                      value={cardSavingPercent}
                      onChange={(e) => setCardSavingPercent(Number(e.target.value))}
                      className="w-full accent-amber-400 cursor-pointer"
                    />

                    <div className="flex justify-between text-[10px] text-slate-400">
                      <span>절감 없음 (2026과 동일)</span>
                      <span>20% 절약</span>
                      <span>40% 극단적 절약</span>
                    </div>
                  </div>
                </div>

              </div>
            )}

          </div>
        )}

        {/* =========================================================================
            TAB 4: 🧠 시냅스 뇌구조 맵 (생각 노드 & 되새김 가중치)
           ========================================================================= */}
        {activeTab === 'brain' && (
          <div className="space-y-4 animate-fadeIn">
            
            {/* 상단: 새 생각 노드 추가 바 */}
            <div className="bg-white rounded-3xl p-4 sm:p-5 border border-indigo-100 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-3">
              <div>
                <h2 className="text-base sm:text-lg font-black text-slate-900 flex items-center gap-2">
                  <Brain className="w-5 h-5 text-indigo-600" />
                  <span>시냅스 뇌구조 인터랙티브 맵</span>
                </h2>
                <p className="text-xs text-slate-400">자주 되새길수록 노드가 비대화되며 나만의 우선순위가 각인됩니다.</p>
              </div>

              <div className="flex gap-2 w-full sm:w-auto">
                <input
                  type="text"
                  placeholder="새로운 생각 / 키워드 입력..."
                  value={newBrainIdea}
                  onChange={(e) => setNewBrainIdea(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && newBrainIdea.trim()) {
                      const newNode = {
                        id: `bn-${Date.now()}`,
                        text: newBrainIdea.trim(),
                        weight: 2,
                        x: Math.floor(Math.random() * 60) + 20,
                        y: Math.floor(Math.random() * 60) + 20,
                        side: Math.random() > 0.5 ? 'left' : 'right',
                        category: '아이디어'
                      };
                      setBrainNodes([...brainNodes, newNode]);
                      setNewBrainIdea('');
                      playRetroSound('bubble', soundEnabled);
                      triggerToast('새로운 생각이 뇌구조에 각인되었습니다.');
                    }
                  }}
                  className="flex-1 sm:w-64 bg-slate-50 border border-slate-200 rounded-2xl px-3 py-2 text-xs text-slate-800 focus:outline-none focus:border-indigo-400"
                />
                <button
                  onClick={() => {
                    if (newBrainIdea.trim()) {
                      const newNode = {
                        id: `bn-${Date.now()}`,
                        text: newBrainIdea.trim(),
                        weight: 2,
                        x: Math.floor(Math.random() * 60) + 20,
                        y: Math.floor(Math.random() * 60) + 20,
                        side: Math.random() > 0.5 ? 'left' : 'right',
                        category: '아이디어'
                      };
                      setBrainNodes([...brainNodes, newNode]);
                      setNewBrainIdea('');
                      playRetroSound('bubble', soundEnabled);
                      triggerToast('새로운 생각이 뇌구조에 각인되었습니다.');
                    }
                  }}
                  className="px-4 py-2 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition shadow-sm active:scale-95 whitespace-nowrap"
                >
                  각인하기
                </button>
              </div>
            </div>

            {/* 뇌구조 2D 시냅스 캔버스 영역 */}
            <div className="relative w-full h-[460px] sm:h-[520px] bg-gradient-to-b from-slate-950 via-indigo-950 to-slate-900 rounded-3xl overflow-hidden shadow-2xl border border-indigo-900/50 p-4">
              
              {/* 좌뇌 & 우뇌 배경 영역 구분 라인 */}
              <div className="absolute inset-0 flex pointer-events-none">
                <div className="w-1/2 h-full border-r border-indigo-500/20 flex flex-col justify-between p-4">
                  <span className="text-[10px] font-black uppercase tracking-wider text-indigo-400/50">
                    좌뇌: 이성 & 실행 & 자산
                  </span>
                </div>
                <div className="w-1/2 h-full flex flex-col justify-between p-4 text-right">
                  <span className="text-[10px] font-black uppercase tracking-wider text-indigo-400/50">
                    우뇌: 감성 & 창의 & 여행
                  </span>
                </div>
              </div>

              {/* 뇌 신경망 노드들 */}
              {brainNodes.map(node => {
                const scale = 1 + (node.weight - 1) * 0.18;
                return (
                  <div
                    key={node.id}
                    style={{
                      left: `${node.x}%`,
                      top: `${node.y}%`,
                      transform: `translate(-50%, -50%) scale(${scale})`
                    }}
                    className="absolute cursor-pointer transition-all duration-300 group"
                  >
                    <div 
                      onClick={() => {
                        // 되새기기: 가중치 증가 & 사운드
                        setBrainNodes(prev => prev.map(n => n.id === node.id ? { ...n, weight: Math.min(7, n.weight + 1) } : n));
                        playRetroSound('recallChime', soundEnabled);
                        grantRewards(15, 10);
                        triggerToast(`✨ [${node.text}] 생각을 되새겼습니다! (가중치: ${node.weight + 1})`);
                      }}
                      className="px-3 py-1.5 rounded-2xl bg-indigo-600/90 hover:bg-indigo-500 text-white text-xs font-bold shadow-lg shadow-indigo-500/30 border border-indigo-400/50 backdrop-blur-md flex items-center gap-1.5 active:scale-95"
                    >
                      <span>{node.text}</span>
                      <span className="text-[10px] px-1 rounded-full bg-white/20 font-mono">
                        {node.weight}
                      </span>
                    </div>

                    {/* 노드 삭제 버튼 */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setBrainNodes(prev => prev.filter(n => n.id !== node.id));
                      }}
                      className="absolute -top-2 -right-2 hidden group-hover:flex w-4 h-4 bg-rose-500 text-white rounded-full items-center justify-center text-[10px]"
                    >
                      ×
                    </button>
                  </div>
                );
              })}

            </div>

          </div>
        )}

        {/* =========================================================================
            TAB 5: 📖 기록의 서재 (감정 일기 & 키워드 마이너)
           ========================================================================= */}
       
            {activeTab === 'diary' && (
            <div className="space-y-6 animate-fadeIn">
              {/* 상단 액션 바 */}
              <div className="flex items-center justify-between bg-white p-5 rounded-3xl border border-indigo-100 shadow-sm">
                <div>
                  <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                    <BookOpen className="w-5 h-5 text-indigo-600" />
                    기록의 서재 (교직 & 일상 회고)
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">지나간 날짜를 선택해 과거 일기를 추가하거나, 회고 댓글을 남길 수 있습니다.</p>
                </div>
                <button
                  onClick={() => {
                    setEditingDiary({});
                    setDiaryDateInput(new Date().toISOString().split('T')[0]);
                    setDiaryTitleInput('');
                    setDiaryContentInput('');
                  }}
                  className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl text-xs font-bold shadow-md transition flex items-center gap-1.5"
                >
                  <Plus className="w-4 h-4" /> 새 일기 쓰기
                </button>
              </div>

              {/* 일기 작성 / 수정 모달 입력 폼 */}
              {editingDiary !== null && (
                <div className="bg-white p-5 rounded-3xl border-2 border-indigo-300 shadow-lg space-y-4">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                    <h4 className="font-bold text-slate-800 text-sm flex items-center gap-1.5">
                      <Edit3 className="w-4 h-4 text-indigo-600" />
                      {editingDiary.id ? '일기 수정하기' : '새 일기 작성하기 (과거 날짜 선택 가능)'}
                    </h4>
                    <button 
                      onClick={() => setEditingDiary(null)}
                      className="text-slate-400 hover:text-slate-600 p-1 text-sm font-bold"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-slate-600 mb-1">날짜 선택</label>
                      <input
                        type="date"
                        value={diaryDateInput}
                        onChange={(e) => setDiaryDateInput(e.target.value)}
                        className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none font-medium"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-600 mb-1">제목</label>
                      <input
                        type="text"
                        placeholder="일기 제목을 입력하세요"
                        value={diaryTitleInput}
                        onChange={(e) => setDiaryTitleInput(e.target.value)}
                        className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-600 mb-1">일기 내용</label>
                    <textarea
                      rows={4}
                      placeholder="오늘 어떤 일이 있었나요? 아이들과 나눈 대화나 나의 감정을 편하게 남겨보세요."
                      value={diaryContentInput}
                      onChange={(e) => setDiaryContentInput(e.target.value)}
                      className="w-full px-3 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none resize-none leading-relaxed"
                    />
                  </div>

                  <div className="flex justify-end gap-2 pt-1">
                    <button
                      onClick={() => setEditingDiary(null)}
                      className="px-4 py-2 text-xs font-semibold text-slate-500 hover:bg-slate-100 rounded-xl transition"
                    >
                      취소
                    </button>
                    <button
                      onClick={handleSaveDiaryEntry}
                      className="px-5 py-2 text-xs font-bold bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl shadow transition"
                    >
                      저장하기
                    </button>
                  </div>
                </div>
              )}

              {/* 일기 타임라인 목록 */}
              <div className="space-y-4">
                {diaryEntries.length === 0 ? (
                  <div className="text-center py-12 bg-white rounded-3xl border border-dashed border-slate-200 text-slate-400 text-xs">
                    작성된 일기가 없습니다. 상단의 [새 일기 쓰기]를 눌러 첫 기록을 남겨보세요!
                  </div>
                ) : (
                  diaryEntries.map((entry) => (
                    <div key={entry.id} className="bg-white rounded-3xl p-5 border border-indigo-50 shadow-sm space-y-3">
                      {/* 일기 상단 헤더 */}
                      <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
                        <div className="flex items-center gap-2">
                          <span className="px-2.5 py-1 rounded-xl text-xs font-bold bg-indigo-50 text-indigo-600 border border-indigo-100 flex items-center gap-1">
                            <Calendar className="w-3.5 h-3.5" /> {entry.date}
                          </span>
                          <h4 className="font-bold text-slate-900 text-sm">{entry.title}</h4>
                        </div>
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => handleOpenEditModal(entry)}
                            className="px-2.5 py-1 text-xs text-slate-600 hover:bg-slate-100 rounded-lg transition font-medium"
                          >
                            수정
                          </button>
                          <button
                            onClick={() => handleDeleteDiaryEntry(entry.id)}
                            className="px-2.5 py-1 text-xs text-rose-500 hover:bg-rose-50 rounded-lg transition font-medium"
                          >
                            삭제
                          </button>
                        </div>
                      </div>

                      {/* 본문 */}
                      <p className="text-xs text-slate-700 leading-relaxed whitespace-pre-wrap">
                        {entry.content}
                      </p>

                      {/* 댓글 / 회고 피드백 영역 */}
                      <div className="mt-3 pt-3 border-t border-slate-100 bg-slate-50/80 p-3.5 rounded-2xl space-y-2.5">
                        <div className="flex items-center justify-between text-xs font-bold text-slate-700">
                          <span className="flex items-center gap-1">
                            💬 날짜별 회고 댓글 ({entry.comments ? entry.comments.length : 0})
                          </span>
                        </div>

                        {/* 댓글 목록 */}
                        <div className="space-y-1.5">
                          {entry.comments && entry.comments.map((comment) => (
                            <div key={comment.id} className="flex items-start justify-between text-xs bg-white p-2.5 rounded-xl border border-slate-200/60 shadow-2xs">
                              <div className="space-y-0.5">
                                <span className="text-[10px] text-slate-400 font-medium">{comment.date}</span>
                                <p className="text-slate-800 leading-snug font-normal">{comment.text}</p>
                              </div>
                              <button
                                onClick={() => handleDeleteComment(entry.id, comment.id)}
                                className="text-slate-300 hover:text-rose-500 text-xs ml-2 p-0.5"
                                title="댓글 삭제"
                              >
                                <X className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          ))}
                        </div>

                        {/* 댓글 입력창 */}
                        <div className="flex gap-1.5 pt-1">
                          <input
                            type="text"
                            placeholder="지나간 날짜에 덧붙이고 싶은 생각이나 회고를 적어보세요..."
                            value={activeCommentEntryId === entry.id ? commentTextInput : ''}
                            onFocus={() => setActiveCommentEntryId(entry.id)}
                            onChange={(e) => {
                              setActiveCommentEntryId(entry.id);
                              setCommentTextInput(e.target.value);
                            }}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') handleAddComment(entry.id);
                            }}
                            className="flex-1 px-3 py-2 text-xs bg-white border border-slate-200 rounded-xl focus:ring-1 focus:ring-indigo-500 outline-none"
                          />
                          <button
                            onClick={() => handleAddComment(entry.id)}
                            className="px-3.5 py-2 text-xs font-bold bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl transition shrink-0"
                          >
                            댓글 등록
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

        {/* =========================================================================
            TAB 6: 👑 캐릭터 & 성장 (아바타 룸 & 칭호 상점)
           ========================================================================= */}
        {activeTab === 'character' && (
          <div className="space-y-4 animate-fadeIn">
            
            {/* 캐릭터 프로필 대형 카드 */}
            <div className="bg-white rounded-3xl p-6 border border-indigo-100 shadow-sm flex flex-col md:flex-row items-center gap-6">
             {/* 커스텀 아바타 사진 표시 및 변경 */}
      <div className="flex flex-col items-center gap-2">
        <div className="relative group w-28 h-28 rounded-3xl overflow-hidden border-4 border-indigo-500 shadow-xl bg-indigo-50 flex items-center justify-center">
          {avatarUrl ? (
            <img src={avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
          ) : (
            <img src={player.avatarImage || "https://images.unsplash.com/photo-1544717305-2782549b5136?w=150"} alt={player.name} className="w-full h-full object-cover" />
          )}
          <label className="absolute inset-0 bg-slate-900/50 text-white flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 cursor-pointer transition text-xs font-bold">
            사진 교체
            <input type="file" accept="image/*" onChange={handleAvatarUpload} className="hidden" />
          </label>
        </div>
        <label className="px-3 py-1 text-xs bg-indigo-50 text-indigo-600 border border-indigo-200 rounded-lg hover:bg-indigo-100 cursor-pointer font-medium">
          내 사진 올리기
          <input type="file" accept="image/*" onChange={handleAvatarUpload} className="hidden" />
        </label>
      </div>

              <div className="space-y-2 text-center md:text-left flex-1">
                <div className="flex flex-wrap items-center justify-center md:justify-start gap-2">
                  <h2 className="text-xl font-black text-slate-900">{player.name}</h2>
                  <span className="px-2.5 py-1 rounded-xl bg-indigo-600 text-white text-xs font-bold">
                    Lv.{player.level}
                  </span>
                </div>
                <p className="text-xs text-indigo-600 font-bold">{player.classTitle}</p>
                <div className="p-2.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-slate-600 inline-block font-medium">
                  현재 장착 칭호: <strong className="text-indigo-700">{player.equippedTitle}</strong>
                </div>

                {/* HP & MP 바 */}
                <div className="grid grid-cols-2 gap-3 pt-2 max-w-sm">
                  <div className="space-y-1">
                    <div className="flex justify-between text-[11px] font-bold">
                      <span className="text-rose-500">HP (체력)</span>
                      <span className="font-mono">{player.hp}/{player.maxHp}</span>
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                      <div className="bg-rose-500 h-2 rounded-full" style={{ width: `${(player.hp / player.maxHp) * 100}%` }} />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <div className="flex justify-between text-[11px] font-bold">
                      <span className="text-sky-500">MP (멘탈)</span>
                      <span className="font-mono">{player.mp}/{player.maxMp}</span>
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                      <div className="bg-sky-500 h-2 rounded-full" style={{ width: `${(player.mp / player.maxMp) * 100}%` }} />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* 칭호 상점 */}
            <div className="bg-white rounded-3xl p-5 border border-indigo-100 shadow-sm space-y-3">
              <h3 className="text-sm font-black text-slate-900 flex items-center gap-1.5">
                <Award className="w-4 h-4 text-amber-500" />
                <span>칭호 해금 & 장착 상점</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {player.titles.map(title => (
                  <div key={title.id} className="p-3.5 rounded-2xl border border-slate-200 flex items-center justify-between text-xs">
                    <div>
                      <span className="font-bold text-slate-800">{title.name}</span>
                      <div className="text-[10px] text-slate-400">
                        {title.unlocked ? '보유 중' : `해금 비용: ${title.cost} Gold`}
                      </div>
                    </div>

                    {title.unlocked ? (
                      <button
                        onClick={() => {
                          setPlayer(prev => ({ ...prev, equippedTitle: title.name }));
                          triggerToast(`✨ [${title.name}] 칭호를 장착했습니다.`);
                        }}
                        className={`px-3 py-1.5 rounded-xl font-bold transition ${
                          player.equippedTitle === title.name 
                            ? 'bg-emerald-600 text-white' 
                            : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                        }`}
                      >
                        {player.equippedTitle === title.name ? '장착 중' : '장착하기'}
                      </button>
                    ) : (
                      <button
                        onClick={() => {
                          if (player.gold >= title.cost) {
                            setPlayer(prev => ({
                              ...prev,
                              gold: prev.gold - title.cost,
                              titles: prev.titles.map(t => t.id === title.id ? { ...t, unlocked: true } : t)
                            }));
                            playRetroSound('levelUp', soundEnabled);
                            triggerToast(`🎉 [${title.name}] 칭호를 구매했습니다!`);
                          } else {
                            triggerToast('골드가 부족합니다.');
                          }
                        }}
                        className="px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-900 font-bold transition shadow-sm"
                      >
                        구매
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>

          </div>
        )}

      </main>

      {/* =========================================================================
          MODALS & OVERLAYS
         ========================================================================= */}

      {/* 모달 1: 저축액 납입 모달 */}
      {showDepositModal && activeDepositGoal && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-white rounded-3xl p-5 sm:p-6 max-w-sm w-full shadow-2xl space-y-4 border border-indigo-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-black text-base text-slate-900 flex items-center gap-1.5">
                <PiggyBank className="w-5 h-5 text-emerald-600" />
                <span>저축액 납입</span>
              </h3>
              <button onClick={() => setShowDepositModal(false)} className="text-slate-400 hover:text-slate-600 p-1">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="text-xs space-y-2">
              <div className="font-bold text-slate-800">{activeDepositGoal.title}</div>
              <div className="text-slate-500">
                현재 저축: {activeDepositGoal.currentAmount?.toLocaleString()} / 목표: {activeDepositGoal.targetAmount?.toLocaleString()} 원
              </div>

              <input
                type="number"
                placeholder="추가 저축할 금액 입력 (원)..."
                value={depositAmount}
                onChange={(e) => setDepositAmount(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-mono font-bold text-slate-800 focus:outline-none focus:border-emerald-400"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
              <button onClick={() => setShowDepositModal(false)} className="px-4 py-2 rounded-xl text-xs font-bold text-slate-500 hover:bg-slate-100">
                취소
              </button>
              <button
                onClick={() => {
                  const amt = Number(depositAmount);
                  if (amt > 0) {
                    setGoals(prev => prev.map(g => {
                      if (g.id !== activeDepositGoal.id) return g;
                      const nextCur = (g.currentAmount || 0) + amt;
                      const nextP = Math.min(100, Math.round((nextCur / g.targetAmount) * 100));
                      return { ...g, currentAmount: nextCur, progress: nextP };
                    }));
                    playRetroSound('deposit', soundEnabled);
                    grantRewards(30, 25);
                    triggerToast(`💰 ${amt.toLocaleString()}원이 저축되었습니다!`);
                    setShowDepositModal(false);
                  }
                }}
                className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-sm"
              >
                납입 완료
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 모달 2: 카테고리 관리 모달 */}
      {showCategoryModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-white rounded-3xl p-5 sm:p-6 max-w-sm w-full shadow-2xl space-y-4 border border-indigo-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-black text-base text-slate-900">목표 카테고리 관리</h3>
              <button onClick={() => setShowCategoryModal(false)} className="text-slate-400 hover:text-slate-600 p-1">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-2 max-h-48 overflow-y-auto">
              {categories.map(c => (
                <div key={c.id} className="flex items-center justify-between p-2 rounded-xl bg-slate-50 text-xs">
                  <span className="font-bold text-slate-800">{c.name}</span>
                  {categories.length > 1 && (
                    <button
                      onClick={() => setCategories(categories.filter(it => it.id !== c.id))}
                      className="text-slate-400 hover:text-rose-500"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              ))}
            </div>

            <div className="pt-2 border-t border-slate-100 flex gap-2">
              <input
                type="text"
                placeholder="새 카테고리명..."
                value={newCatName}
                onChange={(e) => setNewCatName(e.target.value)}
                className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-xs text-slate-800 focus:outline-none"
              />
              <button
                onClick={() => {
                  if (newCatName.trim()) {
                    setCategories([...categories, { id: `cat-${Date.now()}`, name: newCatName.trim(), color: newCatColor }]);
                    setNewCatName('');
                    triggerToast('카테고리가 추가되었습니다.');
                  }
                }}
                className="px-3 py-1.5 bg-indigo-600 text-white rounded-xl text-xs font-bold"
              >
                추가
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 모달 3: 새 목표 추가 모달 */}
      {showAddGoalModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-white rounded-3xl p-5 sm:p-6 max-w-md w-full shadow-2xl space-y-4 border border-indigo-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-black text-base text-slate-900">새 에픽 퀘스트 (목표) 등록</h3>
              <button onClick={() => setShowAddGoalModal(false)} className="text-slate-400 hover:text-slate-600 p-1">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                const form = e.target;
                const title = form.goalTitle.value;
                const period = form.goalPeriod.value;
                const category = form.goalCat.value;
                const deadline = form.goalDeadline.value;
                const isMoney = form.isMoney.checked;
                const targetAmt = isMoney ? Number(form.targetAmount.value) : 0;

                const newG = {
                  id: `g-${Date.now()}`,
                  title,
                  period,
                  category,
                  deadline,
                  progress: 0,
                  isMoneyGoal: isMoney,
                  targetAmount: targetAmt,
                  currentAmount: 0,
                  unit: '원',
                  subTasks: [
                    { id: `st-${Date.now()}-1`, text: '1단계 착수하기', done: false },
                    { id: `st-${Date.now()}-2`, text: '중간 점검하기', done: false }
                  ]
                };

                setGoals([newG, ...goals]);
                setShowAddGoalModal(false);
                playRetroSound('bubble', soundEnabled);
                triggerToast('새로운 목표가 등록되었습니다.');
              }}
              className="space-y-3 text-xs"
            >
              <div>
                <label className="font-bold text-slate-700 block mb-1">목표 명칭</label>
                <input
                  name="goalTitle"
                  required
                  placeholder="예: 일본 오사카 3박4일 미식 여행, 1,000만원 모으기..."
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">기간 분류</label>
                  <select name="goalPeriod" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800">
                    <option value="month">한달 목표</option>
                    <option value="quarter">분기 목표 (3개월)</option>
                    <option value="half">반기 목표 (6개월)</option>
                    <option value="year">1년 목표</option>
                  </select>
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">카테고리</label>
                  <select name="goalCat" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800">
                    {categories.map(c => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">목표 완료일</label>
                <input
                  type="date"
                  name="goalDeadline"
                  defaultValue="2026-12-31"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800"
                />
              </div>

              <div className="pt-2 border-t border-slate-100 space-y-2">
                <label className="flex items-center gap-2 cursor-pointer font-bold text-slate-800">
                  <input type="checkbox" name="isMoney" id="isMoneyCheckbox" className="rounded text-emerald-600" />
                  <span>목돈 모으기 (금전 계획) 연동</span>
                </label>
                <input
                  name="targetAmount"
                  type="number"
                  placeholder="목표 금액 입력 (예: 5000000)..."
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                <button type="button" onClick={() => setShowAddGoalModal(false)} className="px-4 py-2 rounded-xl text-slate-500 hover:bg-slate-100">
                  취소
                </button>
                <button type="submit" className="px-5 py-2 rounded-xl bg-indigo-600 text-white font-bold shadow-sm">
                  등록하기
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 모달 4: 에픽 퀘스트 수정 모달 */}
      {showEditGoalModal && editingGoal && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-white rounded-3xl p-5 sm:p-6 max-w-md w-full shadow-2xl space-y-4 border border-indigo-200 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-black text-base text-slate-900">에픽 퀘스트 수정</h3>
              <button onClick={() => setShowEditGoalModal(false)} className="text-slate-400 hover:text-slate-600 p-1">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">목표 명칭</label>
                <input
                  type="text"
                  value={editingGoal.title}
                  onChange={(e) => setEditingGoal({ ...editingGoal, title: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">기간 분류</label>
                  <select
                    value={editingGoal.period}
                    onChange={(e) => setEditingGoal({ ...editingGoal, period: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800"
                  >
                    <option value="month">한달 목표</option>
                    <option value="quarter">분기 목표 (3개월)</option>
                    <option value="half">반기 목표 (6개월)</option>
                    <option value="year">1년 목표</option>
                  </select>
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">카테고리</label>
                  <select
                    value={editingGoal.category}
                    onChange={(e) => setEditingGoal({ ...editingGoal, category: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800"
                  >
                    {categories.map(c => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">완료일</label>
                <input
                  type="date"
                  value={editingGoal.deadline}
                  onChange={(e) => setEditingGoal({ ...editingGoal, deadline: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800"
                />
              </div>

              {/* 실행 마일스톤 (하위 실천 과제) 추가/수정/삭제 영역 */}
              <div className="pt-2 border-t border-slate-100 space-y-2">
                <div className="flex items-center justify-between">
                  <label className="font-bold text-slate-700">실행 마일스톤 ({editingGoal.subTasks?.length || 0}개)</label>
                  <span className="text-[10px] text-slate-400">문구를 바로 수정하거나 삭제할 수 있습니다</span>
                </div>

                <div className="space-y-1.5 max-h-40 overflow-y-auto pr-1">
                  {(editingGoal.subTasks || []).map((st, sIdx) => (
                    <div key={st.id || sIdx} className="flex items-center gap-1.5 bg-slate-50 p-1.5 rounded-xl border border-slate-200">
                      <input
                        type="text"
                        value={st.text}
                        onChange={(e) => {
                          const updated = [...(editingGoal.subTasks || [])];
                          updated[sIdx] = { ...updated[sIdx], text: e.target.value };
                          setEditingGoal({ ...editingGoal, subTasks: updated });
                        }}
                        className="flex-1 bg-white border border-slate-200 rounded-lg px-2 py-1 text-xs text-slate-800 focus:outline-none focus:border-indigo-400"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          const updated = (editingGoal.subTasks || []).filter((_, idx) => idx !== sIdx);
                          const doneCount = updated.filter(s => s.done).length;
                          const newProgress = updated.length > 0 ? Math.round((doneCount / updated.length) * 100) : editingGoal.progress;
                          setEditingGoal({ ...editingGoal, subTasks: updated, progress: newProgress });
                        }}
                        className="text-slate-400 hover:text-rose-500 p-1 transition"
                        title="마일스톤 삭제"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                  {(!editingGoal.subTasks || editingGoal.subTasks.length === 0) && (
                    <div className="text-[11px] text-slate-400 py-2 text-center bg-slate-50 rounded-xl">
                      등록된 마일스톤이 없습니다. 아래에서 새 마일스톤을 추가해보세요.
                    </div>
                  )}
                </div>

                {/* 새 마일스톤 추가 입력창 */}
                <div className="flex gap-1.5 pt-1">
                  <input
                    type="text"
                    placeholder="새 실행 마일스톤 입력 (Enter)..."
                    value={newEditSubTask}
                    onChange={(e) => setNewEditSubTask(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        if (newEditSubTask.trim()) {
                          const newSt = { id: `st-${Date.now()}`, text: newEditSubTask.trim(), done: false };
                          const updated = [...(editingGoal.subTasks || []), newSt];
                          setEditingGoal({ ...editingGoal, subTasks: updated });
                          setNewEditSubTask('');
                        }
                      }
                    }}
                    className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-1.5 text-xs text-slate-800 focus:outline-none focus:border-indigo-400"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      if (newEditSubTask.trim()) {
                        const newSt = { id: `st-${Date.now()}`, text: newEditSubTask.trim(), done: false };
                        const updated = [...(editingGoal.subTasks || []), newSt];
                        setEditingGoal({ ...editingGoal, subTasks: updated });
                        setNewEditSubTask('');
                      }
                    }}
                    className="px-3 py-1.5 bg-indigo-50 text-indigo-700 hover:bg-indigo-100 border border-indigo-200 font-bold rounded-xl text-xs transition active:scale-95 whitespace-nowrap"
                  >
                    + 추가
                  </button>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-100 flex justify-end gap-2">
                <button onClick={() => setShowEditGoalModal(false)} className="px-4 py-2 rounded-xl text-slate-500 hover:bg-slate-100">
                  취소
                </button>
                <button
                  onClick={() => {
                    setGoals(prev => prev.map(g => g.id === editingGoal.id ? editingGoal : g));
                    setShowEditGoalModal(false);
                    triggerToast('목표 및 실행 마일스톤이 수정되었습니다.');
                  }}
                  className="px-5 py-2 rounded-xl bg-indigo-600 text-white font-bold"
                >
                  수정 완료
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 모달 5: 아바타 커스텀 모달 */}
      {showAvatarModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-white rounded-3xl p-5 sm:p-6 max-w-sm w-full shadow-2xl space-y-4 border border-indigo-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-black text-base text-slate-900">아바타 & 프로필 사진 변경</h3>
              <button onClick={() => setShowAvatarModal(false)} className="text-slate-400 hover:text-slate-600 p-1">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="flex justify-center">
                <div className="w-20 h-20 rounded-2xl overflow-hidden border-2 border-indigo-500 shadow-md">
                  <img src={customAvatarUrl || player.avatarImage} alt="Preview" className="w-full h-full object-cover" />
                </div>
              </div>

              <input
                type="file"
                ref={fileInputRef}
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    const reader = new FileReader();
                    reader.onloadend = () => {
                      setCustomAvatarUrl(reader.result);
                    };
                    reader.readAsDataURL(file);
                  }
                }}
              />

              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="w-full py-2 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold transition flex items-center justify-center gap-1.5 border border-indigo-200"
              >
                <Camera className="w-4 h-4" />
                <span>내 기기에서 사진 파일 업로드</span>
              </button>

              <div>
                <label className="font-bold text-slate-600 block mb-1">이미지 URL 직접 입력</label>
                <input
                  type="text"
                  placeholder="https://..."
                  value={customAvatarUrl}
                  onChange={(e) => setCustomAvatarUrl(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-xs text-slate-800 focus:outline-none"
                />
              </div>

              <div className="pt-2 border-t border-slate-100 flex justify-end gap-2">
                <button onClick={() => setShowAvatarModal(false)} className="px-4 py-2 rounded-xl text-slate-500 hover:bg-slate-100">
                  취소
                </button>
                <button
                  onClick={() => {
                    if (customAvatarUrl) {
                      setPlayer(prev => ({ ...prev, avatarImage: customAvatarUrl }));
                      setShowAvatarModal(false);
                      triggerToast('✨ 프로필 사진이 변경되었습니다.');
                    }
                  }}
                  className="px-5 py-2 rounded-xl bg-indigo-600 text-white font-bold"
                >
                  적용하기
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 모달 6: 급여명세서 인식 결과 확인 및 반영 모달 */}
      {showPaystubModal && scannedPaystubData && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-white rounded-3xl p-5 sm:p-6 max-w-lg w-full shadow-2xl space-y-4 border border-indigo-200 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <span className="text-[10px] font-bold text-indigo-600 uppercase">NEIS 명세서 분석</span>
                <h3 className="font-black text-base text-slate-900">{scannedPaystubData.month} 교원 급여명세서</h3>
              </div>
              <button onClick={() => setShowPaystubModal(false)} className="text-slate-400 hover:text-slate-600 p-1">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-3 gap-2 text-center text-xs">
              <div className="p-3 bg-emerald-50 rounded-2xl border border-emerald-100">
                <span className="text-[10px] text-emerald-700 font-bold block">월 총지급액</span>
                <span className="text-sm font-black font-mono text-emerald-800">
                  {scannedPaystubData.totalIncome?.toLocaleString()}원
                </span>
              </div>
              <div className="p-3 bg-rose-50 rounded-2xl border border-rose-100">
                <span className="text-[10px] text-rose-700 font-bold block">총공제액</span>
                <span className="text-sm font-black font-mono text-rose-800">
                  {scannedPaystubData.totalDeduction?.toLocaleString()}원
                </span>
              </div>
              <div className="p-3 bg-indigo-50 rounded-2xl border border-indigo-100">
                <span className="text-[10px] text-indigo-700 font-bold block">실수령액</span>
                <span className="text-sm font-black font-mono text-indigo-800">
                  {scannedPaystubData.netPay?.toLocaleString()}원
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs pt-2">
              <div className="space-y-1">
                <div className="font-bold text-emerald-800 pb-1 border-b border-slate-100">지급 내역</div>
                {scannedPaystubData.incomes.map((it, idx) => (
                  <div key={idx} className="flex justify-between py-0.5 text-slate-600 text-[11px]">
                    <span>{it.name}</span>
                    <span className="font-mono">{it.amount.toLocaleString()}</span>
                  </div>
                ))}
              </div>

              <div className="space-y-1">
                <div className="font-bold text-rose-800 pb-1 border-b border-slate-100">공제 내역</div>
                {scannedPaystubData.deductions.map((it, idx) => (
                  <div key={idx} className="flex justify-between py-0.5 text-slate-600 text-[11px]">
                    <span>{it.name}</span>
                    <span className="font-mono">-{it.amount.toLocaleString()}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
              <button onClick={() => setShowPaystubModal(false)} className="px-4 py-2 rounded-xl text-slate-500 hover:bg-slate-100 text-xs font-bold">
                닫기
              </button>
              <button
                onClick={applyPaystubToFinance}
                className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-sm"
              >
                가계부 및 연간 계획에 일괄 반영하기
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 모달 7: PWA 앱 다운로드 안내 모달 */}
      {showPwaModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-white rounded-3xl p-5 sm:p-6 max-w-sm w-full shadow-2xl space-y-4 border border-indigo-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-black text-base text-slate-900 flex items-center gap-1.5">
                <Smartphone className="w-5 h-5 text-indigo-600" />
                <span>앱 다운로드 & 설치 안내</span>
              </h3>
              <button onClick={() => setShowPwaModal(false)} className="text-slate-400 hover:text-slate-600 p-1">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs text-slate-600">
              <p className="leading-relaxed">
                '티처 머니 앤 라이프'는 공식 PWA 표준 규격을 준수하여 스마트폰에 앱 아이콘으로 설치해 언제든 바로 실행할 수 있습니다.
              </p>

              <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
                <div className="font-bold text-slate-800">📱 스마트폰 홈 화면 추가 방법:</div>
                <ul className="space-y-1 list-disc list-inside text-[11px] text-slate-500">
                  <li><strong>iPhone / iPad:</strong> Safari 브라우저 하단 공유(네모 화살표) 클릭 후 <strong>'홈 화면에 추가'</strong></li>
                  <li><strong>Android (갤럭시):</strong> Chrome 우측 상단 점 3개 메뉴 클릭 후 <strong>'앱 설치'</strong> 또는 <strong>'홈 화면에 추가'</strong></li>
                </ul>
              </div>
            </div>

            <button
              onClick={() => setShowPwaModal(false)}
              className="w-full py-2.5 rounded-xl bg-indigo-600 text-white font-bold text-xs"
            >
              확인 완료
            </button>
          </div>
        </div>
      )}

      {/* 모달 8: 마스터 목표 추가 모달 */}
      {showAddMasterGoalModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-white rounded-3xl p-5 sm:p-6 max-w-sm w-full shadow-2xl space-y-4 border border-indigo-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-black text-base text-slate-900">삶의 마스터 목표 추가</h3>
              <button onClick={() => setShowAddMasterGoalModal(false)} className="text-slate-400 hover:text-slate-600 p-1">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">목표 명칭</label>
                <input
                  type="text"
                  placeholder="예: 유럽 한달살기, 마라톤 완주..."
                  value={newMasterGoalTitle}
                  onChange={(e) => setNewMasterGoalTitle(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">카테고리</label>
                <select
                  value={newMasterGoalCat}
                  onChange={(e) => setNewMasterGoalCat(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800"
                >
                  <option value="운동/다이어트">운동/다이어트</option>
                  <option value="루틴/습관">루틴/습관</option>
                  <option value="어학/커리어">어학/커리어</option>
                  <option value="여행/버킷">여행/버킷</option>
                  <option value="재테크/부업">재테크/부업</option>
                </select>
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                <button onClick={() => setShowAddMasterGoalModal(false)} className="px-4 py-2 rounded-xl text-slate-500 hover:bg-slate-100">
                  취소
                </button>
                <button onClick={handleAddMasterGoal} className="px-5 py-2 rounded-xl bg-indigo-600 text-white font-bold">
                  추가하기
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 모달 9: 학사일정 직접 등록 및 수정 모달 */}
      {showEventModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-white rounded-3xl p-5 sm:p-6 max-w-md w-full shadow-2xl space-y-4 border border-indigo-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-black text-base text-slate-900 flex items-center gap-2">
                <Calendar className="w-5 h-5 text-indigo-600" />
                {editingEvent ? '학사일정 수정' : '새 학사일정 등록'}
              </h3>
              <button 
                onClick={() => {
                  setShowEventModal(false);
                  setEditingEvent(null);
                }} 
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">일정 명칭</label>
              <input
                type="text"
                placeholder="예: 1학기 여름방학식, 학부모 상담주간, 재량휴업일..."
                value={eventFormTitle}
                onChange={(e) => setEventFormTitle(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-800 focus:outline-none focus:border-indigo-400"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">날짜</label>
                <input
                  type="date"
                  value={eventFormDate}
                  onChange={(e) => setEventFormDate(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-800 focus:outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">분류</label>
                <select
                  value={eventFormType}
                  onChange={(e) => setEventFormType(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-800 focus:outline-none"
                >
                  <option value="school">일반 학사일정</option>
                  <option value="vacation">방학 일정 (여름/겨울)</option>
                  <option value="holiday">재량휴업일 / 공휴일</option>
                  <option value="event">교내 행사 / 시험</option>
                </select>
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">세부 메모 및 준비사항</label>
              <textarea
                rows={3}
                placeholder="관련 업무, 사전 복무 상신, 준비물 등을 자유롭게 적어보세요..."
                value={eventFormNote}
                onChange={(e) => setEventFormNote(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs text-slate-800 focus:outline-none focus:border-indigo-400 resize-none"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
              <button
                onClick={() => {
                  setShowEventModal(false);
                  setEditingEvent(null);
                }}
                className="px-4 py-2 rounded-xl text-xs font-bold text-slate-500 hover:bg-slate-100"
              >
                취소
              </button>
              <button
                onClick={handleSaveEvent}
                className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-sm"
              >
                {editingEvent ? '수정 완료' : '등록하기'}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
