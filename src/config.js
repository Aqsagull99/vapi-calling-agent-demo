/**
 * Two demos, one deployment. `?lang=ar` switches the assistant, the copy and
 * the text direction, so the same URL serves an English-speaking client and an
 * Arabic-speaking one.
 */

const params = new URLSearchParams(window.location.search)
export const LANG = params.get('lang') === 'ar' ? 'ar' : 'en'
export const IS_RTL = LANG === 'ar'

const EN = {
  brand: {
    name: 'Northstar Dental Studio',
    tagline: 'Family & Cosmetic Dentistry · Austin, TX',
    agentName: 'Aria',
    agentRole: 'AI Front Desk Coordinator',
    phone: '(512) 555-0142',
  },
  hero: {
    eyebrow: 'Live demo',
    title: 'Every call answered. Every appointment booked.',
    subtitle:
      'Aria picks up on the first ring, qualifies the caller, and writes the appointment straight into the schedule — day or night.',
    stats: [
      { value: '0.7s', label: 'Average pickup' },
      { value: '24/7', label: 'Always staffed' },
      { value: '100%', label: 'Calls answered' },
    ],
  },
  suggestions: [
    'Hi, I’d like to book a cleaning',
    'Do you take Delta Dental?',
    'Can I get in on Thursday afternoon?',
  ],
  t: {
    agentOnCall: 'Agent on a call',
    agentAvailable: 'Agent available',
    connecting: 'Connecting…',
    wrappingUp: 'Wrapping up…',
    speaking: 'is speaking',
    listening: 'Listening…',
    ready: 'Ready to take your call',
    talkTo: 'Talk to',
    endCall: 'End call',
    mute: 'Mute',
    muted: 'Muted',
    trySaying: 'Try saying',
    testMic: 'Test my microphone',
    testAgain: 'Test again',
    micSaySomething: 'Say something — “testing, one two three”…',
    micWorks: 'Microphone works',
    inputDevice: 'Input device',
    systemDefault: 'System default',
    liveTranscript: 'Live transcript',
    live: 'Live',
    idle: 'Idle',
    transcriptEmpty: 'The conversation appears here, word by word, as it happens.',
    transcriptHint: 'Press the button to begin.',
    turns: 'turns',
    transcribedBy: 'Transcribed in real time by Vapi',
    caller: 'Caller',
    appointment: 'Appointment',
    awaitingCall: 'Awaiting call',
    collecting: 'Collecting details',
    confirmed: 'Confirmed',
    booked: 'Booked & written to the schedule',
    confirmation: 'Confirmation',
    recentCalls: 'Recent calls',
    clear: 'Clear',
    noCalls: 'No calls yet. Completed calls are logged here.',
    unknownCaller: 'Unidentified caller',
    noBooking: 'No booking',
    footerStack: 'Voice orchestration by Vapi · Speech and voice by OpenAI',
    footerNote: 'Demo build — no patient data is stored.',
    fields: {
      patient: ['Patient', 'Awaiting name'],
      phone: ['Callback', 'Awaiting number'],
      service: ['Reason for visit', 'Awaiting reason'],
      date: ['Date', 'Not set'],
      time: ['Time', 'Not set'],
      insurance: ['Insurance', 'Not provided'],
      newPatient: ['Patient type', 'Unknown'],
    },
  },
}

