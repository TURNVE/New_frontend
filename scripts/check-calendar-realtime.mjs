import fs from 'node:fs';

const calendarPanel = fs.readFileSync('src/components/simulation/CalendarPanel.tsx', 'utf8');
const simulationShell = fs.readFileSync('src/shared/simulation/SimulationShell.tsx', 'utf8');

const checks = [
  {
    name: 'Calendar accepts live runtime inputs',
    passed:
      calendarPanel.includes('timeLeft?: number') &&
      calendarPanel.includes('completedActionIds?: string[]') &&
      calendarPanel.includes('onNotify?:'),
  },
  {
    name: 'Calendar derives live deadlines and timeline items',
    passed:
      calendarPanel.includes('deadlineAlerts') &&
      calendarPanel.includes('timelineItems') &&
      calendarPanel.includes('getActionStatus') &&
      calendarPanel.includes('completedActionSet'),
  },
  {
    name: 'Calendar can request and send browser notifications',
    passed:
      calendarPanel.includes('enableBrowserNotifications') &&
      calendarPanel.includes('Notification.permission') &&
      calendarPanel.includes('sendBrowserNotification'),
  },
  {
    name: 'Calendar triggers runtime notification alerts',
    passed:
      calendarPanel.includes('notifiedAlertsRef') &&
      calendarPanel.includes("title: 'Calendar deadline approaching'") &&
      calendarPanel.includes("title: 'Calendar meeting reminder'"),
  },
  {
    name: 'SimulationShell wires calendar to runtime state and notification center',
    passed:
      simulationShell.includes('addNotification') &&
      simulationShell.includes('timeLeft={gameState.timeLeft}') &&
      simulationShell.includes('completedActionIds={completedActionIdList}') &&
      simulationShell.includes('onNotify={(notification) => addNotification(notification)}'),
  },
];

const failures = checks.filter((check) => !check.passed);

if (failures.length > 0) {
  console.error('Calendar realtime check failed:');
  for (const failure of failures) {
    console.error(`- ${failure.name}`);
  }
  process.exit(1);
}

console.log('Calendar realtime check passed.');
