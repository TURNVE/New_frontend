/**
 * Intern Onboarding Simulation — Content
 * 
 * Complete onboarding flow:
 * 1. Receive offer letter
 * 2. Meet your PM (Product Manager)
 * 3. Check calendar for CEO availability
 * 4. Accept meeting with CEO
 * 5. HR introduces you to team
 * 6. Join CEO meeting
 * 7. Get first microtask from PM
 * 8. Complete microtasks
 * 9. PM gets "fired", you get promoted
 * 10. Start real simulation challenges
 */

import type { 
    WeeklySignal, 
    WeeklyEvent, 
    WeeklyActionItem
} from '../../shared/simulation/types';

// ============================================================
// TYPES FOR INTERN STATE
// ============================================================

export interface InternTask {
    id: string;
    title: string;
    description: string;
    hint: string;
    whatThisIs: string;
    whatThatIs?: string;
    completed: boolean;
    type: 'read' | 'action' | 'calendar' | 'meeting' | 'acknowledge';
}

export interface CalendarSlot {
    id: string;
    title: string;
    with: string;
    time: string;
    duration: string;
    available: boolean;
    description: string;
}

export interface TeamMember {
    id: string;
    name: string;
    role: string;
    department: string;
    intro: string;
    color: string;
}

// ============================================================
// CALENDAR DATA
// ============================================================

export const INTERN_CALENDAR_SLOTS: CalendarSlot[] = [
    {
        id: 'cal-1',
        title: 'CEO Welcome Meeting',
        with: 'Marcus Johnson (CEO)',
        time: '6:00 PM Today',
        duration: '30 min',
        available: true,
        description: 'Your first meeting with the CEO. Learn about the company vision.'
    },
    {
        id: 'cal-2',
        title: 'Team Standup',
        with: 'Product Team',
        time: '10:00 AM Tomorrow',
        duration: '15 min',
        available: true,
        description: 'Daily team sync meeting'
    },
    {
        id: 'cal-3',
        title: '1:1 with PM',
        with: 'Sarah Chen (Product Manager)',
        time: '2:00 PM Tomorrow',
        duration: '30 min',
        available: true,
        description: 'Weekly check-in with your PM'
    },
    {
        id: 'cal-4',
        title: 'Product Review',
        with: 'Engineering Team',
        time: '4:00 PM Tomorrow',
        duration: '45 min',
        available: false,
        description: 'Sprint review - already booked'
    },
    {
        id: 'cal-5',
        title: 'Client Call',
        with: 'Sales Team',
        time: '11:00 AM Day after',
        duration: '1 hour',
        available: false,
        description: 'External client meeting'
    }
];

// ============================================================
// TEAM MEMBERS
// ============================================================

export const INTERN_TEAM_MEMBERS: TeamMember[] = [
    {
        id: 'tm-1',
        name: 'Marcus Johnson',
        role: 'CEO',
        department: 'Executive',
        intro: 'Founded the company in 2019. Focuses on strategic growth and investor relations.',
        color: 'bg-primary'
    },
    {
        id: 'tm-2',
        name: 'Sarah Chen',
        role: 'Product Manager',
        department: 'Product',
        intro: 'Your direct manager. She will guide you through your first projects.',
        color: 'bg-purple-500'
    },
    {
        id: 'tm-3',
        name: 'David Park',
        role: 'Engineering Lead',
        department: 'Engineering',
        intro: 'Leads the technical team. He is detail-oriented and loves clean code.',
        color: 'bg-blue-500'
    },
    {
        id: 'tm-4',
        name: 'Lisa Martinez',
        role: 'HR Manager',
        department: 'Human Resources',
        intro: 'Handles onboarding, benefits, and team culture. Your first point of contact for HR.',
        color: 'bg-emerald-500'
    },
    {
        id: 'tm-5',
        name: 'James Wilson',
        role: 'UX Designer',
        department: 'Design',
        intro: 'Focuses on user experience and product design. Works closely with PM team.',
        color: 'bg-pink-500'
    },
    {
        id: 'tm-6',
        name: 'Amy Thompson',
        role: 'Data Analyst',
        department: 'Analytics',
        intro: 'Provides data-driven insights for product decisions.',
        color: 'bg-cyan-500'
    }
];

// ============================================================
// WEEKLY SIGNALS (Notifications during onboarding)
// ============================================================