const AR = {
  brand: {
    name: 'عيادة نورث ستار لطب الأسنان',
    tagline: 'طب أسنان عائلي وتجميلي · دبي',
    agentName: 'آريا',
    agentRole: 'منسقة الاستقبال الذكية',
    phone: '٠٤ ٥٥٥ ٠١٤٢',
  },
  hero: {
    eyebrow: 'عرض مباشر',
    title: 'كل مكالمة يُرد عليها. كل موعد يُحجز.',
    subtitle:
      'آريا ترد من أول رنة، تفهم ما يحتاجه المريض، وتكتب الموعد في الجدول مباشرة — ليلاً أو نهاراً.',
    stats: [
      { value: '٠٫٧ ث', label: 'زمن الرد' },
      { value: '٢٤/٧', label: 'متاحة دائماً' },
      { value: '١٠٠٪', label: 'مكالمات مُجابة' },
    ],
  },
  suggestions: [
    'مرحباً، أريد حجز موعد لتنظيف الأسنان',
    'هل تقبلون تأمين دامان؟',
    'هل يوجد موعد يوم الثلاثاء بعد الظهر؟',
  ],
  t: {
    agentOnCall: 'المساعدة في مكالمة',
    agentAvailable: 'المساعدة متاحة',
    connecting: 'جارٍ الاتصال…',
    wrappingUp: 'جارٍ الإنهاء…',
    speaking: 'تتحدث الآن',
    listening: 'تستمع…',
    ready: 'جاهزة لاستقبال مكالمتك',
    talkTo: 'تحدث مع',
    endCall: 'إنهاء المكالمة',
    mute: 'كتم',
    muted: 'مكتوم',
    trySaying: 'جرّب أن تقول',
    testMic: 'اختبر الميكروفون',
    testAgain: 'اختبر مرة أخرى',
    micSaySomething: 'قل شيئاً — «تجربة، واحد اثنان ثلاثة»…',
    micWorks: 'الميكروفون يعمل',
    inputDevice: 'جهاز الإدخال',
    systemDefault: 'الافتراضي',
    liveTranscript: 'النص المباشر',
    live: 'مباشر',
    idle: 'متوقف',
    transcriptEmpty: 'تظهر المحادثة هنا، كلمة بكلمة، أثناء حدوثها.',
    transcriptHint: 'اضغط الزر للبدء.',
    turns: 'مداخلة',
    transcribedBy: 'تفريغ مباشر عبر Vapi',
    caller: 'المتصل',
    appointment: 'الموعد',
    awaitingCall: 'بانتظار مكالمة',
    collecting: 'جمع التفاصيل',
    confirmed: 'مؤكد',
    booked: 'تم الحجز وتسجيله في الجدول',
    confirmation: 'رقم التأكيد',
    recentCalls: 'المكالمات الأخيرة',
    clear: 'مسح',
    noCalls: 'لا توجد مكالمات بعد. المكالمات المنتهية تُسجَّل هنا.',
    unknownCaller: 'متصل غير معروف',
    noBooking: 'بدون حجز',
    footerStack: 'إدارة الصوت عبر Vapi · التعرف والنطق عبر OpenAI',
    footerNote: 'نسخة تجريبية — لا تُحفظ أي بيانات مرضى.',
    fields: {
      patient: ['المريض', 'بانتظار الاسم'],
      phone: ['رقم التواصل', 'بانتظار الرقم'],
      service: ['سبب الزيارة', 'بانتظار السبب'],
      date: ['التاريخ', 'غير محدد'],
      time: ['الوقت', 'غير محدد'],
      insurance: ['التأمين', 'غير مذكور'],
      newPatient: ['نوع المريض', 'غير معروف'],
    },
  },
}

const active = IS_RTL ? AR : EN

export const BRAND = active.brand
export const HERO = active.hero
export const SUGGESTIONS = active.suggestions
export const T = active.t

/**
 * Trimmed on purpose. A stray space pasted into a hosting provider's
 * environment-variable field becomes `Bearer  <key>` in the auth header, and
 * Vapi answers `400 failed to extract key` — which surfaces in the browser as
 * an unhelpful "Failed to fetch". Cost an afternoon once; never again.
 */
const env = (name) => (import.meta.env[name] ?? '').trim()

export const VAPI_PUBLIC_KEY = env('VITE_VAPI_PUBLIC_KEY')

/** `?assistant=<id>` overrides both, which is how the demo film is recorded. */
export const VAPI_ASSISTANT_ID =
  (params.get('assistant') ?? '').trim() ||
  (IS_RTL ? env('VITE_VAPI_ASSISTANT_ID_AR') : env('VITE_VAPI_ASSISTANT_ID')) ||
  env('VITE_VAPI_ASSISTANT_ID')

export const IS_CONFIGURED = Boolean(VAPI_PUBLIC_KEY && VAPI_ASSISTANT_ID)
