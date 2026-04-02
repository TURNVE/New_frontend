# Confirmation Page - Development Notes

## Overview
The Confirmation Page (`/confirmation`) is the personalization step before users start their simulation. It appears after users select their industry and career track.

## URL Pattern
```
/confirmation?industry={industryId}&track={trackId}
```

**Example:**
```
http://localhost:5173/confirmation?industry=technology&track=product-management
```

---

## Page Components

### 1. Name Input
- Users enter their name to personalize the experience
- Stored in local state (to be connected to user profile)

### 2. Avatar Selection
- 6 colored circular avatars with letter "A"
- Colors: Blue, Emerald, Amber, Red, Violet, Cyan
- Selection stored in local state (to be saved to user profile)

### 3. Your First Project Card ⚠️ **IMPORTANT**

This card is **dynamic** and should be loaded from a configuration/backend based on the user's industry and track selection.

**Current Hardcoded Values:**
```
Project Title: Dashboard Analytics Module
Description: Create a real-time analytics dashboard showing key business metrics with customizable widgets.
```

**Tags Displayed:**
- Industry tag (e.g., "Technology") - color-coded
- Track tag (e.g., "Product Manager") - color-coded

**Future Implementation:**
```typescript
// Suggested data structure
interface FirstProject {
  title: string;
  description: string;
  icon?: string; // Currently using FileText icon
  industryTag: string;
  trackTag: string;
}

// Fetch based on industry + track combination
const getFirstProject = (industry: string, track: string): FirstProject => {
  // API call or config lookup
}
```

**Project Mapping Needed:**
Create a mapping of industry + track combinations to their first projects:

| Industry | Track | Project Title | Description |
|----------|-------|---------------|-------------|
| Technology | Product Management | Dashboard Analytics Module | Create a real-time analytics dashboard... |
| Technology | UX Design | ? | ? |
| Marketing | Digital Marketing | ? | ? |
| ... | ... | ... | ... |

---

### 4. Continue Button
- Navigates to: `/simulation/:trackId?industry=:industryId`
- Blue button with "Continue" text

### 5. Info Cards (Bottom Section)
Three stat cards displayed at the bottom:

| Card | Value | Label | Color |
|------|-------|-------|-------|
| Duration | 4-5 weeks | Estimated Duration | Blue |
| Projects | 3 Simulations | Hands-on Projects | Violet |
| Certificate | ✓ icon | Upon Completion | Emerald |

**Note:** These values are currently static but may need to be dynamic based on track selection.

---

## Industry & Track Mappings

### Industries
```typescript
const industryData = {
  technology: { name: 'Technology', color: 'bg-blue-700' },
  marketing: { name: 'Marketing', color: 'bg-emerald-600' },
  finance: { name: 'Finance', color: 'bg-violet-600' },
  healthcare: { name: 'Healthcare', color: 'bg-red-600' },
  consulting: { name: 'Consulting', color: 'bg-amber-600' },
  retail: { name: 'Retail', color: 'bg-cyan-600' },
  education: { name: 'Education', color: 'bg-indigo-600' },
  manufacturing: { name: 'Manufacturing', color: 'bg-slate-600' }
};
```

### Tracks
```typescript
const trackData = {
  'product-management': { name: 'Product Manager', color: 'bg-emerald-600' },
  'ux-design': { name: 'UX Designer', color: 'bg-emerald-600' },
  'data-analytics': { name: 'Data Analyst', color: 'bg-amber-600' },
  'digital-marketing': { name: 'Digital Marketer', color: 'bg-emerald-600' },
  'financial-analysis': { name: 'Financial Analyst', color: 'bg-amber-600' },
  consulting: { name: 'Strategy Consultant', color: 'bg-red-600' }
};
```

---

## TODO / Future Improvements

- [ ] Create backend API endpoint to fetch first project based on industry + track
- [ ] Create database table/collection for projects
- [ ] Map all industry + track combinations to unique first projects
- [ ] Make info cards (duration, simulations) dynamic based on track
- [ ] Save user name and avatar selection to user profile
- [ ] Add validation (name required before continue)
- [ ] Consider adding avatar customization beyond color (different letters, icons)

---

## File Location
```
Turnve_Frontend/src/pages/ConfirmationPage.tsx
```

## Related Routes
- Previous: `/industries` → `/tracks?industry=:industryId`
- Current: `/confirmation?industry=:industryId&track=:trackId`
- Next: `/simulation/:trackId?industry=:industryId`

---

**Last Updated:** March 16, 2026
