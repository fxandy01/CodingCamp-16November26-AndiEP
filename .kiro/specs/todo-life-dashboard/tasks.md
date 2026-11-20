# Implementation Plan

- [x] 1. Set up project structure
  - Create `index.html`, `css/style.css`, `js/app.js` (one CSS file, one JS file)
  - _Requirements: TC-1, Folder Rules_

- [x] 2. Build page layout and styling
  - [x] 2.1 Add HTML sections for greeting, timer, to-do list, and quick links
  - [x] 2.2 Style cards, typography, buttons, and responsive grid
  - _Requirements: NFR-1, NFR-3_

- [x] 3. Implement greeting, time, and date
  - [x] 3.1 Render time and date, refresh every second
  - [x] 3.2 Choose greeting from the hour
  - _Requirements: 1.1, 1.2, 1.3, 1.4, 1.5, 1.6_

- [x] 4. Implement focus timer
  - [x] 4.1 Display 25:00 and count down on Start
  - [x] 4.2 Add Stop and Reset, and guard against double Start
  - [x] 4.3 Notify the user at 00:00
  - _Requirements: 2.1, 2.2, 2.3, 2.4, 2.5, 2.6_

- [x] 5. Implement to-do list
  - [x] 5.1 Add Tasks and ignore empty input
  - [x] 5.2 Edit Tasks inline (Save, Enter, Esc)
  - [x] 5.3 Toggle done state and delete Tasks
  - [x] 5.4 Persist to and restore from Local Storage
  - [x] 5.5 Show empty-state message
  - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.5, 3.6, 3.7, 3.8_

- [x] 6. Implement quick links
  - [x] 6.1 Render links that open in a new tab
  - [x] 6.2 Add links with URL normalization and validation
  - [x] 6.3 Remove links
  - [x] 6.4 Persist to and restore from Local Storage, with defaults on first load
  - _Requirements: 4.1, 4.2, 4.3, 4.4, 4.5, 4.6, 4.7, 4.8_

- [x] 7. Add enhancements
  - [x] 7.1 Change timer length (1 to 180 minutes), saved in Local Storage
  - [x] 7.2 Prevent duplicate tasks on add and edit
  - [x] 7.3 Sort tasks, with the choice saved in Local Storage

- [x] 8. Add personalization
  - [x] 8.1 Name in greeting, saved in Local Storage
  - [x] 8.2 Daily focus stats (sessions and minutes), reset each day
  - [x] 8.3 Dark and light theme toggle, saved in Local Storage

- [ ] 9. Manual verification in a browser
  - Open `index.html` in Chrome, Firefox, Edge, and Safari
  - Check each acceptance criterion, including reload persistence
  - _Requirements: TC-3_