export const INTERN_WEEKLY_SIGNALS: WeeklySignal[] = [
    // Week 1 - Day 1
    {
        id: 'intern-sig-d1-01',
        week: 1,
        source: 'Sarah Chen',
        sourceInitials: 'SC',
        sourceColor: 'bg-purple-500/20 text-purple-400',
        message: 'Welcome to the team! I am your Product Manager. Let me show you around.',
        severity: 'info',
        tags: ['welcome', 'onboarding'],
    },
    {
        id: 'intern-sig-d1-02',
        week: 1,
        source: 'HR System',
        sourceInitials: 'HR',
        sourceColor: 'bg-emerald-500/20 text-emerald-400',
        message: 'Your offer letter is ready to view in Documents.',
        severity: 'info',
        tags: ['documents', 'offer'],
    },
    // Week 1 - Day 2
    {
        id: 'intern-sig-d2-01',
        week: 1,
        source: 'Lisa Martinez',
        sourceInitials: 'LM',
        sourceColor: 'bg-emerald-500/20 text-emerald-400',
        message: 'Hi! Welcome to TechCorp. Looking forward to meeting you at the team introduction!',
        severity: 'info',
        tags: ['hr', 'team'],
    },
    {
        id: 'intern-sig-d2-02',
        week: 1,
        source: 'Calendar',
        sourceInitials: 'CL',
        sourceColor: 'bg-blue-500/20 text-blue-400',
        message: 'CEO Marcus Johnson has a 6PM slot available today. Would you like to join?',
        severity: 'info',
        tags: ['calendar', 'meeting'],
    },
    // Week 1 - Day 3 (after promotion)
    {
        id: 'intern-sig-promo-01',
        week: 1,
        source: 'System',
        sourceInitials: 'SY',
        sourceColor: 'bg-primary/20 text-primary',
        message: 'Congratulations on your promotion! You are now a Junior Product Manager.',
        severity: 'success',
        tags: ['promotion', 'milestone'],
    },
    {
        id: 'intern-sig-promo-02',
        week: 1,
        source: 'Marcus Johnson',
        sourceInitials: 'MJ',
        sourceColor: 'bg-primary/20 text-primary',
        message: 'Great work during your internship. Now lets get into the real work!',
        severity: 'info',
        tags: ['ceo', 'challenge'],
    },
];

// ============================================================
// WEEKLY EVENTS (Scheduled meetings and events)
// ============================================================

export const INTERN_WEEKLY_EVENTS: WeeklyEvent[] = [
    // Day 1 - Morning
    {
        id: 'intern-evt-d1-welcome',
        week: 1,
        type: 'notification',
        title: 'Welcome to TechCorp!',
        description: 'Your offer letter is ready. Check your Documents to review it.',
        from: 'HR System',
        fromInitials: 'HR',
        fromColor: 'bg-emerald-500/20 text-emerald-400',
        priority: 'high',
        requiresAction: true,
        actionId: 'intern-action-offer-letter',
        timeInWeek: 60, // 1 minute in
    },
    // Day 1 - Meet PM
    {
        id: 'intern-evt-d1-pm-intro',
        week: 1,
        type: 'meeting',
        title: 'Meet Your Product Manager',
        description: 'Sarah Chen wants to welcome you to the team and explain your role.',
        from: 'Sarah Chen',
        fromInitials: 'SC',
        fromColor: 'bg-purple-500/20 text-purple-400',
        priority: 'high',
        requiresAction: true,
        actionId: 'intern-action-meet-pm',
        timeInWeek: 300, // 5 minutes
    },
    // Day 1 - Check Calendar hint
    {
        id: 'intern-evt-d1-calendar-hint',
        week: 1,
        type: 'notification',
        title: 'Calendar Available',
        description: 'You can now check the calendar to see team availability.',
        from: 'System',
        fromInitials: 'SY',
        fromColor: 'bg-blue-500/20 text-blue-400',
        priority: 'normal',
        requiresAction: false,
        timeInWeek: 600, // 10 minutes
    },
    // Day 2 - CEO Meeting
    {
        id: 'intern-evt-d2-ceo-invite',
        week: 1,
        type: 'meeting',
        title: 'CEO Meeting Invitation',
        description: 'Marcus Johnson invites you to a 6PM meeting today. Check your calendar to accept.',
        from: 'Marcus Johnson',
        fromInitials: 'MJ',
        fromColor: 'bg-primary/20 text-primary',
        priority: 'urgent',
        requiresAction: true,
        actionId: 'intern-action-accept-ceo-meeting',
        timeInWeek: 900, // 15 minutes
    },
    // Day 2 - HR Team Intro
    {
        id: 'intern-evt-d2-hr-intro',
        week: 1,
        type: 'meeting',
        title: 'Team Introduction',
        description: 'Lisa Martinez invites you to meet your team members.',
        from: 'Lisa Martinez',
        fromInitials: 'LM',
        fromColor: 'bg-emerald-500/20 text-emerald-400',
        priority: 'high',
        requiresAction: true,
        actionId: 'intern-action-team-intro',
        timeInWeek: 1200, // 20 minutes
    },
    // Day 2 - Meeting reminder
    {
        id: 'intern-evt-d2-meeting-reminder',
        week: 1,
        type: 'notification',
        title: 'Meeting Starts in 5 Minutes',
        description: 'Your CEO meeting starts at 6PM. Join now!',
        from: 'Calendar',
        fromInitials: 'CL',
        fromColor: 'bg-red-500/20 text-red-400',
        priority: 'urgent',
        requiresAction: true,
        actionId: 'intern-action-join-ceo-meeting',
        timeInWeek: 1740, // 29 minutes (5 min before 30min mark)
    },
    // Day 3 - First real task
    {
        id: 'intern-evt-d3-first-task',
        week: 1,
        type: 'request',
        title: 'First Microtask',
        description: 'Sarah Chen has assigned you your first real work task.',
        from: 'Sarah Chen',
        fromInitials: 'SC',
        fromColor: 'bg-purple-500/20 text-purple-400',
        priority: 'high',
        requiresAction: true,
        actionId: 'intern-action-first-task',
        timeInWeek: 600,
    },
    // Day 3 - Promotion event
    {
        id: 'intern-evt-d3-promotion',
        week: 1,
        type: 'notification',
        title: 'Promotion Alert!',
        description: 'Congratulations! You have been promoted to Junior Product Manager!',
        from: 'CEO Office',
        fromInitials: 'CE',
        fromColor: 'bg-primary/20 text-primary',
        priority: 'urgent',
        requiresAction: true,
        actionId: 'intern-action-promotion',
        timeInWeek: 1500,
    },
];

