## TODO

// audit tables - in progress
// auto detect yaml / json
// file delete - to folder
// file upload - to oss
// file delete - to oss
// import / export - replace all? append (ignore duplicates)? append (replace duplicates)
// own self view?

// filter file inputs...
// [UI] handle multiple images display...
// [UI] required * label in form
// [UI] UPLOAD CSV, Download CSV
// [UI] AUTO COMPLETE
// delete (multi select)
// [UI] i18n



## Learning To Use

1. use t4t.http as API reference and testing
2. schema for describing tables is in the tables folder

## Schema

student
subject
country
state
student_subject


## Validation

### HTML input types

- unhandled: button, image, hidden, reset, submit
- undecided: month, week, search
# checkbox, color, file, radio, range, tel, url, time
- handled: date, datetime-local, email, number, password, text

### input attributs
- ignored
  - size: text, search, tel, url, email, and password
  - readonly
  - step: number, range, date, datetime-local, month, time and week.
- dynamic
  - disabled
  - required: text, search, url, tel, email, password, date pickers, number, checkbox, radio, and file
- in use
  - maxlength
  - min, max: number, range, date, datetime-local, month, time and week
  - multiple: email, file
  - pattern: text, date, search, url, tel, email, and password.

