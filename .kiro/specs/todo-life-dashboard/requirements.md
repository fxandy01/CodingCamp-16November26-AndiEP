# Requirements Document

## Introduction

Todo List Life Dashboard is a client-side web app that combines a greeting with a live clock, a focus timer, a to-do list, and quick links in one page. It uses HTML, CSS, and vanilla JavaScript. It has no backend, and all data is stored in the browser's Local Storage.

## Glossary

- **Dashboard**: The single-page web app.
- **Task**: A to-do item with text and a done/not-done state.
- **Quick Link**: A saved button (name + URL) that opens a website.

## Requirements

### Requirement 1: Greeting, Time, and Date

**User Story:** As a user, I want to see the current time, date, and a greeting, so that I know the time of day at a glance.

#### Acceptance Criteria

1. THE Dashboard SHALL display the current time and update it every second.
2. THE Dashboard SHALL display the current date, including weekday, day, month, and year.
3. WHEN the hour is 05:00 to 11:59, THE Dashboard SHALL show "Good morning".
4. WHEN the hour is 12:00 to 16:59, THE Dashboard SHALL show "Good afternoon".
5. WHEN the hour is 17:00 to 20:59, THE Dashboard SHALL show "Good evening".
6. WHEN the hour is 21:00 to 04:59, THE Dashboard SHALL show "Good night".
7. WHEN the user saves a name, THE Dashboard SHALL append it to the greeting (for example "Good morning, Andi") and save it to Local Storage.
8. WHEN the user saves an empty name, THE Dashboard SHALL remove the saved name and show the greeting without it.

### Requirement 2: Focus Timer

**User Story:** As a user, I want a 25-minute timer, so that I can work in focused sessions.

#### Acceptance Criteria

1. THE Dashboard SHALL display the timer initially as 25:00.
2. WHEN the user clicks Start, THE Dashboard SHALL count down one second at a time.
3. WHEN the user clicks Start while the timer is already running, THE Dashboard SHALL NOT start a second countdown.
4. WHEN the user clicks Stop, THE Dashboard SHALL pause the countdown at the current value.
5. WHEN the user clicks Reset, THE Dashboard SHALL stop the countdown and set the display back to 25:00.
6. WHEN the countdown reaches 00:00, THE Dashboard SHALL stop the timer and notify the user.
7. WHEN the user sets a duration from 1 to 180 minutes, THE Dashboard SHALL use it as the timer length, reset the timer to it, and save it to Local Storage.
8. IF the entered duration is outside 1 to 180 minutes, THEN THE Dashboard SHALL reject it and keep the current duration.
9. WHEN the page loads, THE Dashboard SHALL restore the saved duration, or use 25 minutes if none is saved.
10. WHEN a countdown reaches 00:00, THE Dashboard SHALL add one completed session and the session length in minutes to today's focus stats, and save them to Local Storage.
11. THE Dashboard SHALL display today's completed sessions and focused minutes, and reset them when the date changes.
12. WHEN the user stops or resets before 00:00, THE Dashboard SHALL NOT count the session.

### Requirement 3: To-Do List

**User Story:** As a user, I want to manage tasks, so that I can track what I need to do.

#### Acceptance Criteria

1. WHEN the user submits non-empty task text, THE Dashboard SHALL add the Task to the list.
2. WHEN the user submits empty or whitespace-only text, THE Dashboard SHALL NOT add a Task.
3. WHEN the user edits a Task and saves non-empty text, THE Dashboard SHALL update the Task text.
4. WHEN the user toggles a Task's checkbox, THE Dashboard SHALL mark the Task as done or not done, and show done Tasks with a strikethrough.
5. WHEN the user clicks Delete on a Task, THE Dashboard SHALL remove the Task.
6. WHEN the Task list changes, THE Dashboard SHALL save it to Local Storage.
7. WHEN the page loads, THE Dashboard SHALL restore Tasks from Local Storage.
8. WHILE there are no Tasks, THE Dashboard SHALL show an empty-state message.
9. IF a new or edited Task has the same text as an existing Task (ignoring case and surrounding spaces), THEN THE Dashboard SHALL reject it and show a message.
10. WHEN the user picks a sort option (order added, A to Z, Z to A, not done first, done first), THE Dashboard SHALL display Tasks in that order and save the choice to Local Storage.

### Requirement 4: Quick Links

**User Story:** As a user, I want buttons for my favorite websites, so that I can open them quickly.

#### Acceptance Criteria

1. WHEN the user clicks a Quick Link, THE Dashboard SHALL open its URL in a new tab.
2. WHEN the user submits a name and a valid URL, THE Dashboard SHALL add a Quick Link.
3. IF the URL has no protocol, THEN THE Dashboard SHALL prefix it with `https://`.
4. IF the URL is invalid or is not http/https, THEN THE Dashboard SHALL reject it and show an error message.
5. WHEN the user clicks the remove button on a Quick Link, THE Dashboard SHALL delete it.
6. WHEN the Quick Links change, THE Dashboard SHALL save them to Local Storage.
7. WHEN the page loads, THE Dashboard SHALL restore Quick Links from Local Storage.
8. WHEN no saved Quick Links exist in Local Storage, THE Dashboard SHALL show default links (Google, GitHub, YouTube).

### Requirement 5: Theme

**User Story:** As a user, I want a dark or light theme, so that the Dashboard is comfortable to read in any lighting.

#### Acceptance Criteria

1. WHEN the user clicks the theme button, THE Dashboard SHALL switch between light and dark themes and save the choice to Local Storage.
2. WHEN the page loads with no saved choice, THE Dashboard SHALL use the browser's preferred color scheme.
3. WHEN the page loads with a saved choice, THE Dashboard SHALL apply it.

## Technical Constraints

- **TC-1**: Use HTML for structure, CSS for styling, and vanilla JavaScript with no frameworks. No backend server.
- **TC-2**: Use the browser Local Storage API. All data is stored client-side only.
- **TC-3**: Work in modern browsers (Chrome, Firefox, Edge, Safari).

## Non-Functional Requirements

- **NFR-1 Simplicity**: Clean, minimal, easy-to-use interface. No complex setup and no test setup.
- **NFR-2 Performance**: Fast load, responsive interactions, no noticeable lag when updating data.
- **NFR-3 Visual Design**: User-friendly look, clear visual hierarchy, readable typography.

## Folder Rules

- Only one CSS file inside `css/`.
- Only one JavaScript file inside `js/`.
- Keep code clean and readable.