// ============================================================
// WEEKLY ACTIONS (User tasks)
// ============================================================

export const INTERN_WEEKLY_ACTIONS: WeeklyActionItem[] = [
    // === TASK 1: Read Offer Letter ===
    {
        id: 'intern-action-offer-letter',
        week: 1,
        title: 'Review Your Offer Letter',
        description: 'Read your offer letter to understand your role, compensation, and start date.',
        category: 'document',
        actionType: 'acknowledge',
        priority: 'high',
        dueWeek: 1,
        // Hint will be shown in the modal
    },
    
    // === TASK 2: Meet Your PM ===
    {
        id: 'intern-action-meet-pm',
        week: 1,
        title: 'Meet Your Product Manager',
        description: 'Sarah Chen is your direct manager. She will explain your internship role and responsibilities.',
        category: 'meeting',
        actionType: 'acknowledge',
        priority: 'high',
        dueWeek: 1,
    },
    
    // === TASK 3: Check Calendar ===
    {
        id: 'intern-action-check-calendar',
        week: 1,
        title: 'Check Calendar for CEO Availability',
        description: 'The CEO wants to meet you. Check the calendar to see when Marcus Johnson is available.',
        category: 'task',
        actionType: 'acknowledge',
        priority: 'normal',
        dueWeek: 1,
    },
    
    // === TASK 4: Accept CEO Meeting ===
    {
        id: 'intern-action-accept-ceo-meeting',
        week: 1,
        title: 'Accept CEO Meeting Invitation',
        description: 'You have a meeting invitation from Marcus Johnson (CEO). Accept to confirm your attendance.',
        category: 'task',
        actionType: 'choice',
        priority: 'urgent',
        dueWeek: 1,
        choices: [
            {
                id: 'accept-ceo-meeting',
                label: 'Accept Meeting',
                description: 'Confirm your attendance for the 6PM CEO meeting today.',
            },
            {
                id: 'decline-ceo-meeting',
                label: 'Decline for Now',
                description: 'You can always request another time later.',
            },
        ],
    },
    
    // === TASK 5: Team Introduction ===
    {
        id: 'intern-action-team-intro',
        week: 1,
        title: 'Team Introduction with HR',
        description: 'Lisa Martinez (HR) will introduce you to your team members. Get to know your colleagues!',
        category: 'meeting',
        actionType: 'acknowledge',
        priority: 'high',
        dueWeek: 1,
    },
    
    // === TASK 6: Join CEO Meeting ===
    {
        id: 'intern-action-join-ceo-meeting',
        week: 1,
        title: 'Join CEO Welcome Meeting',
        description: 'Your meeting with Marcus Johnson is starting. Join to hear about the company vision.',
        category: 'meeting',
        actionType: 'choice',
        priority: 'urgent',
        dueWeek: 1,
        choices: [
            {
                id: 'join-ceo-meeting',
                label: 'Join Meeting Now',
                description: 'Enter the virtual meeting room to meet the CEO.',
            },
            {
                id: 'join-ceo-meeting-reminder',
                label: 'I need more time',
                description: 'Request a 5-minute buffer before joining.',
            },
        ],
    },
    
    // === TASK 7: First Real Task ===
    {
        id: 'intern-action-first-task',
        week: 1,
        title: 'Complete Your First Microtask',
        description: 'Sarah Chen has assigned you a simple task: Review the product backlog and identify one feature to improve.',
        category: 'task',
        actionType: 'decision_text',
        priority: 'high',
        dueWeek: 1,
        decisionPrompt: 'Review the product backlog below and identify one feature that needs improvement. Explain why you chose it and how you would improve it.',
        decisionPlaceholder: 'Feature Name: ...\n\nWhy this feature: ...\n\nSuggested improvement: ...\n\nExpected impact: ...',
    },
    
    // === TASK 8: Promotion ===
    {
        id: 'intern-action-promotion',
        week: 1,
        title: 'Promotion to Junior PM',
        description: 'Congratulations! Your PM Sarah Chen has been promoted to a new role. The CEO has decided to promote YOU to take her place as the new Product Manager!',
        category: 'notification',
        actionType: 'acknowledge',
        priority: 'urgent',
        dueWeek: 1,
    },
];

