## TOIMPROVE

- import / export - replace all? append (ignore duplicates)? append (replace duplicates) - to improve error handling and response and scaling
- UI replace text with suitable icons+ popover

## TODO

- [BE] audit tables - in progress
- [UI + BE] handle multiple images display...
- [UI + BE] filter file upload inputs...
- [UI + BE] AUTO COMPLETE
- [UI] required * label in form
- [BE] file delete - folder
- [BE] file upload - oss
- [BE] file delete - oss
- [UI + BE] own self view?
- [UI] i18n
- [BE] auto detect yaml / json



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