// ============================================================
// IN-CONTEXT GUIDANCE (Hints for each task)
// ============================================================

export const INTERN_GUIDANCE = {
    offerLetter: {
        whatThisIs: 'Your official employment document from TechCorp',
        whatThatIs: 'This is NOT a contract to sign - its to read and understand your role',
        hint: 'Look for your job title, start date, manager name, and key benefits. This sets your expectations for the role.',
        tips: [
            'Your role is Product Manager Intern',
            'Your manager is Sarah Chen',
            'Start date is today!',
            'This is a 4-week internship program'
        ]
    },
    meetPM: {
        whatThisIs: 'Your direct manager who will guide you during your internship',
        whatThatIs: 'NOT someone to be afraid of - they are here to help you learn',
        hint: 'Sarah will be your go-to person for questions, feedback, and learning opportunities.',
        tips: [
            'She has 5 years of PM experience',
            'She manages a team of 4',
            'She loves data-driven decisions',
            'She is approachable and patient'
        ]
    },
    calendar: {
        whatThisIs: 'A schedule showing when team members are available for meetings',
        whatThatIs: 'NOT the same as your personal calendar - this shows company-wide availability',
        hint: 'You can see when Marcus (CEO) has open slots. Look for the 6PM slot today!',
        tips: [
            'Click on available slots to see meeting details',
            'Green slots are available, gray are booked',
            'You can accept or decline invitations',
            'Check regularly for new meeting invites'
        ]
    },
    acceptMeeting: {
        whatThisIs: 'Confirming your attendance to a scheduled meeting',
        whatThatIs: 'NOT a commitment to prepare anything - just your presence',
        hint: 'Always accept CEO meetings when possible - it shows initiative!',
        tips: [
            'The CEO meeting is at 6PM today',
            'Its a 30-minute welcome session',
            'This is a great networking opportunity',
            'You will learn about company vision'
        ]
    },
    teamIntro: {
        whatThisIs: 'An HR-led session to meet your colleagues',
        whatThatIs: 'NOT a formal presentation - its a casual get-to-know session',
        hint: 'Be friendly and ask questions! This is your chance to make first impressions.',
        tips: [
            'You will meet 6 team members',
            'Each person will share their role',
            'Feel free to ask about their work',
            'Take notes on who does what'
        ]
    },
    ceoMeeting: {
        whatThisIs: 'A meeting with the companys top executive',
        whatThatIs: 'NOT a performance review - its an orientation conversation',
        hint: 'Listen and learn! The CEO wants to welcome you, not test you.',
        tips: [
            'Marcus founded the company in 2019',
            'He values transparency and hard work',
            'He will share the company vision',
            'He may ask about your career goals'
        ]
    },
    firstTask: {
        whatThisIs: 'Your first real work assignment as an intern',
        whatThatIs: 'NOT a test - its a learning opportunity with support',
        hint: 'Think like a user. What feature would YOU want to improve?',
        tips: [
            'Focus on user experience',
            'Consider business impact',
            'Think about technical feasibility',
            'Start with small improvements'
        ]
    },
    promotion: {
        whatThisIs: 'A significant career milestone - you are now a Junior PM!',
        whatThatIs: 'NOT the end of learning - its the beginning of new challenges',
        hint: 'Congratulations! You proved yourself during the internship. Now the real work begins.',
        tips: [
            'You now manage the product team',
            'You will face real business challenges',
            'Expect more responsibilities',
            'Its okay to ask for help'
        ]
    }
};

// ============================================================
// COMPLETION MESSAGE
// ============================================================

export const INTERN_COMPLETION_MESSAGE = {
    title: 'Welcome to TechCorp!',
    subtitle: 'You have successfully completed your intern onboarding.',
    message: 'You started as an intern, learned the team, met the CEO, and now you are a Junior Product Manager. The real challenges await!',
    nextSteps: [
        'Review your first project brief',
        'Meet with your team',
        'Start making product decisions',
        'Build your portfolio with real artifacts'
    ]
};
